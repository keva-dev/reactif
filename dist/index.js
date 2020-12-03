"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OddxReactive = void 0;
var selector_1 = require("./selector");
var state_1 = require("./state");
var createComponent_1 = require("./createComponent");
var mountHandler_1 = require("./mountHandler");
var useEffect_1 = require("./useEffect");
exports.OddxReactive = {
    $: selector_1.$,
    useState: state_1.createState,
    mountComponent: createComponent_1.createComponent,
    on: mountHandler_1.on,
    useEffect: useEffect_1.useEffect,
};
