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

import {lstatSync, Stats, readdirSync} from "fs";

import Server, {server} from "../server";
import Event from "./event";
import {working} from "../index";
import {PluginManifest, PluginObject} from "../utils/interfaces";

import * as logger from "../utils/logger";
import {Color} from "../utils/constants";

/**
 * Should be extended by all Open Shen plugins.
 */
abstract class Plugin {
    private readonly server: Server;
    
    protected constructor(
        server: Server
    ) {
        this.server = server;
    }

    /**
     * Get from {@link require} or create an {@link Object}.
     */
    abstract manifest(): PluginManifest;

    /**
     * Returns the server instance.
     */
    getServer(): Server {
        return this.server;
    }
    
    /**
     * Called when the plugin is loaded.
     */
    load(): void { };

    /**
     * Called when the plugin is enabled.
     */
    enable(): void { };

    /**
     * Called before the plugin is disabled.
     */
    disable(): void { };
}
export default Plugin;

/**
 * Injects methods & properties into the specified class.
 * @param plugin The plugin to inject into.
 */
function pluginInjector(plugin: any): void {
    // 'getServer(): Server' method.
    plugin.server = server;
}

/**
 * Manages plugins and their lifecycle.
 */
export class PluginManager {
    readonly plugins: PluginObject[] = [];
    readonly listeners: any[] = [];

    /**
     * Registers all event listeners in a file to the server.
     * @param listener The result of `require()`'ing a listener.
     */
    registerEvents(listener: any): void {
        this.listeners.push(listener);
    }

    /**
     * Push the event to all listeners.
     * @param event The event to call.
     */
    invokeListeners(event: Event): void {
        const eventName: string = event.constructor.name.split("Event")[0];
        const listeners: any[] = this.listeners.filter(listener => listener.events.includes(eventName));
        listeners.forEach(listener => console.log(listener.exports));
    }
    
    /*
     * Plugin loading.
     */
    
    /**
     * Read all plugins in the plugins directory and register them.
     */
    async registerAllPlugins(): Promise<void> {
        const path: string = `${working}/plugins`;
        const files: string[] = readdirSync(path);
        for(const file of files) {
            const pluginPath: string = `${path}/${file}`;
            const fileData: Stats = lstatSync(pluginPath);
            if(fileData.isDirectory()) {
                const manifest: PluginManifest = require(`${pluginPath}/manifest.json`);
                const pluginClass: any = require(`${pluginPath}/${manifest.main}`);
                this.registerPlugin(pluginClass, manifest);
            } else this.registerPlugin(require(pluginPath));
        }
    }

    /**
     * Registers a plugin to the server.
     * @param baseClass The base class from {@link require}
     */
    registerPlugin(baseClass: any, manifest?: PluginManifest): void {
        try {
            const plugin: Plugin = new baseClass(server);
            manifest = manifest || plugin.manifest();

            this.plugins.push({plugin: plugin, manifest: manifest});
            logger.info(Color.DEFAULT(), `Loading plugin '${manifest.name}' v${manifest.version}...`);
            pluginInjector(plugin); // Inject critical methods into the plugin.
            plugin.load(); // Load the plugin after injecting methods.
        } catch (error: any) {
            console.error("Unable to load a plugin.", error);
        }
    }

    /**
     * Enables all plugins before loading plugin-modifiable systems.
     */
    enableAllPlugins(): void {
        for(const object of this.plugins) {
            const plugin: Plugin = object.plugin; const manifest: PluginManifest = object.manifest;
            logger.info(Color.DEFAULT(), `Enabling plugin '${manifest.name}'...`);
            plugin.enable();
        }
    }

    /**
     * Disables all plugins before the server shuts down.
     */
    disableAllPlugins(): void {
        for(const object of this.plugins) {
            const plugin: Plugin = object.plugin; const manifest: PluginManifest = object.manifest;
            logger.info(Color.DEFAULT(), `Disabling plugin '${manifest.name}'...`);
            plugin.disable();
        }
    }
}

/**
 * Creates a plugin manager instance.
 */
export function createPluginManager(): PluginManager {
    return new PluginManager();
}