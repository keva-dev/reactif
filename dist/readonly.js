"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readonly = void 0;
function readonly(state) {
    return new Proxy(state, {
        get: function (target, p, receiver) {
            return Reflect.get(target, p, receiver);
        },
        set: function () {
            throw new Error('Cannot set a readonly object');
        }
    });
}
exports.readonly = readonly;
