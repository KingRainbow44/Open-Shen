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
import {generateKey} from "../utils/keygen";

export default async function (data, player: Player): Promise<void> {
    await player.login(data.accountUid); // Login the player using their UID.

    setTimeout(() => {
        // Generate an XOR key and set it.
        const keyPair: Buffer = generateKey();
        player.network.setKeyPair(keyPair);
    }, 300);

    return await player.sendPacket("GetPlayerTokenRsp", {
        uid: parseInt(player.info.uid), // Temporarily hardcoded.
        token: "5d3a68649e77deb7870e76cb2a882f6afd683e58", // Temporarily hardcoded.
        accountType: 1, accountUid: player.info.uid, gmUid: "1", // Temporarily hardcoded.
        isProficientPlayer: true, secretKeySeed: "2", securityCmdBuffer: "bOWfEaq03Yd8HWvHODwqi5UfAlUGMgqwAopeu26XS7I=",
        platformType: 3, channelId: 1, countryCode: "MX",
        clientVersionRandomKey: "6c5-99a33d999aa9", regPlatform: 3, clientIpStr: player.address.ip // Temporarily hardcoded.
    });
}