"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.component = void 0;
var onMounted_1 = require("./onMounted");
var createComponent_1 = require("./createComponent");
function component(selector, componentFn) {
    onMounted_1.onMounted(function () {
        createComponent_1.createComponent(selector, componentFn);
    });
}
exports.component = component;
