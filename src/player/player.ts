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

import {KCP} from "node-kcp-x";
import {
    Account,
    Address,
    Character,
    Entity,
    Gacha,
    Inventory,
    PropertyValue,
    Statistics,
    User
} from "../utils/interfaces";
import {PlayerDataNotify, PlayerEnterSceneInfoNotify, PlayerStoreNotify} from "../utils/protocol";
import {PlayerConstants} from "../utils/constants";
import World from "../world/world";

import {base64Decode, base64Encode} from "../utils/utilities";
import {binaryToObject, bufferToPacket, getIdFromFramework, jsonToObject, objectToBuffer} from "../utils/packets";
import {debug, logToFile, verbose} from "../utils/logger";
import {config} from "../index";
import {server} from "../server";
import DataProvider from "../objects/provider";

export default class Player {
    kcpObj: KCP;
    address: Address;

    network: NetworkAdapter;
    data: DataAdapter;

    /* The player's data. */
    info: User;
    stats: Statistics;
    inventory: Inventory;
    gacha: Gacha;
    world: World;

    /* Value holders. */
    entityIds: number[] = [];
    entityObj: Entity;

    /* Debug holder. */
    chatMessages: object = {};

    /**
     * @param kcp This is the KCP client object assigned when the player is created.
     */
    constructor(kcp: KCP) {
        this.kcpObj = kcp;
        this.network = new NetworkAdapter(this);
    }

    /**
     * Called when converting the player into a string.
     */
    toString() {
        return this.info.nickname;
    }

    /**
     * Encode and send a packet to the KCP client using the framework.
     * @param framework The protobuf framework to use.
     * @param packet The packet content to send.
     */
    async sendPacket(framework: string, packet: object = undefined): Promise<void> {
        if (packet == undefined) {
            packet = config.debug.useRawPackets ? binaryToObject(framework) : jsonToObject(framework);
        }

        // Dump packet content if in verbose mode with a high enough debug level.
        config.debug.debugLevel >= 9 && verbose(35, `[UDP VERBOSE] Dispatching ${framework} with data:`, packet);

        if (config.debug.logPackets) {
            logToFile(JSON.stringify(packet), `outgoing_${framework}`, true);
            logToFile(`[UDP] Dispatched ${framework} at ${Date.now()}`, `outbound_packets`, true);
        }

        if (parseInt(framework.charAt(framework.length - 1))) {
            framework = framework.slice(0, framework.length - 1);
        }

        const packetId: number = getIdFromFramework(framework);
        const encodedData: any = await objectToBuffer(packet, packetId);
        this.kcpObj.send(await bufferToPacket(encodedData, packetId, this.network.getKeyPair() || server.getInitialKeyPair()));

        if (!["PingRsp"].includes(framework) || config.debug.debugLevel >= 9)
            debug(36, `[UDP] Sent packet: ${framework} (${packetId})`);
    }

    /**
     * Finish logging the player into the game.
     * @param uid The player's UID to grab data from.
     */
    async login(uid: string): Promise<void> {
        this.data = new DataAdapter(this);

        let playerData: Account;
        const dataProvider: DataProvider = server.getDataProvider();
        if(!(await dataProvider.playerDataExists(uid))) {
            dataProvider.createPlayerData(uid, defaultPlayerData(uid));
            playerData = defaultPlayerData(uid);
        } else playerData = <Account> await dataProvider.getPlayerData(uid);

        const defaultData: Account = defaultPlayerData(uid);
        this.info = playerData.userData || defaultData.userData;
        this.stats = playerData.statistics || defaultData.statistics;
        this.gacha = playerData.gacha || defaultData.gacha;
        this.inventory = playerData.inventory || defaultData.inventory;

        this.world = new World();
        this.world.addPlayer(this);
    }

    /**
     * Log the player out of the game and save their data.
     */
    async logout(): Promise<void> {
        const serialized: Account = {
            userData: this.info,
            statistics: this.stats,
            inventory: this.inventory,
            gacha: this.gacha
        };

        this.world.removePlayer(this);
        server.getDataProvider().updatePlayerData(this.info.uid, serialized);
    }

    /*
     * API Methods.
     */

    /**
     * Sends a message to the player.
     * @param message The message to send.
     * @param uid The player who sent the message (or Console if not specified)
     */
    sendMessage(message: string, uid: string = "1"): void {
        // TODO: Send chat message packet.
    }
}

/**
 * A data wrapper for the player.
 */
class DataAdapter {
    private readonly player: Player;

    constructor(player: Player) {
        this.player = player;
    }

    /**
     * Get the player for this adapter.
     */
    getPlayer(): Player {
        return this.player;
    }

