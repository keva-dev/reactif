"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.component = void 0;
var mounted_1 = require("./mounted");
var createComponent_1 = require("./createComponent");
function component(selector, componentFn) {
    mounted_1.mounted(function () {
        createComponent_1.createComponent(selector, componentFn);
    });
}
exports.component = component;
