"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFuncReactive = void 0;
var globalState_1 = require("./globalState");
function makeFuncReactive(fn) {
    function wrapped() {
        globalState_1.globalState.currentFn = fn;
        fn();
        globalState_1.globalState.currentFn = undefined;
    }
    wrapped();
}
exports.makeFuncReactive = makeFuncReactive;
