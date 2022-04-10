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
import {DoGachaRequest, DoGachaResponse} from "../utils/protocol";
import {BannerData, Gacha} from "../utils/interfaces";
import {randomNumber} from "../utils/utilities";
import {configs} from "../index";

const {currency, tenPull, onePull} = configs.gachaConfig.costs;
const {maxTimes} = configs.gachaConfig.gacha;

export default async function (data: DoGachaRequest, player: Player): Promise<void> {
    const response: DoGachaResponse = {
        gachaType: data.gachaType,
        gachaTimes: data.gachaTimes,
        gachaScheduleId: data.gachaScheduleId,
        newGachaRandom: randomNumber(111111111, 999999999),
        costItemId: currency.standard, // TODO: Properly implement.
        tenCostItemId: currency.standard, // TODO: Properly implement.
        costItemNum: onePull,
        tenCostItemNum: tenPull,
        leftGachaTimes: maxTimes, // TODO: Properly implement.
        gachaTimesLimit: maxTimes, // TODO: Properly implement.
        gachaItemList: []
    };

    const gacha: Gacha = player.gacha;
    const banner: BannerData = gacha.banners[data.gachaType] || {
        pity: {four: 0, five: 0}, guarantee: {four: false, five: false}
    };

    for (let i = 0; i < data.gachaTimes; i++) {
        let random = Math.round(Math.random() * 1000);
        let threshold = banner.pity.five >= 90 ? 1000 : 6;

        if (random < threshold) {
            // Player gets 5-star item.
            if (banner.guarantee.five || randomNumber(0, 1) == 0) {
                // Player wins limited character/weapon.
                banner.guarantee.five = false;
            } else {
                // Player receives standard character/weapon.
                banner.guarantee.five = true;
            }

            // Set player pity back to 0.
            banner.pity.five = 0;
            continue;
        } else banner.pity.five++;

        random = Math.round(Math.random() * 1000);
        threshold = banner.pity.four >= 10 ? 1000 : 51;

        if (random < threshold) {
            // Player gets 4-star item.
            if (banner.guarantee.four || randomNumber(0, 1) == 0) {
                // Player wins limited character/weapon.
                banner.guarantee.four = false;
            } else {
                // Player receives standard character/weapon.
                banner.guarantee.four = true;
            }

            // Set player pity back to 0.
            banner.pity.four = 0;
            continue;
        } else banner.pity.four++;
    }

    gacha.banners[data.gachaType] = banner; // Write banner data.
    return await player.sendPacket("DoGachaRsp", response);
}