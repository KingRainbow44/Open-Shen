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

import {terminate} from "../server";
import {info} from "../utils/logger";
import {createSocket, Socket} from "dgram";
import {AddressInfo} from "net";
import {Color} from "../utils/constants";

/* Listening server for UDP traffic. */
const udpServer: Socket = createSocket("udp4");
export default udpServer;

/* Register server events. */
udpServer.on("message", () => {/* TODO: Handle messages */
});
udpServer.on("error", (error: Error) => {
    console.error("UDP server error:", error);
    udpServer.close(() => terminate);
});
udpServer.on("listening", () => {
    const boundTo: AddressInfo = udpServer.address();
    info(Color.DEFAULT(), `UDP server listening on ${boundTo.address}:${boundTo.port}.`);
});

/* Bind to specified port. */
udpServer.bind(22102);