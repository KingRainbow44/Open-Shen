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

class Handshake {
    static MAGIC_CONNECT = [0xFF, 0xFFFFFFFF];
    static MAGIC_SEND_BACK_CONV = [0x145, 0x14514545];
    static MAGIC_DISCONNECT = [0x194, 0x19419494];

    magic1: number;
    magic2: number;
    conv: number;
    token: number;
    data: number;
    buffer: Buffer | number;

    constructor(magic = [0x0, 0x0], conv = 0, token = 0, data = 0) {
        this.magic1 = magic[0];
        this.conv = conv;
        this.token = token;
        this.data = data;
        this.magic2 = magic[1];
        this.buffer = 0;
    }

    decode(data) {
        let dataBuffer = Buffer.from(data);
        this.magic1 = dataBuffer.readUInt32BE(0);
        this.conv = dataBuffer.readUInt32BE(4);
        this.token = dataBuffer.readUInt32BE(8);
        this.data = dataBuffer.readUInt32BE(12);
        this.magic2 = dataBuffer.readUInt32BE(16);
        this.buffer = dataBuffer;
    }

    encode() {
        let buffer = Buffer.alloc(20);
        buffer.writeUInt32BE(this.magic1, 0);

        buffer.writeUInt32BE(1, 4);
        buffer.writeUInt32BE(1, 8);

        buffer.writeUInt32BE(this.data, 12);
        buffer.writeUInt32BE(this.magic2, 16);
        this.buffer = buffer;
    }
}

export default Handshake;