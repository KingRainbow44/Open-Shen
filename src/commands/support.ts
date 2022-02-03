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

import Command from "../objects/command";
import Player from "../player/player";
import {base, config, mode} from "../index";
import {existsSync} from "fs";
import {execSync} from "child_process";
import {formatDate} from "../utils/utilities";
import {server} from "../server";

export default class SupportCommand extends Command {
    constructor() {
        super("support", "Logs useful support information to the console.", "/support");
    }

    async execute(args: string[], player?: Player): Promise<void> {
        // Collect the data.
        let dumpData: string = "";
        const crashes: object[] = server.crashDumps;
        for(let i = 0; i < Math.min(crashes.length, 3); i++) {
            dumpData += `\nLatest dump #${i + 1}:${JSON.stringify(crashes[i])}`;
        } if(dumpData.length == 0) dumpData = "No crash dumps found.";
        
        const data: string = `
        Running in mode: ${mode == "precompile" ? "development" : "release"}
        Running: ${existsSync(`${base}/.git`) ? `from source code on Git (build: ${execSync("git describe --tags --always --dirty", {encoding: "utf-8"}).trim()})` : "from a packaged executable"}
        Using client version: ${config.server.clientVersion}
        Running server on port: ${config.server.udpPort}
        Config version: ${config.version}
        Debug status: ${config.debug.enableDebug ? `enabled (level ${config.debug.debugLevel})` : "disabled"}
        Specified data provider: ${config.data.dataProvider}
        Data dump from ${formatDate(Date.now())}
        Latest crash dumps: ${dumpData}
        `;
        
        console.info("Paste the following data into the support channel:", "```" + data + "```");
        return Promise.resolve();
    }
}