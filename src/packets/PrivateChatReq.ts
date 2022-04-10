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

import Player from "../player/Player";
import {PrivateChatRequest} from "../utils/protocol";
import {handleCommand} from "../handlers/command";

// mode == 'verbose' && logWebhook.send({embeds: [genericEmbed(data.text, `Private Chat to ${data.targetUid}`)]});
// player.info.gachaRspValue = parseInt(data.text);

export default async function (data: PrivateChatRequest, player: Player): Promise<void> {
    const target: number = data.targetUid;
    if (target == 1337) {
        data.text && handleCommand(data.text, player);
    }

    player.sendPacket("PlayerChatNotify", {
        channelId: 0, chatInfo: {
            text: data.text, time: Date.now(), toUid: target,
            sequence: 1, isRead: true
        }
    });

    return await player.sendPacket("PrivateChatRsp", {retcode: 1649173597});
}