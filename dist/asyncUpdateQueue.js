"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextTick = exports.add = void 0;
var globalState_1 = require("./globalState");
var queue = new Set();
function add(fn) {
    if (queue.has(fn)) {
        return;
    }
    queue.add(fn);
    if (globalState_1.globalState.isQueueSleep) {
        globalState_1.globalState.isQueueSleep = false;
        setTimeout(nextTick, 0);
    }
}
exports.add = add;
function nextTick() {
    if (queue.size) {
        queue.forEach(function (fn) {
            fn();
        });
        queue.clear();
        globalState_1.globalState.isQueueSleep = true;
    }
}
exports.nextTick = nextTick;
