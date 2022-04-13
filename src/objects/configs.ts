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

import {GachaConfig} from "../utils/interfaces";
import {copyFileSync, mkdirSync, existsSync} from "fs";
import {base, working} from "../index";

if(!existsSync(`${working}/configs`))
    mkdirSync(`${working}/configs`);

/**
 * Reads the config file from the directory if it exists,
 * else return the default config & make a new one.
 * @param configName The name of the config file.
 */
function readConfig(configName: string): object {
    const path = `${working}/configs`;
    if (!existsSync(`${path}/${configName}.json`)) {
        copyFileSync(
            `${base}/resources/default-configs/${configName}.json`,
            `${path}/${configName}.json`
        );
    }

    try {   
        return require(`${path}/${configName}.json`);
    } catch {
        console.error(`Failed to read config file: ${configName}.json`);
        process.exit(1);
    }
}

export default class ConfigLoader {
    gachaConfig: GachaConfig;

    constructor() {
        this.gachaConfig = <GachaConfig> readConfig("gacha");
    }
}