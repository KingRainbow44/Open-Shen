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

import Player from "../player/player";
import {UnionCmdNotify} from "../utils/protocol";
import {Color} from "../utils/constants";
import * as protocol from "../utils/packets";
import * as logger from "../utils/logger";
import * as utils from "../utils/utilities";

import {config} from "../index";
import {server} from "../server";

export default async function (data: UnionCmdNotify, player: Player): Promise<void> {
    for(const cmd of data.cmdList) {
        const messageId: number = cmd.messageId;
        const body: Buffer = cmd.body;
        
        const data: object = await protocol.packetToObject(body, messageId);
        await handleUnionCmd(messageId, data, player);
    } return Promise.resolve();
}

/**
 * Invokes the appropriate handler for the given message ID.
 * @param cmdId The message ID.
 * @param cmdData The data associated with the message.
 */
async function handleUnionCmd(cmdId: number, cmdData: object, player: Player): Promise<void> {
    const framework: string = protocol.getFrameworkById(cmdId);
    try {
        const handler = require(`./union/${framework}`);
        const result: any = await handler.default(cmdData, player);
        
        if(config.debug.logPackets) {
            logger.logToFile(JSON.stringify(cmdData), `incoming_${framework}`, true);
            logger.logToFile(`[UDP] Accepted ${framework} at ${utils.formatDate(Date.now())}`, `inbound_packets`, true);
        } 
        
        return result;
    } catch (error: any) {
        logger.debug(Color.CYAN(false), `Unable to handle union command ${cmdId} (${framework})`);
        if(config.debug.debugLevel > 1 && !server.unhandledPackets[cmdId]) {
            console.warn("Unhandled union command:", error);
            server.unhandledPackets.push(cmdId);
        }
    }
}