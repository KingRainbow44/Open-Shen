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

/* Imports. */
import {Config} from "./interfaces";
import {base, config, working} from "../index";
import {ServerConstants} from "./constants";
import {copyFileSync, writeFileSync, mkdirSync, existsSync} from "fs";

/* Config updater. */
export function updateConfig(): void {
    // Create a duplicate of the existing config.
    let current: Config | object = {};
    Object.assign(current, config);

    // Replace the existing config with an updated version.
    copyFileSync(`${base}/resources/default-configs/config.json`, `${working}/config.json`);

    // Replace the values in the new config with existing ones.
    let newConfig: Config = require(`${working}/config.json`);
    Object.assign(newConfig, current);

    // Save the existing-updated config to the file.
    newConfig.version = ServerConstants.CONFIG_VERSION;
    writeFileSync(`${working}/config.json`, JSON.stringify(newConfig, null, 2));

    // Log the config update.
    console.info(`Config updated to version ${ServerConstants.CONFIG_VERSION}.`);
}

/* Structure creator. */
export function createStructure(): void {
    // Certificates directory.
    if(!existsSync(`${working}/certs`)) {
        mkdirSync(`${working}/certs`);
        console.warn(`Before running, add certificates to the '${working}/certs' directory.`);
        process.exit(0);
    }
    
    // Versions directory.
    if(!existsSync(`${working}/versions`)) {
        mkdirSync(`${working}/versions`);
        console.warn(`Before running, add a version to the '${working}/versions' directory.`);
        process.exit(0);
    }
    
    // Protocol directory.
    if(!existsSync(`${working}/protocol`)) {
        mkdirSync(`${working}/protocol`);
        console.warn(`Before running, add '.proto' files to the '${working}/protocol' directory.`);
        process.exit(0);
    }
    
    // Packets directory.
    if(!existsSync(`${working}/packets`)) {
        mkdirSync(`${working}/packets`); mkdirSync(`${working}/rawPackets`);
        console.warn(`Before running, add '.json' files to the '${working}/packets' directory.`);
        process.exit(0);
    }
    
    // Logs directory.
    if(!existsSync(`${working}/logs`))
        mkdirSync(`${working}/logs`);
    // Configs directory.
    if(!existsSync(`${working}/configs`))
        mkdirSync(`${working}/configs`);
    // Unknown directory
    if(!existsSync(`${working}/unknown`))
        mkdirSync(`${working}/unknown`);
}