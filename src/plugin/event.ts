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

/**
 * A class extended by event classes.
 * Passed through to event listeners.
 */
abstract class Event { }
export default Event;

/* If implemented, the event can be canceled. */
export interface Cancelable {
    cancel: boolean;
    isCanceled(): boolean;
}

/*
 * Built-in events.
 */

/**
 * Called before a packet is passed to a handler.
 */
export class ReceivePacketEvent extends Event implements Cancelable {
    cancel: boolean = false;
    
    protected readonly player: Player;
    protected readonly packetId: number;
    protected readonly packetName: string;
    protected readonly packetData: object;
    
    constructor(
        packetId: number, packetName: string, 
        packetData: object, sender: Player
    ) {
        super();
        this.player = sender;
        this.packetId = packetId;
        this.packetName = packetName;
        this.packetData = packetData;
    }
    
    isCanceled(): boolean {
        return this.cancel;
    }

    /**
     * The player who sent the packet.
     */
    getPlayer(): Player {
        return this.player;
    }

    /**
     * The ID of the packet sent.
     */
    getPacketId(): number {
        return this.packetId;
    }

    /**
     * The name of the packet sent.
     */
    getPacketName(): string {
        return this.packetName;
    }
    
    /**
     * The data of the packet sent.
     */
    getPacketData(): object {
        return this.packetData;
    }
}

/**
 * Called before a packet is sent to a player.
 */
export class SendPacketEvent extends Event implements Cancelable {
    cancel: boolean = false;
    
    protected readonly player: Player;
    protected readonly packetId: number;
    protected readonly packetName: string;
    protected readonly packetData: object;

    constructor(
        packetId: number, packetName: string,
        packetData: object, target: Player
    ) {
        super();
        this.player = target;
        this.packetId = packetId;
        this.packetName = packetName;
        this.packetData = packetData;
    }

    isCanceled(): boolean {
        return this.cancel;
    }

    /**
     * The player who sent the packet.
     */
    getPlayer(): Player {
        return this.player;
    }

    /**
     * The ID of the packet sent.
     */
    getPacketId(): number {
        return this.packetId;
    }

    /**
     * The name of the packet sent.
     */
    getPacketName(): string {
        return this.packetName;
    }

    /**
     * The data of the packet sent.
     */
    getPacketData(): object {
        return this.packetData;
    }
}