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

import {PlayerLoginResponse} from "./protocol";
import Plugin from "../plugin/plugin";

/*
 * Configuration schemas.
 */

/* Server configuration file. */
export interface Config {
    version: number;

    debug: {
        enableDebug: boolean;
        debugLevel: number;
        useRawPackets: boolean;
        logPackets: boolean;
    };

    logger: {
        ignoredPacketIds: number[];
    };

    server: {
        udpPort: number;
        clientVersion: string;
    };
    
    data: {
        dataProvider: string;
        providerCredentials: object;
    };
}

/* Gacha configuration file. */
export interface GachaConfig {
    gacha: {
        types: Array<number>;
        maxTimes: number;
    };

    costs: {
        currency: {
            standard: number;
            limited: number;
        }
        tenPull: number;
        onePull: number;
    }

    time: {
        start: string;
        end: string;
    }
}

/* Plugin manifest file. */
export interface PluginManifest {
    name: string; description: string;
    main: string; version: string;
    author?: string|string[];
}

/*
 * Internal schemas.
 */

/* Client/Server version specification file. */
export interface Version {
    versionInfo: string;
    loginData: PlayerLoginResponse;
    packetIds: object;
}

export interface Address {
    ip: string;
    port: number;
    networkId: string;
}

export interface Vector {
    X: number;
    Y: number;
    Z: number;
}

export interface MotionInfo {
    pos: Vector; rot: Vector; speed: Vector;
    params: Vector[]; refPos: Vector;
    state: number; refId: number;
    sceneTime: number;
    internalVelocity: number;
}

export interface PluginObject {
    plugin: Plugin;
    manifest: PluginManifest;
}

/* 
 * Data schemas. 
 */

export interface Account {
    userData: User;
    statistics: Statistics;
    inventory: Inventory;
    gacha: Gacha;
}

export interface User {
    uid: string; // The player's unique identifier.
    nickname: string; // The player's display name.
    signature: string; // The player's "description".
    friends: Friend[]; // The player's friends.
    friendRequests: Friend[]; // Incoming friend requests for the player.
    position: Vector; // The player's last-known position.

    // Debug values.
    gachaRspValue: number;
}

export interface Statistics {
    adventureRank: number,
    adventureExp: number;
    worldLevel: number;
}

export interface Inventory {
    selectedAvatar: number;
}

export interface Gacha {
    banners: object | BannerData[];
}

/* 
 * Game schemas.
 */

export interface Friend {
    uid: number;
    param: number;
    adventureRank: number;
    worldLevel: number;
    nickname: string;
    signature: string;
    canCoop: boolean;
    isGameSource: boolean;
    platformType: string;

    lastActiveTime: number;
    nameCardId: number;
    profilePicture: object; // {avatarId: 10000005}
}

export interface Property {
    propType?: number; type?: number;
    propValue?: PropertyValue|number;
}

export interface Entity {
    entityType: number;
    entityId: number;
    lifeState: number;

    motionInfo: {
        pos: Vector | object;
        rot: Vector | object;
        speed: Vector | object;
    };
    propList: Property[];
    fightPropList: Property[];
    animatorParaList: object[];

    avatar: Avatar;
    entityClientData: object;
    entityAuthorityInfo: {
        abilityInfo: object;
        rendererChangedInfo: object;
        aiInfo: { isAiOpen: boolean; bornPos: object; }
        bornPos: object;
    };
}

export interface Avatar {
    uid: number;
    avatarId: number;
    guid: string;
    peerId: number;
    equipIdList: number[];
    skillDepotId: number;

    wearingFlycloakId: number;
    bornTime: number;
    excelInfo: Excel;

    weapon: Weapon;
    reliquaryList: object[];
    inherentProudSkillList: number[];
    skillLevelMap: object;
    teamResonanceList: number[];
}

export interface SceneAvatar {
    playerUid: number;
    sceneId: number;

    avatarAbilityInfo: object;
    abilityControlBlock: object;
    sceneEntityInfo: Entity;
    weaponAbilityInfo: object;

    weaponGuid: string;
    avatarGuid: string;
    weaponEntityId: number;
    entityId: number;
    isPlayerCurAvatar: boolean;
}

export interface Character {
    avatarGuid: string;
    avatarEntityId: number;
    weaponGuid: string;
    weaponEntityId: number;
    avatarAbilityInfo: object;
    weaponAbilityInfo: object;
}

export interface Weapon {
    entityId: number;
    gadgetId: number;
    itemId: number; // This is the **item** id.
    guid: string; // Should match avatar.
    level: number;
    abilityInfo: object;
}

export interface GachaItemEntry {
    gachaItem_: { itemId: number; count: number; }
    tokenItemList: Array<{ itemId: number; count: number; }>;
    transferItems?: Array<{ itemId: number; count: number; }>;
}

export interface GachaInfo {
    scheduleId: number;
    gachaSortId: number;
    beginTime: number;
    endTime: number;
    gachaType: number;
    gachaUpInfoList?: Array<GachaUpInfo>;

    costItemId: number;
    costItemNum: number;
    tenCostItemId: number;
    tenCostItemNum: number;

    leftGachaTimes: number;
    gachaTimesLimit: number;

    gachaProbUrl: string;
    gachaRecordUrl: string;
    gachaProbUrlOversea: string;
    gachaRecordUrlOversea: string;
}

export interface GachaUpInfo {
    itemParentType: number;
    itemIdList: number[];
}

export interface BannerData {
    pity: { four: number; five: number; };
    guarantee: { four: boolean; five: boolean; };

    chartedItemId?: number;
    fatePoints?: number;
}

export interface PropertyValue {
    /* ival = Integer; fval = Float */
    ival?: string|number;
    fval?: string|number;

    type: string|number;
    val?: string|number;
}

export interface ItemEntry {
    itemId: number;
    guid: number;
    material?: Material;
    equip?: Equip;
    furniture?: Furniture;
}

export interface Furniture {
    count: number;
}

export interface Equip {
    isLocked: boolean;
    reliquary?: any;
    weapon?: any;
}

export interface Material {
    count: number;
    deleteInfo: object;
}

export interface Excel {
    prefabPathHash: string;
    prefabPathRemoteHash: string;
    controllerPathHash: string;
    controllerPathRemoteHash: string;
    combatConfigHash: string;
}

export interface UnionCommand {
    messageId: number;
    body: Buffer;
}

/*
 * Union Command Schemas
 */

export interface CombatInvokeEntry {
    argumentType: number;
    forwardType: number;
    combatData: Buffer;
}