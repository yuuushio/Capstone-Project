// Position Registry

import {ConfigStorage} from "../../Utilities/ConfigStorage.js";
import {PWWPosition} from "./PWWPosition.js";

const STORAGE_KEY = "PositionManagerStorageKey";

export class PositionRegistry {

    /** @type {{String: PWWPosition}} */
    // data[widgetName] === PWWPosition
    data = {}

    constructor() {
        this.getFromConfigStorage().then();
    }

    /**
     * Set a position by widget name
     * @param widgetName {string}
     * @param position {PWWPosition}
     */
    setPositionByWidgetName(widgetName, position) {
        this.data[widgetName] = position;
    }

    /**
     * Get a position by widget name
     * @param widgetName {string}
     * @returns {PWWPosition}
     */
    getPositionByWidgetName(widgetName) {
        const dataEntry = this.data[widgetName];
        const x = dataEntry ? dataEntry.x : 0;
        const y = dataEntry ? dataEntry.y : 0;
        return new PWWPosition(x, y);
    }


    async commit() {
        await this.saveToConfigStorage();
    }

    async getFromConfigStorage() {
        const persistentData = await ConfigStorage.get(STORAGE_KEY);
        if (persistentData) {
            this.data = persistentData;
        }
    }

    resetAll() {
        this.data = {};
    }

    async saveToConfigStorage() {
        await ConfigStorage.set(STORAGE_KEY, this.data);
    }

}