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

import express, {Express, Request, Response} from "express";
import * as http from "http";
import * as https from "https";
import {handleUnrouted} from "../http/static";
import {Color} from "../utils/constants";
import {info} from "../utils/logger";
import {working} from "../index";
import {readFileSync} from "fs";

/* Create an express instance. */
const app: Express = express();

/* Route requests. */
app.post("/crash/dataUpload", (request: Request, response: Response) => {
    console.log(request.body); // TODO: Log crash dumps.
});

app.use(handleUnrouted);

/* Create HTTP servers. */
const httpServer: http.Server = http.createServer(app);
const httpsServer: https.Server = https.createServer({
    key: readFileSync(`${working}/certs/private-key.pem`),
    cert: readFileSync(`${working}/certs/certificate.pem`)
}, app);

/* Listen on respective ports. */
try {
    httpServer.listen(80, () => info(Color.DEFAULT(), "[HTTP] Listening at http://localhost:80."));
    httpsServer.listen(443, () => info(Color.DEFAULT(), "[HTTPS] Listening at https://localhost:443."));
} catch (error: any) {
    console.error("HTTP server failed to start.", error);
    process.exit(1);
}