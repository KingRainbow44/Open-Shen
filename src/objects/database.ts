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

import {debug} from "../utils/logger";
import * as sqlite from "better-sqlite3";

class Database {
    database: sqlite.Database;

    constructor(databasePath: string) {
        this.database = sqlite.default(databasePath);
    }

    /**
     * Executes a query on the database.
     * @param query The query to execute.
     */
    query(query: string): sqlite.RunResult {
        debug(34, `[Database] Executing query: ${query}`);
        return this.database.prepare(query).run();
    }

    /**
     * Executes the query on the database and returns the response.
     * @param query The query to execute.
     */
    fetch(query: string): any {
        debug(34, `[Database] Executing query: ${query}`);
        return this.database.prepare(query).get();
    }
}

export default Database;