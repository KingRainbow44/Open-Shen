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

import DataProvider from "../provider";
import Database from "../database";
import {Account} from "../../utils/interfaces";
import {working} from "../../index";
import {base64Decode, base64Encode} from "../../utils/utilities";

export default class SQLite3Provider implements DataProvider {
    database: Database;
    
    constructor(credentials: object) {
        const databaseFile: string = credentials["file"] || "database";
        this.database = new Database(`${working}/${databaseFile}.db`);
    }
    
    initializeDatabase(): Promise<void> {
        this.database.query('CREATE TABLE IF NOT EXISTS `players` (`uid` VARCHAR(10) PRIMARY KEY, `data` LONGTEXT, `inventory` LONGTEXT);');
        this.database.query('CREATE TABLE IF NOT EXISTS `accounts` (`uid` VARCHAR(10) PRIMARY KEY, `name` VARCHAR(64), `data` LONGTEXT);');
        return Promise.resolve();
    }

    playerDataExists(uid: string): Promise<boolean> {
        return Promise.resolve(this.database.fetch(`SELECT * FROM players WHERE uid = '${uid}';`) != undefined);
    }
    
    createPlayerData(uid: string, data: Account): Promise<void> {
        this.database.query(`INSERT INTO players (uid, data, inventory)
                             VALUES ('${uid}', '${base64Encode(JSON.stringify(data))}', 'e30');`);
        return Promise.resolve();
    }

    getPlayerData(uid: string): Promise<Account> {
        const row: any = this.database.fetch(`SELECT * FROM players WHERE uid = '${uid}';`);
        const rawData: string = row.data; return Promise.resolve(JSON.parse(base64Decode(rawData)));
    }

    updatePlayerData(uid: string, data: Account): Promise<void> {
        this.database.query(`UPDATE players
                      SET data='${base64Encode(JSON.stringify(data))}'
                      WHERE uid = '${uid}';`);
        return Promise.resolve();
    }
}