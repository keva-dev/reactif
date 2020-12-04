"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEffect = void 0;
var globalState_1 = require("./globalState");
function useEffect(fn) {
    if (typeof fn !== "function")
        return;
    setTimeout(function () {
        globalState_1.globalState.currentFn = fn;
        fn();
        globalState_1.globalState.currentFn = undefined;
    }, 0);
}
exports.useEffect = useEffect;
