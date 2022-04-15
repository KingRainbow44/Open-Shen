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
import {info} from "../utils/logger";

/**
 * The base class for Open Shen's commands.
 */
abstract class Command {
    label: string;
    description: string;
    usage: string = "/help";
    aliases: string[] = [];

    protected constructor(
        label: string, description: string,
        usage?: string, aliases?: string[]
    ) {
        this.label = label;
        this.description = description;
        if (usage) this.usage = usage;
        if (aliases) this.aliases = aliases;
    }

    /**
     * Called when a player executes this command from in-game.
     * @param args The arguments passed into the command.
     * @param player The player who executed this command.
     *               Only passed if a player executed the command.
     */
    async execute(args: string[], player?: Player): Promise<void> {
    }

    /**
     * Sends a message to the player or console.
     * @param message The message to send.
     * @param player The player to send the message to.
     */
    message(message: string, player?: Player): void {
        if (player == null)
            info(33, message);
        else {
            const messages: string[] = message.split("\n");
            for (const msg of messages)
                player.sendMessage(msg);
        }
    }
}

export default Command;