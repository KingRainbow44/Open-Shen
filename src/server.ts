/*
 * Copyright © 2022 Open-Shen Team. All rights reserved.
 *
 * Project licensed under the MIT License: https://www.mit.edu/~amini/LICENSE.md
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * All portions of this software are available for public use, provided that
 * credit is given to the original author(s).
 */

/**
 * Called before the process closes.
 */
/* Imports. */
import * as logger from "./utils/logger";
import * as protocol from "./utils/packets";
import * as utils from "./utils/utilities";
import {readFileSync, writeFileSync} from "fs";
import {createProviderInstance} from "./objects/provider";
import {createPluginManager} from "./plugin/plugin";
import {base, config, working} from "./index";
import udpServer from "./handlers/udp";

import Player from "./player/player";
import Handshake from "./objects/handshake";
import {PluginManager} from "./plugin/plugin";
import DataProvider from "./objects/provider";
import {RemoteInfo} from "dgram";
import {Version} from "./utils/interfaces";
import {KCP} from "node-kcp-x";

export function terminate(): void {
    // Shut down server execution.
    server.shutdown(false);
}

/* Handling process termination. */
process.on('exit', terminate);
process.on('SIGUSR1', process.exit);
process.on('SIGUSR2', process.exit);
process.on('SIGTERM', process.exit);
process.on('SIGINT', process.exit);

/* UDP Handler */
export async function processPacket(data: Buffer, rInfo: RemoteInfo) {
    const networkId: string = `${rInfo.address}_${rInfo.port}_${data.readUInt32LE(0).toString(16)}`;
    const buffer: Buffer = Buffer.from(data);

    // Client -> Server Handshake Request
    if (buffer.byteLength <= 20) {
        const handshake: Handshake = authenticate(buffer, buffer.readInt32BE(0));
        handshake.encode(); // Encode the handshake.
        const hsBuffer: Buffer = <Buffer>handshake.buffer;

        udpServer.send(hsBuffer, 0, hsBuffer.byteLength, rInfo.port, rInfo.address);
        return;
    }

    let player: Player; // The player sending the request.

    // Check if the player is already connected.
    if ((player = server.getPlayerByIdentifier(networkId)) == undefined) {
        const newKCP: KCP = new KCP(buffer.readUInt32LE(0), {address: rInfo.address, port: rInfo.port});
        newKCP.nodelay(1, 10, 2, 1);
        newKCP.output(output);

        player = new Player(newKCP);
        player.address = {ip: rInfo.address, port: rInfo.port, networkId: networkId};
        server.addPlayer(networkId, player);
    }

    server.setOutputToken(data.readUInt32BE(4)); // Set the output token.
    const packet: Buffer = protocol.reformatKcpPacket(buffer); // Reformat the packet.
    player.kcpObj.input(packet); // Send the packet to the player.
    player.kcpObj.update(Date.now()); // Update the player's KCP object.

    let received: Buffer = player.kcpObj.recv();
    if (received) {
        let remaining: Buffer = received; // This removes parts of the packet.
        protocol.xorData(remaining, player.network.getKeyPair() || server.getInitialKeyPair()); // Decrypt the packet.

        if (!( // If the packet isn't valid, ignore it.
            remaining.length > 5 && remaining.readInt16BE(0) == 0x4567 &&
            remaining.readUInt16BE(remaining.byteLength - 2) == 0x89AB
        )) return;

        let packetId: number = remaining.readInt16BE(2); // Get the packet ID.
        if (![2349, 373, 3187, 100].includes(packetId) || config.debug.debugLevel >= 9) {
            if (!config.logger.ignoredPacketIds.includes(packetId))
                logger.debug(36, `[UDP] Received packet ${protocol.getFrameworkById(packetId)} (${packetId})`);
        }

        let noMagic: Buffer = protocol.parsePacketData(remaining); // Parse the packet and remove magic bytes.
        if (!isNaN(protocol.getFrameworkById(packetId))) {
            logger.debug(36, `[UDP] Received unknown packet ${packetId}`);
            writeFileSync(`${working}/unknown/${packetId}.packet`, remaining.toString('base64'));
            return;
        }

        let dataBuffer: any = await protocol.packetToObject(noMagic, packetId); // Convert the packet to an object.
        return await handlePacket(packetId, player, dataBuffer); // Handle the packet with a handler.
    }
}

/**
 * Referenced from {@link KCP#output}.
 * @param data The output data.
 * @param size The size of the output data.
 * @param rInfo The network ID of the client.
 */
function output(data: any, size: number, rInfo: RemoteInfo): void {
    if (data == undefined) return;

    if (data.length > 26) {
        data = protocol.formatSentPacket(data, server.getOutputToken())
        let arrayData: Buffer[] = protocol.getPackets(data)
        for (let key of arrayData) {
            udpServer.send(key, 0, key.length, rInfo.port, rInfo.address)
        }
        return;
    }

    udpServer.send(data, 0, size, rInfo.port, rInfo.address);
}

