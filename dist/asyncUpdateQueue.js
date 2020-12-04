"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAsyncUpdateQueue = void 0;
function useAsyncUpdateQueue() {
    var queue = new Set();
    var sleeping = true;
    function add(fn) {
        if (queue.has(fn)) {
            return;
        }
        queue.add(fn);
        if (sleeping === true) {
            sleeping = false;
            setTimeout(run, 0);
        }
    }
    function run() {
        if (queue.size) {
            queue.forEach(function (fn) {
                fn();
            });
            queue.clear();
            sleeping = true;
        }
    }
    return { add: add, nextTick: run };
}
exports.useAsyncUpdateQueue = useAsyncUpdateQueue;
