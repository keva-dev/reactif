"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDependency = void 0;
var globalState_1 = require("./globalState");
function useDependency() {
    var dependents = new Set();
    window.addEventListener('hashchange', function () {
        dependents.clear();
    });
    function depend() {
        if (typeof globalState_1.globalState.currentFn === "function") {
            dependents.add(globalState_1.globalState.currentFn);
        }
    }
    function notify() {
        dependents.forEach(function (fn) { return fn(); });
    }
    return { depend: depend, notify: notify };
}
exports.useDependency = useDependency;
