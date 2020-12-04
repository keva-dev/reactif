"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createState = void 0;
var dependency_1 = require("./dependency");
var asyncUpdateQueue_1 = require("./asyncUpdateQueue");
var updateQueue = asyncUpdateQueue_1.useAsyncUpdateQueue();
function createState(state) {
    var dep = dependency_1.useDependency();
    return new Proxy(state, {
        get: function (target, p, receiver) {
            dep.depend();
            return Reflect.get(target, p, receiver);
        },
        set: function (target, p, value, receiver) {
            var set = Reflect.set(target, p, value, receiver);
            updateQueue.add(dep.notify);
            return set;
        }
    });
}
exports.createState = createState;
