// Storage Service JS
// This script stores to and/or fetches from the
// config object from Chrome's persistent storage
// It works with arbitrary serializable JavaScript object

// exploratory testing passed 2020-09-14

class StorageAdapter {

    /**
     * Get something from the storage
     * @param key {string}
     * @returns {Promise<Object>}
     * @abstract
     */
    async get(key) {}

    /**
     * Set something into the storage
     * @param key {string}
     * @param value {Object}
     * @returns {Promise<void>}
     * @abstract
     */
    async set(key, value) {}

}

class LocalStorageAdapter extends StorageAdapter {

    async get(key) {
        const rawString = localStorage.getItem(key);
        return JSON.parse(rawString);
    }

    async set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

}

class ChromeStorageAdapter extends StorageAdapter {

    async get(key) {
        return await new Promise((resolve) => {
            chrome.storage.sync.get(key, (result) => {
                resolve(result[key]);
            });
        });
    }

    async set(key, value) {

        await new Promise((resolve, reject) => {

            const dict = {};
            dict[key] = value;
            chrome.storage.sync.set(dict);

            chrome.runtime.error ? reject(chrome.runtime.error): resolve();

        });
    }

}

export const ConfigStorage = {

    /** @type StorageAdapter */
    adapter: null,
    /** @type boolean */
    isInitialised: false,

    /**
     * Initialises the ConfigService object
     */
    checkInitialisation: function() {

        if (this.isInitialised) {
            return;
        }

        // do we have chrome storage support here?
        if (this._hasChromeStorageSupport()) {
            this.adapter = new ChromeStorageAdapter();
        } else {
            this.adapter = new LocalStorageAdapter();
        }

        this.isInitialised = true;

    },

    /**
     * Checks if this browser env has chrome storage support
     * @returns {boolean}
     * @private
     */
    _hasChromeStorageSupport: () => {

        try {
            return (chrome.storage.sync.set instanceof Function);
        } catch (e) {
            if (e instanceof ReferenceError || e instanceof TypeError) {
                return false;
            } else {
                throw e;
            }
        }
    },

    /**
     * Get something from the storage
     * @param key {string}
     * @returns {Promise<Object>}
     */
    get: function(key) {
        this.checkInitialisation();
        return this.adapter.get(key);
    },

    /**
     * Sets something to the storage
     * @param key {string}
     * @param value {object}
     * @returns {Promise<void>}
     */
    set: function(key, value) {
        this.checkInitialisation();
        return this.adapter.set(key, value);
    }
}