"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createState_1 = require("./createState");
var createComponent_1 = require("./createComponent");
var mountHandler_1 = require("./mountHandler");
var useEffect_1 = require("./useEffect");
var router_1 = require("./router");
var ReOdd = {
    useState: createState_1.createState,
    render: createComponent_1.createComponent,
    useEffect: useEffect_1.useEffect,
    on: mountHandler_1.on,
    Router: {
        getParams: router_1.getParams,
        useRouter: router_1.useRouter
    }
};
exports.default = ReOdd;
