"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_work_tree_1 = require("../util/git/get-work-tree");
const inworkspace_1 = require("../util/inworkspace");
const filedummy_1 = require("./filedummy");
const filephysical_1 = require("./filephysical");
class GitBlameCache {
    constructor(logger) {
        this.cache = new Map();
        this.interval = setInterval(() => {
            this.cleanCache(logger);
        }, GitBlameCache.cacheTimeToLive);
    }
    async getFile(logger, fileName) {
        const cachedEntry = this.cache.get(fileName);
        if (cachedEntry) {
            return cachedEntry.file;
        }
        const workTree = get_work_tree_1.getWorkTree(logger, fileName);
        if (inworkspace_1.inWorkspace(fileName) && await workTree) {
            const cacheEntry = {
                created: Date.now(),
                file: new filephysical_1.GitFilePhysical(fileName, await workTree),
            };
            this.cache.set(fileName, cacheEntry);
            return cacheEntry.file;
        }
        else {
            const cacheEntry = {
                created: Date.now(),
                file: new filedummy_1.GitFileDummy(fileName),
            };
            this.cache.set(fileName, cacheEntry);
            return cacheEntry.file;
        }
    }
    /**
     * To force clear, set maxAge to 0.
     * For infinite TTL set maxAge to -Infinite.
     */
    cleanCache(logger, maxAge = GitBlameCache.cacheTimeToLive) {
        const oldestAllowed = Date.now() - maxAge;
        for (const [fileName, cacheEntry] of this.cache.entries()) {
            if (cacheEntry.created >= oldestAllowed - maxAge) {
                this.cache.delete(fileName);
            }
        }
    }
    dispose() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.cleanCache(undefined, 0);
    }
}
GitBlameCache.cacheTimeToLive = 15 * 60000;
exports.GitBlameCache = GitBlameCache;
//# sourceMappingURL=blamecache.js.map