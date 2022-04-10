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
 * Handler for static HTTP requests.
 */
import {Request, Response} from "express";
import {parseUri} from "./utils";

/**
 * Handler for unhandled HTTP requests.
 * @route /...
 */
export function handleUnrouted(request: Request, response: Response) {
    const url: string = parseUri(request.url); console.log(request.url);
    let responseData: any = staticRoutes[url] || {retcode: 0, code: 0};
    if(responseData instanceof Object)
        responseData = JSON.stringify(responseData);
    response.status(200).send(responseData);
}

/* Static results for requests. */
const staticRoutes = {
    '/query_region_list': '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',

    '/account/risky/api/check': {
        retcode: 0, message: 'OK'
    },

    '/hk4e/mdk/shield/api/login': {
        retcode: 0, message: 'OK',
        data: {account: {uid: 624263971, token: 'OpenShen', name: 'OpenShen'}}
    },

    '/hk4e/mdk/shield/api/verify': {
        retcode: 0, message: 'OK',
        data: {account: {uid: 624263971, token: 'OpenShen', name: 'OpenShen'}}
    },

    '/hk4e/combo/granter/login/v2/login': {
        retcode: 0, message: 'OK',
        data: {
            combo_id: '624263971', open_id: '624263971',
            combo_token: '624263971', data: {guest: false},
            heartbeat: false, account_type: 1
        }
    }
};