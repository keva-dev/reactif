"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncUpdateQueue = exports.useAsyncUpdateQueue = void 0;
function useAsyncUpdateQueue() {
    var queue = new Set();
    var isQueueSleep = true;
    function add(fn) {
        if (queue.has(fn)) {
            return;
        }
        queue.add(fn);
        if (isQueueSleep) {
            isQueueSleep = false;
            setTimeout(nextTick, 0);
        }
    }
    function nextTick() {
        if (queue.size) {
            queue.forEach(function (fn) {
                fn();
            });
            queue.clear();
            isQueueSleep = true;
        }
    }
    return { add: add, nextTick: nextTick };
}
exports.useAsyncUpdateQueue = useAsyncUpdateQueue;
exports.asyncUpdateQueue = useAsyncUpdateQueue();
