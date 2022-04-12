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
    static readonly CONFIG_VERSION: number = 3;

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

export class GeneratorConstants {
    static readonly ABILITY_EMBRYO_LIST = [
        {
            "abilityId": 2,
            "abilityNameHash": 4291357363,
            "abilityOverrideNameHash": 1178079449
        },
        {
            "abilityId": 3,
            "abilityNameHash": 664564586,
            "abilityOverrideNameHash": 1178079449
        },
        {
            "abilityId": 4,
            "abilityNameHash": 4172444990,
            "abilityOverrideNameHash": 1178079449
        },
        {
            "abilityId": 5,
            "abilityNameHash": 1578170661,
            "abilityOverrideNameHash": 1178079449
        },
        {
            "abilityId": 6,
            "abilityNameHash": 918348879,
            "abilityOverrideNameHash": 1178079449
        },
        {
            "abilityId": 7,
            "abilityNameHash": 1410219662,
            "abilityOverrideNameHash": 1178079449
        },
        {
            "abilityId": 8,
            "abilityNameHash": 1474894886,
            "abilityOverrideNameHash": 1178079449
        },
        {
            "abilityId": 9,
            "abilityNameHash": 3832178184,
            "abilityOverrideNameHash": 1178079449
        },
        {
            "abilityId": 10,
            "abilityNameHash": 2306062007,
            "abilityOverrideNameHash": 1178079449
        },
        {
            "abilityId": 11,
            "abilityNameHash": 3105629177,
            "abilityOverrideNameHash": 1178079449
        },
        {
            "abilityId": 12,
            "abilityNameHash": 3771526669,
            "abilityOverrideNameHash": 1178079449
        },
        {
            "abilityId": 13,
            "abilityNameHash": 100636247,
            "abilityOverrideNameHash": 1178079449
        },
        {
            "abilityId": 14,
            "abilityNameHash": 1564404322,
            "abilityOverrideNameHash": 1178079449
        },
        {
            "abilityId": 15,
            "abilityNameHash": 497711942,
            "abilityOverrideNameHash": 1178079449
        },
        {
            "abilityId": 16,
            "abilityNameHash": 1142761247,
            "abilityOverrideNameHash": 1178079449
        },
        {
            "abilityId": 17,
            "abilityNameHash": 518324758,
            "abilityOverrideNameHash": 1178079449
        },
        {
            "abilityId": 18,
            "abilityNameHash": 3276790745,
            "abilityOverrideNameHash": 1178079449
        },
        {
            "abilityId": 19,
            "abilityNameHash": 3429175060,
            "abilityOverrideNameHash": 1178079449
        },
        {
            "abilityId": 20,
            "abilityNameHash": 3429175061,
            "abilityOverrideNameHash": 1178079449
        },
        {
            "abilityId": 21,
            "abilityNameHash": 4253958193,
            "abilityOverrideNameHash": 1178079449
        },
        {
            "abilityId": 22,
            "abilityNameHash": 209033715,
            "abilityOverrideNameHash": 1178079449
        },
        {
            "abilityId": 23,
            "abilityNameHash": 900298203,
            "abilityOverrideNameHash": 1178079449
        },
        {
            "abilityId": 24,
            "abilityNameHash": 127390306,
            "abilityOverrideNameHash": 1178079449
        },
        {
            "abilityId": 25,
            "abilityNameHash": 825255509,
            "abilityOverrideNameHash": 1178079449
        }
    ];
    static readonly FIGHT_PROP_LIST = [
        {
            "propType": 1,
            "propValue": 1363.1275634765625
        },
        {
            "propType": 4,
            "propValue": 59.55296325683594
        },
        {
            "propType": 6
        },
        {
            "propType": 7,
            "propValue": 85.55137634277344
        },
        {
            "propType": 20,
            "propValue": 0.07100000232458115
        },
        {
            "propType": 21
        },
        {
            "propType": 22,
            "propValue": 0.5
        },
        {
            "propType": 23,
            "propValue": 1
        },
        {
            "propType": 26
        },
        {
            "propType": 27
        },
        {
            "propType": 28
        },
        {
            "propType": 29
        },
        {
            "propType": 30
        },
        {
            "propType": 40
        },
        {
            "propType": 41
        },
        {
            "propType": 42
        },
        {
            "propType": 43
        },
        {
            "propType": 44
        },
        {
            "propType": 45
        },
        {
            "propType": 46
        },
        {
            "propType": 50
        },
        {
            "propType": 51
        },
        {
            "propType": 52
        },
        {
            "propType": 53
        },
        {
            "propType": 54
        },
        {
            "propType": 55
        },
        {
            "propType": 56
        },
        {
            "propType": 74,
            "propValue": 60
        },
        {
            "propType": 2000,
            "propValue": 1363.1275634765625
        },
        {
            "propType": 2001,
            "propValue": 59.55296325683594
        },
        {
            "propType": 2002,
            "propValue": 85.55137634277344
        },
        {
            "propType": 2003
        },
        {
            "propType": 1004,
            "propValue": 2
        },
        {
            "propType": 1010,
            "propValue": 1363.1275634765625
        }
    ];
    
    static readonly EXCEL_LIST = {
        amber: {
            prefabPathHash: "1049031694485",
            prefabPathRemoteHash: "1053359340965",
            controllerPathHash: "336094165345",
            controllerPathRemoteHash: "822233630114",
            combatConfigHash: "152079964069"
        }
    };
    static readonly WEAPON_LIST = {
        test: {
            entityId: 100664042,
            gadgetId: 50015101,
            itemId: 15101,
            guid: "2681193339516092493",
            level: 1,
            abilityInfo: {}
        }
    };
}

export class InvocationArguments {
    static readonly COMBAT_NONE = 0;
    static readonly COMBAT_EVT_BEING_HIT = 1;
    static readonly COMBAT_ANIMATOR_STATE_CHANGED = 2;
    static readonly COMBAT_FACE_TO_DIR = 3;
    static readonly COMBAT_SET_ATTACK_TARGET = 4;
    static readonly COMBAT_RUSH_MOVE = 5;
    static readonly COMBAT_ANIMATOR_PARAMETER_CHANGED = 6;
    static readonly ENTITY_MOVE = 7;
    static readonly SYNC_ENTITY_POSITION = 8;
    static readonly COMBAT_STEER_MOTION_INFO = 9;
    static readonly COMBAT_FORCE_SET_POS_INFO = 10;
    static readonly COMBAT_COMPENSATE_POS_DIFF = 11;
    static readonly COMBAT_MONSTER_DO_BLINK = 12;
    static readonly COMBAT_FIXED_RUSH_MOVE = 13;
    static readonly COMBAT_SYNC_TRANSFORM = 14;
    static readonly COMBAT_LIGHT_CORE_MOVE = 15;
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