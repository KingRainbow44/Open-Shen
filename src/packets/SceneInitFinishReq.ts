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
import {jsonToObject} from "../utils/packets";

export default async function (data, player: Player): Promise<void> {
    const world = player.world; // The player's world.

    player.sendPacket("WorldOwnerDailyTaskNotify");
    player.sendPacket("WorldPlayerInfoNotify", world.toWorldPlayerInfo());
    player.sendPacket("WorldDataNotify", world.toPropertyMap());
    player.sendPacket("WorldOwnerBlossomBriefInfoNotify");
    player.sendPacket("TeamResonanceChangeNotify"); // TODO: Implement this.
    player.sendPacket("WorldAllRoutineTypeNotify");
    player.sendPacket("SceneForceUnlockNotify");
    player.sendPacket("PlayerGameTimeNotify", world.getGameTime(player));
    player.sendPacket("SceneTimeNotify", {sceneId: 3}); // Temporarily hardcoded.
    player.sendPacket("SceneDataNotify");
    player.sendPacket("AvatarEquipChangeNotify", jsonToObject("AvatarEquipChangeNotify2"));
    player.sendPacket("AvatarEquipChangeNotify", jsonToObject("AvatarEquipChangeNotify1"));
    player.sendPacket("AvatarEquipChangeNotify", jsonToObject("AvatarEquipChangeNotify1"));
    player.sendPacket("AvatarEquipChangeNotify", jsonToObject("AvatarEquipChangeNotify2"));
    player.sendPacket("HostPlayerNotify", world.getWorldHost());
    player.sendPacket("ScenePlayerInfoNotify", world.toScenePlayerInfo());
    player.sendPacket("PlayerEnterSceneInfoNotify", player.network.enterSceneNotification(3495));
    player.sendPacket("SyncTeamEntityNotify", {sceneId: 3}); // Temporarily hardcoded.
    player.sendPacket("SyncScenePlayTeamEntityNotify", {sceneId: 3}); // Temporarily hardcoded.
    player.sendPacket("ScenePlayBattleInfoListNotify");
    player.sendPacket("SceneTeamUpdateNotify", world.network.sceneTeamUpdateNotification()); // TODO: Implement this.
    player.sendPacket("AllMarkPointNotify");
    player.sendPacket("PlayerPropNotify", {propMap: {10018: {type: 10018, ival: "1", val: "1"}}});
    return await player.sendPacket("SceneInitFinishRsp", {enterSceneToken: 3495});
}