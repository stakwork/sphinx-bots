"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MSG_TYPE = exports._emit = void 0;
var EventEmitter = require("eventemitter3");
var node_fetch_1 = require("node-fetch");
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var EE = new EventEmitter();
exports._emit = function (topic, msg) {
    EE.emit(topic, msg);
};
var MSG_TYPE;
(function (MSG_TYPE) {
    MSG_TYPE["READY"] = "ready";
    MSG_TYPE["MESSAGE"] = "message";
    MSG_TYPE["GUILD_CREATE"] = "guildCreate";
    MSG_TYPE["GUILD_DELETE"] = "guildDelete";
})(MSG_TYPE = exports.MSG_TYPE || (exports.MSG_TYPE = {}));
var Client = /** @class */ (function () {
    function Client() {
        this.token = '';
        this.action = null; // post to webhook
        this.logging = false;
    }
    Client.prototype.login = function (token, action) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.token = token;
                if (this.token === '_') {
                    this.logging = true;
                }
                else {
                    this.startServer();
                }
                if (action)
                    this.action = action;
                return [2 /*return*/];
            });
        });
    };
    Client.prototype.log = function (a) {
        if (!this.logging)
            return;
        console.log(a);
    };
    Client.prototype.on = function (msgType, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!this.token)
                    return [2 /*return*/];
                EE.on(msgType, function (m) {
                    _this.log('===> EE.on received' + msgType + 'CONTENT:' + JSON.stringify(m));
                    var channel = {
                        id: m.channel.id,
                        send: function (msg) { return _this.embedToAction(__assign(__assign({}, msg), { channel: { id: m.channel.id, send: function () { } } })); }
                    };
                    m.channel = channel;
                    m.reply = function (content) {
                        _this.embedToAction({ content: content, channel: channel });
                    };
                    callback(m);
                });
                return [2 /*return*/];
            });
        });
    };
    Client.prototype.embedToAction = function (m) {
        var content = '';
        var botName = 'Bot';
        if (m.embed && m.embed.html) {
            content = m.embed.html;
            botName = m.embed.author;
        }
        else if (typeof m.content === 'string') {
            content = m.content;
        }
        // console.log(<Action>{
        //     botName, chatUUID: m.channel.id,
        //     content, action: 'broadcast',
        // })
        var a = {
            botName: botName,
            chatUUID: m.channel.id,
            content: content,
            action: 'broadcast',
        };
        if (this.action) {
            this.action(a);
        }
        else {
            this.doAction(a);
        }
    };
    Client.prototype.parseToken = function () {
        if (!this.token)
            return;
        var arr = this.token.split('.');
        if (arr.length < 3)
            return null;
        // 0:id 1:secret 2:url
        var bot_id = Buffer.from(arr[0], 'base64').toString('binary');
        var bot_secret = Buffer.from(arr[1], 'base64').toString('binary');
        var url = Buffer.from(arr[2], 'base64').toString('binary');
        if (!bot_id || !bot_secret || !url)
            return null;
        return {
            bot_id: bot_id, bot_secret: bot_secret, url: url
        };
    };
    Client.prototype.doAction = function (a) {
        return __awaiter(this, void 0, void 0, function () {
            var t, url, bot_id, bot_secret, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        t = this.parseToken();
                        if (!t)
                            return [2 /*return*/];
                        url = t.url, bot_id = t.bot_id, bot_secret = t.bot_secret;
                        return [4 /*yield*/, node_fetch_1.default(url, {
                                method: 'POST',
                                body: JSON.stringify(__assign(__assign({}, a), { bot_id: bot_id, bot_secret: bot_secret })),
                                headers: { 'Content-Type': 'application/json' }
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        console.log('doAction error:', e_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Client.prototype.startServer = function () {
        var t = this.parseToken();
        if (!t)
            return;
        var bot_secret = t.bot_secret;
        var app = express();
        var port = process.env.PORT || 3000;
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(cors({
            allowedHeaders: ['X-Requested-With', 'Content-Type', 'Accept', 'x-user-token', 'Authorization', 'x-secret']
        }));
        app.post('/', function (req, res) {
            var secret = req.headers['x-secret'];
            if (secret !== bot_secret) {
                return res.send({ error: 'no secret provided' });
            }
            EE.emit(MSG_TYPE.MESSAGE, req.body);
            res.send({ sucess: true });
        });
        app.listen(port, function () {
            console.log("Listening at http://localhost:" + port);
        });
    };
    return Client;
}());
exports.default = Client;
