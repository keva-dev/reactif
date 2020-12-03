"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var globalState_1 = require("./globalState");
var Dependency = /** @class */ (function () {
    function Dependency() {
        this.deps = new Set();
    }
    Dependency.prototype.depend = function () {
        if (globalState_1.globalState.currentFn) {
            this.deps.add(globalState_1.globalState.currentFn);
        }
    };
    Dependency.prototype.notify = function () {
        this.deps.forEach(function (fn) { return fn(); });
    };
    return Dependency;
}());
exports.default = Dependency;
