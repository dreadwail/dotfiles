"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cache = new Set();
/**
 * Throttle a function. It will ignore any calls to it in the
 * timeout time since it was last called successfully.
 *
 * @param timeout in milliseconds
 */
function throttleFunction(timeout) {
    return (target, propertyKey, descriptor) => {
        const oldMethod = descriptor.value;
        const identifier = Symbol();
        descriptor.value = function (...args) {
            if (!cache.has(identifier)) {
                oldMethod.call(this, args);
                cache.add(identifier);
                setTimeout(() => {
                    cache.delete(identifier);
                }, timeout);
            }
        };
    };
}
exports.throttleFunction = throttleFunction;
//# sourceMappingURL=throttle.function.js.map