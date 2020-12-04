"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateQueue = void 0;
var UpdateQueue = /** @class */ (function () {
    function UpdateQueue(selector) {
        this.queue = new Set();
        this.sleeping = true;
        this.selector = selector;
    }
    UpdateQueue.prototype.add = function (fns) {
        var _this = this;
        fns.forEach(function (f) { return _this.queue.add(f); });
        if (this.sleeping === true) {
            this.sleeping = false;
            setTimeout(this.run, 0);
        }
    };
    UpdateQueue.prototype.run = function () {
        var _this = this;
        if (this.queue.size) {
            this.queue.forEach(function (fn) {
                document.querySelector(_this.selector).innerHTML = fn();
            });
            this.queue.clear();
            this.sleeping = true;
        }
    };
    return UpdateQueue;
}());
exports.UpdateQueue = UpdateQueue;
