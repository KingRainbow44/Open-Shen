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

const sceneAreas = {
    3: {
        sceneId: 3, areaIdList: [1],
        cityInfoList: [
            {cityId: 3, level: 1},
            {cityId: 1, level: 1},
            {cityId: 2, level: 1}
        ]
    },
    4: {
        sceneId: 4, areaIdList: [100],
        cityInfoList: [
            {cityId: 100, level: 1}
        ]
    }
};

export default async function (data, player: Player): Promise<void> {
    // TODO: Implement multiple scenes & player data.
    return await player.sendPacket("GetSceneAreaRsp", sceneAreas[data.sceneId]);
}