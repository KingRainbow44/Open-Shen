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

import {Entity, MotionInfo, Vector} from "../utils/interfaces";

export default class ServerEntity {
    private entityId: number|undefined;
    private dataHolder: Entity|undefined;
    
    /* Position data. */
    position: Vector;
    rotation: Vector;
    speed: Vector;
    motionState: number; // Defined as 'MotionState'.
    
    constructor(entityId: number|undefined) {
        this.entityId = entityId;
    }
    
    /**
     * Returns the entity's identifier (for the world).
     */
    getEntityId(): number {
        return this.entityId;
    }

    /**
     * Returns the data holder for this entity.
     * Should be used in internal server methods.
     */
    getEntityData(): Entity {
        return this.dataHolder;
    }

    /**
     * Sets the entity identifier from the world.
     * Should be called from a delayed initialization.
     * @param entityId The entity identifier.
     */
    setEntityId(entityId: number): void {
        if(this.entityId != undefined)
            throw Error("Cannot set entity ID twice.");
        this.entityId = entityId;
    }

    /**
     * Overrides the existing entity data.
     * @param data The new entity data.
     */
    setEntityData(data: Entity): void {
        this.dataHolder = data;
    }

    /**
     * Moves the entity using given {@link MotionInfo}.
     * @param motion The motion info to use. (from UnionCmdNotify)
     */
    move(motion: MotionInfo): void {
        // Set our internal variables.
        this.position = motion.pos;
        this.rotation = motion.rot;
        this.speed = motion.speed;
        this.motionState = motion.state;
        
        // Update the data holder.
        const motionInfo = this.dataHolder.motionInfo;
        motionInfo.pos = motion.pos;
        motionInfo.rot = motion.rot;
        motionInfo.speed = motion.speed;
    }
}