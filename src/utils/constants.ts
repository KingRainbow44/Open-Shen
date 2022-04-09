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

import {Friend} from "./interfaces";

export class ServerConstants {
    static readonly CONFIG_VERSION: number = 1;

    static readonly GACHA_TYPES = {
        0: { // Standard banner.
            gachaType: 200, scheduleId: 586,
            gachaPrefabPath: "GachaShowPanel_A022", gachaPreviewPrefabPath: "UI_Tab_GachaShowPanel_A022",
            gachaProbUrl: "https://webstatic-sea.mihoyo.com/hk4e/event/e20190909gacha/index.html?authkey_ver=1&sign_type=2&auth_appid=webview_gacha&gacha_id=3c6c223d4d5ada706c7216b82da2593cc17050&timestamp=1626824159",
            gachaProbUrlOversea: "https://webstatic-sea.mihoyo.com/hk4e/event/e20190909gacha/index.html?authkey_ver=1&sign_type=2&auth_appid=webview_gacha&gacha_id=3c6c223d4d5ada706c7216b82da2593cc17050&timestamp=1626824159",
            gachaRecordUrlOversea: "https://webstatic-sea.mihoyo.com/hk4e/event/e20190909gacha/index.html?authkey_ver=1&sign_type=2&auth_appid=webview_gacha&init_type=200&gacha_id=3c6c223d4d5ada706c7216b82da2593cc17050&timestamp=1626824159"
        }
    };
    static readonly SWITCHED_GACHA_TYPES = (function (): object {
        const result: object = {};
        for (const key in ServerConstants.GACHA_TYPES) {
            result[ServerConstants.GACHA_TYPES[key].gachaType] = ServerConstants.GACHA_TYPES[key];
        }
        return result;
    })();
}

export class PlayerConstants {
    static readonly CONSOLE_USER: Friend = {
        uid: 1, param: 31,
        adventureRank: 60, worldLevel: 8,
        nickname: 'Console', signature: 'I do things.',
        canCoop: true, isGameSource: true,
        platformType: 'PC',

        lastActiveTime: Date.now(), nameCardId: 210001,
        profilePicture: {avatarId: 10000005}
    };
}

export class Color {
    static BLACK(foreground: boolean = true): number {
        return foreground ? 30 : 40;
    }

    static RED(foreground: boolean = true): number {
        return foreground ? 31 : 41;
    }

    static GREEN(foreground: boolean = true): number {
        return foreground ? 32 : 42;
    }

    static YELLOW(foreground: boolean = true): number {
        return foreground ? 33 : 43;
    }

    static BLUE(foreground: boolean = true): number {
        return foreground ? 34 : 44;
    }

    static MAGENTA(foreground: boolean = true): number {
        return foreground ? 35 : 45;
    }

    static CYAN(foreground: boolean = true): number {
        return foreground ? 36 : 46;
    }

    static WHITE(foreground: boolean = true): number {
        return foreground ? 37 : 47;
    }

    static DEFAULT(foreground: boolean = true): number {
        return foreground ? 39 : 49;
    }

    static RESET(foreground: boolean = true): number {
        return foreground ? 0 : 0;
    }
}