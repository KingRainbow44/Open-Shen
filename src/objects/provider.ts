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

import {Account} from "../utils/interfaces";
import {base, config} from "../index";

/**
 * This interface is to be implemented by all data providers.
 * Data providers are passed the following on instantiation:
 * - {@link object}: Provider credentials.
 * 
 * Methods in this interface are to be implemented.
 * The methods are invoked on their respective use case.
 * All methods should return a {@link Promise} with an object.
 */
export default interface DataProvider {
    /* Database initialization. */
    initializeDatabase(): Promise<void>;
    
    /* Player data handling. */
    playerDataExists(uid: string): Promise<boolean>;
    getPlayerData(uid: string): Promise<Account>;
    createPlayerData(uid: string, data: Account): Promise<void>;
    updatePlayerData(uid: string, data: Account): Promise<void>;
}

const registeredProviders: object = {
    sqlite3: require("./providers/sqlite3")
};

/**
 * Attempts to create a DataProvider using the specified provider in the config.
 * Stops the server if the provider isn't found/throws an error.
 */
export function createProviderInstance(): DataProvider {
    const providerName: string = config.data.dataProvider;
    const providerCredentials: object = config.data.providerCredentials;
    
    let dataProvider: DataProvider;
    try {
        let provider: any = registeredProviders[providerName].default;
        dataProvider = new provider(providerCredentials);
    } catch (error: any) {
        console.error(`Failed to create data provider instance.`, error);
        process.exit(1);
    } return dataProvider;
}