    /* Avatar/Character blocks. */

    /**
     * Creates avatar data (for 'PlayerEnterSceneInfoNotify')
     * @param avatar One of the four selected avatars to use.
     */
    avatarData(avatar: number): Character {
        if (avatar < 0 || avatar > 3)
            throw new Error(`Invalid avatar ID: ${avatar}`);
        return {
            avatarAbilityInfo: undefined,
            avatarEntityId: 0,
            avatarGuid: "",
            weaponAbilityInfo: undefined,
            weaponEntityId: 0,
            weaponGuid: ""
        };
    }
}

/**
 * A protocol wrapper for the player.
 */
class NetworkAdapter {
    private readonly player: Player;
    private keyPair: Buffer;

    constructor(player: Player) {
        this.player = player;
    }

    /**
     * Get the player for this adapter.
     */
    getPlayer(): Player {
        return this.player;
    }

    /**
     * Returns the XOR keypair for decrypting packets.
     */
    getKeyPair(): Buffer {
        return this.keyPair;
    }

    /**
     * Sets the XOR keypair for decrypting packets.
     * @param keyPair The keypair generated from the token.
     */
    setKeyPair(keyPair: Buffer): void {
        this.keyPair = keyPair;
    }

    /**
     * Creates an 'PlayerEnterSceneInfoNotify' packet.
     * @param sceneToken The scene token for the packet.
     */
    enterSceneNotification(sceneToken: number): PlayerEnterSceneInfoNotify {
        return jsonToObject("PlayerEnterSceneInfoNotify");
        // TODO: Fully implement after testing.
        // const player: Player = this.getPlayer();
        // return {
        //     enterSceneToken: sceneToken,
        //     curAvatarEntityId: player.entityObj.entityId,
        //     avatarEnterInfo: [],
        //
        //     teamEnterInfo: {
        //         teamEntityId: 150995686,
        //         teamAbilityInfo: {},
        //         abilityControlBlock: {}
        //     },
        //     mpLevelEntityInfo: {
        //         entityId: 184550127,
        //         authorityPeerId: 1,
        //         abilityInfo: {}
        //     }
        // };
    }

    /**
     * Creates a 'PlayerDataNotify' packet.
     */
    dataNotification(): PlayerDataNotify {
        const stats: Statistics = this.player.stats;
        const properties: object = {
            10004: toPropertyValue(10004, 1),
            10005: toPropertyValue(10005, 50),
            10006: toPropertyValue(10006, 1),
            10007: toPropertyValue(10007, 0, false),
            10008: toPropertyValue(10008, 0, false),
            10009: toPropertyValue(10009, 1),
            10010: toPropertyValue(10010, 10000),
            10011: toPropertyValue(10011, 10000),
            10012: toPropertyValue(10012, 0, false),
            10013: toPropertyValue(10013, stats.adventureRank),
            10014: toPropertyValue(10014, stats.adventureExp),
            10015: toPropertyValue(10015, 88),
            10016: toPropertyValue(10016, 55082),
            10017: toPropertyValue(10017, 2),
            10019: toPropertyValue(10019, stats.worldLevel),
            10020: toPropertyValue(10020, 160)
        };
        return {
            nickName: this.player.info.nickname,
            serverTime: 1627169021298,
            regionId: 49,
            isFirstLoginToday: false,
            propMap: properties
        };
    }

    /**
     * Creates a 'PlayerStoreNotify' packet.
     * TODO: Implement player inventory.
     */
    storageNotification(): PlayerStoreNotify {
        // const inventory: Inventory = this.player.inventory;
        return <PlayerStoreNotify>jsonToObject("PlayerStoreNotify");
    }
}

/**
 * Creates default player data to be saved later.
 * @param uid The UID for the player data.
 */
function defaultPlayerData(uid: string): Account {
    return <Account>{
        userData: {
            uid: uid,
            nickname: "User", signature: "",
            friends: [PlayerConstants.CONSOLE_USER], friendRequests: [],
            gachaRspValue: 0
        },
        statistics: {
            adventureRank: 1, adventureExp: 0,
            worldLevel: 0
        },
        inventory: {
            selectedAvatar: 0
        },
        gacha: {
            banners: []
        }
    };
}

/**
 * Creates a property value object.
 * @param type The property type.
 * @param value The value for the property.
 * @param withVal Should the object include a 'val' field?
 */
function toPropertyValue(type: number, value: number, withVal: boolean = true): PropertyValue {
    const baseObject: PropertyValue = {type: type, ival: value};
    withVal && Object.assign(baseObject, {val: value.toString()});
    return baseObject;
}