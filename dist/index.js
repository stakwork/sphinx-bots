"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._emit = exports.MSG_TYPE = exports.MessageEmbed = exports.Client = void 0;
var client_1 = require("./client");
exports.Client = client_1.default;
Object.defineProperty(exports, "MSG_TYPE", { enumerable: true, get: function () { return client_1.MSG_TYPE; } });
Object.defineProperty(exports, "_emit", { enumerable: true, get: function () { return client_1._emit; } });
var messageEmbed_1 = require("./messageEmbed");
exports.MessageEmbed = messageEmbed_1.default;
