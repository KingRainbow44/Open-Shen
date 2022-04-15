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

import {
    Character,
    CombatInvokeEntry,
    Entity,
    GachaItemEntry,
    ItemEntry, MotionInfo,
    SceneAvatar,
    UnionCommand,
    Vector
} from "./interfaces";

/*
 * Genshin Impact Packets
 *

/* Used in `DoGachaReq` */
export interface DoGachaRequest {
    gachaType: number;
    gachaTimes: number;
    gachaRandom: number;
    gachaScheduleId: number;
}

/* Used in `PrivateChatReq` */
export interface PrivateChatRequest {
    text?: string;
    icon?: number;
    targetUid: number;
}

/* Used in `ChangeAvatarReq` */
export interface ChangeAvatarRequest {
    guid: string;
    isMove: boolean;
    movePos: Vector;
}

/* Used in `GetPlayerTokenReq` */
export interface PlayerTokenRequest {
    accountType: number;
    accountUid: string;
    accountToken: string;
    accountExt: string;
    uid: number;
    
    isGuest: boolean;
    platformType: number;
    onlineId: string;
    channelId: number;
    countryCode: string;
    clientIpStr: string;
}

/* Used in `DoGachaRsp` */
export interface DoGachaResponse {
    gachaType: number;
    gachaTimes: number;
    gachaItemList: GachaItemEntry[];
    newGachaRandom: number;
    gachaScheduleId: number;

    costItemId: number;
    costItemNum: number;
    tenCostItemId: number;
    tenCostItemNum: number;

    leftGachaTimes: number;
    gachaTimesLimit: number;
}

/* Used in `ChangeAvatarReq` */
export interface ChangeAvatarResponse {
    curGuid: string;
}

/* Used in `PlayerLoginReq` */
export interface PlayerLoginResponse {
    isUseAbilityHash: boolean;
    abilityHashCode: number;
    clientDataVersion: number;
    clientSilenceDataVersion: number;
    gameBiz: string;
    countryCode: string;
    registerCps: string;

    clientMd5: string;
    clientSilenceMd5: string;
    clientVersionSuffix: string;
    clientSilenceVersionSuffix: string;

    isScOpen: boolean;
    scInfo: string;

    resVersionConfig: {
        version: string;
        md5: string;
        releaseTotalSize: string;
        versionSuffix: string;
        branch: string;
    }
}

/*
 * Genshin Impact Notifications
 */

export interface SceneEntityDisappearNotify {
    entityList: number[];
    disappearType: number;
}

export interface SceneEntityAppearNotify {
    entityList: Entity[];
    appearType: number;
    param: number;
}

export interface PlayerPropNotify {
    propMap: object;
}

export interface PlayerDataNotify {
    nickName: string;
    serverTime: number;
    regionId: number;
    isFirstLoginToday: boolean;
    propMap: object;
}

export interface PlayerStoreNotify {
    storeType: number;
    itemList: ItemEntry[];
    weightLimit: number;
}

export interface PlayerEnterSceneInfoNotify {
    curAvatarEntityId: number;
    enterSceneToken: number;

    avatarEnterInfo: Character[];

    teamEnterInfo: {
        teamEntityId: number;
        teamAbilityInfo: object;
        abilityControlBlock: object;
    };

    mpLevelEntityInfo: {
        entityId: number;
        authorityPeerId: number;
        abilityInfo: object;
    };
}

export interface PlayerEnterSceneNotify {
    sceneId: number;
    pos: Vector;
    sceneBeginTime: number;
    type: number;
    targetUid: number;
    prevSceneId?: number;
    prevPos?: Vector;
    dungeonId?: number;
    worldLevel?: number;
    enterSceneToken: number;
    isFirstLoginEnterScene: boolean;
    sceneTagIdList: number[];
    isSkipUi?: boolean;
    enterReason: number;
    worldType: number;
    sceneTransaction?: string;
}

export interface SceneTeamUpdateNotify {
    sceneTeamAvatarList: SceneAvatar[];
}

export interface UnionCmdNotify {
    cmdList: UnionCommand[];
}

/* 
 * Union Command Notify Definitions 
 */

export interface CombatInvocationsNotify {
    invokeList: CombatInvokeEntry[];
}

export interface EntityMoveInfo {
    entityId: number;
    motionInfo: MotionInfo;
    sceneTime: number;
    reliableSeq: number;
    isReliable: boolean;
}