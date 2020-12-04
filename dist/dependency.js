"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDependency = void 0;
var globalState_1 = require("./globalState");
function useDependency() {
    var dependants = new Set();
    window.addEventListener('hashchange', function () {
        dependants.clear();
    });
    function depend() {
        if (typeof globalState_1.globalState.currentFn === "function") {
            dependants.add(globalState_1.globalState.currentFn);
        }
    }
    function notify() {
        dependants.forEach(function (fn) { return fn(); });
    }
    return { depend: depend, notify: notify };
}
exports.useDependency = useDependency;
