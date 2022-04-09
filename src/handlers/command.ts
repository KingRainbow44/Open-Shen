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

import {info} from "../utils/logger";
import Player from "../player/player";
import Command from "../objects/command";

const commands: object = {};

const stdin = process.openStdin();
stdin.addListener('data', data => handleCommand(data.toString().trim()));

/**
 * Call from a message send.
 * Parsing happens in this function.
 * @param message The message sent by the player.
 * @param player? The player who sent the message.
 */
export function handleCommand(message: string, player?: Player): void {
    const split: string[] = message.split(" ");
    const label: string = split[0];
    split.shift();

    try {
        const command: Command = commands[label];
        command.execute(split, player)
            .then(() => info(34, `${player || "Server"} issued command: ${message}`))
            .catch(error => info(34, `${player || "Server"} issued command: ${message}`, error));
    } catch {
        info(31, `Command ${label} not found.`);
    }
}

// TODO: Implement a command map system.