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
import {Entity, Statistics, User} from "../utils/interfaces";
import {SceneEntityAppearNotify, SceneTeamUpdateNotify} from "../utils/protocol";
import {jsonToObject} from "../utils/packets";

class World {
    network: NetworkAdapter = new NetworkAdapter(this);
    entityManager: EntityManager = new EntityManager(this);
    players: object = {};

    hostUid: number | null = undefined;
    time: number = 16469;

    addPlayer(player: Player) {
        this.players[parseInt(player.info.uid)] = player;
        if (this.hostUid == undefined)
            this.hostUid = parseInt(player.info.uid);

        // Assign the player entity IDs.
        for (let i = 0; i < 4; i++)
            player.entityIds[i] = this.entityManager.allocateEntityId();
    }

    removePlayer(player: Player) {
        delete this.players[parseInt(player.info.uid)];
    }

    getPlayers(): Player[] {
        return Object.values(this.players);
    }

    /**
     * Get the game time in seconds for a player.
     * @param player
     */
    getGameTime(player: Player): object {
        return {gameTime: this.time, uid: parseInt(player.info.uid)};
    }

    /**
     * Get the world's host in a simple object.
     */
    getWorldHost(asPacket: boolean = true): Player | object {
        return asPacket ? {hostUid: this.hostUid, hostPeerUid: this.hostUid} : this.players[this.hostUid];
    }

    /*
     * Packet methods.
     */

    /**
     * Broadcasts the player to all world players.
     * @param framework The framework of the packet.
     * @param packet The packet to broadcast.
     */
    broadcastPacket(framework: string, packet: object): void {
        this.getPlayers().forEach(player => player.sendPacket(framework, packet));
    }

    /**
     * Takes information about this world and constructs
     * a WorldPlayerInfoNotify object.
     */
    toWorldPlayerInfo(): object {
        let packet = {
            playerInfoList: [],
            playerUidList: []
        };

        Object.keys(this.players).forEach(uid => {
            let player: Player = this.players[uid];
            let userData: User = player.info;
            let stats: Statistics = player.stats;

            packet.playerUidList.push(parseInt(uid));
            packet.playerInfoList.push({
                uid: parseInt(uid),
                nickname: userData.nickname,
                playerLevel: stats.adventureRank,
                mpSettingType: 0, // Temporarily hardcoded.
                curPlayerNumInWorld: 1, // Temporarily hardcoded.
                nameCardId: 210001, // Temporarily hardcoded.
                profilePicture: {avatarId: 10000007} // Temporarily hardcoded.
            });
        });

        return packet;
    }

    /**
     * Takes information about this world and constructs
     * a ScenePlayerInfoNotify object.
     */
    toScenePlayerInfo(): object {
        let packet = {playerInfoList: []};

        Object.keys(this.players).forEach(uid => {
            let player: Player = this.players[uid];
            let userData: User = player.info;
            let stats: Statistics = player.stats;

            packet.playerInfoList.push({
                uid: parseInt(uid),
                peerId: 1,
                name: userData.nickname,
                sceneId: 3,
                onlinePlayerInfo: {
                    uid: parseInt(uid),
                    nickname: userData.nickname,
                    playerLevel: stats.adventureRank,
                    mpSettingType: 2, // Temporarily hardcoded.
                    curPlayerNumInWorld: 1, // Temporarily hardcoded.
                    nameCardId: 210001, // Temporarily hardcoded.
                    profilePicture: {avatarId: 10000007} // Temporarily hardcoded.
                }
            });
        });

        return packet;
    }

    /**
     * Temporarily hardcoded.
     * Returns a map of all world properties.
     */
    toPropertyMap(): object {
        return {
            worldPropMap: {
                1: {type: 1, ival: "0"},
                2: {type: 2, ival: "0"},
            }
        };
    }
}

class EntityManager {
    world: World;
    entities: object = {};
    nextEntityId: number = 0;

    /**
     * Creates a world entity manager.
     * @param world The world to bind to.
     */
    constructor(world: World) {
        this.world = world;
    }

    /*
     * Entity methods.
     */

    /**
     * Allocates a new entity ID.
     * The entities object will need to be **manually updated**.
     */
    allocateEntityId(): number {
        return this.nextEntityId++;
    }

    /**
     * Adds the entity to the manager while assigning it an ID.
     * @param entity The entity to add.
     * @param withPacket Should the server send a packet to the players?
     */
    addEntity(entity: Entity, withPacket: boolean = false): number {
        const entityId: number = this.nextEntityId++;
        entity.entityId = entityId;

        this.entities[entityId] = entity;

        if (withPacket) {
            this.world.broadcastPacket("SceneEntityAppearNotify", <SceneEntityAppearNotify>{
                entityList: [entity], appearType: 0, param: 16777459
            });
        }
        return entityId;
    }

    /**
     * Removes an entity from the manager by its ID.
     * @param entityId The ID of the entity to remove.
     * @param withPacket Should the server send a packet to the players?
     */
    removeEntity(entityId: number, withPacket: boolean = false): void {
        delete this.entities[entityId];

        if (withPacket) {
            this.world.broadcastPacket("SceneEntityDisappearNotify", {
                entityList: [entityId], disappearType: 0
            });
        }
    }

    /*
     * Player methods.
     */

    /**
     * Creates the player as a world entity.
     * @param player The player to add as an entity.
     * @return A packet to be broadcast to players.
     */
    enter(player: Player): object {
        // TODO: Use entity IDs from player to construct scene avatar.
        // TODO: Create entity generator for player data.
        // TODO: Create proper scene team update notify packet.
        return {};
    }
}

/**
 * A protocol adapter for the world.
 */
class NetworkAdapter {
    private readonly world: World;

    constructor(world: World) {
        this.world = world;
    }

    /**
     * Gets the world for this adapter.
     */
    getWorld(): World {
        return this.world;
    }

    /**
     * Creates a 'SceneTeamUpdateNotify' packet.
     */
    sceneTeamUpdateNotification(): SceneTeamUpdateNotify {
        return jsonToObject("SceneTeamUpdateNotify");
        // TODO: Implement Co-Op compatible team packets.
        // const avatars: SceneAvatar[] = [];
        // return {sceneTeamAvatarList: avatars};
    }
}

export default World;