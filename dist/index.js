"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createState_1 = require("./createState");
var createComponent_1 = require("./createComponent");
var events_1 = require("./events");
var component_1 = require("./component");
var onMounted_1 = require("./onMounted");
var onUnmounted_1 = require("./onUnmounted");
var router_1 = require("./router");
var asyncUpdateQueue_1 = require("./asyncUpdateQueue");
var readonly_1 = require("./readonly");
var ReOdd = {
    reactive: createState_1.createState,
    render: createComponent_1.createComponent,
    onMounted: onMounted_1.onMounted,
    onUnmounted: onUnmounted_1.onUnmounted,
    on: events_1.on,
    component: component_1.component,
    Router: {
        getParams: router_1.getParams,
        useRouter: router_1.useRouter
    },
    nextTick: asyncUpdateQueue_1.nextTick,
    readonly: readonly_1.readonly
};
exports.default = ReOdd;
