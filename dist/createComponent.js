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
function createComponent(selector, componentFunc) {
    var fn = componentFunc();
    makeFuncReactive(function () {
        document.querySelector(selector).innerHTML = typeof fn !== 'function' ? fn : fn();
    });
}
exports.createComponent = createComponent;
