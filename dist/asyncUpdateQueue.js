"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextTick = exports.add = void 0;
var queue = new Set();
var sleeping = true;
function add(fn) {
    if (queue.has(fn)) {
        return;
    }
    queue.add(fn);
    if (sleeping === true) {
        sleeping = false;
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
        sleeping = true;
    }
}
exports.nextTick = nextTick;
