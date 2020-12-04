"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComponent = void 0;
var globalState_1 = require("./globalState");
function makeFuncReactive(fn) {
    function wrapped() {
        globalState_1.globalState.currentFn = fn;
        fn();
        globalState_1.globalState.currentFn = undefined;
    }
    wrapped();
}
function createComponent(selector, fn) {
    makeFuncReactive(function () {
        document.querySelector(selector).innerHTML = fn();
    });
}
exports.createComponent = createComponent;