/**
 * Handles a client handshake.
 * @return A processed handshake.
 */
function authenticate(data: Buffer, type: number): Handshake {
    let buffer: Buffer, handshake: Handshake;
    switch (type) {
        case 0xFF: // Incoming connection request.
            buffer = Buffer.from(data);
            handshake = new Handshake();
            handshake.decode(buffer);

            let _conv = (Date.now());
            let _token = 0xFFCCEEBB ^ ((Date.now() >> 32) & 0xFFFFFFFF);

            return new Handshake([0x145, 0x14514545], _conv, _token);
        case 0x194: // Incoming disconnection request.
            return new Handshake(Handshake.MAGIC_DISCONNECT);

        default:
            logger.debug(32, `[UDP] Unknown handshake type ${type}.`);
            return new Handshake();
    }
}

/**
 * Handle the provided packet.
 * @param packetId The packet ID.
 * @param player The player sending the packet.
 * @param data The packet data.
 */
async function handlePacket(packetId: number, player: Player, data: any): Promise<void> {
    const framework: string = protocol.getFrameworkById(packetId);
    try {
        const handler = require(`./packets/${framework}`);
        const result: any = await handler.default(data, player);

        if (config.debug.logPackets) {
            logger.logToFile(JSON.stringify(data), `incoming_${framework}`, true);
            logger.logToFile(`[UDP] Accepted ${framework} at ${utils.formatDate(Date.now())}`, `inbound_packets`, true);
        }

        return result;
    } catch (exception) {
        logger.debug(36, `[UDP] Unhandled packet ${packetId} (${framework}).`);
        if (config.debug.debugLevel > 1 && !server.unhandledPackets[packetId]) {
            console.warn("Unhandled packet exception:", exception); // Log the exception data to the console.
            server.unhandledPackets.push(packetId); // Prevent this packet from being logged multiple times.
        }
    }
}

/**
 * The Open-Shen server.
 * Handles the entire server-side.
 */
export default class Server {
    private readonly initialKey: Buffer = undefined;
    private readonly pluginManager: PluginManager = createPluginManager();
    private provider: DataProvider = undefined;
    private token: number = 0x00000000; // TODO: Determine if this needs to be moved to the player class.
    private players: object = {};

    readonly crashDumps: object[] = [];
    versionData: Version = undefined;
    unhandledPackets: number[] = [];

    constructor() {
        // The initial XOR key for the game (2.0-2.6).
        this.initialKey = Buffer.from(readFileSync(`${base}/resources/initial-key.bin`).toString(), "base64");
        // This loads the data required for handling the specified version.
        this.versionData = <Version> require(`${working}/versions/${config.server.clientVersion}.json`);

        this.startup(); // Begin the startup sequence.
    }

    /**
     * Called after constructor is called.
     * Should be called after the server is instantiated.
     * @private For internal invocation only.
     */
    private async startup(): Promise<void> {
        // Load plugins.
        this.pluginManager.registerAllPlugins();

        // Create a data provider instance.
        this.provider = createProviderInstance();
        // Initialize the data provider.
        this.provider.initializeDatabase();

        // Enable all plugins.
        this.pluginManager.enableAllPlugins();
    }

    /**
     * Disables most of the server's features.
     * Should be called before shutdown.
     */
    shutdown(exit: boolean = true): void {
        // Disable all plugins.
        this.pluginManager.disableAllPlugins();
        
        // Exit process if requested.
        exit && process.exit(0);
    }

    /**
     * Returns the initial keypair for the server & client.
     * This keypair can be used for the first packet (PlayerTokenReq).
     */
    getInitialKeyPair(): Buffer {
        return this.initialKey;
    }

    /**
     * Returns the server data provider.
     */
    getDataProvider(): DataProvider {
        return this.provider;
    }

    /**
     * Returns the server's plugin manager.
     */
    getPluginManager(): PluginManager {
        return this.pluginManager;
    }

    /**
     * Sets the token used by {@link output}.
     * @param token
     */
    setOutputToken(token: number) {
        this.token = token;
    }

    /**
     * Get the output token specified by a packet.
     * @return The output token.
     */
    getOutputToken(): number {
        return this.token;
    }

    /**
     * Adds the player to the server.
     * @param networkId The player's network ID.
     * @param player The player to add.
     */
    addPlayer(networkId: string, player: Player): void {
        this.players[networkId] = player;
    }

    /**
     * Removes the player from the server.
     * @param player The player to remove.
     */
    removePlayer(player: Player): void {
        delete this.players[player.address.networkId];
    }

    /**
     * Gets the player by their network ID.
     * @param networkId The player's network ID.
     */
    getPlayerByIdentifier(networkId: string): Player | undefined {
        return this.players[networkId];
    }
}

/* The Open-Shen server instance. */
export const server: Server = new Server();
/* Singleton method. */
export function getInstance(): Server {
    return server;
}