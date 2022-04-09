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

const friend = {
    uid: 1337,
    nickname: 'Console',
    level: 60,
    worldLevel: 8,
    param: 31,
    signature: "I do stuff.",
    isMpModeAvailable: true,
    lastActiveTime: 0,
    nameCardId: 210001,
    profilePicture: {avatarId: 10000005},
    isGameSource: true,
    platformType: 'PC'
};

export default async function (data, player: Player): Promise<void> {
    // TODO: Co-Op system.
    return await player.sendPacket("GetRecentMpPlayerListRsp", {
        recentMpPlayerBriefList: [friend]
    });
}