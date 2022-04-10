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
import {GachaConfig, GachaInfo} from "../utils/interfaces";
import {configs} from "../index";
import {ServerConstants} from "../utils/constants";

const gachaInfo = ((function (): object {
    const gachaConfig: GachaConfig = configs.gachaConfig;
    const gachaInfo = {gachaInfoList: <GachaInfo[]>[], gachaRandom: 3596445971};

    const {maxTimes, types} = gachaConfig.gacha;
    const {currency, tenPull, onePull} = gachaConfig.costs;
    const {start, end} = gachaConfig.time;

    gachaConfig.gacha.types.forEach(type => {
        const info: GachaInfo = ServerConstants.GACHA_TYPES[type];
        info.gachaTimesLimit = maxTimes;
        info.leftGachaTimes = maxTimes; // TODO: Properly implement.
        info.tenCostItemId = currency.standard; // TODO: Properly implement.
        info.costItemId = currency.standard; // TODO: Properly implement.
        info.tenCostItemNum = tenPull;
        info.costItemNum = onePull;
        info.beginTime = start == "-1" ? Date.now() : parseInt(start);
        info.endTime = Date.now() + parseInt(end);
        gachaInfo.gachaInfoList.push(info);
    });

    return gachaInfo;
}))();

export default async function (data, player: Player): Promise<void> {
    return await player.sendPacket("GetGachaInfoRsp", gachaInfo);
}