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

/* Run mode. none = normal; precompile = from source */
export const mode: string = process.argv[2] || "none";
/* The current working directory. */
export const working: string = mode == "precompile" ? (process.env["WORKING_DIRECTORY"] || process.cwd()) : process.cwd();
/* The application files directory. */
export const base: string = `${__dirname}/..`;

/* Handle unhandled exceptions. */
process.on('uncaughtException', (error: any) => {
    console.error("An error occurred while running Open Shen:", error);
    process.exit(1);
});

/* Dynamic imports. */
import {copyFileSync, existsSync} from "fs";
import {createStructure, updateConfig} from "./utils/updater";
import {Color, ServerConstants} from "./utils/constants";

/* Override 'console' methods. */
import * as logger from "./utils/logger";
logger.info(Color.DEFAULT(), "Open Shen is starting...");

/* Declare server config. */
import {Config} from "./utils/interfaces";
if (!existsSync(`${working}/config.json`))
    copyFileSync(`${base}/resources/default-configs/config.json`, `${working}/config.json`);
export const config: Config = require(`${working}/config.json`);

// Update config if necessary.
if (config.version != ServerConstants.CONFIG_VERSION)
    updateConfig();

/* Create server folder structure. */
createStructure();

/* Declare additional configs. */
import ConfigLoader from "./objects/configs";
export const configs: ConfigLoader = new ConfigLoader();

/* Start handlers. */
import "./handlers/udp";
import "./handlers/http";
import "./handlers/command";
/* Create server instance. */
import "./server";