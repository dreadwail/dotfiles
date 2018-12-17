"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GenericCache {
    constructor() {
        this.storage = new Map();
        this.timeToLive = 10;
        this.clearTimer = setInterval(() => {
            this.cleanExpired();
        }, 10 * 60000);
    }
    /**
     * Set the cache TTL for all new items
     * @param ttl Time to live in minutes
     */
    setTimeToLive(ttl) {
        this.timeToLive = ttl * 60000;
    }
    /**
     * Store values in the cache until aprox the TTL expires
     * @param key Identifier for the stored value
     * @param value Value of the decided type
     */
    store(key, value) {
        this.storage.set(key, {
            data: value,
            expire: Date.now() + this.timeToLive,
        });
    }
    read(key) {
        const value = this.storage.get(key);
        if (value === undefined) {
            return undefined;
        }
        if (value.expire >= Date.now()) {
            return undefined;
        }
        return value.data;
    }
    delete(key) {
        this.storage.delete(key);
    }
    dispose() {
        clearInterval(this.clearTimer);
        this.storage.clear();
    }
    cleanExpired() {
        this.storage.forEach((value, key) => {
            if (value.expire >= Date.now()) {
                this.storage.delete(key);
            }
        });
    }
}
exports.GenericCache = GenericCache;
//# sourceMappingURL=generic-cache.js.map