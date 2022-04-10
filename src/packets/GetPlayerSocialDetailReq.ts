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

export default async function (data, player: Player): Promise<void> {
    const searchFor = data.uid;

    if (searchFor == 624263971) { // This is the default player data.
        return await player.sendPacket("GetPlayerSocialDetailRsp");
    }

    // TODO: Do a database search of the UID.
    // SELECT * FROM players WHERE uid='${searchFor}';

    return await player.sendPacket("GetPlayerSocialDetailRsp", {
        detailData: {
            reservedList: [], showAvatarInfoList: [], showNameCardIdList: [],
            uid: (parseInt(searchFor) || 1), nickname: 'Console', level: 60,
            birthday: {month: 6, day: 9}, onlineState: 1, isFriend: true,
            isMpModeAvailable: true, nameCardId: 210001, finishAchievementNum: 69420,
            profilePicture: {avatarId: 10000007}
        }
    });
}