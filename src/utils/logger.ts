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

import {appendFileSync, existsSync, writeFileSync} from "fs";
import {createFileSync} from "fs-extra";
import {formatDate} from "./utilities";
import {config, working} from "../index";
import {Color} from "./constants";

/* Route all `console.log` calls to debug. */
export const logger: Function = console.log;
console.log = (message: any, ...args: any[]): void => debug(Color.DEFAULT(), message, ...args);

/* Route remaining console methods. */
console.info = (message: any, ...args: any[]): void => info(Color.DEFAULT(), message, ...args);
console.warn = (message: any, ...args: any[]): void => warn(Color.YELLOW(), message, ...args);
console.error = (message: any, ...args: any[]): void => error(Color.RED(), message, ...args);
console.debug = (message: any, ...args: any[]): void => debug(Color.BLUE(), message, ...args);

/**
 * Logs a message to the console.
 * @param color The color of the message.
 * @param message The message to log.
 * @param args Other objects to log.
 */
export function info(color: string | number = 0, message: string, ...args: any[]): void {
    logger(`\x1b[${color}m${"[INFO] " + message}\x1b[0m`, ...args);
    logToFile(`[INFO] ${formatDate(Date.now())}: ${message}`, `latest`, true);
}

/**
 * Logs a warning to the console.
 * @param color The color of the message.
 * @param message The message to log.
 * @param args Other objects to log.
 */
export function warn(color: string | number = 0, message: string, ...args: any[]): void {
    logger(`\x1b[${color}m${"[WARN] " + message}\x1b[0m`, ...args);
    logToFile(`[WARN] ${formatDate(Date.now())}: ${message}`, `latest`, true);
}

/**
 * Logs an error to the console.
 * @param color The color of the message.
 * @param message The message to log.
 * @param args Other objects to log.
 */
export function error(color: string | number = 0, message: string, ...args: any[]): void {
    logger(`\x1b[${color}m${"[ERROR] " + message}\x1b[0m`, ...args);
    logToFile(`[ERROR] ${formatDate(Date.now())}: ${message}`, `latest`, true);
}

/**
 * Logs a message to the console. (if the process is in debug mode)
 * @param color The color of the message.
 * @param message The message to log.
 * @param args Other objects to log.
 */
export function debug(color: string | number, message: string, ...args: any[]): void {
    logToFile(`[DEBUG] ${formatDate(Date.now())}: ${message}`, `latest`, true);
    if (config.debug.enableDebug) {
        logger(`\x1b[${color}m${"[DEBUG] " + message}\x1b[0m`, ...args);
    }
}

/**
 * Logs a message to the console. (if the process is in verbose mode)
 * @param color The color of the message.
 * @param message The message to log.
 * @param args Other objects to log.
 */
export function verbose(color: string | number, message: string, ...args: any[]): void {
    logToFile(`[VERBOSE] ${formatDate(Date.now())}: ${message}`, `latest`, true)
    if (config.debug.enableDebug && config.debug.debugLevel > 1) {
        logger(`\x1b[${color}m${"[VERBOSE] " + message}\x1b[0m`, ...args);
    }
}

/**
 * Logs specified content to a file in the `logs` directory.
 * @param content The content to log.
 * @param fileName The file name to log to.
 * @param append Should the content be appended to the file?
 * @param extension The file extension for the log.
 */
export function logToFile(
    content: string, fileName: string,
    append: boolean = false, extension: string = "log"
): void {
    const path: string = `${working}/logs/${fileName}.${extension}`;
    if(!existsSync(path)) createFileSync(path);
    if (append) {
        appendFileSync(path, content + "\n");
    } else {
        writeFileSync(path, content);
    }
}