"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComponent = void 0;
var globalState_1 = require("./globalState");
function makeFuncReactiveAndExecute(fn) {
    function wrapped() {
        globalState_1.globalState.currentFn = fn;
        fn();
        globalState_1.globalState.currentFn = undefined;
    }
    wrapped();
}
function createComponent(selector, fn) {
    makeFuncReactiveAndExecute(function () {
        document.querySelector(selector).innerHTML = fn();
    });
}
exports.createComponent = createComponent;
