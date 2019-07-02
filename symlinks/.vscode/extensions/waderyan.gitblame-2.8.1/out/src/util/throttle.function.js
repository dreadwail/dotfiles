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
    return (_target, _propertyKey, descriptor) => {
        if (descriptor.value === undefined) {
            throw new Error('Invalid trottleFunction usage detected');
        }
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
            return Promise.resolve();
        };
    };
}
exports.throttleFunction = throttleFunction;
//# sourceMappingURL=throttle.function.js.map