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

import Player from "../../player/player";
import {CombatInvocationsNotify, EntityMoveInfo} from "../../utils/protocol";
import {InvocationArguments} from "../../utils/constants";
import * as protocol from "../../utils/packets";
import World from "../../world/world";
import ServerEntity from "../../world/entity";

export default async function (data: CombatInvocationsNotify, player: Player) {
    for(const invoke of data.invokeList) {
        const type: number = invoke.argumentType;
        const forwardTo: number = invoke.forwardType;
        const data: Buffer = invoke.combatData;
        await handleInvocation({
            player: player,
            type: type,
            forwardTo: forwardTo,
            data: data
        });
    }
}

async function handleInvocation(object: InvocationObject) {
    const {data, player, type} = object;
    const world: World = player.world;
    
    switch(type) {
        default:
            console.log(`Unknown invocation type: ${type}`);
            break;
            
        case InvocationArguments.ENTITY_MOVE:
            const decoded: EntityMoveInfo = await protocol.packetToObject(data, "EntityMoveInfo");
            
            const entityId: number = decoded.entityId;
            const entity: ServerEntity = world.entityManager.getEntityById(entityId);
            if(entity) entity.move(decoded.motionInfo); // Move the specified entity.
            break;
    }

    return Promise.resolve();
}

/* Makes data easier. */
interface InvocationObject {
    data: Buffer;
    forwardTo: number;
    type: number;
    player: Player;
}