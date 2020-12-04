"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var state_1 = require("./state");
var createComponent_1 = require("./createComponent");
var mountHandler_1 = require("./mountHandler");
var useEffect_1 = require("./useEffect");
var router_1 = require("./router");
var ReOdd = {
    useState: state_1.createState,
    render: createComponent_1.createComponent,
    useEffect: useEffect_1.useEffect,
    on: mountHandler_1.on,
    router: new router_1.Router()
};
exports.default = ReOdd;
