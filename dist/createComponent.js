"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComponent = void 0;
var makeFuncReactive_1 = require("./makeFuncReactive");
function createComponent(selector, fn) {
    makeFuncReactive_1.makeFuncReactive(function () {
        document.querySelector(selector).innerHTML = fn();
    });
}
exports.createComponent = createComponent;
