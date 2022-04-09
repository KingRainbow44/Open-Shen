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

/*
 * HTTP-specific utility functions.
 */

import {Request, Response, NextFunction} from "express";
import * as logger from "../utils/logger";
import {Color} from "../utils/constants";

/**
 * Logs an incoming HTTP request.
 * @param next The next function in the middleware chain.
 */
export function logRequest(req: Request, res: Response, next: NextFunction) {
    logger.debug(Color.GREEN(), `[HTTP] Request to: ${req.path}`);
    next(); // Invoke the next function in the chain.
}

/**
 * Return a parsed URL object from a request object.
 * @param url The request URI.
 * @return The URL route.
 */
export function parseUri(url: string): string {
    const spliced: string = url.split("?")[0];
    return spliced.replace(/hk4e_(cn|global)/, 'hk4e');
}