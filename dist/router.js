"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRouter = exports.getParams = void 0;
var createComponent_1 = require("./createComponent");
var useEffect_1 = require("./useEffect");
var params = Object.create(null);
function getParams() {
    return params;
}
exports.getParams = getParams;
function useRouter() {
    var routes = Object.create(null);
    function route(path, fn) {
        while (path.startsWith('/')) {
            path = path.substring(1);
        }
        routes[path] = fn;
    }
    function getPath() {
        params = {};
        useEffect_1.clearEffect();
        var path = location.hash;
        while (path.startsWith('/') || path.startsWith('#')) {
            path = path.substring(1);
        }
        while (path.endsWith('/')) {
            path = path.substring(0, path.length - 1);
        }
        return path;
    }
    function match(path, selector) {
        if (typeof routes[path] === "function") {
            createComponent_1.createComponent(selector, routes[path]);
            return;
        }
        var paths = Object.keys(routes);
        var _loop_1 = function (p) {
            if (p.includes(':')) {
                var current_1 = path.split('/');
                var pathGroups_1 = p.split('/');
                var pathParamsPos_1 = [];
                pathGroups_1.forEach(function (g, i) {
                    if (g.startsWith(':')) {
                        pathParamsPos_1.push(i);
                    }
                });
                pathParamsPos_1.forEach(function (i) {
                    current_1[i] = pathGroups_1[i];
                });
                if (current_1.join('/') === p) {
                    var currentGroup_1 = path.split('/');
                    pathParamsPos_1.forEach(function (i) {
                        params[pathGroups_1[i].substring(1)] = currentGroup_1[i];
                    });
                    createComponent_1.createComponent(selector, routes[p]);
                    return { value: void 0 };
                }
            }
            if (p.endsWith('**')) {
                var matchAllPath = p.slice(0, -2);
                if (path.startsWith(matchAllPath)) {
                    createComponent_1.createComponent(selector, routes[p]);
                    return { value: void 0 };
                }
            }
        };
        for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
            var p = paths_1[_i];
            var state_1 = _loop_1(p);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        // 404
        if (typeof routes['*'] === "function") {
            createComponent_1.createComponent(selector, routes['*']);
            return;
        }
        createComponent_1.createComponent(selector, function () { return "<p>404 Not Found</p>"; });
    }
    function render(selector) {
        window.addEventListener('hashchange', function () {
            match(getPath(), selector);
        }, false);
        match(getPath(), selector);
    }
    return { route: route, render: render };
}
exports.useRouter = useRouter;
