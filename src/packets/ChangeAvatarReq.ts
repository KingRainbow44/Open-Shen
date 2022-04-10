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
import {ChangeAvatarRequest, ChangeAvatarResponse} from "../utils/protocol";

export default async function (data: ChangeAvatarRequest, player: Player): Promise<void> {
    // TODO: Get current player's avatar.
    // TODO: De-spawn avatar using it's entity ID.
    // TODO: Spawn new avatar from world.
    // TODO: Modify player properties.

    // TODO: Properly implement character switching.
    player.sendPacket("SceneEntityDisappearNotify");
    player.sendPacket("SceneEntityAppearNotify");
    player.sendPacket("PlayerEnterSceneInfoNotify");
    return await player.sendPacket("ChangeAvatarRsp", <ChangeAvatarResponse>{curGuid: data.guid});
}