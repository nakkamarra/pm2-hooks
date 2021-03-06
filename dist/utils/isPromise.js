'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Created by desaroger on 4/03/17.
 */

module.exports = function isPromise(x) {
    if (!x || (typeof x === 'undefined' ? 'undefined' : _typeof(x)) !== 'object') return false;
    if (typeof x.then !== 'function' || typeof x.catch !== 'function') return false;
    return true;
};