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
import {jsonToObject} from "../utils/packets";
import {server} from "../server";

export default async function (data, player: Player): Promise<void> {
    player.sendPacket("ActivityScheduleInfoNotify");
    player.sendPacket("PlayerPropNotify");
    player.sendPacket("PlayerDataNotify", player.network.dataNotification());
    player.sendPacket("OpenStateUpdateNotify");
    player.sendPacket("StoreWeightLimitNotify");
    player.sendPacket("PlayerStoreNotify", player.network.storageNotification());
    player.sendPacket("AvatarDataNotify", jsonToObject("AvatarDataNotify"));
    player.sendPacket("AvatarSatiationDataNotify");
    player.sendPacket("RegionSearchNotify");
    player.sendPacket("PlayerEnterSceneNotify");
    return await player.sendPacket("PlayerLoginRsp", server.versionData.loginData);
}