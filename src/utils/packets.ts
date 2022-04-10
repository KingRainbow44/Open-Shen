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

import {Version} from "./interfaces";
import {config, working} from "../index";
import {load} from "protobufjs";
import {readFileSync} from "fs";

const versionData: Version = require(`${working}/versions/${config.server.clientVersion}.json`);
const packetIds: object = versionData.packetIds;
const switchedPacketIds: object = (function () {
    const obj = {};
    for (let x in packetIds) {
        obj[packetIds[x]] = x;
    }
    return obj;
})();

/**
 * Encrypts/decrypts a data buffer from a key buffer.
 * @param data The data to encrypt/decrypt.
 * @param key The key used to encrypt/decrypt.
 */
export function xorData(data: Buffer, key: Buffer) {
    for (let i = 0; i < data.length; i++)
        data.writeUInt8(data.readUInt8(i) ^ key.readUInt8(i % key.length), i);
}

/**
 * Removes magic bytes from a data buffer.
 * @param data The data buffer to remove magic bytes from.
 */
export function removeMagic(data: Buffer) {
    let moreSliced = Buffer.from(data.slice(10)); // Removes two byte magic.
    moreSliced = moreSliced.slice(0, moreSliced.byteLength - 2); // Removes two byte magic at the end.
    return moreSliced.slice(data.readUInt8(5));
}

/**
 * Creates a usable buffer from a packet.
 * @param data The packet to decrypt & decode.
 */
export function parsePacketData(data: Buffer) {
    let buffer = removeMagic(data);
    return buffer.slice(data.readUInt8(6), buffer.length);
}

/**
 * Gets the protobuf framework from a packet ID.
 * @param packetId The packet ID associated with the framework.
 */
export function getFrameworkById(packetId: number) {
    const name = packetIds[packetId]
    return name == null ? packetId : name;
}

/**
 * Get the packet ID associated with a protobuf framework.
 * @param protoName The protobuf framework name.
 */
export function getIdFromFramework(protoName: string) {
    const name = switchedPacketIds[protoName];
    return name == null ? protoName : name;
}

/**
 * Creates a protobuf object from a JS object.
 * @param object The object to create a protobuf object from.
 * @param packetId The packet ID relative to the framework associated with the object.
 */
export async function objectToBuffer(object: object, packetId: number) {
    try {
        const protoName = getFrameworkById(packetId);
        if (protoName == "None") {
            return protoName;
        }

        const root = await load(`${working}/protocol/${protoName}.proto`);
        // @ts-ignore
        const testMessage = root.lookup(protoName);
        // @ts-ignore
        const message = testMessage.create(object);
        // @ts-ignore
        return testMessage.encode(message).finish();
    } catch (exception) {
        console.log(exception);
    }
}

/**
 * Creates a JS object from a UDP packet.
 * @param data The data received from the client.
 * @param packetId The packet ID relative to the data.
 */
export async function packetToObject(data: any, packetId: number) {
    try {
        let protoName = getFrameworkById(packetId);
        if (protoName == "None") {
            return protoName;
        }

        const root = await load(`${working}/protocol/${protoName}.proto`);
        const testMessage = root.lookup(protoName);
        // @ts-ignore
        return testMessage.decode(data);
    } catch (exception) {
        console.log(`Error parsing packet ${getFrameworkById(packetId)}: Error: ${exception}`);
    }
}

/**
 * Converts a socket message to a KCP input.
 * @param message The socket message to convert.
 */
export function reformatKcpPacket(message: Buffer) {
    let i: number = 0, tokenSizeTotal: number = 0;
    let messages: Buffer[] = [];

    while (i < message.length) {
        let convId = message.readUInt32BE(i);
        let remainingHeader = message.subarray(i + 8, i + 28);
        let contentLen = message.readUInt32LE(i + 24);
        let content = message.subarray(i + 28, i + 28 + contentLen);

        let formattedMessage = Buffer.alloc(24 + contentLen);
        formattedMessage.writeUInt32BE(convId, 0);
        remainingHeader.copy(formattedMessage, 4);
        content.copy(formattedMessage, 24);
        i += 28 + contentLen;
        tokenSizeTotal += 4;
        messages.push(formattedMessage);
    }
    return Buffer.concat(messages, message.length - tokenSizeTotal);
}

/**
 * Converts a protobuf object to a KCP packet.
 * @param data The protobuf object to convert.
 * @param packetId The packet ID relative to the framework associated with the data.
 * @param key The XOR encryption key to encrypt the data with.
 */
export async function bufferToPacket(data: Buffer, packetId: number, key: Buffer) {
    let magic2 = Buffer.from(0x89AB.toString(16), 'hex'); // 45670005000c0000000b 18f7032801309df197eea02f10cbc4a086062566c8
    let part1 = Buffer.alloc(10);
    let metadata = await objectToBuffer({sent_ms: Date.now()}, 13371337); // 13371337 - Packet Head.
    part1.writeUInt16BE(0x4567, 0);
    part1.writeUInt16BE(packetId, 2);
    part1.writeUInt8(metadata.length, 5);
    part1.writeUInt16BE(data.length, 8);

    try {
        let ret = Buffer.concat([part1, metadata, data, magic2], part1.length + metadata.length + data.length + magic2.length);
        xorData(ret, key);
        return ret;
    } catch (exception) {
        console.log(data);
    }
}

/**
 * Unknown method.
 * @param data Data from a KCP object.
 * @param token A token from the KCP object.
 */
export function formatSentPacket(data: any, token: number) {
    let data1: Buffer = Buffer.from(data, 'hex');
    let it: number = 0;
    let messages: Buffer[] = [];

    while (it < data1.length) {
        let conv = data1.readUInt32BE(it);
        let contentLen = data1.readUInt32LE(it + 20);
        let newStart = Buffer.alloc(8);
        newStart.writeUInt32BE(conv, 0);
        newStart.writeUInt32BE(token, 4);

        let slice = data1.subarray(it + 4, it + 24 + contentLen);
        let awa = Buffer.concat([newStart, slice]);
        messages.push(awa);
        it += contentLen + 24;
    }
    return Buffer.concat(messages);
}

/**
 * Converts a buffer into a packet collection.
 * @param data The initial buffer to convert.
 * @param length The length of the collection.
 */
export function getPackets(data: Buffer, length: number = 28): Buffer[] {
    let it: number = 0;
    let buffers: Buffer[] = [];
    while (it < data.length) {
        let contentLen = data.readUInt32BE(it + length - 4)
        let sliced = data.slice(it, it + length + contentLen)
        buffers.push(sliced);
        it += length + contentLen
    }
    return buffers;
}

/**
 * Read the contents of a raw packet and convert it to an object.
 * @param binaryName The binary of the file to convert.
 * @param packetId The packet ID of the associated binary. (optional).
 */
export function binaryToObject(binaryName: string, packetId: number = undefined): object {
    return packetToObject(
        readFileSync(`${working}/rawPackets/${binaryName}.bin`),
        packetId ?? getIdFromFramework(binaryName)
    );
}

/**
 * Reads the contents of a JSON packet and convert it to an object.
 * @param framework The name of the file to convert.
 */
export function jsonToObject(framework: string) {
    return require(`${working}/packets/${framework}.json`);
}