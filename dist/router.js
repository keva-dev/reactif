"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
var createComponent_1 = require("./createComponent");
var useEffect_1 = require("./useEffect");
var Router = /** @class */ (function () {
    function Router() {
        this.routes = Object.create(null);
    }
    Router.prototype.route = function (path, fn) {
        while (path.startsWith('/')) {
            path = path.substring(1);
        }
        this.routes[path] = fn;
    };
    Router.getPath = function () {
        Router.params = {};
        useEffect_1.clearEffect();
        var path = location.hash;
        while (path.startsWith('/') || path.startsWith('#')) {
            path = path.substring(1);
        }
        return path;
    };
    Router.prototype.match = function (path, selector) {
        if (typeof this.routes[path] === "function") {
            createComponent_1.createComponent(selector, this.routes[path]);
            return;
        }
        var paths = Object.keys(this.routes);
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
                        Router.params[pathGroups_1[i].substring(1)] = currentGroup_1[i];
                    });
                    createComponent_1.createComponent(selector, this_1.routes[p]);
                    return { value: void 0 };
                }
            }
            if (p.endsWith('**')) {
                var matchAllPath = p.slice(0, -2);
                if (path.startsWith(matchAllPath)) {
                    createComponent_1.createComponent(selector, this_1.routes[p]);
                    return { value: void 0 };
                }
            }
        };
        var this_1 = this;
        for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
            var p = paths_1[_i];
            var state_1 = _loop_1(p);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        // 404
        if (typeof this.routes['*'] === "function") {
            createComponent_1.createComponent(selector, this.routes['*']);
            return;
        }
        createComponent_1.createComponent(selector, function () { return "<p>404 Not Found</p>"; });
    };
    Router.prototype.render = function (selector) {
        var _this = this;
        window.addEventListener('hashchange', function () {
            _this.match(Router.getPath(), selector);
        }, false);
        this.match(Router.getPath(), selector);
    };
    Router.params = Object.create(null);
    return Router;
}());
exports.Router = Router;
