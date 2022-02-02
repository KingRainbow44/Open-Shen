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

/**
 * Generates a pseudo-random number within the given range.
 * @param min The minimum value.
 * @param max The maximum value.
 */
export function randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Formats a given {@link number} from Date#now into a human-readable string.
 * @param time The time to format from {@link Date#now}.
 * @return The time formatted as: `[year]-[month]-[day] [hour]:[minute]:[second].[millisecond]`.
 */
export function formatDate(time: number, useColons: boolean = true): string {
    const date = new Date(time);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const millisecond = date.getMilliseconds();

    const separator: string = useColons ? ":" : ".";
    return `${year}-${month}-${day} ${hour}${separator}${minute}${separator}${second}.${millisecond}`;
}

/**
 * Checks if a string is valid JSON.
 * @param json The string to check.
 */
export function isJson(json: string): boolean {
    try {
        JSON.parse(json);
        return true;
    } catch {
        return false;
    }
}

/**
 * Checks if a string is a valid URL.
 * @param url The string to check.
 */
export function isUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Checks if the given argument is a number.
 * @param value The value to check.
 */
export function isNumber(value: any): boolean {
    return typeof value === 'number' && !isNaN(value);
}

/**
 * Encode a value into Base64.
 * @param value The value to encode.
 */
export function base64Encode(value: string): string {
    return Buffer.from(value).toString("base64");
}

/**
 * Decode a value from Base64.
 * @param value The value to decode.
 */
export function base64Decode(value: string): string {
    return Buffer.from(value, "base64").toString();
}