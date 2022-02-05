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

const scenePoints = {
    3: {
        sceneId: 3, unlockedPointList: [7, 10, 6, 8], unlockAreaList: [1],
        notExploredDungeonEntryList: [14, 15, 13, 1, 2, 12, 6, 10, 8, 16, 11, 3, 1001, 7, 9]
    },
    4: {
        sceneId: 4, unlockAreaList: [100]
    }
};

export default async function (data, player: Player): Promise<void> {
    // TODO: Implement multiple scenes & player data.
    return await player.sendPacket("GetScenePointRsp", scenePoints[data.sceneId]);
}