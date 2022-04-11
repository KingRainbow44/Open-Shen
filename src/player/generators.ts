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

import Player from "./player";
import {Avatar, SceneAvatar, Weapon} from "../utils/interfaces";
import {GeneratorConstants} from "../utils/constants";

/**
 * Generates a {@link Avatar}.
 */
export class AvatarGenerator {
    private readonly player: Player;
    
    constructor(player: Player) {
        this.player = player;
    }

    /**
     * Builds a {@link Avatar} from the given data.
     */
    build(avatarId: string, weaponId: string, ids: IdHolder): Avatar {
        const weapon: Weapon = GeneratorConstants.WEAPON_LIST[weaponId];
        weapon.entityId = ids.weaponId;
        return {
            uid: parseInt(this.player.info.uid),
            avatarId: ids.avatarId,
            guid: ids.guid,
            peerId: 1, // TODO: Dynamically set this.
            equipIdList: [60120, 15101],
            skillDepotId: 2101, // TODO: Dynamically set this.
            weapon: weapon,
            reliquaryList: [
                {
                    "itemId": 60120,
                    "guid": "2681193339516092517",
                    "level": 1
                }
            ], // TODO: Dynamically set this.
            inherentProudSkillList: [212301], // TODO: Dynamically set this.
            skillLevelMap: {
                10017: 1,
                10032: 1,
                10041: 1
            }, // TODO: Dynamically set this.
            teamResonanceList: [],
            wearingFlycloakId: 140001, // TODO: Dynamically set this.
            bornTime: 1617061880, // TODO: Figure out this number format and make compatible with Date.now().
            excelInfo: GeneratorConstants.EXCEL_LIST[avatarId]
        };
    }
}

/**
 * Generates a {@link SceneAvatar}.
 */
export class SceneAvatarGenerator {
    private readonly player: Player;
    
    constructor(player: Player) {
        this.player = player;
    }

    /**
     * Builds a {@link SceneAvatar} from the player's current state.
     * @param avatar (out of the 4 entity IDs) The entity ID from the player to use.
     */
    build(avatar: number): SceneAvatar {
        if(avatar < 0 || avatar > 3)
            avatar = 0;
        const avatarEntityId: number = this.player.entityIds[avatar];
        const weaponEntityId: number = this.player.entityIds[avatar + 4];
        
        return {
            playerUid: parseInt(this.player.info.uid),
            avatarGuid: "2681193339516092417", // TODO: Dynamically set this.
            sceneId: 3, // TODO: Dynamically set this.
            entityId: avatarEntityId,
            avatarAbilityInfo: {}, // TODO: Implement this.
            sceneEntityInfo: {
                entityType: 1, // Labeled as: PROT_ENTITY_AVATAR
                entityId: avatarEntityId,
                motionInfo: {
                    pos: {},
                    rot: {},
                    speed: {}
                }, // TODO: Dynamically set this.
                propList: [
                    {
                        type: 4001, propValue: {type: 4001, ival: "7", val: "7"}
                    }
                ], // TODO: Dynamically set this.
                fightPropList: GeneratorConstants.FIGHT_PROP_LIST, // TODO: Dynamically set this.
                lifeState: 1, // TODO: Implement this.,
                animatorParaList: [{}],
                avatar: new AvatarGenerator(this.player).build('amber', 'test', {
                    avatarId: avatarEntityId,
                    weaponId: weaponEntityId,
                    guid: "2681193339516092417"
                }),
                entityClientData: {},
                entityAuthorityInfo: {
                    abilityInfo: {},
                    rendererChangedInfo: {},
                    aiInfo: {
                        isAiOpen: true, bornPos: {}
                    },
                    bornPos: {}
                }
            },
            weaponGuid: "2681193339516092495", // TODO: Dynamically set this.
            weaponEntityId: weaponEntityId,
            weaponAbilityInfo: {}, // TODO: Implement this.
            abilityControlBlock: {
                abilityEmbryoList: GeneratorConstants.ABILITY_EMBRYO_LIST
            },
            isPlayerCurAvatar: false // This can be changed by the server later.
        };
    }
}

interface IdHolder {
    avatarId?: number; weaponId?: number;
    entityId?: number; guid?: string;
}