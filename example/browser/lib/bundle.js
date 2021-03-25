(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var cinerino = window.cinerino = require('./lib/browser.js');
},{"./lib/browser.js":12}],2:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Abstract API Client
 */
__exportStar(require("@cinerino/api-abstract-client"), exports);

},{"@cinerino/api-abstract-client":115}],3:[function(require,module,exports){
"use strict";
// tslint:disable-next-line:no-single-line-block-comment
/* istanbul ignore file */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.ImplicitGrantClient = void 0;
var createDebug = require("debug");
var qs = require("qs");
var ErrorFactory = require("./implicitGrantClient/error");
var popupAuthenticationHandler_1 = require("./implicitGrantClient/popupAuthenticationHandler");
var silentAuthenticationHandler_1 = require("./implicitGrantClient/silentAuthenticationHandler");
var silentLogoutHandler_1 = require("./implicitGrantClient/silentLogoutHandler");
// tslint:disable-next-line:no-require-imports no-var-requires
var idTokenVerifier = require('idtoken-verifier');
var oAuth2client_1 = require("./oAuth2client");
var debug = createDebug('cinerino-api:auth:implicitGrantClient');
/**
 * OAuth2 client using grant type 'implicit grant'
 */
var ImplicitGrantClient = /** @class */ (function (_super) {
    __extends(ImplicitGrantClient, _super);
    function ImplicitGrantClient(options) {
        // assert.check(
        //     options,
        //     { type: 'object', message: 'options parameter is not valid' },
        //     {
        //         domain: { type: 'string', message: 'domain option is required' },
        //         clientId: { type: 'string', message: 'clientId option is required' },
        //         responseType: { optional: true, type: 'string', message: 'responseType is not valid' },
        //         responseMode: { optional: true, type: 'string', message: 'responseMode is not valid' },
        //         redirectUri: { optional: true, type: 'string', message: 'redirectUri is not valid' },
        //         scope: { optional: true, type: 'string', message: 'scope is not valid' },
        //         audience: { optional: true, type: 'string', message: 'audience is not valid' }
        //     }
        // );
        var _this = _super.call(this, options) || this;
        _this.options = options;
        _this.options.responseMode = 'fragment';
        _this.options.responseType = 'token';
        // amazon cognitoの認可サーバーはnonce未実装
        // tslint:disable-next-line:no-null-keyword
        _this.options.nonce = null;
        debug('options:', _this.options);
        _this.credentials = {};
        return _this;
    }
    ImplicitGrantClient.BUILD_PASRSE_HASH_RESPONS = function (qsParams, __, idTokenPayload) {
        return {
            accessToken: qsParams.access_token,
            idToken: qsParams.id_token,
            idTokenPayload: idTokenPayload,
            refreshToken: qsParams.refresh_token,
            state: qsParams.state,
            // tslint:disable-next-line:no-magic-numbers
            expiresIn: qsParams.expires_in ? parseInt(qsParams.expires_in, 10) : undefined,
            tokenType: qsParams.token_type
        };
    };
    ImplicitGrantClient.prototype.isSignedIn = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.refreshToken()
                        .then(function (result) { return result; })
                        // tslint:disable-next-line:no-null-keyword
                        .catch(function () { return null; })];
            });
        });
    };
    ImplicitGrantClient.prototype.getAccessToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.credentials.accessToken === undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.refreshAccessToken()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, this.credentials.accessToken];
                }
            });
        });
    };
    ImplicitGrantClient.prototype.refreshAccessToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.credentials.refreshToken === undefined) {
                    throw new Error('not authorized yet');
                }
                return [2 /*return*/, this.refreshToken()];
            });
        });
    };
    /**
     * Executes a silent authentication transaction under the hood in order to fetch a new tokens for the current session.
     */
    ImplicitGrantClient.prototype.refreshToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var usePostMessage, params, handler, hash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        usePostMessage = false;
                        params = {
                            clientId: this.options.clientId,
                            responseType: this.options.responseType,
                            responseMode: this.options.responseMode,
                            prompt: 'none',
                            redirectUri: this.options.redirectUri,
                            scope: this.options.scope,
                            state: this.options.state,
                            nonce: this.options.nonce
                        };
                        handler = silentAuthenticationHandler_1.default.CREATE({
                            authenticationUrl: this.buildAuthorizeUrl(params)
                        });
                        return [4 /*yield*/, handler.login(usePostMessage)];
                    case 1:
                        hash = _a.sent();
                        return [2 /*return*/, this.onLogin(hash)];
                }
            });
        });
    };
    /**
     * Redirects to the hosted login page (`/authorize`) in order to start a new authN/authZ transaction.
     */
    ImplicitGrantClient.prototype.signIn = function () {
        return __awaiter(this, void 0, void 0, function () {
            var usePostMessage, params, handler, hash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        usePostMessage = true;
                        params = {
                            clientId: this.options.clientId,
                            responseType: this.options.responseType,
                            responseMode: this.options.responseMode,
                            prompt: '',
                            redirectUri: this.options.redirectUri,
                            scope: this.options.scope,
                            state: this.options.state,
                            nonce: this.options.nonce
                        };
                        handler = popupAuthenticationHandler_1.default.CREATE({
                            authenticationUrl: this.buildAuthorizeUrl(params)
                        });
                        return [4 /*yield*/, handler.login(usePostMessage)];
                    case 1:
                        hash = _a.sent();
                        return [2 /*return*/, this.onLogin(hash)];
                }
            });
        });
    };
    /**
     * Redirects to the auth0 logout endpoint
     */
    ImplicitGrantClient.prototype.signOut = function () {
        return __awaiter(this, void 0, void 0, function () {
            var usePostMessage, handler;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        usePostMessage = false;
                        handler = silentLogoutHandler_1.default.CREATE({
                            logoutUrl: this.buildLogoutUrl({
                                clientId: this.options.clientId,
                                logoutUri: this.options.logoutUri
                            })
                        });
                        return [4 /*yield*/, handler.logout(usePostMessage)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ImplicitGrantClient.prototype.onLogin = function (hash) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        debug('onLogin');
                        // hash was already parsed, so we just return it.
                        _a = this;
                        if (!(typeof hash === 'object')) return [3 /*break*/, 1];
                        _b = hash;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.parseHash(hash)];
                    case 2:
                        _b = _c.sent();
                        _c.label = 3;
                    case 3:
                        // hash was already parsed, so we just return it.
                        _a.credentials = _b;
                        debug('credentials:', this.credentials);
                        return [2 /*return*/, this.credentials];
                }
            });
        });
    };
    ImplicitGrantClient.prototype.parseHash = function (hash) {
        return __awaiter(this, void 0, void 0, function () {
            var hashStr, parsedQs, err, payload, verifier, decodedToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hashStr = hash === undefined ? window.location.hash : hash;
                        hashStr = hashStr.replace(/^#?\/?/, '');
                        parsedQs = qs.parse(hashStr);
                        // if authorization falied
                        if (parsedQs.hasOwnProperty('error')) {
                            err = new ErrorFactory.AuthorizeError(parsedQs.error_description);
                            err.error = parsedQs.error;
                            err.errorDescription = parsedQs.error_description;
                            err.state = parsedQs.state;
                            throw err;
                        }
                        if (!parsedQs.hasOwnProperty('access_token') &&
                            !parsedQs.hasOwnProperty('id_token') &&
                            !parsedQs.hasOwnProperty('refresh_token')) {
                            throw new Error('invalid hash');
                        }
                        if (!parsedQs.id_token) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.validateToken(parsedQs.id_token, this.options.nonce)];
                    case 1:
                        payload = _a.sent();
                        return [2 /*return*/, ImplicitGrantClient.BUILD_PASRSE_HASH_RESPONS(parsedQs, '', payload)];
                    case 2:
                        if (parsedQs.id_token) {
                            verifier = new idTokenVerifier({
                                issuer: this.options.tokenIssuer,
                                audience: this.options.clientId
                            });
                            decodedToken = verifier.decode(parsedQs.id_token);
                            return [2 /*return*/, ImplicitGrantClient.BUILD_PASRSE_HASH_RESPONS(parsedQs, '', decodedToken.payload)];
                        }
                        else {
                            // tslint:disable-next-line:no-null-keyword
                            return [2 /*return*/, ImplicitGrantClient.BUILD_PASRSE_HASH_RESPONS(parsedQs, '', null)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Decodes the a JWT and verifies its nonce value
     */
    ImplicitGrantClient.prototype.validateToken = function (token, nonce) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                debug('validating id_token...');
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var verifier = new idTokenVerifier({
                            issuer: _this.options.tokenIssuer,
                            audience: _this.options.clientId
                        });
                        verifier.verify(token, nonce, function (err, payload) {
                            debug('id_token verified', err, payload);
                            if (err !== null) {
                                reject(err);
                                return;
                            }
                            resolve(payload);
                        });
                    })];
            });
        });
    };
    ImplicitGrantClient.prototype.buildAuthorizeUrl = function (options) {
        var qString = qs.stringify({
            client_id: options.clientId,
            response_type: options.responseType,
            redirect_uri: options.redirectUri,
            response_mode: options.responseMode,
            scope: options.scope,
            state: options.state,
            nonce: options.nonce,
            prompt: options.prompt
        });
        return "https://" + this.options.domain + ImplicitGrantClient.AUTHORIZE_URL + "?" + qString;
    };
    /**
     * Builds and returns the Logout url in order to initialize a new authN/authZ transaction
     * If you want to navigate the user to a specific URL after the logout,
     * set that URL at the returnTo parameter. The URL should be included in any the appropriate Allowed Logout URLs list:
     */
    ImplicitGrantClient.prototype.buildLogoutUrl = function (options) {
        var qString = qs.stringify({
            client_id: options.clientId,
            logout_uri: options.logoutUri
        });
        return "https://" + this.options.domain + ImplicitGrantClient.LOGOUT_URL + "?" + qString;
    };
    ImplicitGrantClient.AUTHORIZE_URL = '/authorize';
    ImplicitGrantClient.LOGOUT_URL = '/logout';
    return ImplicitGrantClient;
}(oAuth2client_1.default));
exports.ImplicitGrantClient = ImplicitGrantClient;

},{"./implicitGrantClient/error":4,"./implicitGrantClient/popupAuthenticationHandler":6,"./implicitGrantClient/silentAuthenticationHandler":8,"./implicitGrantClient/silentLogoutHandler":9,"./oAuth2client":11,"debug":279,"idtoken-verifier":288,"qs":294}],4:[function(require,module,exports){
"use strict";
// tslint:disable-next-line:no-single-line-block-comment
/* istanbul ignore file */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizeError = void 0;
/**
 * クライアント認可エラー
 */
var AuthorizeError = /** @class */ (function (_super) {
    __extends(AuthorizeError, _super);
    function AuthorizeError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AuthorizeError;
}(Error));
exports.AuthorizeError = AuthorizeError;

},{}],5:[function(require,module,exports){
"use strict";
// tslint:disable-next-line:no-single-line-block-comment
/* istanbul ignore file */
Object.defineProperty(exports, "__esModule", { value: true });
var createDebug = require("debug");
var debug = createDebug('cinerino-api:auth:iframeHandler');
/**
 * IframeHandler
 */
var IframeHandler = /** @class */ (function () {
    function IframeHandler(options) {
        this.url = options.url;
        this.callback = options.callback;
        // tslint:disable-next-line:no-magic-numbers
        this.timeout = (options.timeout !== undefined) ? options.timeout : 60 * 1000;
        // tslint:disable-next-line:no-null-keyword
        this.timeoutCallback = (options.timeoutCallback !== undefined) ? options.timeoutCallback : null;
        this.eventListenerType = (options.eventListenerType !== undefined) ? options.eventListenerType : 'message';
        // tslint:disable-next-line:no-null-keyword
        this.iframe = null;
        // tslint:disable-next-line:no-null-keyword
        this.timeoutHandle = null;
        // tslint:disable-next-line:no-null-keyword
        this.destroyTimeout = null;
        // tslint:disable-next-line:no-null-keyword
        this.proxyEventListener = null;
        // If no event identifier specified, set default
        this.eventValidator = (options.eventValidator !== undefined) ? options.eventValidator : {
            isValid: function () {
                return true;
            }
        };
        if (typeof this.callback !== 'function') {
            throw new Error('options.callback must be a function');
        }
    }
    IframeHandler.prototype.init = function () {
        var _this = this;
        debug('opening iframe...', this.eventListenerType);
        this.iframe = window.document.createElement('iframe');
        this.iframe.style.display = 'none';
        this.iframe.src = this.url;
        // Workaround to avoid using bind that does not work in IE8
        this.proxyEventListener = function (e) {
            _this.eventListener(e);
        };
        switch (this.eventListenerType) {
            case 'message':
                this.eventSourceObject = window;
                break;
            case 'load':
                this.eventSourceObject = this.iframe;
                break;
            default:
                throw new Error("Unsupported event listener type: " + this.eventListenerType);
        }
        this.eventSourceObject.addEventListener(this.eventListenerType, this.proxyEventListener, false);
        window.document.body.appendChild(this.iframe);
        this.timeoutHandle = setTimeout(function () {
            _this.timeoutHandler();
        }, this.timeout);
    };
    IframeHandler.prototype.eventListener = function (event) {
        var eventData = { event: event, sourceObject: this.eventSourceObject };
        this.destroy();
        this.callback(eventData);
    };
    IframeHandler.prototype.timeoutHandler = function () {
        this.destroy();
        if (this.timeoutCallback) {
            this.timeoutCallback();
        }
    };
    IframeHandler.prototype.destroy = function () {
        var _this = this;
        clearTimeout(this.timeoutHandle);
        this.destroyTimeout = setTimeout(function () {
            _this.eventSourceObject.removeEventListener(_this.eventListenerType, _this.proxyEventListener, false);
            window.document.body.removeChild(_this.iframe);
        }, 0);
    };
    return IframeHandler;
}());
exports.default = IframeHandler;

},{"debug":279}],6:[function(require,module,exports){
"use strict";
// tslint:disable-next-line:no-single-line-block-comment
/* istanbul ignore file */
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
var ErrorFactory = require("./error");
var popupHandler_1 = require("./popupHandler");
/**
 * PopupAuthenticationHandler
 */
var PopupAuthenticationHandler = /** @class */ (function () {
    function PopupAuthenticationHandler(options) {
        this.authenticationUrl = options.authenticationUrl;
        // tslint:disable-next-line:no-magic-numbers
        this.timeout = (options.timeout !== undefined) ? options.timeout : 60 * 1000;
        // tslint:disable-next-line:no-null-keyword
        this.handler = null;
    }
    PopupAuthenticationHandler.GET_EVENT_VALIDATOR = function () {
        return {};
    };
    PopupAuthenticationHandler.GET_CALLBACK_HANDLER = function (cb, usePostMessage) {
        return function (eventData) {
            var callbackValue;
            try {
                if (!usePostMessage) {
                    // loadイベントの場合は、ポップアップのフラグメントをコールバックへ渡す
                    callbackValue = eventData.sourceObject.location.hash;
                }
                else if (typeof eventData.event.data === 'object' && eventData.event.data.hash) {
                    callbackValue = eventData.event.data.hash;
                }
                else {
                    callbackValue = eventData.event.data;
                }
            }
            catch (error) {
                // tslint:disable-next-line:no-console
                console.error('PopupAuthenticationHandler.GET_CALLBACK_HANDLER:', error);
            }
            cb(callbackValue);
        };
    };
    PopupAuthenticationHandler.CREATE = function (options) {
        return new PopupAuthenticationHandler(options);
    };
    PopupAuthenticationHandler.prototype.login = function (usePostMessage) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.handler = new popupHandler_1.default({
                            url: _this.authenticationUrl,
                            eventListenerType: usePostMessage ? 'message' : 'load',
                            callback: PopupAuthenticationHandler.GET_CALLBACK_HANDLER(resolve, usePostMessage),
                            timeout: _this.timeout,
                            eventValidator: PopupAuthenticationHandler.GET_EVENT_VALIDATOR(),
                            timeoutCallback: function () {
                                var err = new ErrorFactory.AuthorizeError('Timeout during authentication');
                                err.error = 'timeout';
                                err.errorDescription = 'Timeout during authentication';
                                reject(err);
                            },
                            usePostMessage: false
                        });
                        _this.handler.init();
                    })];
            });
        });
    };
    return PopupAuthenticationHandler;
}());
exports.default = PopupAuthenticationHandler;

},{"./error":4,"./popupHandler":7}],7:[function(require,module,exports){
"use strict";
// tslint:disable-next-line:no-single-line-block-comment
/* istanbul ignore file */
Object.defineProperty(exports, "__esModule", { value: true });
var createDebug = require("debug");
var debug = createDebug('cinerino-api:auth:popupHandler');
/**
 * PopupHandler
 */
var PopupHandler = /** @class */ (function () {
    function PopupHandler(options) {
        this.url = options.url;
        this.callback = options.callback;
        // tslint:disable-next-line:no-magic-numbers
        this.timeout = (options.timeout !== undefined) ? options.timeout : 60 * 1000;
        // tslint:disable-next-line:no-null-keyword
        this.timeoutCallback = (options.timeoutCallback !== undefined) ? options.timeoutCallback : null;
        this.eventListenerType = (options.eventListenerType !== undefined) ? options.eventListenerType : 'message';
        // tslint:disable-next-line:no-null-keyword
        this.popupWindow = null;
        // tslint:disable-next-line:no-null-keyword
        this.timeoutHandle = null;
        // tslint:disable-next-line:no-null-keyword
        this.destroyTimeout = null;
        // tslint:disable-next-line:no-null-keyword
        this.proxyEventListener = null;
        // If no event identifier specified, set default
        this.eventValidator = (options.eventValidator !== undefined) ? options.eventValidator : {
            isValid: function () {
                return true;
            }
        };
        if (typeof this.callback !== 'function') {
            throw new Error('options.callback must be a function');
        }
    }
    PopupHandler.prototype.init = function () {
        var _this = this;
        debug('opening popup...', this.eventListenerType);
        this.popupWindow = window.open(this.url, 'authorizeWindow');
        // Workaround to avoid using bind that does not work in IE8
        this.proxyEventListener = function (e) {
            _this.eventListener(e);
        };
        switch (this.eventListenerType) {
            case 'message':
                this.eventSourceObject = window;
                break;
            case 'load':
                this.eventSourceObject = this.popupWindow;
                break;
            default:
                throw new Error("Unsupported event listener type: " + this.eventListenerType);
        }
        debug('this.eventSourceObject:', this.eventSourceObject);
        this.eventSourceObject.addEventListener(this.eventListenerType, this.proxyEventListener, false);
        this.timeoutHandle = setTimeout(function () {
            _this.timeoutHandler();
        }, this.timeout);
    };
    PopupHandler.prototype.eventListener = function (event) {
        debug('PopupHandler.eventListener...event:', event);
        var eventData = { event: event, sourceObject: this.eventSourceObject };
        this.destroy();
        // 呼び出し元へコールバック
        this.callback(eventData);
    };
    PopupHandler.prototype.timeoutHandler = function () {
        if (this.timeoutCallback) {
            this.timeoutCallback();
        }
    };
    PopupHandler.prototype.destroy = function () {
        var _this = this;
        clearTimeout(this.timeoutHandle);
        this.destroyTimeout = setTimeout(function () {
            _this.eventSourceObject.removeEventListener(_this.eventListenerType, _this.proxyEventListener, false);
            // ポップアップを閉じる
            _this.popupWindow.close();
        }, 0);
    };
    return PopupHandler;
}());
exports.default = PopupHandler;

},{"debug":279}],8:[function(require,module,exports){
"use strict";
// tslint:disable-next-line:no-single-line-block-comment
/* istanbul ignore file */
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
var ErrorFactory = require("./error");
var iframeHandler_1 = require("./iframeHandler");
/**
 * SilentAuthenticationHandler
 */
var SilentAuthenticationHandler = /** @class */ (function () {
    function SilentAuthenticationHandler(options) {
        this.authenticationUrl = options.authenticationUrl;
        // tslint:disable-next-line:no-magic-numbers
        this.timeout = (options.timeout !== undefined) ? options.timeout : 60 * 1000;
        // tslint:disable-next-line:no-null-keyword
        this.handler = null;
    }
    SilentAuthenticationHandler.GET_EVENT_VALIDATOR = function () {
        return {};
    };
    SilentAuthenticationHandler.GET_CALLBACK_HANDLER = function (cb, usePostMessage) {
        return function (eventData) {
            var callbackValue;
            try {
                if (!usePostMessage) {
                    // loadイベントの場合は、iframeウィンドウのフラグメントをコールバックへ渡す
                    callbackValue = eventData.sourceObject.contentWindow.location.hash;
                }
                else if (typeof eventData.event.data === 'object' && eventData.event.data.hash) {
                    callbackValue = eventData.event.data.hash;
                }
                else {
                    callbackValue = eventData.event.data;
                }
            }
            catch (error) {
                // tslint:disable-next-line:no-console
                console.error('SilentAuthenticationHandler.GET_CALLBACK_HANDLER:', error);
            }
            cb(callbackValue);
        };
    };
    SilentAuthenticationHandler.CREATE = function (options) {
        return new SilentAuthenticationHandler(options);
    };
    SilentAuthenticationHandler.prototype.login = function (usePostMessage) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.handler = new iframeHandler_1.default({
                            url: _this.authenticationUrl,
                            eventListenerType: usePostMessage ? 'message' : 'load',
                            callback: SilentAuthenticationHandler.GET_CALLBACK_HANDLER(resolve, usePostMessage),
                            timeout: _this.timeout,
                            eventValidator: SilentAuthenticationHandler.GET_EVENT_VALIDATOR(),
                            timeoutCallback: function () {
                                var err = new ErrorFactory.AuthorizeError('Timeout during authentication renew');
                                err.error = 'timeout';
                                err.errorDescription = 'Timeout during authentication renew';
                                reject(err);
                            },
                            usePostMessage: usePostMessage || false
                        });
                        _this.handler.init();
                    })];
            });
        });
    };
    return SilentAuthenticationHandler;
}());
exports.default = SilentAuthenticationHandler;

},{"./error":4,"./iframeHandler":5}],9:[function(require,module,exports){
"use strict";
// tslint:disable-next-line:no-single-line-block-comment
/* istanbul ignore file */
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
var ErrorFactory = require("./error");
var iframeHandler_1 = require("./iframeHandler");
/**
 * SilentLogoutHandler
 */
var SilentLogoutHandler = /** @class */ (function () {
    function SilentLogoutHandler(options) {
        this.logoutUrl = options.logoutUrl;
        // tslint:disable-next-line:no-magic-numbers
        this.timeout = (options.timeout !== undefined) ? options.timeout : 60 * 1000;
        // tslint:disable-next-line:no-null-keyword
        this.handler = null;
    }
    SilentLogoutHandler.GET_CALLBACK_HANDLER = function (cb, usePostMessage) {
        return function (eventData) {
            var callbackValue;
            try {
                if (!usePostMessage) {
                    // loadイベントの場合は、iframeウィンドウのフラグメントをコールバックへ渡す
                    callbackValue = eventData.sourceObject.contentWindow.location.hash;
                }
                else if (typeof eventData.event.data === 'object' && eventData.event.data.hash) {
                    callbackValue = eventData.event.data.hash;
                }
                else {
                    callbackValue = eventData.event.data;
                }
            }
            catch (error) {
                // tslint:disable-next-line:no-console
                console.error('SilentLogoutHandler.GET_CALLBACK_HANDLER:', error);
            }
            cb(callbackValue);
        };
    };
    SilentLogoutHandler.CREATE = function (options) {
        return new SilentLogoutHandler(options);
    };
    SilentLogoutHandler.GET_EVENT_VALIDATOR = function () {
        return {};
    };
    SilentLogoutHandler.prototype.logout = function (usePostMessage) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.handler = new iframeHandler_1.default({
                            url: _this.logoutUrl,
                            eventListenerType: usePostMessage ? 'message' : 'load',
                            callback: SilentLogoutHandler.GET_CALLBACK_HANDLER(resolve, usePostMessage),
                            timeout: _this.timeout,
                            eventValidator: SilentLogoutHandler.GET_EVENT_VALIDATOR(),
                            timeoutCallback: function () {
                                var err = new ErrorFactory.AuthorizeError('Timeout during logout');
                                err.error = 'timeout';
                                err.errorDescription = 'Timeout during logout';
                                reject(err);
                            },
                            usePostMessage: usePostMessage || false
                        });
                        _this.handler.init();
                    })];
            });
        });
    };
    return SilentLogoutHandler;
}());
exports.default = SilentLogoutHandler;

},{"./error":4,"./iframeHandler":5}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginTicket = void 0;
/**
 * APIログインチケット
 * id tokenからユーザーネームを取り出すためのシンプルなクラス
 */
var LoginTicket = /** @class */ (function () {
    /**
     * constructor
     */
    function LoginTicket(params) {
        this.envelope = params.envelope;
        this.payload = params.payload;
    }
    /**
     * ユーザーネームを取り出す
     */
    LoginTicket.prototype.getUsername = function () {
        if (this.payload !== undefined) {
            return this.payload['cognito:username'];
        }
        return;
    };
    return LoginTicket;
}());
exports.LoginTicket = LoginTicket;

},{}],11:[function(require,module,exports){
(function (Buffer){
"use strict";
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
/**
 * OAuth2クライアント
 */
var crypto = require("crypto");
var createDebug = require("debug");
var http_status_1 = require("http-status");
var fetch = require("isomorphic-fetch");
var querystring = require("querystring");
var abstract_1 = require("../abstract");
var loginTicket_1 = require("./loginTicket");
var debug = createDebug('cinerino-sdk:auth:oAuth2client');
/**
 * OAuth2 client
 */
var OAuth2client = /** @class */ (function () {
    function OAuth2client(options) {
        // tslint:disable-next-line:no-suspicious-comment
        // TODO add minimum validation
        this.options = options;
        this.credentials = {};
    }
    OAuth2client.BASE64URLENCODE = function (str) {
        return str.toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    };
    OAuth2client.SHA256 = function (buffer) {
        return crypto.createHash('sha256')
            .update(buffer)
            .digest();
    };
    /**
     * Generates URL for consent page landing.
     */
    OAuth2client.prototype.generateAuthUrl = function (optOpts) {
        var options = {
            response_type: 'code',
            client_id: this.options.clientId,
            redirect_uri: this.options.redirectUri,
            scope: optOpts.scopes.join(' '),
            state: optOpts.state
        };
        if (optOpts.codeVerifier !== undefined) {
            options.code_challenge_method = 'S256';
            options.code_challenge = OAuth2client.BASE64URLENCODE(OAuth2client.SHA256(optOpts.codeVerifier));
        }
        var rootUrl = "https://" + this.options.domain + OAuth2client.OAUTH2_AUTH_BASE_URI;
        return rootUrl + "?" + querystring.stringify(options);
    };
    /**
     * Generates URL for logout.
     */
    OAuth2client.prototype.generateLogoutUrl = function () {
        var options = {
            client_id: this.options.clientId,
            logout_uri: this.options.logoutUri
        };
        var rootUrl = "https://" + this.options.domain + OAuth2client.OAUTH2_LOGOUT_URI;
        return rootUrl + "?" + querystring.stringify(options);
    };
    /**
     * Gets the access token for the given code.
     * @param code The authorization code.
     */
    OAuth2client.prototype.getToken = function (code, codeVerifier) {
        return __awaiter(this, void 0, void 0, function () {
            var form, secret, options;
            var _this = this;
            return __generator(this, function (_a) {
                form = {
                    code: code,
                    client_id: this.options.clientId,
                    redirect_uri: this.options.redirectUri,
                    grant_type: 'authorization_code',
                    code_verifier: codeVerifier
                };
                secret = Buffer.from(this.options.clientId + ":" + this.options.clientSecret, 'utf8')
                    .toString('base64');
                options = {
                    body: querystring.stringify(form),
                    method: 'POST',
                    headers: {
                        Authorization: "Basic " + secret,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };
                debug('fetching...', options);
                return [2 /*return*/, fetch("https://" + this.options.domain + OAuth2client.OAUTH2_TOKEN_URI, options)
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var body, body, tokens;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    debug('response:', response.status);
                                    if (!(response.status !== http_status_1.OK)) return [3 /*break*/, 5];
                                    if (!(response.status === http_status_1.BAD_REQUEST)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, response.json()];
                                case 1:
                                    body = _a.sent();
                                    throw new Error(body.error);
                                case 2: return [4 /*yield*/, response.text()];
                                case 3:
                                    body = _a.sent();
                                    throw new Error(body);
                                case 4: return [3 /*break*/, 7];
                                case 5: return [4 /*yield*/, response.json()];
                                case 6:
                                    tokens = _a.sent();
                                    // tslint:disable-next-line:no-single-line-block-comment
                                    /* istanbul ignore else */
                                    if (tokens && tokens.expires_in) {
                                        // tslint:disable-next-line:no-magic-numbers
                                        tokens.expiry_date = ((new Date()).getTime() + (tokens.expires_in * 1000));
                                        delete tokens.expires_in;
                                    }
                                    return [2 /*return*/, tokens];
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * OAuthクライアントに認証情報をセットします。
     */
    OAuth2client.prototype.setCredentials = function (credentials) {
        this.credentials = credentials;
    };
    OAuth2client.prototype.refreshAccessToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.credentials.refresh_token === undefined) {
                    throw new Error('No refresh token is set.');
                }
                return [2 /*return*/, this.refreshToken(this.credentials.refresh_token)
                        .then(function (tokens) {
                        tokens.refresh_token = _this.credentials.refresh_token;
                        debug('setting credentials...', tokens);
                        _this.credentials = tokens;
                        return _this.credentials;
                    })];
            });
        });
    };
    /**
     * 期限の切れていないアクセストークンを取得します。
     * 必要であれば更新してから取得します。
     */
    OAuth2client.prototype.getAccessToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var expiryDate, isTokenExpired, shouldRefresh;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expiryDate = this.credentials.expiry_date;
                        isTokenExpired = (expiryDate !== undefined) ? (expiryDate <= (new Date()).getTime()) : false;
                        if (this.credentials.access_token === undefined && this.credentials.refresh_token === undefined) {
                            throw new Error('No access or refresh token is set.');
                        }
                        shouldRefresh = (this.credentials.access_token === undefined) || isTokenExpired;
                        if (!(shouldRefresh && this.credentials.refresh_token !== undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.refreshAccessToken()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, this.credentials.access_token];
                }
            });
        });
    };
    // public async signInWithLINE(idToken: string): Promise<ICredentials> {
    //     // request for new token
    //     debug('requesting access token...');
    //     return await request.post({
    //         url: `${API_ENDPOINT}/oauth/token/signInWithGoogle`,
    //         body: {
    //             idToken: idToken,
    //             client_id: this.clientId,
    //             client_secret: this.clientSecret,
    //             scopes: this.scopes,
    //             state: this.state
    //         },
    //         json: true,
    //         simple: false,
    //         resolveWithFullResponse: true,
    //         useQuerystring: true
    //     }).then((response) => {
    //         if (response.statusCode !== httpStatus.OK) {
    //             if (typeof response.body === 'string') {
    //                 throw new Error(response.body);
    //             }
    //             if (typeof response.body === 'object' && response.body.errors !== undefined) {
    //                 const message = (<any[]>response.body.errors).map((error) => {
    //                     return `[${error.title}]${error.detail}`;
    //                 }).join(', ');
    //                 throw new Error(message);
    //             }
    //             throw new Error('An unexpected error occurred');
    //         }
    //         const tokens = response.body;
    //         if (tokens && tokens.expires_in) {
    //             // tslint:disable-next-line:no-magic-numbers
    //             tokens.expiry_date = ((new Date()).getTime() + (tokens.expires_in * 1000));
    //             delete tokens.expires_in;
    //         }
    //         this.credentials = tokens;
    //         return tokens;
    //     });
    // }
    /**
     * Revokes the access given to token.
     * @param token The existing token to be revoked.
     */
    // public revokeToken(token: string) {
    // }
    /**
     * Provides a request implementation with OAuth 2.0 flow.
     * If credentials have a refresh_token, in cases of HTTP
     * 401 and 403 responses, it automatically asks for a new
     * access token and replays the unsuccessful request.
     * @param options Request options.
     */
    OAuth2client.prototype.fetch = function (url, options, expectedStatusCodes) {
        return __awaiter(this, void 0, void 0, function () {
            var retry, result, numberOfTry, _a, _b, error_1, statusCode;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        retry = true;
                        options.headers = (options.headers === undefined || options.headers === null) ? {} : options.headers;
                        numberOfTry = 0;
                        _c.label = 1;
                    case 1:
                        if (!(numberOfTry >= 0)) return [3 /*break*/, 9];
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 5, , 8]);
                        numberOfTry += 1;
                        if (numberOfTry > 1) {
                            retry = false;
                        }
                        _a = options.headers;
                        _b = "Bearer ";
                        return [4 /*yield*/, this.getAccessToken()];
                    case 3:
                        _a.Authorization = _b + (_c.sent());
                        return [4 /*yield*/, this.makeFetch(url, options, expectedStatusCodes)];
                    case 4:
                        result = _c.sent();
                        return [3 /*break*/, 9];
                    case 5:
                        error_1 = _c.sent();
                        if (!(error_1 instanceof Error)) return [3 /*break*/, 7];
                        statusCode = error_1.code;
                        if (!(retry && (statusCode === http_status_1.UNAUTHORIZED || statusCode === http_status_1.FORBIDDEN))) return [3 /*break*/, 7];
                        /* It only makes sense to retry once, because the retry is intended
                         * to handle expiration-related failures. If refreshing the token
                         * does not fix the failure, then refreshing again probably won't
                         * help */
                        // Force token refresh
                        return [4 /*yield*/, this.refreshAccessToken()];
                    case 6:
                        /* It only makes sense to retry once, because the retry is intended
                         * to handle expiration-related failures. If refreshing the token
                         * does not fix the failure, then refreshing again probably won't
                         * help */
                        // Force token refresh
                        _c.sent();
                        return [3 /*break*/, 1];
                    case 7: throw error_1;
                    case 8: return [3 /*break*/, 1];
                    case 9: return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * IDトークンを検証する
     * 結果にはIDトークンの付加情報が含まれます。
     */
    OAuth2client.prototype.verifyIdToken = function (options) {
        if (this.credentials.id_token === undefined) {
            throw new Error('The verifyIdToken method requires an ID Token');
        }
        // return this.verifySignedJwt(options.idToken, options.audience, OAuth2Client.ISSUERS_);
        return this.verifySignedJwt(this.credentials.id_token, options.audience);
    };
    /**
     * Provides a request implementation with OAuth 2.0 flow.
     * If credentials have a refresh_token, in cases of HTTP
     * 401 and 403 responses, it automatically asks for a new
     * access token and replays the unsuccessful request.
     * @param options Request options.
     */
    // public async request(options: request.OptionsWithUri, expectedStatusCodes: number[]) {
    //     const accessToken = await this.getAccessToken();
    //     options.auth = { bearer: accessToken };
    //     return this.makeRequest(options, expectedStatusCodes);
    // }
    /**
     * Makes a request without paying attention to refreshing or anything
     * Assumes that all credentials are set correctly.
     * @param opts Options for request
     * @param callback callback function
     */
    // tslint:disable-next-line:prefer-function-over-method
    // public async makeRequest(options: request.OptionsWithUri, expectedStatusCodes: number[]) {
    //     const transporter = new DefaultTransporter(expectedStatusCodes);
    //     return transporter.request(options);
    // }
    /**
     * Makes a request without paying attention to refreshing or anything
     * Assumes that all credentials are set correctly.
     */
    // tslint:disable-next-line:prefer-function-over-method
    OAuth2client.prototype.makeFetch = function (url, options, expectedStatusCodes) {
        return __awaiter(this, void 0, void 0, function () {
            var transporter;
            return __generator(this, function (_a) {
                transporter = new abstract_1.transporters.DefaultTransporter(expectedStatusCodes);
                return [2 /*return*/, transporter.fetch(url, options)];
            });
        });
    };
    /**
     * Refreshes the access token.
     */
    OAuth2client.prototype.refreshToken = function (refreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            var form, secret, options;
            var _this = this;
            return __generator(this, function (_a) {
                // request for new token
                debug('refreshing access token...', this.credentials, refreshToken);
                form = {
                    client_id: this.options.clientId,
                    refresh_token: refreshToken,
                    grant_type: 'refresh_token'
                };
                secret = Buffer.from(this.options.clientId + ":" + this.options.clientSecret, 'utf8')
                    .toString('base64');
                options = {
                    body: querystring.stringify(form),
                    method: 'POST',
                    headers: {
                        Authorization: "Basic " + secret,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };
                debug('fetching...', options);
                return [2 /*return*/, fetch("https://" + this.options.domain + OAuth2client.OAUTH2_TOKEN_URI, options)
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var body, body, tokens;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    debug('response:', response.status);
                                    if (!(response.status !== http_status_1.OK)) return [3 /*break*/, 5];
                                    if (!(response.status === http_status_1.BAD_REQUEST)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, response.json()];
                                case 1:
                                    body = _a.sent();
                                    throw new Error(body.error);
                                case 2: return [4 /*yield*/, response.text()];
                                case 3:
                                    body = _a.sent();
                                    throw new Error(body);
                                case 4: return [3 /*break*/, 7];
                                case 5: return [4 /*yield*/, response.json()];
                                case 6:
                                    tokens = _a.sent();
                                    // tslint:disable-next-line:no-single-line-block-comment
                                    /* istanbul ignore else */
                                    if (tokens && tokens.expires_in) {
                                        // tslint:disable-next-line:no-magic-numbers
                                        tokens.expiry_date = ((new Date()).getTime() + (tokens.expires_in * 1000));
                                        delete tokens.expires_in;
                                    }
                                    return [2 /*return*/, tokens];
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * Verify the id token is signed with the correct certificate
     * and is from the correct audience.
     * @param jwt The jwt to verify (The ID Token in this case).
     * @param requiredAudience The audience to test the jwt against.
     * @param issuers The allowed issuers of the jwt (Optional).
     */
    // tslint:disable-next-line:prefer-function-over-method
    OAuth2client.prototype.verifySignedJwt = function (jwt, requiredAudience) {
        // private verifySignedJwt(jwt: string, requiredAudience: string | string[], issuers?: string[]) {
        var segments = jwt.split('.');
        // tslint:disable-next-line:no-magic-numbers
        if (segments.length !== 3) {
            throw new Error("Wrong number of segments in token: " + jwt);
        }
        // const signed = `${segments[0]}.${segments[1]}`;
        // // tslint:disable-next-line:no-magic-numbers
        // const signature = segments[2];
        var envelope;
        var payload;
        try {
            envelope = JSON.parse(new Buffer(segments[0], 'base64').toString('utf8'));
        }
        catch (err) {
            throw new Error("Can't parse token envelope: " + segments[0]);
        }
        try {
            payload = JSON.parse(new Buffer(segments[1], 'base64').toString('utf8'));
        }
        catch (err) {
            throw new Error("Can't parse token payload: " + segments[0]);
        }
        if (payload.iat === undefined) {
            throw new Error("No issue time in token: " + JSON.stringify(payload));
        }
        if (payload.exp === undefined) {
            throw new Error("No expiration time in token: " + JSON.stringify(payload));
        }
        if (isNaN(payload.iat)) {
            throw new Error('iat field using invalid format');
        }
        if (isNaN(payload.exp)) {
            throw new Error('exp field using invalid format');
        }
        // if (issuers !== undefined && issuers.indexOf(payload.iss) < 0) {
        //     throw new Error(`Invalid issuer, expected one of [${issuers}], but got ${payload.iss}`);
        // }
        // Check the audience matches if we have one
        // tslint:disable-next-line:no-single-line-block-comment
        /* istanbul ignore else */
        if (requiredAudience !== undefined) {
            var aud = payload.aud;
            var audVerified = false;
            // If the requiredAudience is an array, check if it contains token
            if (Array.isArray(requiredAudience)) {
                audVerified = (requiredAudience.indexOf(aud) > -1);
            }
            else {
                audVerified = (aud === requiredAudience);
            }
            if (!audVerified) {
                throw new Error('Wrong recipient, payload audience != requiredAudience');
            }
        }
        return new loginTicket_1.LoginTicket({
            envelope: envelope,
            payload: payload
        });
    };
    /**
     * The base URL for auth endpoints.
     */
    OAuth2client.OAUTH2_AUTH_BASE_URI = '/authorize';
    /**
     * The base endpoint for token retrieval.
     */
    OAuth2client.OAUTH2_TOKEN_URI = '/token';
    /**
     * The base endpoint to revoke tokens.
     */
    OAuth2client.OAUTH2_LOGOUT_URI = '/logout';
    return OAuth2client;
}());
exports.default = OAuth2client;

}).call(this,require("buffer").Buffer)
},{"../abstract":2,"./loginTicket":10,"buffer":275,"crypto":274,"debug":279,"http-status":287,"isomorphic-fetch":290,"querystring":300}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthInstance = exports.transporters = exports.service = exports.factory = void 0;
/**
 * API Javascript Client
 */
var abstract_1 = require("./abstract");
var implicitGrantClient_1 = require("./auth/implicitGrantClient");
/**
 * factory
 */
exports.factory = abstract_1.factory;
exports.service = abstract_1.service;
exports.transporters = abstract_1.transporters;
/**
 * create OAuth2 client instance using implicit grant
 */
// tslint:disable-next-line:no-single-line-block-comment
/* istanbul ignore next */
function createAuthInstance(options) {
    return new implicitGrantClient_1.ImplicitGrantClient(options);
}
exports.createAuthInstance = createAuthInstance;

},{"./abstract":2,"./auth/implicitGrantClient":3}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * アクションステータス
 */
var ActionStatusType;
(function (ActionStatusType) {
    ActionStatusType["ActiveActionStatus"] = "ActiveActionStatus";
    ActionStatusType["CompletedActionStatus"] = "CompletedActionStatus";
    ActionStatusType["FailedActionStatus"] = "FailedActionStatus";
    ActionStatusType["PotentialActionStatus"] = "PotentialActionStatus";
    ActionStatusType["CanceledActionStatus"] = "CanceledActionStatus";
})(ActionStatusType || (ActionStatusType = {}));
exports.default = ActionStatusType;

},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * アクションタイプ
 */
var ActionType;
(function (ActionType) {
    ActionType["AuthorizeAction"] = "AuthorizeAction";
    ActionType["CancelAction"] = "CancelAction";
    ActionType["CheckAction"] = "CheckAction";
    ActionType["InformAction"] = "InformAction";
    ActionType["MoneyTransfer"] = "MoneyTransfer";
    ActionType["PayAction"] = "PayAction";
    ActionType["RefundAction"] = "RefundAction";
    ActionType["RegisterAction"] = "RegisterAction";
    ActionType["ReserveAction"] = "ReserveAction";
    ActionType["ReturnAction"] = "ReturnAction";
    ActionType["SendAction"] = "SendAction";
    ActionType["UnRegisterAction"] = "UnRegisterAction";
    ActionType["UseAction"] = "UseAction";
})(ActionType || (ActionType = {}));
exports.default = ActionType;

},{}],16:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],17:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],18:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],19:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],20:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],21:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],22:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],23:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],24:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],25:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],26:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],27:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CategorySetIdentifier;
(function (CategorySetIdentifier) {
    /**
     * 口座タイプ
     */
    CategorySetIdentifier["AccountType"] = "AccountType";
    /**
     * レーティングタイプ
     */
    CategorySetIdentifier["ContentRatingType"] = "ContentRatingType";
    /**
     * 配給区分
     */
    CategorySetIdentifier["DistributorType"] = "DistributorType";
    /**
     * 決済カード(ムビチケ券種)区分
     */
    CategorySetIdentifier["MovieTicketType"] = "MovieTicketType";
    /**
     * オファーカテゴリータイプ
     */
    CategorySetIdentifier["OfferCategoryType"] = "OfferCategoryType";
    /**
     * 決済方法タイプ
     */
    CategorySetIdentifier["PaymentMethodType"] = "PaymentMethodType";
    /**
     * 座席タイプ
     */
    CategorySetIdentifier["SeatingType"] = "SeatingType";
    /**
     * サービス区分
     */
    CategorySetIdentifier["ServiceType"] = "ServiceType";
    /**
     * 音響方式タイプ
     */
    CategorySetIdentifier["SoundFormatType"] = "SoundFormatType";
    /**
     * 上映方式タイプ
     */
    CategorySetIdentifier["VideoFormatType"] = "VideoFormatType";
})(CategorySetIdentifier = exports.CategorySetIdentifier || (exports.CategorySetIdentifier = {}));

},{}],29:[function(require,module,exports){
"use strict";
/**
 * アプリケーションクライアントユーザーファクトリー
 * クライアントサイドでapiを利用するユーザー
 */
Object.defineProperty(exports, "__esModule", { value: true });

},{}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 著作物タイプ
 */
var CreativeWorkType;
(function (CreativeWorkType) {
    CreativeWorkType["EmailMessage"] = "EmailMessage";
    CreativeWorkType["Movie"] = "Movie";
    CreativeWorkType["WebApplication"] = "WebApplication";
})(CreativeWorkType || (CreativeWorkType = {}));
exports.default = CreativeWorkType;

},{}],31:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],32:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],33:[function(require,module,exports){
"use strict";
/**
 * Media type typically expressed using a MIME format
 * @see http://www.iana.org/assignments/media-types/media-types.xhtml
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Application;
(function (Application) {
    Application["pdf"] = "application/pdf";
    Application["json"] = "application/json";
})(Application = exports.Application || (exports.Application = {}));
var Audio;
(function (Audio) {
})(Audio = exports.Audio || (exports.Audio = {}));
var Font;
(function (Font) {
})(Font = exports.Font || (exports.Font = {}));
var Example;
(function (Example) {
})(Example = exports.Example || (exports.Example = {}));
var Image;
(function (Image) {
})(Image = exports.Image || (exports.Image = {}));
var Message;
(function (Message) {
})(Message = exports.Message || (exports.Message = {}));
var Model;
(function (Model) {
})(Model = exports.Model || (exports.Model = {}));
var Multipart;
(function (Multipart) {
})(Multipart = exports.Multipart || (exports.Multipart = {}));
var Text;
(function (Text) {
    Text["csv"] = "text/csv";
})(Text = exports.Text || (exports.Text = {}));
var Video;
(function (Video) {
})(Video = exports.Video || (exports.Video = {}));

},{}],34:[function(require,module,exports){
"use strict";
/**
 * エラーコード
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["AlreadyInUse"] = "AlreadyInUse";
    ErrorCode["Argument"] = "Argument";
    ErrorCode["ArgumentNull"] = "ArgumentNull";
    ErrorCode["Forbidden"] = "Forbidden";
    ErrorCode["NotFound"] = "NotFound";
    ErrorCode["NotImplemented"] = "NotImplemented";
    ErrorCode["RateLimitExceeded"] = "RateLimitExceeded";
    ErrorCode["ServiceUnavailable"] = "ServiceUnavailable";
    ErrorCode["Unauthorized"] = "Unauthorized";
})(ErrorCode || (ErrorCode = {}));
exports.default = ErrorCode;

},{}],35:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var chevre_1 = require("./chevre");
/**
 * AlreadyInUseError
 */
var AlreadyInUseError = /** @class */ (function (_super) {
    __extends(AlreadyInUseError, _super);
    function AlreadyInUseError(entityName, fieldNames, message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = "The specified '" + entityName + "' value is already in use for: " + fieldNames.join(', ') + ".";
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.AlreadyInUse, actualMessage) /* istanbul ignore next */ || this;
        _this.entityName = entityName;
        _this.fieldNames = fieldNames;
        setPrototypeOf(_this, AlreadyInUseError.prototype);
        return _this;
    }
    return AlreadyInUseError;
}(chevre_1.ChevreError));
exports.default = AlreadyInUseError;

},{"../errorCode":34,"./chevre":38,"setprototypeof":301}],36:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var chevre_1 = require("./chevre");
/**
 * ArgumentError
 */
var ArgumentError = /** @class */ (function (_super) {
    __extends(ArgumentError, _super);
    function ArgumentError(argumentName, message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = "Invalid or missing argument supplied: " + argumentName + ".";
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.Argument, actualMessage) /* istanbul ignore next */ || this;
        _this.argumentName = argumentName;
        setPrototypeOf(_this, ArgumentError.prototype);
        return _this;
    }
    return ArgumentError;
}(chevre_1.ChevreError));
exports.default = ArgumentError;

},{"../errorCode":34,"./chevre":38,"setprototypeof":301}],37:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var chevre_1 = require("./chevre");
/**
 * ArgumentNullError
 */
var ArgumentNullError = /** @class */ (function (_super) {
    __extends(ArgumentNullError, _super);
    function ArgumentNullError(argumentName, message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = "Missing argument: " + argumentName + ".";
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.ArgumentNull, actualMessage) /* istanbul ignore next */ || this;
        _this.argumentName = argumentName;
        setPrototypeOf(_this, ArgumentNullError.prototype);
        return _this;
    }
    return ArgumentNullError;
}(chevre_1.ChevreError));
exports.default = ArgumentNullError;

},{"../errorCode":34,"./chevre":38,"setprototypeof":301}],38:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * ChevreError
 */
var ChevreError = /** @class */ (function (_super) {
    __extends(ChevreError, _super);
    function ChevreError(code, message) {
        var _this = 
        // tslint:disable-next-line:no-single-line-block-comment
        _super.call(this, message) /* istanbul ignore next */ || this;
        _this.name = 'ChevreError';
        _this.reason = code;
        return _this;
    }
    return ChevreError;
}(Error));
exports.ChevreError = ChevreError;

},{}],39:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var chevre_1 = require("./chevre");
/**
 * ForbiddenError
 */
var ForbiddenError = /** @class */ (function (_super) {
    __extends(ForbiddenError, _super);
    function ForbiddenError(message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Forbidden.';
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.Forbidden, actualMessage) /* istanbul ignore next */ || this;
        setPrototypeOf(_this, ForbiddenError.prototype);
        return _this;
    }
    return ForbiddenError;
}(chevre_1.ChevreError));
exports.default = ForbiddenError;

},{"../errorCode":34,"./chevre":38,"setprototypeof":301}],40:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var chevre_1 = require("./chevre");
/**
 * NotFoundError
 */
var NotFoundError = /** @class */ (function (_super) {
    __extends(NotFoundError, _super);
    function NotFoundError(entityName, message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = "Not Found: " + entityName + ".";
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.NotFound, actualMessage) /* istanbul ignore next */ || this;
        _this.entityName = entityName;
        setPrototypeOf(_this, NotFoundError.prototype);
        return _this;
    }
    return NotFoundError;
}(chevre_1.ChevreError));
exports.default = NotFoundError;

},{"../errorCode":34,"./chevre":38,"setprototypeof":301}],41:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var chevre_1 = require("./chevre");
/**
 * NotImplementedError
 */
var NotImplementedError = /** @class */ (function (_super) {
    __extends(NotImplementedError, _super);
    function NotImplementedError(message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Method is not yet implemented.';
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.NotImplemented, actualMessage) /* istanbul ignore next */ || this;
        setPrototypeOf(_this, NotImplementedError.prototype);
        return _this;
    }
    return NotImplementedError;
}(chevre_1.ChevreError));
exports.default = NotImplementedError;

},{"../errorCode":34,"./chevre":38,"setprototypeof":301}],42:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var chevre_1 = require("./chevre");
/**
 * RateLimitExceededError
 */
var RateLimitExceededError = /** @class */ (function (_super) {
    __extends(RateLimitExceededError, _super);
    function RateLimitExceededError(message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Rate limit exceeded.';
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.RateLimitExceeded, actualMessage) /* istanbul ignore next */ || this;
        setPrototypeOf(_this, RateLimitExceededError.prototype);
        return _this;
    }
    return RateLimitExceededError;
}(chevre_1.ChevreError));
exports.default = RateLimitExceededError;

},{"../errorCode":34,"./chevre":38,"setprototypeof":301}],43:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var chevre_1 = require("./chevre");
/**
 * ServiceUnavailableError
 */
var ServiceUnavailableError = /** @class */ (function (_super) {
    __extends(ServiceUnavailableError, _super);
    function ServiceUnavailableError(message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Service unavailable temporarily.';
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.ServiceUnavailable, actualMessage) /* istanbul ignore next */ || this;
        setPrototypeOf(_this, ServiceUnavailableError.prototype);
        return _this;
    }
    return ServiceUnavailableError;
}(chevre_1.ChevreError));
exports.default = ServiceUnavailableError;

},{"../errorCode":34,"./chevre":38,"setprototypeof":301}],44:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var chevre_1 = require("./chevre");
/**
 * UnauthorizedError
 */
var UnauthorizedError = /** @class */ (function (_super) {
    __extends(UnauthorizedError, _super);
    function UnauthorizedError(message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Unauthorized.';
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.Unauthorized, actualMessage) /* istanbul ignore next */ || this;
        setPrototypeOf(_this, UnauthorizedError.prototype);
        return _this;
    }
    return UnauthorizedError;
}(chevre_1.ChevreError));
exports.default = UnauthorizedError;

},{"../errorCode":34,"./chevre":38,"setprototypeof":301}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * errors
 */
var alreadyInUse_1 = require("./error/alreadyInUse");
exports.AlreadyInUse = alreadyInUse_1.default;
var argument_1 = require("./error/argument");
exports.Argument = argument_1.default;
var argumentNull_1 = require("./error/argumentNull");
exports.ArgumentNull = argumentNull_1.default;
var chevre_1 = require("./error/chevre");
exports.Chevre = chevre_1.ChevreError;
var forbidden_1 = require("./error/forbidden");
exports.Forbidden = forbidden_1.default;
var notFound_1 = require("./error/notFound");
exports.NotFound = notFound_1.default;
var notImplemented_1 = require("./error/notImplemented");
exports.NotImplemented = notImplemented_1.default;
var rateLimitExceeded_1 = require("./error/rateLimitExceeded");
exports.RateLimitExceeded = rateLimitExceeded_1.default;
var serviceUnavailable_1 = require("./error/serviceUnavailable");
exports.ServiceUnavailable = serviceUnavailable_1.default;
var unauthorized_1 = require("./error/unauthorized");
exports.Unauthorized = unauthorized_1.default;

},{"./error/alreadyInUse":35,"./error/argument":36,"./error/argumentNull":37,"./error/chevre":38,"./error/forbidden":39,"./error/notFound":40,"./error/notImplemented":41,"./error/rateLimitExceeded":42,"./error/serviceUnavailable":43,"./error/unauthorized":44}],46:[function(require,module,exports){
"use strict";
/**
 * イベントステータス
 */
Object.defineProperty(exports, "__esModule", { value: true });
var EventStatusType;
(function (EventStatusType) {
    EventStatusType["EventCancelled"] = "EventCancelled";
    EventStatusType["EventPostponed"] = "EventPostponed";
    EventStatusType["EventRescheduled"] = "EventRescheduled";
    EventStatusType["EventScheduled"] = "EventScheduled";
})(EventStatusType || (EventStatusType = {}));
exports.default = EventStatusType;

},{}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * イベントタイプ
 */
var EventType;
(function (EventType) {
    EventType["ScreeningEvent"] = "ScreeningEvent";
    EventType["ScreeningEventSeries"] = "ScreeningEventSeries";
})(EventType || (EventType = {}));
exports.default = EventType;

},{}],48:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],49:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],50:[function(require,module,exports){
"use strict";
/**
 * 商品在庫状況
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ItemAvailability;
(function (ItemAvailability) {
    ItemAvailability["Discontinued"] = "Discontinued";
    ItemAvailability["InStock"] = "InStock";
    ItemAvailability["InStoreOnly"] = "InStoreOnly";
    ItemAvailability["LimitedAvailability"] = "LimitedAvailability";
    ItemAvailability["OnlineOnly"] = "OnlineOnly";
    ItemAvailability["OutOfStock"] = "OutOfStock";
    ItemAvailability["PreOrder"] = "PreOrder";
    ItemAvailability["PreSale"] = "PreSale";
    ItemAvailability["SoldOut"] = "SoldOut";
})(ItemAvailability || (ItemAvailability = {}));
exports.default = ItemAvailability;

},{}],51:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RefundTypeEnumeration;
(function (RefundTypeEnumeration) {
    RefundTypeEnumeration["ExchangeRefund"] = "ExchangeRefund";
    RefundTypeEnumeration["FullRefund"] = "FullRefund";
    RefundTypeEnumeration["StoreCreditRefund"] = "StoreCreditRefund";
})(RefundTypeEnumeration = exports.RefundTypeEnumeration || (exports.RefundTypeEnumeration = {}));
var ReturnFeesEnumeration;
(function (ReturnFeesEnumeration) {
    ReturnFeesEnumeration["OriginalShippingFees"] = "OriginalShippingFees";
    ReturnFeesEnumeration["RestockingFees"] = "RestockingFees";
    ReturnFeesEnumeration["ReturnShippingFees"] = "ReturnShippingFees";
})(ReturnFeesEnumeration = exports.ReturnFeesEnumeration || (exports.ReturnFeesEnumeration = {}));
/**
 * 返品ポリシーインターフェース
 * @see https://schema.org/MerchantReturnEnumeration
 */
var MerchantReturnEnumeration;
(function (MerchantReturnEnumeration) {
    /**
     * there is a finite window for product returns.
     */
    MerchantReturnEnumeration["MerchantReturnFiniteReturnWindow"] = "MerchantReturnFiniteReturnWindow";
    /**
     * product returns are not permitted.
     */
    MerchantReturnEnumeration["MerchantReturnNotPermitted"] = "MerchantReturnNotPermitted";
    /**
     * there is an unlimited window for product returns.
     */
    MerchantReturnEnumeration["MerchantReturnUnlimitedWindow"] = "MerchantReturnUnlimitedWindow";
    /**
     * a product return policy is not specified here.
     */
    MerchantReturnEnumeration["MerchantReturnUnspecified"] = "MerchantReturnUnspecified";
})(MerchantReturnEnumeration = exports.MerchantReturnEnumeration || (exports.MerchantReturnEnumeration = {}));

},{}],53:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],54:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],55:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],56:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * オファータイプ
 */
var OfferType;
(function (OfferType) {
    OfferType["Offer"] = "Offer";
    OfferType["AggregateOffer"] = "AggregateOffer";
})(OfferType || (OfferType = {}));
exports.default = OfferType;

},{}],57:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],58:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 組織タイプ
 */
var OrganizationType;
(function (OrganizationType) {
    OrganizationType["Corporation"] = "Corporation";
    OrganizationType["MovieTheater"] = "MovieTheater";
    OrganizationType["Project"] = "Project";
})(OrganizationType = exports.OrganizationType || (exports.OrganizationType = {}));

},{}],59:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 決済方法タイプ
 */
var PaymentMethodType;
(function (PaymentMethodType) {
    /**
     * 現金
     */
    PaymentMethodType["Cash"] = "Cash";
    /**
     * クレジットカード
     */
    PaymentMethodType["CreditCard"] = "CreditCard";
    /**
     * 電子マネー
     */
    PaymentMethodType["EMoney"] = "EMoney";
    /**
     * MGチケット
     */
    PaymentMethodType["MGTicket"] = "MGTicket";
    /**
     * ムビチケ
     */
    PaymentMethodType["MovieTicket"] = "MovieTicket";
    /**
     * その他
     */
    PaymentMethodType["Others"] = "Others";
})(PaymentMethodType = exports.PaymentMethodType || (exports.PaymentMethodType = {}));

},{}],60:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],61:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],62:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 場所タイプ
 */
var PlaceType;
(function (PlaceType) {
    PlaceType["AggregatePlace"] = "AggregatePlace";
    PlaceType["MovieTheater"] = "MovieTheater";
    PlaceType["Place"] = "Place";
    PlaceType["ScreeningRoom"] = "ScreeningRoom";
    PlaceType["ScreeningRoomSection"] = "ScreeningRoomSection";
    PlaceType["Seat"] = "Seat";
})(PlaceType = exports.PlaceType || (exports.PlaceType = {}));
// export default PlaceType;

},{}],64:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],65:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],66:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],67:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],68:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * price currency
 * The currency (in 3-letter ISO 4217 format) of the price or a price component,
 * when attached to PriceSpecification and its subtypes.
 */
var PriceCurrency;
(function (PriceCurrency) {
    PriceCurrency["JPY"] = "JPY";
})(PriceCurrency || (PriceCurrency = {}));
exports.default = PriceCurrency;

},{}],69:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 価格仕様タイプ
 */
var PriceSpecificationType;
(function (PriceSpecificationType) {
    /**
     * 基本価格仕様
     */
    PriceSpecificationType["PriceSpecification"] = "PriceSpecification";
    /**
     * カテゴリーコードチャージ仕様
     */
    PriceSpecificationType["CategoryCodeChargeSpecification"] = "CategoryCodeChargeSpecification";
    /**
     * 複合価格仕様
     */
    PriceSpecificationType["CompoundPriceSpecification"] = "CompoundPriceSpecification";
    /**
     * ムビチケ券種区分チャージ仕様
     */
    PriceSpecificationType["MovieTicketTypeChargeSpecification"] = "MovieTicketTypeChargeSpecification";
    /**
     * 単価仕様
     */
    PriceSpecificationType["UnitPriceSpecification"] = "UnitPriceSpecification";
})(PriceSpecificationType || (PriceSpecificationType = {}));
exports.default = PriceSpecificationType;

},{}],70:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * プロダクトタイプ
 */
var ProductType;
(function (ProductType) {
    /**
     * イベントサービス
     */
    ProductType["EventService"] = "EventService";
    /**
     * メンバーシップサービス
     */
    ProductType["MembershipService"] = "MembershipService";
    /**
     * ペイメントカード
     */
    ProductType["PaymentCard"] = "PaymentCard";
    /**
     * アドオン
     */
    ProductType["Product"] = "Product";
})(ProductType = exports.ProductType || (exports.ProductType = {}));

},{}],71:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ProgramMembershipType;
(function (ProgramMembershipType) {
    ProgramMembershipType["ProgramMembership"] = "ProgramMembership";
})(ProgramMembershipType = exports.ProgramMembershipType || (exports.ProgramMembershipType = {}));

},{}],72:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],73:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],74:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],75:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],76:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Enumerated status values for Reservation.
 */
var ReservationStatusType;
(function (ReservationStatusType) {
    /**
     * The status for a previously confirmed reservation that is now cancelled.
     */
    ReservationStatusType["ReservationCancelled"] = "ReservationCancelled";
    /**
     * The status of a confirmed reservation.
     */
    ReservationStatusType["ReservationConfirmed"] = "ReservationConfirmed";
    /**
     * The status of a reservation on hold pending an update like credit card number or flight changes.
     */
    ReservationStatusType["ReservationHold"] = "ReservationHold";
    /**
     * The status of a reservation when a request has been sent, but not confirmed.
     */
    ReservationStatusType["ReservationPending"] = "ReservationPending";
})(ReservationStatusType || (ReservationStatusType = {}));
exports.default = ReservationStatusType;

},{}],77:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 予約タイプ
 */
var ReservationType;
(function (ReservationType) {
    ReservationType["EventReservation"] = "EventReservation";
    ReservationType["ReservationPackage"] = "ReservationPackage";
})(ReservationType || (ReservationType = {}));
exports.default = ReservationType;

},{}],78:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],79:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],80:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PaymentServiceType;
(function (PaymentServiceType) {
    PaymentServiceType["CreditCard"] = "CreditCard";
    PaymentServiceType["FaceToFace"] = "FaceToFace";
    PaymentServiceType["MovieTicket"] = "MovieTicket";
    PaymentServiceType["PaymentCard"] = "PaymentCard";
})(PaymentServiceType = exports.PaymentServiceType || (exports.PaymentServiceType = {}));

},{}],81:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Identifier;
(function (Identifier) {
    Identifier["COA"] = "COA";
    Identifier["Chevre"] = "Chevre";
})(Identifier = exports.Identifier || (exports.Identifier = {}));

},{}],82:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * ソートタイプ
 */
var SortType;
(function (SortType) {
    SortType[SortType["Ascending"] = 1] = "Ascending";
    SortType[SortType["Descending"] = -1] = "Descending";
})(SortType || (SortType = {}));
exports.default = SortType;

},{}],83:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],84:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * タスク名
 */
var TaskName;
(function (TaskName) {
    TaskName["Reserve"] = "reserve";
    TaskName["CancelReservation"] = "cancelReservation";
    TaskName["CancelPendingReservation"] = "cancelPendingReservation";
    TaskName["AggregateOnProject"] = "aggregateOnProject";
    TaskName["AggregateScreeningEvent"] = "aggregateScreeningEvent";
    TaskName["ImportEventCapacitiesFromCOA"] = "importEventCapacitiesFromCOA";
    TaskName["ImportEventsFromCOA"] = "importEventsFromCOA";
    TaskName["ImportOffersFromCOA"] = "importOffersFromCOA";
    TaskName["CancelMoneyTransfer"] = "cancelMoneyTransfer";
    TaskName["MoneyTransfer"] = "moneyTransfer";
    TaskName["Refund"] = "refund";
    TaskName["RegisterService"] = "registerService";
    TaskName["Pay"] = "pay";
    /**
     *  Eメールメッセージ送信
     */
    TaskName["SendEmailMessage"] = "sendEmailMessage";
    /**
     * ウェブフックをたたく
     */
    TaskName["TriggerWebhook"] = "triggerWebhook";
    TaskName["VoidPayment"] = "voidPayment";
})(TaskName || (TaskName = {}));
exports.default = TaskName;

},{}],85:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * タスクステータス
 */
var TaskStatus;
(function (TaskStatus) {
    /**
     * 準備OK
     */
    TaskStatus["Ready"] = "Ready";
    /**
     * 実行中
     */
    TaskStatus["Running"] = "Running";
    /**
     * 実行済
     */
    TaskStatus["Executed"] = "Executed";
    /**
     * 実行中止
     */
    TaskStatus["Aborted"] = "Aborted";
})(TaskStatus || (TaskStatus = {}));
exports.default = TaskStatus;

},{}],86:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],87:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],88:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],89:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],90:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],91:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],92:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],93:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],94:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],95:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],96:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],97:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],98:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],99:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],100:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],101:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],102:[function(require,module,exports){
"use strict";
/**
 * 取引ステータス
 */
Object.defineProperty(exports, "__esModule", { value: true });
var TransactionStatusType;
(function (TransactionStatusType) {
    TransactionStatusType["InProgress"] = "InProgress";
    TransactionStatusType["Canceled"] = "Canceled";
    TransactionStatusType["Confirmed"] = "Confirmed";
    TransactionStatusType["Expired"] = "Expired";
})(TransactionStatusType || (TransactionStatusType = {}));
exports.default = TransactionStatusType;

},{}],103:[function(require,module,exports){
"use strict";
/**
 * 取引タスクエクスポートステータス
 */
Object.defineProperty(exports, "__esModule", { value: true });
var TransactionTasksExportationStatus;
(function (TransactionTasksExportationStatus) {
    /**
     * 未エクスポート
     */
    TransactionTasksExportationStatus["Unexported"] = "Unexported";
    /**
     * エクスポート中
     */
    TransactionTasksExportationStatus["Exporting"] = "Exporting";
    /**
     * エクスポート済
     */
    TransactionTasksExportationStatus["Exported"] = "Exported";
})(TransactionTasksExportationStatus || (TransactionTasksExportationStatus = {}));
exports.default = TransactionTasksExportationStatus;

},{}],104:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 取引タイプ
 */
var TransactionType;
(function (TransactionType) {
    /**
     * 通貨転送
     */
    TransactionType["MoneyTransfer"] = "MoneyTransfer";
    /**
     * 予約
     */
    TransactionType["Reserve"] = "Reserve";
    /**
     * 予約キャンセル
     */
    TransactionType["CancelReservation"] = "CancelReservation";
    /**
     * 決済
     * PaymentMethod: PaymentCard,CreditCard...
     */
    TransactionType["Pay"] = "Pay";
    /**
     * 返金
     */
    TransactionType["Refund"] = "Refund";
    /**
     * サービス登録
     * Service: MembershipService,PaymentCard...
     */
    TransactionType["RegisterService"] = "RegisterService";
})(TransactionType || (TransactionType = {}));
exports.default = TransactionType;

},{}],105:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],106:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],107:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],108:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],109:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],110:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],111:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 単位符号
 */
var UnitCode;
(function (UnitCode) {
    /**
     * 年
     */
    UnitCode["Ann"] = "ANN";
    /**
     * no unit
     */
    UnitCode["C62"] = "C62";
    /**
     * 日
     */
    UnitCode["Day"] = "DAY";
    /**
     * 秒
     */
    UnitCode["Sec"] = "SEC";
})(UnitCode = exports.UnitCode || (exports.UnitCode = {}));

},{}],112:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CancelReservationActionFactory = require("./factory/action/cancel/reservation");
var CheckMovieTicketActionFactory = require("./factory/action/check/paymentMethod/movieTicket");
var UseReservationActionFactory = require("./factory/action/consume/use/reservation");
var InformActionFactory = require("./factory/action/interact/inform");
var RegisterProgramMembershipActionFactory = require("./factory/action/interact/register/programMembership");
var RegisterServiceActionFactory = require("./factory/action/interact/register/service");
var UnRegisterProgramMembershipActionFactory = require("./factory/action/interact/unRegister/programMembership");
var ReserveActionFactory = require("./factory/action/reserve");
var PayActionFactory = require("./factory/action/trade/pay");
var RefundActionFactory = require("./factory/action/trade/refund");
var MoneyTransferActionFactory = require("./factory/action/transfer/moneyTransfer");
var SendEmailMessageActionFactory = require("./factory/action/transfer/send/message/email");
var actionStatusType_1 = require("./factory/actionStatusType");
var actionType_1 = require("./factory/actionType");
var AccountTitleFactory = require("./factory/accountTitle");
var CategoryCodeFactory = require("./factory/categoryCode");
var ClientUserFactory = require("./factory/clientUser");
var EmailMessageFactory = require("./factory/creativeWork/message/email");
var MovieCreativeWorkFactory = require("./factory/creativeWork/movie");
var creativeWorkType_1 = require("./factory/creativeWorkType");
var EncodingFormat = require("./factory/encodingFormat");
var ScreeningEventFactory = require("./factory/event/screeningEvent");
var ScreeningEventSeriesFactory = require("./factory/event/screeningEventSeries");
var eventStatusType_1 = require("./factory/eventStatusType");
var eventType_1 = require("./factory/eventType");
var itemAvailability_1 = require("./factory/itemAvailability");
var LanguageFactory = require("./factory/language");
var MerchantReturnPolicyFactory = require("./factory/merchantReturnPolicy");
var MonetaryAmountFactory = require("./factory/monetaryAmount");
var OfferFactory = require("./factory/offer");
var OfferCatalogFactory = require("./factory/offerCatalog");
var offerType_1 = require("./factory/offerType");
var OrganizationFactory = require("./factory/organization");
var organizationType_1 = require("./factory/organizationType");
var CreditCardFactory = require("./factory/paymentMethod/paymentCard/creditCard");
var MovieTicketFactory = require("./factory/paymentMethod/paymentCard/movieTicket");
var paymentMethodType_1 = require("./factory/paymentMethodType");
var PermitFactory = require("./factory/permit");
var MovieTheaterPlaceFactory = require("./factory/place/movieTheater");
var ScreeningRoomPlaceFactory = require("./factory/place/screeningRoom");
var ScreeningRoomSectionPlaceFactory = require("./factory/place/screeningRoomSection");
var SeatPlaceFactory = require("./factory/place/seat");
var placeType_1 = require("./factory/placeType");
var priceCurrency_1 = require("./factory/priceCurrency");
var priceSpecificationType_1 = require("./factory/priceSpecificationType");
var ProductFactory = require("./factory/product");
var ProgramMembershipFactory = require("./factory/programMembership");
var project = require("./factory/project");
var PropertyValueFactory = require("./factory/propertyValue");
var QualitativeValueFactory = require("./factory/qualitativeValue");
var QuantitativeValueFactory = require("./factory/quantitativeValue");
var reservationStatusType_1 = require("./factory/reservationStatusType");
var reservationType_1 = require("./factory/reservationType");
var SellerFactory = require("./factory/seller");
var PaymentServiceFactory = require("./factory/service/paymentService");
var WebAPIServiceFactory = require("./factory/service/webAPI");
var ServiceTypeFactory = require("./factory/serviceType");
var sortType_1 = require("./factory/sortType");
var unitCode_1 = require("./factory/unitCode");
var AggregateOnProjectTaskFactory = require("./factory/task/aggregateOnProject");
var AggregateScreeningEventTaskFactory = require("./factory/task/aggregateScreeningEvent");
var CancelMoneyTransferTaskFactory = require("./factory/task/cancelMoneyTransfer");
var CancelPendingReservationTaskFactory = require("./factory/task/cancelPendingReservation");
var CancelReservationTaskFactory = require("./factory/task/cancelReservation");
var ImportEventCapacitiesFromCOATaskFactory = require("./factory/task/importEventCapacitiesFromCOA");
var ImportEventsFromCOATaskFactory = require("./factory/task/importEventsFromCOA");
var ImportOffersFromCOATaskFactory = require("./factory/task/importOffersFromCOA");
var MoneyTransferTaskFactory = require("./factory/task/moneyTransfer");
var PayTaskFactory = require("./factory/task/pay");
var RefundTaskFactory = require("./factory/task/refund");
var RegisterServiceTaskFactory = require("./factory/task/registerService");
var ReserveTaskFactory = require("./factory/task/reserve");
var SendEmailMessageTaskFactory = require("./factory/task/sendEmailMessage");
var TriggerWebhookTaskFactory = require("./factory/task/triggerWebhook");
var VoidPaymentTaskFactory = require("./factory/task/voidPayment");
var TaskExecutionResultFactory = require("./factory/taskExecutionResult");
var taskName_1 = require("./factory/taskName");
var taskStatus_1 = require("./factory/taskStatus");
var CancelReservationTransactionFactory = require("./factory/transaction/cancelReservation");
var MoneyTransferTransactionFactory = require("./factory/transaction/moneyTransfer");
var PayTransactionFactory = require("./factory/transaction/pay");
var RefundTransactionFactory = require("./factory/transaction/refund");
var RegisterServiceTransactionFactory = require("./factory/transaction/registerService");
var ReserveTransactionFactory = require("./factory/transaction/reserve");
var transactionStatusType_1 = require("./factory/transactionStatusType");
var transactionTasksExportationStatus_1 = require("./factory/transactionTasksExportationStatus");
var transactionType_1 = require("./factory/transactionType");
var errorCode_1 = require("./factory/errorCode");
var errors = require("./factory/errors");
exports.errors = errors;
exports.errorCode = errorCode_1.default;
exports.actionStatusType = actionStatusType_1.default;
exports.actionType = actionType_1.default;
var action;
(function (action) {
    var authorize;
    (function (authorize) {
    })(authorize = action.authorize || (action.authorize = {}));
    var cancel;
    (function (cancel) {
        // tslint:disable-next-line:no-shadowed-variable
        cancel.reservation = CancelReservationActionFactory;
    })(cancel = action.cancel || (action.cancel = {}));
    var check;
    (function (check) {
        // tslint:disable-next-line:no-shadowed-variable
        var paymentMethod;
        (function (paymentMethod) {
            paymentMethod.movieTicket = CheckMovieTicketActionFactory;
        })(paymentMethod = check.paymentMethod || (check.paymentMethod = {}));
    })(check = action.check || (action.check = {}));
    var interact;
    (function (interact) {
        interact.inform = InformActionFactory;
        var register;
        (function (register) {
            // tslint:disable-next-line:no-shadowed-variable
            register.programMembership = RegisterProgramMembershipActionFactory;
            // tslint:disable-next-line:no-shadowed-variable
            register.service = RegisterServiceActionFactory;
        })(register = interact.register || (interact.register = {}));
        var unRegister;
        (function (unRegister) {
            // tslint:disable-next-line:no-shadowed-variable
            unRegister.programMembership = UnRegisterProgramMembershipActionFactory;
        })(unRegister = interact.unRegister || (interact.unRegister = {}));
    })(interact = action.interact || (action.interact = {}));
    var trade;
    (function (trade) {
        trade.pay = PayActionFactory;
        trade.refund = RefundActionFactory;
    })(trade = action.trade || (action.trade = {}));
    var transfer;
    (function (transfer) {
        transfer.moneyTransfer = MoneyTransferActionFactory;
        var send;
        (function (send) {
            var message;
            (function (message) {
                message.email = SendEmailMessageActionFactory;
            })(message = send.message || (send.message = {}));
        })(send = transfer.send || (transfer.send = {}));
    })(transfer = action.transfer || (action.transfer = {}));
    var consume;
    (function (consume) {
        var use;
        (function (use) {
            // tslint:disable-next-line:no-shadowed-variable
            use.reservation = UseReservationActionFactory;
        })(use = consume.use || (consume.use = {}));
    })(consume = action.consume || (action.consume = {}));
    action.reserve = ReserveActionFactory;
})(action = exports.action || (exports.action = {}));
exports.accountTitle = AccountTitleFactory;
exports.categoryCode = CategoryCodeFactory;
exports.clientUser = ClientUserFactory;
var creativeWork;
(function (creativeWork) {
    var message;
    (function (message) {
        message.email = EmailMessageFactory;
    })(message = creativeWork.message || (creativeWork.message = {}));
    creativeWork.movie = MovieCreativeWorkFactory;
})(creativeWork = exports.creativeWork || (exports.creativeWork = {}));
exports.creativeWorkType = creativeWorkType_1.default;
var event;
(function (event) {
    event.screeningEvent = ScreeningEventFactory;
    event.screeningEventSeries = ScreeningEventSeriesFactory;
})(event = exports.event || (exports.event = {}));
exports.encodingFormat = EncodingFormat;
exports.eventStatusType = eventStatusType_1.default;
exports.eventType = eventType_1.default;
exports.itemAvailability = itemAvailability_1.default;
exports.language = LanguageFactory;
exports.merchantReturnPolicy = MerchantReturnPolicyFactory;
exports.monetaryAmount = MonetaryAmountFactory;
exports.offer = OfferFactory;
exports.offerCatalog = OfferCatalogFactory;
exports.offerType = offerType_1.default;
exports.organization = OrganizationFactory;
exports.organizationType = organizationType_1.OrganizationType;
exports.paymentMethodType = paymentMethodType_1.PaymentMethodType;
var paymentMethod;
(function (paymentMethod) {
    var paymentCard;
    (function (paymentCard) {
        paymentCard.creditCard = CreditCardFactory;
        paymentCard.movieTicket = MovieTicketFactory;
    })(paymentCard = paymentMethod.paymentCard || (paymentMethod.paymentCard = {}));
})(paymentMethod = exports.paymentMethod || (exports.paymentMethod = {}));
exports.permit = PermitFactory;
exports.priceCurrency = priceCurrency_1.default;
var place;
(function (place) {
    place.movieTheater = MovieTheaterPlaceFactory;
    place.screeningRoom = ScreeningRoomPlaceFactory;
    place.screeningRoomSection = ScreeningRoomSectionPlaceFactory;
    place.seat = SeatPlaceFactory;
})(place = exports.place || (exports.place = {}));
exports.placeType = placeType_1.PlaceType;
var priceSpecification;
(function (priceSpecification) {
})(priceSpecification = exports.priceSpecification || (exports.priceSpecification = {}));
exports.priceSpecificationType = priceSpecificationType_1.default;
exports.programMembership = ProgramMembershipFactory;
exports.product = ProductFactory;
exports.project = project;
exports.propertyValue = PropertyValueFactory;
exports.qualitativeValue = QualitativeValueFactory;
exports.quantitativeValue = QuantitativeValueFactory;
exports.reservationStatusType = reservationStatusType_1.default;
exports.reservationType = reservationType_1.default;
exports.seller = SellerFactory;
var task;
(function (task) {
    task.aggregateOnProject = AggregateOnProjectTaskFactory;
    task.aggregateScreeningEvent = AggregateScreeningEventTaskFactory;
    task.cancelMoneyTransfer = CancelMoneyTransferTaskFactory;
    task.cancelPendingReservation = CancelPendingReservationTaskFactory;
    task.cancelReservation = CancelReservationTaskFactory;
    task.importEventCapacitiesFromCOA = ImportEventCapacitiesFromCOATaskFactory;
    task.importEventsFromCOA = ImportEventsFromCOATaskFactory;
    task.importOffersFromCOA = ImportOffersFromCOATaskFactory;
    task.moneyTransfer = MoneyTransferTaskFactory;
    task.pay = PayTaskFactory;
    task.refund = RefundTaskFactory;
    task.registerService = RegisterServiceTaskFactory;
    task.reserve = ReserveTaskFactory;
    task.sendEmailMessage = SendEmailMessageTaskFactory;
    task.triggerWebhook = TriggerWebhookTaskFactory;
    task.voidPayment = VoidPaymentTaskFactory;
})(task = exports.task || (exports.task = {}));
var service;
(function (service) {
    service.paymentService = PaymentServiceFactory;
    service.webAPI = WebAPIServiceFactory;
})(service = exports.service || (exports.service = {}));
exports.serviceType = ServiceTypeFactory;
exports.sortType = sortType_1.default;
exports.taskExecutionResult = TaskExecutionResultFactory;
exports.taskName = taskName_1.default;
exports.taskStatus = taskStatus_1.default;
var transaction;
(function (transaction) {
    transaction.cancelReservation = CancelReservationTransactionFactory;
    transaction.moneyTransfer = MoneyTransferTransactionFactory;
    transaction.pay = PayTransactionFactory;
    transaction.refund = RefundTransactionFactory;
    transaction.registerService = RegisterServiceTransactionFactory;
    transaction.reserve = ReserveTransactionFactory;
})(transaction = exports.transaction || (exports.transaction = {}));
exports.transactionStatusType = transactionStatusType_1.default;
exports.transactionTasksExportationStatus = transactionTasksExportationStatus_1.default;
exports.transactionType = transactionType_1.default;
exports.unitCode = unitCode_1.UnitCode;

},{"./factory/accountTitle":13,"./factory/action/cancel/reservation":16,"./factory/action/check/paymentMethod/movieTicket":17,"./factory/action/consume/use/reservation":18,"./factory/action/interact/inform":19,"./factory/action/interact/register/programMembership":20,"./factory/action/interact/register/service":21,"./factory/action/interact/unRegister/programMembership":22,"./factory/action/reserve":23,"./factory/action/trade/pay":24,"./factory/action/trade/refund":25,"./factory/action/transfer/moneyTransfer":26,"./factory/action/transfer/send/message/email":27,"./factory/actionStatusType":14,"./factory/actionType":15,"./factory/categoryCode":28,"./factory/clientUser":29,"./factory/creativeWork/message/email":31,"./factory/creativeWork/movie":32,"./factory/creativeWorkType":30,"./factory/encodingFormat":33,"./factory/errorCode":34,"./factory/errors":45,"./factory/event/screeningEvent":48,"./factory/event/screeningEventSeries":49,"./factory/eventStatusType":46,"./factory/eventType":47,"./factory/itemAvailability":50,"./factory/language":51,"./factory/merchantReturnPolicy":52,"./factory/monetaryAmount":53,"./factory/offer":54,"./factory/offerCatalog":55,"./factory/offerType":56,"./factory/organization":57,"./factory/organizationType":58,"./factory/paymentMethod/paymentCard/creditCard":60,"./factory/paymentMethod/paymentCard/movieTicket":61,"./factory/paymentMethodType":59,"./factory/permit":62,"./factory/place/movieTheater":64,"./factory/place/screeningRoom":65,"./factory/place/screeningRoomSection":66,"./factory/place/seat":67,"./factory/placeType":63,"./factory/priceCurrency":68,"./factory/priceSpecificationType":69,"./factory/product":70,"./factory/programMembership":71,"./factory/project":72,"./factory/propertyValue":73,"./factory/qualitativeValue":74,"./factory/quantitativeValue":75,"./factory/reservationStatusType":76,"./factory/reservationType":77,"./factory/seller":78,"./factory/service/paymentService":80,"./factory/service/webAPI":81,"./factory/serviceType":79,"./factory/sortType":82,"./factory/task/aggregateOnProject":86,"./factory/task/aggregateScreeningEvent":87,"./factory/task/cancelMoneyTransfer":88,"./factory/task/cancelPendingReservation":89,"./factory/task/cancelReservation":90,"./factory/task/importEventCapacitiesFromCOA":91,"./factory/task/importEventsFromCOA":92,"./factory/task/importOffersFromCOA":93,"./factory/task/moneyTransfer":94,"./factory/task/pay":95,"./factory/task/refund":96,"./factory/task/registerService":97,"./factory/task/reserve":98,"./factory/task/sendEmailMessage":99,"./factory/task/triggerWebhook":100,"./factory/task/voidPayment":101,"./factory/taskExecutionResult":83,"./factory/taskName":84,"./factory/taskStatus":85,"./factory/transaction/cancelReservation":105,"./factory/transaction/moneyTransfer":106,"./factory/transaction/pay":107,"./factory/transaction/refund":108,"./factory/transaction/registerService":109,"./factory/transaction/reserve":110,"./factory/transactionStatusType":102,"./factory/transactionTasksExportationStatus":103,"./factory/transactionType":104,"./factory/unitCode":111}],113:[function(require,module,exports){
"use strict";
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
exports.StubAuthClient = exports.AuthClient = void 0;
var transporters_1 = require("../transporters");
/**
 * 抽象認証クライアント
 */
var AuthClient = /** @class */ (function () {
    function AuthClient() {
    }
    return AuthClient;
}());
exports.AuthClient = AuthClient;
/**
 * テスト認証クライアント
 */
// tslint:disable-next-line:no-single-line-block-comment
/* istanbul ignore next */
var StubAuthClient = /** @class */ (function () {
    function StubAuthClient() {
    }
    // tslint:disable-next-line:prefer-function-over-method
    StubAuthClient.prototype.fetch = function (url, options, expectedStatusCodes) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (new transporters_1.DefaultTransporter(expectedStatusCodes)).fetch(url, options)];
            });
        });
    };
    // tslint:disable-next-line:prefer-function-over-method
    StubAuthClient.prototype.getAccessToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, 'access_token'];
            });
        });
    };
    return StubAuthClient;
}());
exports.StubAuthClient = StubAuthClient;

},{"../transporters":147}],114:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * factory
 */
__exportStar(require("@cinerino/factory"), exports);

},{"@cinerino/factory":222}],115:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.service = exports.auth = exports.Auth = exports.transporters = exports.factory = void 0;
// tslint:disable:max-classes-per-file
/**
 * API Service Library for Javascript
 */
var factory = require("./factory");
var ServiceFactory = require("./service");
var authClient_1 = require("./auth/authClient");
var account_1 = require("./service/account");
var action_1 = require("./service/action");
var authorization_1 = require("./service/authorization");
var categoryCode_1 = require("./service/categoryCode");
var creativeWork_1 = require("./service/creativeWork");
var delivery_1 = require("./service/delivery");
var event_1 = require("./service/event");
var iam_1 = require("./service/iam");
var invoice_1 = require("./service/invoice");
var offer_1 = require("./service/offer");
var order_1 = require("./service/order");
var ownershipInfo_1 = require("./service/ownershipInfo");
var payment_1 = require("./service/payment");
var paymentMethod_1 = require("./service/paymentMethod");
var person_1 = require("./service/person");
var ownershipInfo_2 = require("./service/person/ownershipInfo");
var place_1 = require("./service/place");
var product_1 = require("./service/product");
var project_1 = require("./service/project");
var reservation_1 = require("./service/reservation");
var seller_1 = require("./service/seller");
var serviceOutput_1 = require("./service/serviceOutput");
var task_1 = require("./service/task");
var token_1 = require("./service/token");
var moneyTransfer_1 = require("./service/transaction/moneyTransfer");
var placeOrder_1 = require("./service/transaction/placeOrder");
var placeOrder4sskts_1 = require("./service/transaction/placeOrder4sskts");
var placeOrder4ttts_1 = require("./service/transaction/placeOrder4ttts");
var returnOrder_1 = require("./service/transaction/returnOrder");
var userPool_1 = require("./service/userPool");
var transporters = require("./transporters");
exports.factory = factory;
exports.transporters = transporters;
/**
 * 認証クライアント抽象クラス
 */
var Auth = /** @class */ (function (_super) {
    __extends(Auth, _super);
    function Auth() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Auth;
}(authClient_1.AuthClient));
exports.Auth = Auth;
var auth;
(function (auth) {
    /**
     * 抽象認証クライアント
     */
    // tslint:disable-next-line:no-shadowed-variable
    var Auth = /** @class */ (function (_super) {
        __extends(Auth, _super);
        function Auth() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Auth;
    }(authClient_1.AuthClient));
    auth.Auth = Auth;
    /**
     * スタブ認証クライアント
     */
    var StubAuth = /** @class */ (function (_super) {
        __extends(StubAuth, _super);
        function StubAuth() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return StubAuth;
    }(authClient_1.StubAuthClient));
    auth.StubAuth = StubAuth;
})(auth = exports.auth || (exports.auth = {}));
/**
 * サービスモジュール
 */
var service;
(function (service) {
    /**
     * Baseサービス
     */
    var Service = /** @class */ (function (_super) {
        __extends(Service, _super);
        function Service() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Service;
    }(ServiceFactory.Service));
    service.Service = Service;
    /**
     * 口座サービス
     */
    var Account = /** @class */ (function (_super) {
        __extends(Account, _super);
        function Account() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Account;
    }(account_1.AccountService));
    service.Account = Account;
    /**
     * アクションサービス
     */
    var Action = /** @class */ (function (_super) {
        __extends(Action, _super);
        function Action() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Action;
    }(action_1.ActionService));
    service.Action = Action;
    /**
     * 認可サービス
     */
    var Authorization = /** @class */ (function (_super) {
        __extends(Authorization, _super);
        function Authorization() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Authorization;
    }(authorization_1.AuthorizationService));
    service.Authorization = Authorization;
    /**
     * カテゴリーコードサービス
     */
    var CategoryCode = /** @class */ (function (_super) {
        __extends(CategoryCode, _super);
        function CategoryCode() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return CategoryCode;
    }(categoryCode_1.CategoryCodeService));
    service.CategoryCode = CategoryCode;
    /**
     * 作品サービス
     */
    var CreativeWork = /** @class */ (function (_super) {
        __extends(CreativeWork, _super);
        function CreativeWork() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return CreativeWork;
    }(creativeWork_1.CreativeWorkService));
    service.CreativeWork = CreativeWork;
    /**
     * 配送サービス
     */
    var Delivery = /** @class */ (function (_super) {
        __extends(Delivery, _super);
        function Delivery() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Delivery;
    }(delivery_1.DeliveryService));
    service.Delivery = Delivery;
    /**
     * イベントサービス
     */
    var Event = /** @class */ (function (_super) {
        __extends(Event, _super);
        function Event() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Event;
    }(event_1.EventService));
    service.Event = Event;
    /**
     * IAMサービス
     */
    var IAM = /** @class */ (function (_super) {
        __extends(IAM, _super);
        function IAM() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return IAM;
    }(iam_1.IAMService));
    service.IAM = IAM;
    /**
     * インボイスサービス
     */
    var Invoice = /** @class */ (function (_super) {
        __extends(Invoice, _super);
        function Invoice() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Invoice;
    }(invoice_1.InvoiceService));
    service.Invoice = Invoice;
    /**
     * オファーサービス
     */
    var Offer = /** @class */ (function (_super) {
        __extends(Offer, _super);
        function Offer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Offer;
    }(offer_1.OfferService));
    service.Offer = Offer;
    /**
     * 注文サービス
     */
    var Order = /** @class */ (function (_super) {
        __extends(Order, _super);
        function Order() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Order;
    }(order_1.OrderService));
    service.Order = Order;
    /**
     * 所有権サービス
     */
    var OwnershipInfo = /** @class */ (function (_super) {
        __extends(OwnershipInfo, _super);
        function OwnershipInfo() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return OwnershipInfo;
    }(ownershipInfo_1.OwnershipInfoService));
    service.OwnershipInfo = OwnershipInfo;
    /**
     * 決済サービス
     */
    var Payment = /** @class */ (function (_super) {
        __extends(Payment, _super);
        function Payment() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Payment;
    }(payment_1.PaymentService));
    service.Payment = Payment;
    /**
     * 決済方法サービス
     */
    var PaymentMethod = /** @class */ (function (_super) {
        __extends(PaymentMethod, _super);
        function PaymentMethod() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return PaymentMethod;
    }(paymentMethod_1.PaymentMethodService));
    service.PaymentMethod = PaymentMethod;
    /**
     * ユーザーサービス
     */
    var Person = /** @class */ (function (_super) {
        __extends(Person, _super);
        function Person() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Person;
    }(person_1.PersonService));
    service.Person = Person;
    var person;
    (function (person) {
        /**
         * ユーザー所有権サービス
         */
        // tslint:disable-next-line:no-shadowed-variable
        var OwnershipInfo = /** @class */ (function (_super) {
            __extends(OwnershipInfo, _super);
            function OwnershipInfo() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return OwnershipInfo;
        }(ownershipInfo_2.PersonOwnershipInfoService));
        person.OwnershipInfo = OwnershipInfo;
    })(person = service.person || (service.person = {}));
    /**
     * 場所サービス
     */
    var Place = /** @class */ (function (_super) {
        __extends(Place, _super);
        function Place() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Place;
    }(place_1.PlaceService));
    service.Place = Place;
    /**
     * プロダクトサービス
     */
    var Product = /** @class */ (function (_super) {
        __extends(Product, _super);
        function Product() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Product;
    }(product_1.ProductService));
    service.Product = Product;
    /**
     * プロジェクトサービス
     */
    var Project = /** @class */ (function (_super) {
        __extends(Project, _super);
        function Project() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Project;
    }(project_1.ProjectService));
    service.Project = Project;
    /**
     * 予約サービス
     */
    var Reservation = /** @class */ (function (_super) {
        __extends(Reservation, _super);
        function Reservation() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Reservation;
    }(reservation_1.ReservationService));
    service.Reservation = Reservation;
    /**
     * 販売者サービス
     */
    var Seller = /** @class */ (function (_super) {
        __extends(Seller, _super);
        function Seller() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Seller;
    }(seller_1.SellerService));
    service.Seller = Seller;
    /**
     * サービスアウトプットサービス
     */
    var ServiceOutput = /** @class */ (function (_super) {
        __extends(ServiceOutput, _super);
        function ServiceOutput() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ServiceOutput;
    }(serviceOutput_1.ServiceOutputService));
    service.ServiceOutput = ServiceOutput;
    /**
     * タスクサービス
     */
    var Task = /** @class */ (function (_super) {
        __extends(Task, _super);
        function Task() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Task;
    }(task_1.TaskService));
    service.Task = Task;
    /**
     * トークンサービス
     */
    var Token = /** @class */ (function (_super) {
        __extends(Token, _super);
        function Token() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Token;
    }(token_1.TokenService));
    service.Token = Token;
    /**
     * 取引サービス
     */
    var transaction;
    (function (transaction) {
        /**
         * 通貨転送取引サービス
         */
        var MoneyTransfer = /** @class */ (function (_super) {
            __extends(MoneyTransfer, _super);
            function MoneyTransfer() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return MoneyTransfer;
        }(moneyTransfer_1.MoneyTransferTransactionService));
        transaction.MoneyTransfer = MoneyTransfer;
        /**
         * 注文取引サービス
         */
        var PlaceOrder = /** @class */ (function (_super) {
            __extends(PlaceOrder, _super);
            function PlaceOrder() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return PlaceOrder;
        }(placeOrder_1.PlaceOrderTransactionService));
        transaction.PlaceOrder = PlaceOrder;
        /**
         * sskts専用注文取引サービス
         */
        var PlaceOrder4sskts = /** @class */ (function (_super) {
            __extends(PlaceOrder4sskts, _super);
            function PlaceOrder4sskts() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return PlaceOrder4sskts;
        }(placeOrder4sskts_1.PlaceOrderTransaction4ssktsService));
        transaction.PlaceOrder4sskts = PlaceOrder4sskts;
        /**
         * ttts専用注文取引サービス
         */
        var PlaceOrder4ttts = /** @class */ (function (_super) {
            __extends(PlaceOrder4ttts, _super);
            function PlaceOrder4ttts() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return PlaceOrder4ttts;
        }(placeOrder4ttts_1.PlaceOrderTransaction4tttsService));
        transaction.PlaceOrder4ttts = PlaceOrder4ttts;
        /**
         * 注文返品取引サービス
         */
        var ReturnOrder = /** @class */ (function (_super) {
            __extends(ReturnOrder, _super);
            function ReturnOrder() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return ReturnOrder;
        }(returnOrder_1.ReturnOrderTransactionService));
        transaction.ReturnOrder = ReturnOrder;
    })(transaction = service.transaction || (service.transaction = {}));
    /**
     * 取引サービス
     * @alias service.transaction
     */
    service.txn = transaction;
    /**
     * Cognitoユーザープールサービス
     */
    var UserPool = /** @class */ (function (_super) {
        __extends(UserPool, _super);
        function UserPool() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return UserPool;
    }(userPool_1.UserPoolService));
    service.UserPool = UserPool;
})(service = exports.service || (exports.service = {}));

},{"./auth/authClient":113,"./factory":114,"./service":116,"./service/account":117,"./service/action":118,"./service/authorization":119,"./service/categoryCode":120,"./service/creativeWork":121,"./service/delivery":122,"./service/event":123,"./service/iam":124,"./service/invoice":125,"./service/offer":126,"./service/order":127,"./service/ownershipInfo":128,"./service/payment":129,"./service/paymentMethod":130,"./service/person":131,"./service/person/ownershipInfo":132,"./service/place":133,"./service/product":134,"./service/project":135,"./service/reservation":136,"./service/seller":137,"./service/serviceOutput":138,"./service/task":139,"./service/token":140,"./service/transaction/moneyTransfer":141,"./service/transaction/placeOrder":142,"./service/transaction/placeOrder4sskts":143,"./service/transaction/placeOrder4ttts":144,"./service/transaction/returnOrder":145,"./service/userPool":146,"./transporters":147}],116:[function(require,module,exports){
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
exports.Service = void 0;
var qs = require("qs");
var transporters_1 = require("./transporters");
/**
 * base service class
 */
var Service = /** @class */ (function () {
    function Service(options) {
        this.options = options;
    }
    /**
     * Create and send request to API
     */
    Service.prototype.fetch = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var defaultOptions, baseUrl, url, querystrings, headers, fetchOptions, transporter;
            return __generator(this, function (_a) {
                defaultOptions = {
                    headers: {},
                    method: 'GET'
                };
                // tslint:disable-next-line:no-parameter-reassignment
                options = __assign(__assign({}, defaultOptions), options);
                baseUrl = this.options.endpoint;
                // tslint:disable-next-line:no-single-line-block-comment
                /* istanbul ignore else */
                if (this.options.project !== undefined
                    && this.options.project !== null
                    && typeof this.options.project.id === 'string'
                    && this.options.project.id.length > 0) {
                    baseUrl = baseUrl + "/projects/" + this.options.project.id;
                }
                url = "" + baseUrl + options.uri;
                querystrings = qs.stringify(options.qs);
                url += (querystrings.length > 0) ? "?" + querystrings : '';
                headers = __assign({
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }, options.headers);
                fetchOptions = {
                    method: options.method,
                    headers: headers,
                    body: JSON.stringify(options.body)
                };
                // create request (using authClient or otherwise and return request obj)
                if (this.options.auth !== undefined) {
                    return [2 /*return*/, this.options.auth.fetch(url, fetchOptions, options.expectedStatusCodes)];
                }
                else {
                    transporter = (this.options.transporter !== undefined) ? this.options.transporter : new transporters_1.DefaultTransporter(options.expectedStatusCodes);
                    return [2 /*return*/, transporter.fetch(url, fetchOptions)];
                }
                return [2 /*return*/];
            });
        });
    };
    return Service;
}());
exports.Service = Service;

},{"./transporters":147,"qs":149}],117:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.AccountService = void 0;
var http_status_1 = require("http-status");
var service_1 = require("../service");
/**
 * 口座サービス
 */
var AccountService = /** @class */ (function (_super) {
    __extends(AccountService, _super);
    function AccountService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 注文トークンを使用して口座開設
     */
    AccountService.prototype.openByToken = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: '/accounts/openByToken',
                            method: 'POST',
                            body: params,
                            expectedStatusCodes: [http_status_1.NO_CONTENT]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * ポイントを入金する(sskts専用)
     */
    AccountService.prototype.deposit4sskts = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: '/accounts/transactions/deposit',
                            method: 'POST',
                            body: params,
                            expectedStatusCodes: [http_status_1.NO_CONTENT]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return AccountService;
}(service_1.Service));
exports.AccountService = AccountService;

},{"../service":116,"http-status":287}],118:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.ActionService = void 0;
var http_status_1 = require("http-status");
var service_1 = require("../service");
/**
 * アクションサービス
 */
var ActionService = /** @class */ (function (_super) {
    __extends(ActionService, _super);
    function ActionService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * アクション検索
     */
    ActionService.prototype.search = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/actions',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {};
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * チケット印刷(sskts専用)
     */
    ActionService.prototype.printTicket = function (
    /**
     * チケットオブジェクト
     */
    params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/actions/print/ticket',
                        method: 'POST',
                        body: params,
                        expectedStatusCodes: [http_status_1.CREATED]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * チケット印刷アクション検索
     */
    ActionService.prototype.searchPrintTicket = function (
    /**
     * 検索条件(sskts専用)
     */
    params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/actions/print/ticket',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    return ActionService;
}(service_1.Service));
exports.ActionService = ActionService;

},{"../service":116,"http-status":287}],119:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.AuthorizationService = void 0;
var http_status_1 = require("http-status");
var service_1 = require("../service");
/**
 * 認可サービス
 */
var AuthorizationService = /** @class */ (function (_super) {
    __extends(AuthorizationService, _super);
    function AuthorizationService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 認可検索
     */
    AuthorizationService.prototype.search = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/authorizations',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {};
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    return AuthorizationService;
}(service_1.Service));
exports.AuthorizationService = AuthorizationService;

},{"../service":116,"http-status":287}],120:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.CategoryCodeService = void 0;
var http_status_1 = require("http-status");
var service_1 = require("../service");
/**
 * カテゴリーコードサービス
 */
var CategoryCodeService = /** @class */ (function (_super) {
    __extends(CategoryCodeService, _super);
    function CategoryCodeService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 検索
     */
    CategoryCodeService.prototype.search = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/categoryCodes',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {};
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    return CategoryCodeService;
}(service_1.Service));
exports.CategoryCodeService = CategoryCodeService;

},{"../service":116,"http-status":287}],121:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.CreativeWorkService = void 0;
var http_status_1 = require("http-status");
var service_1 = require("../service");
/**
 * 作品サービス
 */
var CreativeWorkService = /** @class */ (function (_super) {
    __extends(CreativeWorkService, _super);
    function CreativeWorkService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 映画作品検索
     */
    CreativeWorkService.prototype.searchMovies = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/creativeWorks/movie',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {};
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    return CreativeWorkService;
}(service_1.Service));
exports.CreativeWorkService = CreativeWorkService;

},{"../service":116,"http-status":287}],122:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.DeliveryService = void 0;
var http_status_1 = require("http-status");
var service_1 = require("../service");
/**
 * 配送サービス
 */
var DeliveryService = /** @class */ (function (_super) {
    __extends(DeliveryService, _super);
    function DeliveryService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 注文を配送する
     * 作成された注文データに対して、同期的に注文を配送します(所有権が作成されます)
     * すでに配送済の場合、何もしません。
     */
    DeliveryService.prototype.sendOrder = function (params) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/orders/" + ((_a = params.object) === null || _a === void 0 ? void 0 : _a.orderNumber) + "/deliver",
                            method: 'POST',
                            body: params,
                            expectedStatusCodes: [http_status_1.NO_CONTENT]
                        })];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return DeliveryService;
}(service_1.Service));
exports.DeliveryService = DeliveryService;

},{"../service":116,"http-status":287}],123:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.EventService = void 0;
var http_status_1 = require("http-status");
var service_1 = require("../service");
/**
 * イベントサービス
 */
var EventService = /** @class */ (function (_super) {
    __extends(EventService, _super);
    function EventService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * イベント検索
     */
    EventService.prototype.search = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/events',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {};
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * イベント取得
     */
    EventService.prototype.findById = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/events/" + params.id,
                        method: 'GET',
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * イベント更新
     */
    EventService.prototype.updatePartially = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/events/" + params.id,
                            method: 'PATCH',
                            body: params,
                            expectedStatusCodes: [http_status_1.NO_CONTENT]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * イベントに対する座席オファー検索
     * @deprecated Use searchSeats
     */
    EventService.prototype.searchOffers = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/events/" + params.event.id + "/offers",
                        method: 'GET',
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * イベントに対する座席検索
     */
    EventService.prototype.searchSeats = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/events/" + params.event.id + "/seats",
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {};
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * イベントに対する券種オファー検索
     */
    EventService.prototype.searchTicketOffers = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/events/" + params.event.id + "/offers/ticket",
                        method: 'GET',
                        expectedStatusCodes: [http_status_1.OK],
                        qs: params
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * イベントに対する券種オファー検索(COA券種)
     */
    EventService.prototype.searchTicketOffers4COA = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/events/" + params.event.id + "/offers/ticket",
                        method: 'GET',
                        expectedStatusCodes: [http_status_1.OK],
                        qs: params
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    return EventService;
}(service_1.Service));
exports.EventService = EventService;

},{"../service":116,"http-status":287}],124:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.IAMService = exports.RoleType = void 0;
var http_status_1 = require("http-status");
var service_1 = require("../service");
var RoleType;
(function (RoleType) {
    RoleType["OrganizationRole"] = "OrganizationRole";
})(RoleType = exports.RoleType || (exports.RoleType = {}));
/**
 * IAMサービス
 */
var IAMService = /** @class */ (function (_super) {
    __extends(IAMService, _super);
    function IAMService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * ユーザー検索
     */
    IAMService.prototype.searchUsers = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/iam/users',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {};
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * ユーザー取得
     */
    IAMService.prototype.findUserById = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/iam/users/" + params.id,
                        method: 'GET',
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * プロフィール検索
     */
    IAMService.prototype.getUserProfile = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/iam/users/" + params.id + "/profile",
                        method: 'GET',
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * プロフィール更新
     */
    IAMService.prototype.updateUserProfile = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/iam/users/" + params.id + "/profile",
                            method: 'PATCH',
                            body: params,
                            expectedStatusCodes: [http_status_1.NO_CONTENT]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * IAMロール検索
     */
    IAMService.prototype.searchRoles = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/iam/roles',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {};
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * IAMメンバー作成
     */
    IAMService.prototype.createMember = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/iam/members',
                        method: 'POST',
                        body: params,
                        expectedStatusCodes: [http_status_1.CREATED]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * IAMメンバー検索
     */
    IAMService.prototype.searchMembers = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/iam/members',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {};
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * IAMメンバー取得
     */
    IAMService.prototype.findMemberById = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/iam/members/" + params.member.id,
                        method: 'GET',
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * IAMメンバー更新
     */
    IAMService.prototype.updateMember = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/iam/members/" + params.member.id,
                            method: 'PUT',
                            body: params,
                            expectedStatusCodes: [http_status_1.NO_CONTENT]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * IAMメンバー削除
     */
    IAMService.prototype.deleteMember = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/iam/members/" + params.member.id,
                            method: 'DELETE',
                            expectedStatusCodes: [http_status_1.NO_CONTENT]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * IAMメンバープロフィール検索
     */
    IAMService.prototype.getMemberProfile = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/iam/members/" + params.member.id + "/profile",
                        method: 'GET',
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * IAMメンバープロフィール更新
     */
    IAMService.prototype.updateMemberProfile = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/iam/members/" + params.member.id + "/profile",
                            method: 'PATCH',
                            body: params.member,
                            expectedStatusCodes: [http_status_1.NO_CONTENT]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return IAMService;
}(service_1.Service));
exports.IAMService = IAMService;

},{"../service":116,"http-status":287}],125:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.InvoiceService = void 0;
var http_status_1 = require("http-status");
var service_1 = require("../service");
/**
 * インボイスサービス
 */
var InvoiceService = /** @class */ (function (_super) {
    __extends(InvoiceService, _super);
    function InvoiceService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * インボイスを検索する
     */
    InvoiceService.prototype.search = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/invoices',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {};
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    return InvoiceService;
}(service_1.Service));
exports.InvoiceService = InvoiceService;

},{"../service":116,"http-status":287}],126:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.OfferService = void 0;
var http_status_1 = require("http-status");
var service_1 = require("../service");
/**
 * オファーサービス
 */
var OfferService = /** @class */ (function (_super) {
    __extends(OfferService, _super);
    function OfferService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 通貨オファー承認
     */
    OfferService.prototype.authorizeMonetaryAmount = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/offers/" + params.object.itemOffered.typeOf + "/authorize",
                        method: 'POST',
                        expectedStatusCodes: [http_status_1.CREATED],
                        body: params
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * プロダクトオファー承認
     */
    OfferService.prototype.authorizeProduct = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/offers/product/authorize',
                        method: 'POST',
                        expectedStatusCodes: [http_status_1.CREATED],
                        body: params
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * オファー承認取消
     */
    OfferService.prototype.voidAuthorization = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/offers/" + params.object.itemOffered.typeOf + "/authorize/" + params.id + "/void",
                            method: 'PUT',
                            expectedStatusCodes: [http_status_1.NO_CONTENT],
                            body: params
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return OfferService;
}(service_1.Service));
exports.OfferService = OfferService;

},{"../service":116,"http-status":287}],127:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.OrderService = void 0;
var http_status_1 = require("http-status");
var service_1 = require("../service");
/**
 * 注文サービス
 */
var OrderService = /** @class */ (function (_super) {
    __extends(OrderService, _super);
    function OrderService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 注文を作成する
     * 確定した注文取引に対して、同期的に注文データを作成します。
     * すでに注文が作成済の場合、何もしません。
     */
    OrderService.prototype.placeOrder = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: '/orders',
                            method: 'POST',
                            body: params,
                            expectedStatusCodes: [http_status_1.NO_CONTENT, http_status_1.OK]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 確認番号で検索
     * 確認番号と購入者情報で注文を検索します
     */
    OrderService.prototype.findByConfirmationNumber = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/orders/findByConfirmationNumber',
                        method: 'POST',
                        body: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 予約番号と電話番号で注文情報を取得する(sskts専用)
     */
    OrderService.prototype.findByOrderInquiryKey4sskts = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/orders/findByOrderInquiryKey',
                        method: 'POST',
                        body: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 注文番号と何かしらで注文照会
     */
    OrderService.prototype.findOneByOrderNumberAndSomething = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/orders/findOneByOrderNumberAndSomething',
                        method: 'POST',
                        body: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 注文コードを発行する
     */
    OrderService.prototype.authorize = function (params) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_b) {
                return [2 /*return*/, this.fetch({
                        uri: "/orders/" + String((_a = params.object) === null || _a === void 0 ? void 0 : _a.orderNumber) + "/authorize",
                        method: 'POST',
                        body: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 注文に対するアクションを検索する
     */
    OrderService.prototype.searchActionsByOrderNumber = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/orders/" + params.orderNumber + "/actions",
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 注文取得
     */
    OrderService.prototype.findByOrderNumber = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/orders/" + params.orderNumber,
                        method: 'GET',
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 識別子で注文検索
     */
    OrderService.prototype.findByIdentifier = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/orders/findByIdentifier',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {};
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * 注文を検索する
     */
    OrderService.prototype.search = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/orders',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {};
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * ストリーミングダウンロード
     */
    OrderService.prototype.download = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/orders/download",
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.body];
                    }); }); })];
            });
        });
    };
    return OrderService;
}(service_1.Service));
exports.OrderService = OrderService;

},{"../service":116,"http-status":287}],128:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.OwnershipInfoService = void 0;
var http_status_1 = require("http-status");
var service_1 = require("../service");
/**
 * 所有権サービス
 */
var OwnershipInfoService = /** @class */ (function (_super) {
    __extends(OwnershipInfoService, _super);
    function OwnershipInfoService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 所有権検索
     */
    OwnershipInfoService.prototype.search = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/ownershipInfos',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {};
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * 所有権トークンを取得する
     * @deprecated TokenServiceを使用してください
     */
    OwnershipInfoService.prototype.getToken = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/ownershipInfos/tokens',
                        method: 'POST',
                        body: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 所有権検証アクションを検索する
     * 所有権に対して発行されたトークンを認証しようとしたアクションを検索します
     */
    OwnershipInfoService.prototype.searchCheckTokenActions = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/ownershipInfos/" + params.id + "/actions/checkToken",
                        method: 'GET',
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {};
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * 登録日と劇場で会員数をカウント(sskts専用)
     */
    OwnershipInfoService.prototype.countByRegisterDateAndTheater = function (
    /**
     * 検索条件
     * fromDateとtoDateの時間を注意して
     */
    params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/ownershipInfos/countByRegisterDateAndTheater',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    return OwnershipInfoService;
}(service_1.Service));
exports.OwnershipInfoService = OwnershipInfoService;

},{"../service":116,"http-status":287}],129:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.PaymentService = void 0;
var http_status_1 = require("http-status");
var factory = require("../factory");
var service_1 = require("../service");
/**
 * 決済サービス
 */
var PaymentService = /** @class */ (function (_super) {
    __extends(PaymentService, _super);
    function PaymentService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 対面決済承認
     */
    PaymentService.prototype.authorizeAnyPayment = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/payment/" + factory.chevre.service.paymentService.PaymentServiceType.FaceToFace + "/authorize",
                        method: 'POST',
                        expectedStatusCodes: [http_status_1.CREATED],
                        body: params
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * クレジットカード決済承認
     */
    PaymentService.prototype.authorizeCreditCard = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/payment/" + factory.chevre.service.paymentService.PaymentServiceType.CreditCard + "/authorize",
                        method: 'POST',
                        expectedStatusCodes: [http_status_1.CREATED],
                        body: params
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * ムビチケ決済承認
     */
    PaymentService.prototype.authorizeMovieTicket = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/payment/" + factory.chevre.service.paymentService.PaymentServiceType.MovieTicket + "/authorize",
                        method: 'POST',
                        expectedStatusCodes: [http_status_1.CREATED],
                        body: params
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 口座決済承認
     * @deprecated Use authorizePaymentCard()
     */
    PaymentService.prototype.authorizeAccount = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.authorizePaymentCard(params)];
            });
        });
    };
    /**
     * ペイメントカード決済承認
     */
    PaymentService.prototype.authorizePaymentCard = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/payment/" + factory.chevre.product.ProductType.PaymentCard + "/authorize",
                        method: 'POST',
                        expectedStatusCodes: [http_status_1.CREATED],
                        body: params
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * ムビチケ認証
     */
    PaymentService.prototype.checkMovieTicket = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/payment/" + factory.chevre.service.paymentService.PaymentServiceType.MovieTicket + "/actions/check",
                        method: 'POST',
                        expectedStatusCodes: [http_status_1.CREATED],
                        body: params
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * ペイメントカード認証
     */
    PaymentService.prototype.checkPaymentCard = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/payment/" + factory.chevre.product.ProductType.PaymentCard + "/check",
                        method: 'POST',
                        expectedStatusCodes: [http_status_1.OK],
                        body: params
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 対面決済承認取消
     */
    PaymentService.prototype.voidAnyPayment = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/payment/" + factory.chevre.service.paymentService.PaymentServiceType.FaceToFace + "/authorize/" + params.id + "/void",
                            method: 'PUT',
                            expectedStatusCodes: [http_status_1.NO_CONTENT],
                            body: params
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 決済承認取消
     */
    PaymentService.prototype.voidTransaction = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/payment/" + params.object.typeOf + "/authorize/" + params.id + "/void",
                            method: 'PUT',
                            expectedStatusCodes: [http_status_1.NO_CONTENT],
                            body: params
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return PaymentService;
}(service_1.Service));
exports.PaymentService = PaymentService;

},{"../factory":114,"../service":116,"http-status":287}],130:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.PaymentMethodService = void 0;
var http_status_1 = require("http-status");
var factory = require("../factory");
var service_1 = require("../service");
/**
 * 決済方法サービス
 */
var PaymentMethodService = /** @class */ (function (_super) {
    __extends(PaymentMethodService, _super);
    function PaymentMethodService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * ムビチケを検索する
     */
    PaymentMethodService.prototype.searchMovieTickets = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/paymentMethods/" + factory.chevre.service.paymentService.PaymentServiceType.MovieTicket,
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {};
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    return PaymentMethodService;
}(service_1.Service));
exports.PaymentMethodService = PaymentMethodService;

},{"../factory":114,"../service":116,"http-status":287}],131:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.PersonService = void 0;
var http_status_1 = require("http-status");
var service_1 = require("../service");
/**
 * ユーザーサービス
 */
var PersonService = /** @class */ (function (_super) {
    __extends(PersonService, _super);
    function PersonService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * プロフィール検索
     */
    PersonService.prototype.getProfile = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            var _this = this;
            return __generator(this, function (_a) {
                id = (typeof params.id === 'string') ? params.id : 'me';
                return [2 /*return*/, this.fetch({
                        uri: "/people/" + id + "/profile",
                        method: 'GET',
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * プロフィール更新
     */
    PersonService.prototype.updateProfile = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = (typeof params.id === 'string') ? params.id : 'me';
                        return [4 /*yield*/, this.fetch({
                                uri: "/people/" + id + "/profile",
                                method: 'PATCH',
                                body: params,
                                expectedStatusCodes: [http_status_1.NO_CONTENT]
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 注文を検索する
     */
    PersonService.prototype.searchOrders = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            var _this = this;
            return __generator(this, function (_a) {
                id = (typeof params.id === 'string') ? params.id : 'me';
                return [2 /*return*/, this.fetch({
                        uri: "/people/" + id + "/orders",
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {};
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * 会員検索
     */
    PersonService.prototype.search = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/people',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {};
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * ユーザー取得
     */
    PersonService.prototype.findById = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            var _this = this;
            return __generator(this, function (_a) {
                id = (typeof params.id === 'string') ? params.id : 'me';
                return [2 /*return*/, this.fetch({
                        uri: "/people/" + id,
                        method: 'GET',
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * ユーザー削除
     */
    PersonService.prototype.deleteById = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = (typeof params.id === 'string') ? params.id : 'me';
                        return [4 /*yield*/, this.fetch({
                                uri: "/people/" + id,
                                method: 'DELETE',
                                body: params,
                                expectedStatusCodes: [http_status_1.NO_CONTENT]
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 会員プログラム登録解除(sskts専用)
     */
    PersonService.prototype.unRegisterProgramMembership = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            var _this = this;
            return __generator(this, function (_a) {
                id = (typeof params.id === 'string') ? params.id : 'me';
                return [2 /*return*/, this.fetch({
                        uri: "/people/" + id + "/ownershipInfos/programMembership/" + params.ownershipInfoIdentifier + "/unRegister",
                        method: 'PUT',
                        body: {},
                        expectedStatusCodes: [http_status_1.ACCEPTED]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    return PersonService;
}(service_1.Service));
exports.PersonService = PersonService;

},{"../service":116,"http-status":287}],132:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.PersonOwnershipInfoService = void 0;
var http_status_1 = require("http-status");
var service_1 = require("../../service");
/**
 * ユーザー所有権サービス
 */
var PersonOwnershipInfoService = /** @class */ (function (_super) {
    __extends(PersonOwnershipInfoService, _super);
    function PersonOwnershipInfoService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * クレジットカード追加
     */
    PersonOwnershipInfoService.prototype.addCreditCard = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            var _this = this;
            return __generator(this, function (_a) {
                id = (typeof params.id === 'string') ? params.id : 'me';
                return [2 /*return*/, this.fetch({
                        uri: "/people/" + id + "/ownershipInfos/creditCards",
                        method: 'POST',
                        body: params.creditCard,
                        expectedStatusCodes: [http_status_1.CREATED]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * クレジットカード検索
     */
    PersonOwnershipInfoService.prototype.searchCreditCards = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            var _this = this;
            return __generator(this, function (_a) {
                id = (typeof params.id === 'string') ? params.id : 'me';
                return [2 /*return*/, this.fetch({
                        uri: "/people/" + id + "/ownershipInfos/creditCards",
                        method: 'GET',
                        qs: {},
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * クレジットカード削除
     */
    PersonOwnershipInfoService.prototype.deleteCreditCard = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = (typeof params.id === 'string') ? params.id : 'me';
                        return [4 /*yield*/, this.fetch({
                                uri: "/people/" + id + "/ownershipInfos/creditCards/" + params.cardSeq,
                                method: 'DELETE',
                                expectedStatusCodes: [http_status_1.NO_CONTENT]
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 口座開設
     */
    PersonOwnershipInfoService.prototype.openAccount = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            var _this = this;
            return __generator(this, function (_a) {
                id = (typeof params.id === 'string') ? params.id : 'me';
                return [2 /*return*/, this.fetch({
                        uri: "/people/" + id + "/ownershipInfos/accounts/" + params.accountType,
                        method: 'POST',
                        body: {
                            name: params.name
                        },
                        expectedStatusCodes: [http_status_1.CREATED]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 口座解約
     * 口座の状態を変更するだけで、ユーザーの所有する口座リストから削除はされません。
     * 解約された口座で取引を進行しようとすると400エラーとなります。
     */
    PersonOwnershipInfoService.prototype.closeAccount = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = (typeof params.id === 'string') ? params.id : 'me';
                        return [4 /*yield*/, this.fetch({
                                uri: "/people/" + id + "/ownershipInfos/accounts/Default/" + params.accountNumber + "/close",
                                method: 'PUT',
                                expectedStatusCodes: [http_status_1.NO_CONTENT]
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 口座取引履歴検索
     */
    PersonOwnershipInfoService.prototype.searchAccountMoneyTransferActions = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            var _this = this;
            return __generator(this, function (_a) {
                id = (typeof params.id === 'string') ? params.id : 'me';
                return [2 /*return*/, this.fetch({
                        uri: "/people/" + id + "/ownershipInfos/accounts/actions/moneyTransfer",
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {};
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * 所有権検索
     */
    PersonOwnershipInfoService.prototype.search = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            var _this = this;
            return __generator(this, function (_a) {
                id = (typeof params.id === 'string') ? params.id : 'me';
                return [2 /*return*/, this.fetch({
                        uri: "/people/" + id + "/ownershipInfos",
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {};
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * 所有権に対して認可コードを発行する
     */
    PersonOwnershipInfoService.prototype.authorize = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            var _this = this;
            return __generator(this, function (_a) {
                id = (typeof params.id === 'string') ? params.id : 'me';
                return [2 /*return*/, this.fetch({
                        uri: "/people/" + id + "/ownershipInfos/" + params.ownershipInfoId + "/authorize",
                        method: 'POST',
                        expectedStatusCodes: [http_status_1.OK],
                        body: params
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    return PersonOwnershipInfoService;
}(service_1.Service));
exports.PersonOwnershipInfoService = PersonOwnershipInfoService;

},{"../../service":116,"http-status":287}],133:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.PlaceService = void 0;
var http_status_1 = require("http-status");
var factory = require("../factory");
var service_1 = require("../service");
/**
 * 場所サービス
 */
var PlaceService = /** @class */ (function (_super) {
    __extends(PlaceService, _super);
    function PlaceService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 劇場検索
     */
    PlaceService.prototype.searchMovieTheaters = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/places/" + factory.chevre.placeType.MovieTheater,
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {};
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * スクリーン検索
     */
    PlaceService.prototype.searchScreeningRooms = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/places/" + factory.chevre.placeType.ScreeningRoom,
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {};
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * 座席検索
     */
    PlaceService.prototype.searchSeats = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/places/" + factory.chevre.placeType.Seat,
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {};
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    return PlaceService;
}(service_1.Service));
exports.PlaceService = PlaceService;

},{"../factory":114,"../service":116,"http-status":287}],134:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.ProductService = void 0;
var http_status_1 = require("http-status");
var service_1 = require("../service");
/**
 * プロダクトサービス
 */
var ProductService = /** @class */ (function (_super) {
    __extends(ProductService, _super);
    function ProductService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 検索
     */
    ProductService.prototype.search = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/products',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {};
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * プロダクトオファー検索
     */
    ProductService.prototype.searchOffers = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/products/" + params.itemOffered.id + "/offers",
                        method: 'GET',
                        expectedStatusCodes: [http_status_1.OK],
                        qs: params
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    return ProductService;
}(service_1.Service));
exports.ProductService = ProductService;

},{"../service":116,"http-status":287}],135:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.ProjectService = void 0;
var http_status_1 = require("http-status");
var service_1 = require("../service");
/**
 * プロジェクトサービス
 */
var ProjectService = /** @class */ (function (_super) {
    __extends(ProjectService, _super);
    function ProjectService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * プロジェクト作成
     */
    ProjectService.prototype.create = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/projects',
                        method: 'POST',
                        body: params,
                        expectedStatusCodes: [http_status_1.CREATED]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * プロジェクト検索
     */
    ProjectService.prototype.search = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/projects',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {};
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * プロジェクト取得
     */
    ProjectService.prototype.findById = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/projects/" + params.id,
                        method: 'GET',
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * プロジェクト編集
     */
    ProjectService.prototype.update = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/projects/" + params.id,
                            method: 'PATCH',
                            body: params,
                            expectedStatusCodes: [http_status_1.NO_CONTENT]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * プロジェクト設定取得
     */
    ProjectService.prototype.getSettings = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/projects/" + params.id + "/settings",
                        method: 'GET',
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * ヘルスチェック
     */
    ProjectService.prototype.getHealth = function (_) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/health',
                        method: 'GET',
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var version, _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    version = response.headers.get('X-API-Version');
                                    _a = {
                                        version: (typeof version === 'string') ? version : undefined,
                                        status: response.status
                                    };
                                    return [4 /*yield*/, response.text()];
                                case 1: return [2 /*return*/, (_a.message = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * DB統計取得
     */
    ProjectService.prototype.getDBStats = function (_) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/stats/dbStats',
                        method: 'GET',
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    return ProjectService;
}(service_1.Service));
exports.ProjectService = ProjectService;

},{"../service":116,"http-status":287}],136:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.ReservationService = void 0;
var http_status_1 = require("http-status");
var factory = require("../factory");
var service_1 = require("../service");
/**
 * 予約サービス
 */
var ReservationService = /** @class */ (function (_super) {
    __extends(ReservationService, _super);
    function ReservationService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 予約検索
     */
    ReservationService.prototype.search = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/reservations',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {
                                        totalCount: (typeof response.headers.get('X-Total-Count') === 'string')
                                            ? Number(response.headers.get('X-Total-Count'))
                                            : undefined
                                    };
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * ストリーミングダウンロード
     */
    ReservationService.prototype.download = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/reservations/download',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.body];
                    }); }); })];
            });
        });
    };
    /**
     * 予約を使用する
     * 注文コードから取得したトークンを利用して、予約に入場記録を追加します
     */
    ReservationService.prototype.useByToken = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/reservations/use',
                        method: 'POST',
                        body: params,
                        expectedStatusCodes: [http_status_1.NO_CONTENT, http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (response.status === http_status_1.OK) {
                                return [2 /*return*/, response.json()];
                            }
                            else {
                                return [2 /*return*/];
                            }
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    /**
     * 予約に対する入場アクションを検索する
     */
    ReservationService.prototype.searchUseActions = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/reservations/" + String(params.object.id) + "/actions/use",
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {};
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * 予約使用アクション取消
     */
    ReservationService.prototype.cancelUseAction = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/reservations/" + String(params.object.id) + "/actions/use/" + String(params.id) + "/" + factory.actionStatusType.CanceledActionStatus,
                            method: 'PUT',
                            body: params,
                            expectedStatusCodes: [http_status_1.NO_CONTENT]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 予約取消
     */
    ReservationService.prototype.cancel = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: '/reservations/cancel',
                            method: 'PUT',
                            body: params,
                            expectedStatusCodes: [http_status_1.NO_CONTENT]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 予約IDあるいは予約番号指定でチェックイン(発券)する
     * @deprecated じきに削除予定
     */
    ReservationService.prototype.checkIn = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: '/reservations/checkedIn',
                            method: 'PUT',
                            body: params,
                            expectedStatusCodes: [http_status_1.NO_CONTENT]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @deprecated じきに削除予定
     */
    ReservationService.prototype.attend = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/reservations/" + encodeURIComponent(String(params.id)) + "/attended",
                            method: 'PUT',
                            expectedStatusCodes: [http_status_1.NO_CONTENT]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return ReservationService;
}(service_1.Service));
exports.ReservationService = ReservationService;

},{"../factory":114,"../service":116,"http-status":287}],137:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.SellerService = void 0;
var http_status_1 = require("http-status");
var service_1 = require("../service");
/**
 * 販売者サービス
 */
var SellerService = /** @class */ (function (_super) {
    __extends(SellerService, _super);
    function SellerService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 販売者取得
     */
    SellerService.prototype.findById = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/sellers/" + params.id,
                        method: 'GET',
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 販売者検索
     */
    SellerService.prototype.search = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/sellers',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {};
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    return SellerService;
}(service_1.Service));
exports.SellerService = SellerService;

},{"../service":116,"http-status":287}],138:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.ServiceOutputService = void 0;
var http_status_1 = require("http-status");
// import * as factory from '../factory';
var service_1 = require("../service");
/**
 * サービスアウトプットサービス
 */
var ServiceOutputService = /** @class */ (function (_super) {
    __extends(ServiceOutputService, _super);
    function ServiceOutputService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 検索
     */
    ServiceOutputService.prototype.search = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/serviceOutputs',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {};
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    return ServiceOutputService;
}(service_1.Service));
exports.ServiceOutputService = ServiceOutputService;

},{"../service":116,"http-status":287}],139:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.TaskService = void 0;
var http_status_1 = require("http-status");
var service_1 = require("../service");
/**
 * タスクサービス
 */
var TaskService = /** @class */ (function (_super) {
    __extends(TaskService, _super);
    function TaskService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * タスク作成
     */
    TaskService.prototype.create = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/tasks/" + params.name,
                        method: 'POST',
                        body: params,
                        expectedStatusCodes: [http_status_1.CREATED]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * タスク取得
     */
    TaskService.prototype.findById = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/tasks/" + params.name + "/" + params.id,
                        method: 'GET',
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * タスク検索
     */
    TaskService.prototype.search = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/tasks',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {};
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    return TaskService;
}(service_1.Service));
exports.TaskService = TaskService;

},{"../service":116,"http-status":287}],140:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.TokenService = void 0;
var http_status_1 = require("http-status");
var service_1 = require("../service");
/**
 * トークンサービス
 */
var TokenService = /** @class */ (function (_super) {
    __extends(TokenService, _super);
    function TokenService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * トークンを取得する
     */
    TokenService.prototype.getToken = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/tokens',
                        method: 'POST',
                        body: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    return TokenService;
}(service_1.Service));
exports.TokenService = TokenService;

},{"../service":116,"http-status":287}],141:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.MoneyTransferTransactionService = void 0;
var http_status_1 = require("http-status");
var factory = require("../../factory");
var service_1 = require("../../service");
/**
 * 通貨転送取引サービス
 */
var MoneyTransferTransactionService = /** @class */ (function (_super) {
    __extends(MoneyTransferTransactionService, _super);
    function MoneyTransferTransactionService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.typeOf = factory.transactionType.MoneyTransfer;
        return _this;
    }
    /**
     * 取引を開始する
     */
    MoneyTransferTransactionService.prototype.start = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/transactions/" + this.typeOf + "/start",
                        method: 'POST',
                        body: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 取引人プロフィール変更
     */
    MoneyTransferTransactionService.prototype.setProfile = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/transactions/" + this.typeOf + "/" + params.id + "/agent",
                            method: 'PUT',
                            expectedStatusCodes: [http_status_1.NO_CONTENT],
                            body: params.agent
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 取引確定
     */
    MoneyTransferTransactionService.prototype.confirm = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/transactions/" + this.typeOf + "/" + params.id + "/confirm",
                            method: 'PUT',
                            expectedStatusCodes: [http_status_1.NO_CONTENT]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 明示的に取引を中止する
     * 既に確定済、あるいは、期限切れの取引に対して実行するとArgumentエラーが返されます。
     */
    MoneyTransferTransactionService.prototype.cancel = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/transactions/" + this.typeOf + "/" + params.id + "/cancel",
                            method: 'PUT',
                            expectedStatusCodes: [http_status_1.NO_CONTENT]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 取引検索
     */
    MoneyTransferTransactionService.prototype.search = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/transactions/" + this.typeOf,
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {};
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * 取引に対するアクションを検索する
     */
    MoneyTransferTransactionService.prototype.searchActionsByTransactionId = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/transactions/" + this.typeOf + "/" + params.id + "/actions",
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    return MoneyTransferTransactionService;
}(service_1.Service));
exports.MoneyTransferTransactionService = MoneyTransferTransactionService;

},{"../../factory":114,"../../service":116,"http-status":287}],142:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.PlaceOrderTransactionService = void 0;
var http_status_1 = require("http-status");
var factory = require("../../factory");
var service_1 = require("../../service");
/**
 * 注文取引サービス
 */
var PlaceOrderTransactionService = /** @class */ (function (_super) {
    __extends(PlaceOrderTransactionService, _super);
    function PlaceOrderTransactionService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.typeOf = factory.transactionType.PlaceOrder;
        return _this;
    }
    /**
     * 取引を開始する
     */
    PlaceOrderTransactionService.prototype.start = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/transactions/" + this.typeOf + "/start",
                        method: 'POST',
                        body: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 座席予約承認
     */
    PlaceOrderTransactionService.prototype.authorizeSeatReservation = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/transactions/" + this.typeOf + "/" + params.purpose.id + "/actions/authorize/offer/seatReservation",
                        method: 'POST',
                        expectedStatusCodes: [http_status_1.CREATED],
                        body: params.object
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 座席予約承認取消
     */
    PlaceOrderTransactionService.prototype.voidSeatReservation = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/transactions/" + this.typeOf + "/" + params.purpose.id + "/actions/authorize/offer/seatReservation/" + params.id + "/cancel",
                            method: 'PUT',
                            expectedStatusCodes: [http_status_1.NO_CONTENT]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * ポイントインセンティブ承認
     */
    PlaceOrderTransactionService.prototype.authorizePointAward = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/transactions/" + this.typeOf + "/" + params.purpose.id + "/actions/authorize/award/accounts/point",
                        method: 'POST',
                        expectedStatusCodes: [http_status_1.CREATED],
                        body: params.object
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * ポイントインセンティブ承認取消
     */
    PlaceOrderTransactionService.prototype.voidPointAward = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/transactions/" + this.typeOf + "/" + params.purpose.id + "/actions/authorize/award/accounts/point/" + params.id + "/cancel",
                            method: 'PUT',
                            expectedStatusCodes: [http_status_1.NO_CONTENT]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 取引人プロフィール変更
     */
    PlaceOrderTransactionService.prototype.setProfile = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/transactions/" + this.typeOf + "/" + params.id + "/agent",
                            method: 'PUT',
                            expectedStatusCodes: [http_status_1.NO_CONTENT],
                            body: params.agent
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 取引確定
     */
    PlaceOrderTransactionService.prototype.confirm = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/transactions/" + this.typeOf + "/" + params.id + "/confirm",
                        method: 'PUT',
                        expectedStatusCodes: [http_status_1.OK],
                        body: params
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 明示的に取引を中止する
     * 既に確定済、あるいは、期限切れの取引に対して実行するとArgumentエラーが返されます。
     */
    PlaceOrderTransactionService.prototype.cancel = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/transactions/" + this.typeOf + "/" + params.id + "/cancel",
                            method: 'PUT',
                            expectedStatusCodes: [http_status_1.NO_CONTENT]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 取引検索
     */
    PlaceOrderTransactionService.prototype.search = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/transactions/" + this.typeOf,
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {};
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * 取引に対するアクションを検索する
     */
    PlaceOrderTransactionService.prototype.searchActionsByTransactionId = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/transactions/" + this.typeOf + "/" + params.id + "/actions",
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * ストリーミングダウンロード
     */
    PlaceOrderTransactionService.prototype.stream = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/transactions/" + this.typeOf + "/report",
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.body];
                    }); }); })];
            });
        });
    };
    return PlaceOrderTransactionService;
}(service_1.Service));
exports.PlaceOrderTransactionService = PlaceOrderTransactionService;

},{"../../factory":114,"../../service":116,"http-status":287}],143:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.PlaceOrderTransaction4ssktsService = void 0;
var http_status_1 = require("http-status");
var placeOrder_1 = require("./placeOrder");
/**
 * 注文取引サービス(sskts専用)
 */
var PlaceOrderTransaction4ssktsService = /** @class */ (function (_super) {
    __extends(PlaceOrderTransaction4ssktsService, _super);
    function PlaceOrderTransaction4ssktsService(options) {
        return _super.call(this, options) || this; /* istanbul ignore next */
    }
    /**
     * 座席予約オファー承認
     */
    PlaceOrderTransaction4ssktsService.prototype.createSeatReservationAuthorization = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/transactions/" + this.typeOf + "/" + params.purpose.id + "/actions/authorize/seatReservation",
                        method: 'POST',
                        expectedStatusCodes: [http_status_1.CREATED],
                        body: {
                            eventIdentifier: params.object.event.id,
                            offers: params.object.acceptedOffer
                        }
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 座席予約オファー承認取消
     */
    PlaceOrderTransaction4ssktsService.prototype.cancelSeatReservationAuthorization = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/transactions/" + this.typeOf + "/" + params.purpose.id + "/actions/authorize/seatReservation/" + params.id,
                            method: 'DELETE',
                            expectedStatusCodes: [http_status_1.NO_CONTENT]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 座席予約承認アクションの供給情報を変更する
     * 完了ステータスの座席仮予約に対して券種変更する際に使用
     */
    PlaceOrderTransaction4ssktsService.prototype.changeSeatReservationOffers = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/transactions/" + this.typeOf + "/" + params.purpose.id + "/actions/authorize/seatReservation/" + params.id,
                        method: 'PATCH',
                        expectedStatusCodes: [http_status_1.OK],
                        body: {
                            eventIdentifier: params.object.event.id,
                            offers: params.object.acceptedOffer
                        }
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    return PlaceOrderTransaction4ssktsService;
}(placeOrder_1.PlaceOrderTransactionService));
exports.PlaceOrderTransaction4ssktsService = PlaceOrderTransaction4ssktsService;

},{"./placeOrder":142,"http-status":287}],144:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.PlaceOrderTransaction4tttsService = void 0;
var http_status_1 = require("http-status");
var placeOrder_1 = require("./placeOrder");
/**
 * 注文取引サービス(ttts専用)
 */
var PlaceOrderTransaction4tttsService = /** @class */ (function (_super) {
    __extends(PlaceOrderTransaction4tttsService, _super);
    function PlaceOrderTransaction4tttsService(options) {
        return _super.call(this, options) || this; /* istanbul ignore next */
    }
    /**
     * 座席予約承認
     */
    PlaceOrderTransaction4tttsService.prototype.createSeatReservationAuthorization = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/ttts/transactions/" + this.typeOf + "/" + params.transactionId + "/actions/authorize/seatReservation",
                        method: 'POST',
                        expectedStatusCodes: [http_status_1.CREATED],
                        body: {
                            performance_id: params.performanceId,
                            offers: params.offers
                        }
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    return PlaceOrderTransaction4tttsService;
}(placeOrder_1.PlaceOrderTransactionService));
exports.PlaceOrderTransaction4tttsService = PlaceOrderTransaction4tttsService;

},{"./placeOrder":142,"http-status":287}],145:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.ReturnOrderTransactionService = void 0;
var http_status_1 = require("http-status");
var factory = require("../../factory");
var service_1 = require("../../service");
/**
 * 注文返品取引サービス
 */
var ReturnOrderTransactionService = /** @class */ (function (_super) {
    __extends(ReturnOrderTransactionService, _super);
    function ReturnOrderTransactionService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.typeOf = factory.transactionType.ReturnOrder;
        return _this;
    }
    /**
     * 取引を開始する
     */
    ReturnOrderTransactionService.prototype.start = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/transactions/" + this.typeOf + "/start",
                        method: 'POST',
                        body: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * 取引人プロフィール変更
     */
    ReturnOrderTransactionService.prototype.setProfile = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/transactions/" + this.typeOf + "/" + params.id + "/agent",
                            method: 'PUT',
                            expectedStatusCodes: [http_status_1.NO_CONTENT],
                            body: params.agent
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 取引確定
     */
    ReturnOrderTransactionService.prototype.confirm = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch({
                            uri: "/transactions/" + this.typeOf + "/" + params.id + "/confirm",
                            method: 'PUT',
                            body: params,
                            expectedStatusCodes: [http_status_1.NO_CONTENT]
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 取引検索
     */
    ReturnOrderTransactionService.prototype.search = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: '/transactions/returnOrder',
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {};
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    return ReturnOrderTransactionService;
}(service_1.Service));
exports.ReturnOrderTransactionService = ReturnOrderTransactionService;

},{"../../factory":114,"../../service":116,"http-status":287}],146:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.UserPoolService = void 0;
var http_status_1 = require("http-status");
var service_1 = require("../service");
/**
 * Cognitoユーザープールサービス
 */
var UserPoolService = /** @class */ (function (_super) {
    __extends(UserPoolService, _super);
    function UserPoolService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * ユーザープール取得
     */
    UserPoolService.prototype.findById = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/userPools/" + params.userPoolId,
                        method: 'GET',
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    /**
     * クライアント検索
     */
    UserPoolService.prototype.searchClients = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/userPools/" + params.userPoolId + "/clients",
                        method: 'GET',
                        qs: params,
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {};
                                    return [4 /*yield*/, response.json()];
                                case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                        _a)];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * クライアント取得
     */
    UserPoolService.prototype.findClientById = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch({
                        uri: "/userPools/" + params.userPoolId + "/clients/" + params.clientId,
                        method: 'GET',
                        expectedStatusCodes: [http_status_1.OK]
                    })
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, response.json()];
                    }); }); })];
            });
        });
    };
    return UserPoolService;
}(service_1.Service));
exports.UserPoolService = UserPoolService;

},{"../service":116,"http-status":287}],147:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.StubTransporter = exports.DefaultTransporter = exports.RequestError = exports.Transporter = void 0;
// tslint:disable:max-classes-per-file
/**
 * transporters
 */
var createDebug = require("debug");
var fetch = require("isomorphic-fetch");
var debug = createDebug('cinerino-api-abstract-client:transporters');
// tslint:disable-next-line
// const pkg = require('../package.json');
/**
 * トランスポーター抽象クラス
 */
var Transporter = /** @class */ (function () {
    function Transporter() {
    }
    return Transporter;
}());
exports.Transporter = Transporter;
/**
 * RequestError
 */
var RequestError = /** @class */ (function (_super) {
    __extends(RequestError, _super);
    function RequestError(message) {
        var _this = 
        // tslint:disable-next-line:no-single-line-block-comment
        _super.call(this, message) /* istanbul ignore next */ || this;
        _this.name = 'CinerinoRequestError';
        return _this;
    }
    return RequestError;
}(Error));
exports.RequestError = RequestError;
/**
 * DefaultTransporter
 */
var DefaultTransporter = /** @class */ (function () {
    function DefaultTransporter(expectedStatusCodes) {
        this.expectedStatusCodes = expectedStatusCodes;
    }
    /**
     * Configures request options before making a request.
     */
    DefaultTransporter.CONFIGURE = function (options) {
        // set transporter user agent
        // options.headers = (options.headers !== undefined) ? options.headers : {};
        // tslint:disable-next-line:no-single-line-block-comment
        /* istanbul ignore else */
        // if (!(<any>options.headers)['User-Agent']) {
        //     (<any>options.headers)['User-Agent'] = DefaultTransporter.USER_AGENT;
        // } else if ((<any>options.headers)['User-Agent'].indexOf(DefaultTransporter.USER_AGENT) === -1) {
        //     (<any>options.headers)['User-Agent'] = `${(<any>options.headers)['User-Agent']} ${DefaultTransporter.USER_AGENT}`;
        // }
        return options;
    };
    /**
     * Makes a request with given options and invokes callback.
     */
    DefaultTransporter.prototype.fetch = function (url, options) {
        return __awaiter(this, void 0, void 0, function () {
            var fetchOptions;
            var _this = this;
            return __generator(this, function (_a) {
                fetchOptions = DefaultTransporter.CONFIGURE(options);
                debug('fetching...', url, fetchOptions);
                return [2 /*return*/, fetch(url, fetchOptions)
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, this.wrapCallback(response)];
                    }); }); })];
            });
        });
    };
    /**
     * Wraps the response callback.
     */
    DefaultTransporter.prototype.wrapCallback = function (response) {
        return __awaiter(this, void 0, void 0, function () {
            var err, body, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        err = new RequestError('An unexpected error occurred');
                        debug('request processed', response.status);
                        if (!(this.expectedStatusCodes.indexOf(response.status) < 0)) return [3 /*break*/, 6];
                        body = void 0;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 5]);
                        return [4 /*yield*/, response.clone()
                                .json()];
                    case 2:
                        // Only and only application/json responses should
                        // be decoded back to JSON, but there are cases API back-ends
                        // responds without proper content-type.
                        body = _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        return [4 /*yield*/, response.clone()
                                .text()];
                    case 4:
                        body = _a.sent();
                        return [3 /*break*/, 5];
                    case 5:
                        if (typeof body === 'object' && body.error !== undefined) {
                            err = new RequestError(body.error.message);
                            err.code = response.status;
                            err.errors = body.error.errors;
                        }
                        else {
                            err = new RequestError(body);
                            err.code = response.status;
                            err.errors = [];
                        }
                        return [3 /*break*/, 7];
                    case 6: return [2 /*return*/, response];
                    case 7: throw err;
                }
            });
        });
    };
    return DefaultTransporter;
}());
exports.DefaultTransporter = DefaultTransporter;
/**
 * スタブトランポーター
 */
var StubTransporter = /** @class */ (function () {
    function StubTransporter(body) {
        this.body = body;
    }
    StubTransporter.prototype.fetch = function (_, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Response(this.body, options)];
            });
        });
    };
    return StubTransporter;
}());
exports.StubTransporter = StubTransporter;

},{"debug":279,"isomorphic-fetch":290}],148:[function(require,module,exports){
'use strict';

var replace = String.prototype.replace;
var percentTwenties = /%20/g;

var Format = {
    RFC1738: 'RFC1738',
    RFC3986: 'RFC3986'
};

module.exports = {
    'default': Format.RFC3986,
    formatters: {
        RFC1738: function (value) {
            return replace.call(value, percentTwenties, '+');
        },
        RFC3986: function (value) {
            return String(value);
        }
    },
    RFC1738: Format.RFC1738,
    RFC3986: Format.RFC3986
};

},{}],149:[function(require,module,exports){
'use strict';

var stringify = require('./stringify');
var parse = require('./parse');
var formats = require('./formats');

module.exports = {
    formats: formats,
    parse: parse,
    stringify: stringify
};

},{"./formats":148,"./parse":150,"./stringify":151}],150:[function(require,module,exports){
'use strict';

var utils = require('./utils');

var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;

var defaults = {
    allowDots: false,
    allowPrototypes: false,
    allowSparse: false,
    arrayLimit: 20,
    charset: 'utf-8',
    charsetSentinel: false,
    comma: false,
    decoder: utils.decode,
    delimiter: '&',
    depth: 5,
    ignoreQueryPrefix: false,
    interpretNumericEntities: false,
    parameterLimit: 1000,
    parseArrays: true,
    plainObjects: false,
    strictNullHandling: false
};

var interpretNumericEntities = function (str) {
    return str.replace(/&#(\d+);/g, function ($0, numberStr) {
        return String.fromCharCode(parseInt(numberStr, 10));
    });
};

var parseArrayValue = function (val, options) {
    if (val && typeof val === 'string' && options.comma && val.indexOf(',') > -1) {
        return val.split(',');
    }

    return val;
};

// This is what browsers will submit when the ✓ character occurs in an
// application/x-www-form-urlencoded body and the encoding of the page containing
// the form is iso-8859-1, or when the submitted form has an accept-charset
// attribute of iso-8859-1. Presumably also with other charsets that do not contain
// the ✓ character, such as us-ascii.
var isoSentinel = 'utf8=%26%2310003%3B'; // encodeURIComponent('&#10003;')

// These are the percent-encoded utf-8 octets representing a checkmark, indicating that the request actually is utf-8 encoded.
var charsetSentinel = 'utf8=%E2%9C%93'; // encodeURIComponent('✓')

var parseValues = function parseQueryStringValues(str, options) {
    var obj = {};
    var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
    var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
    var parts = cleanStr.split(options.delimiter, limit);
    var skipIndex = -1; // Keep track of where the utf8 sentinel was found
    var i;

    var charset = options.charset;
    if (options.charsetSentinel) {
        for (i = 0; i < parts.length; ++i) {
            if (parts[i].indexOf('utf8=') === 0) {
                if (parts[i] === charsetSentinel) {
                    charset = 'utf-8';
                } else if (parts[i] === isoSentinel) {
                    charset = 'iso-8859-1';
                }
                skipIndex = i;
                i = parts.length; // The eslint settings do not allow break;
            }
        }
    }

    for (i = 0; i < parts.length; ++i) {
        if (i === skipIndex) {
            continue;
        }
        var part = parts[i];

        var bracketEqualsPos = part.indexOf(']=');
        var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;

        var key, val;
        if (pos === -1) {
            key = options.decoder(part, defaults.decoder, charset, 'key');
            val = options.strictNullHandling ? null : '';
        } else {
            key = options.decoder(part.slice(0, pos), defaults.decoder, charset, 'key');
            val = utils.maybeMap(
                parseArrayValue(part.slice(pos + 1), options),
                function (encodedVal) {
                    return options.decoder(encodedVal, defaults.decoder, charset, 'value');
                }
            );
        }

        if (val && options.interpretNumericEntities && charset === 'iso-8859-1') {
            val = interpretNumericEntities(val);
        }

        if (part.indexOf('[]=') > -1) {
            val = isArray(val) ? [val] : val;
        }

        if (has.call(obj, key)) {
            obj[key] = utils.combine(obj[key], val);
        } else {
            obj[key] = val;
        }
    }

    return obj;
};

var parseObject = function (chain, val, options, valuesParsed) {
    var leaf = valuesParsed ? val : parseArrayValue(val, options);

    for (var i = chain.length - 1; i >= 0; --i) {
        var obj;
        var root = chain[i];

        if (root === '[]' && options.parseArrays) {
            obj = [].concat(leaf);
        } else {
            obj = options.plainObjects ? Object.create(null) : {};
            var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
            var index = parseInt(cleanRoot, 10);
            if (!options.parseArrays && cleanRoot === '') {
                obj = { 0: leaf };
            } else if (
                !isNaN(index)
                && root !== cleanRoot
                && String(index) === cleanRoot
                && index >= 0
                && (options.parseArrays && index <= options.arrayLimit)
            ) {
                obj = [];
                obj[index] = leaf;
            } else {
                obj[cleanRoot] = leaf;
            }
        }

        leaf = obj;
    }

    return leaf;
};

var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
    if (!givenKey) {
        return;
    }

    // Transform dot notation to bracket notation
    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

    // The regex chunks

    var brackets = /(\[[^[\]]*])/;
    var child = /(\[[^[\]]*])/g;

    // Get the parent

    var segment = options.depth > 0 && brackets.exec(key);
    var parent = segment ? key.slice(0, segment.index) : key;

    // Stash the parent if it exists

    var keys = [];
    if (parent) {
        // If we aren't using plain objects, optionally prefix keys that would overwrite object prototype properties
        if (!options.plainObjects && has.call(Object.prototype, parent)) {
            if (!options.allowPrototypes) {
                return;
            }
        }

        keys.push(parent);
    }

    // Loop through children appending to the array until we hit depth

    var i = 0;
    while (options.depth > 0 && (segment = child.exec(key)) !== null && i < options.depth) {
        i += 1;
        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
            if (!options.allowPrototypes) {
                return;
            }
        }
        keys.push(segment[1]);
    }

    // If there's a remainder, just add whatever is left

    if (segment) {
        keys.push('[' + key.slice(segment.index) + ']');
    }

    return parseObject(keys, val, options, valuesParsed);
};

var normalizeParseOptions = function normalizeParseOptions(opts) {
    if (!opts) {
        return defaults;
    }

    if (opts.decoder !== null && opts.decoder !== undefined && typeof opts.decoder !== 'function') {
        throw new TypeError('Decoder has to be a function.');
    }

    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
    }
    var charset = typeof opts.charset === 'undefined' ? defaults.charset : opts.charset;

    return {
        allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
        allowPrototypes: typeof opts.allowPrototypes === 'boolean' ? opts.allowPrototypes : defaults.allowPrototypes,
        allowSparse: typeof opts.allowSparse === 'boolean' ? opts.allowSparse : defaults.allowSparse,
        arrayLimit: typeof opts.arrayLimit === 'number' ? opts.arrayLimit : defaults.arrayLimit,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        comma: typeof opts.comma === 'boolean' ? opts.comma : defaults.comma,
        decoder: typeof opts.decoder === 'function' ? opts.decoder : defaults.decoder,
        delimiter: typeof opts.delimiter === 'string' || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
        // eslint-disable-next-line no-implicit-coercion, no-extra-parens
        depth: (typeof opts.depth === 'number' || opts.depth === false) ? +opts.depth : defaults.depth,
        ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
        interpretNumericEntities: typeof opts.interpretNumericEntities === 'boolean' ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
        parameterLimit: typeof opts.parameterLimit === 'number' ? opts.parameterLimit : defaults.parameterLimit,
        parseArrays: opts.parseArrays !== false,
        plainObjects: typeof opts.plainObjects === 'boolean' ? opts.plainObjects : defaults.plainObjects,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
    };
};

module.exports = function (str, opts) {
    var options = normalizeParseOptions(opts);

    if (str === '' || str === null || typeof str === 'undefined') {
        return options.plainObjects ? Object.create(null) : {};
    }

    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
    var obj = options.plainObjects ? Object.create(null) : {};

    // Iterate over the keys and setup the new object

    var keys = Object.keys(tempObj);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options, typeof str === 'string');
        obj = utils.merge(obj, newObj, options);
    }

    if (options.allowSparse === true) {
        return obj;
    }

    return utils.compact(obj);
};

},{"./utils":152}],151:[function(require,module,exports){
'use strict';

var getSideChannel = require('side-channel');
var utils = require('./utils');
var formats = require('./formats');
var has = Object.prototype.hasOwnProperty;

var arrayPrefixGenerators = {
    brackets: function brackets(prefix) {
        return prefix + '[]';
    },
    comma: 'comma',
    indices: function indices(prefix, key) {
        return prefix + '[' + key + ']';
    },
    repeat: function repeat(prefix) {
        return prefix;
    }
};

var isArray = Array.isArray;
var push = Array.prototype.push;
var pushToArray = function (arr, valueOrArray) {
    push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);
};

var toISO = Date.prototype.toISOString;

var defaultFormat = formats['default'];
var defaults = {
    addQueryPrefix: false,
    allowDots: false,
    charset: 'utf-8',
    charsetSentinel: false,
    delimiter: '&',
    encode: true,
    encoder: utils.encode,
    encodeValuesOnly: false,
    format: defaultFormat,
    formatter: formats.formatters[defaultFormat],
    // deprecated
    indices: false,
    serializeDate: function serializeDate(date) {
        return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
};

var isNonNullishPrimitive = function isNonNullishPrimitive(v) {
    return typeof v === 'string'
        || typeof v === 'number'
        || typeof v === 'boolean'
        || typeof v === 'symbol'
        || typeof v === 'bigint';
};

var stringify = function stringify(
    object,
    prefix,
    generateArrayPrefix,
    strictNullHandling,
    skipNulls,
    encoder,
    filter,
    sort,
    allowDots,
    serializeDate,
    format,
    formatter,
    encodeValuesOnly,
    charset,
    sideChannel
) {
    var obj = object;

    if (sideChannel.has(object)) {
        throw new RangeError('Cyclic object value');
    }

    if (typeof filter === 'function') {
        obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
        obj = serializeDate(obj);
    } else if (generateArrayPrefix === 'comma' && isArray(obj)) {
        obj = utils.maybeMap(obj, function (value) {
            if (value instanceof Date) {
                return serializeDate(value);
            }
            return value;
        });
    }

    if (obj === null) {
        if (strictNullHandling) {
            return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, 'key', format) : prefix;
        }

        obj = '';
    }

    if (isNonNullishPrimitive(obj) || utils.isBuffer(obj)) {
        if (encoder) {
            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, 'key', format);
            return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder, charset, 'value', format))];
        }
        return [formatter(prefix) + '=' + formatter(String(obj))];
    }

    var values = [];

    if (typeof obj === 'undefined') {
        return values;
    }

    var objKeys;
    if (generateArrayPrefix === 'comma' && isArray(obj)) {
        // we need to join elements in
        objKeys = [{ value: obj.length > 0 ? obj.join(',') || null : undefined }];
    } else if (isArray(filter)) {
        objKeys = filter;
    } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];
        var value = typeof key === 'object' && key.value !== undefined ? key.value : obj[key];

        if (skipNulls && value === null) {
            continue;
        }

        var keyPrefix = isArray(obj)
            ? typeof generateArrayPrefix === 'function' ? generateArrayPrefix(prefix, key) : prefix
            : prefix + (allowDots ? '.' + key : '[' + key + ']');

        sideChannel.set(object, true);
        var valueSideChannel = getSideChannel();
        pushToArray(values, stringify(
            value,
            keyPrefix,
            generateArrayPrefix,
            strictNullHandling,
            skipNulls,
            encoder,
            filter,
            sort,
            allowDots,
            serializeDate,
            format,
            formatter,
            encodeValuesOnly,
            charset,
            valueSideChannel
        ));
    }

    return values;
};

var normalizeStringifyOptions = function normalizeStringifyOptions(opts) {
    if (!opts) {
        return defaults;
    }

    if (opts.encoder !== null && opts.encoder !== undefined && typeof opts.encoder !== 'function') {
        throw new TypeError('Encoder has to be a function.');
    }

    var charset = opts.charset || defaults.charset;
    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
    }

    var format = formats['default'];
    if (typeof opts.format !== 'undefined') {
        if (!has.call(formats.formatters, opts.format)) {
            throw new TypeError('Unknown format option provided.');
        }
        format = opts.format;
    }
    var formatter = formats.formatters[format];

    var filter = defaults.filter;
    if (typeof opts.filter === 'function' || isArray(opts.filter)) {
        filter = opts.filter;
    }

    return {
        addQueryPrefix: typeof opts.addQueryPrefix === 'boolean' ? opts.addQueryPrefix : defaults.addQueryPrefix,
        allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        delimiter: typeof opts.delimiter === 'undefined' ? defaults.delimiter : opts.delimiter,
        encode: typeof opts.encode === 'boolean' ? opts.encode : defaults.encode,
        encoder: typeof opts.encoder === 'function' ? opts.encoder : defaults.encoder,
        encodeValuesOnly: typeof opts.encodeValuesOnly === 'boolean' ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
        filter: filter,
        format: format,
        formatter: formatter,
        serializeDate: typeof opts.serializeDate === 'function' ? opts.serializeDate : defaults.serializeDate,
        skipNulls: typeof opts.skipNulls === 'boolean' ? opts.skipNulls : defaults.skipNulls,
        sort: typeof opts.sort === 'function' ? opts.sort : null,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
    };
};

module.exports = function (object, opts) {
    var obj = object;
    var options = normalizeStringifyOptions(opts);

    var objKeys;
    var filter;

    if (typeof options.filter === 'function') {
        filter = options.filter;
        obj = filter('', obj);
    } else if (isArray(options.filter)) {
        filter = options.filter;
        objKeys = filter;
    }

    var keys = [];

    if (typeof obj !== 'object' || obj === null) {
        return '';
    }

    var arrayFormat;
    if (opts && opts.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = opts.arrayFormat;
    } else if (opts && 'indices' in opts) {
        arrayFormat = opts.indices ? 'indices' : 'repeat';
    } else {
        arrayFormat = 'indices';
    }

    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

    if (!objKeys) {
        objKeys = Object.keys(obj);
    }

    if (options.sort) {
        objKeys.sort(options.sort);
    }

    var sideChannel = getSideChannel();
    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (options.skipNulls && obj[key] === null) {
            continue;
        }
        pushToArray(keys, stringify(
            obj[key],
            key,
            generateArrayPrefix,
            options.strictNullHandling,
            options.skipNulls,
            options.encode ? options.encoder : null,
            options.filter,
            options.sort,
            options.allowDots,
            options.serializeDate,
            options.format,
            options.formatter,
            options.encodeValuesOnly,
            options.charset,
            sideChannel
        ));
    }

    var joined = keys.join(options.delimiter);
    var prefix = options.addQueryPrefix === true ? '?' : '';

    if (options.charsetSentinel) {
        if (options.charset === 'iso-8859-1') {
            // encodeURIComponent('&#10003;'), the "numeric entity" representation of a checkmark
            prefix += 'utf8=%26%2310003%3B&';
        } else {
            // encodeURIComponent('✓')
            prefix += 'utf8=%E2%9C%93&';
        }
    }

    return joined.length > 0 ? prefix + joined : '';
};

},{"./formats":148,"./utils":152,"side-channel":302}],152:[function(require,module,exports){
'use strict';

var formats = require('./formats');

var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;

var hexTable = (function () {
    var array = [];
    for (var i = 0; i < 256; ++i) {
        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
    }

    return array;
}());

var compactQueue = function compactQueue(queue) {
    while (queue.length > 1) {
        var item = queue.pop();
        var obj = item.obj[item.prop];

        if (isArray(obj)) {
            var compacted = [];

            for (var j = 0; j < obj.length; ++j) {
                if (typeof obj[j] !== 'undefined') {
                    compacted.push(obj[j]);
                }
            }

            item.obj[item.prop] = compacted;
        }
    }
};

var arrayToObject = function arrayToObject(source, options) {
    var obj = options && options.plainObjects ? Object.create(null) : {};
    for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== 'undefined') {
            obj[i] = source[i];
        }
    }

    return obj;
};

var merge = function merge(target, source, options) {
    /* eslint no-param-reassign: 0 */
    if (!source) {
        return target;
    }

    if (typeof source !== 'object') {
        if (isArray(target)) {
            target.push(source);
        } else if (target && typeof target === 'object') {
            if ((options && (options.plainObjects || options.allowPrototypes)) || !has.call(Object.prototype, source)) {
                target[source] = true;
            }
        } else {
            return [target, source];
        }

        return target;
    }

    if (!target || typeof target !== 'object') {
        return [target].concat(source);
    }

    var mergeTarget = target;
    if (isArray(target) && !isArray(source)) {
        mergeTarget = arrayToObject(target, options);
    }

    if (isArray(target) && isArray(source)) {
        source.forEach(function (item, i) {
            if (has.call(target, i)) {
                var targetItem = target[i];
                if (targetItem && typeof targetItem === 'object' && item && typeof item === 'object') {
                    target[i] = merge(targetItem, item, options);
                } else {
                    target.push(item);
                }
            } else {
                target[i] = item;
            }
        });
        return target;
    }

    return Object.keys(source).reduce(function (acc, key) {
        var value = source[key];

        if (has.call(acc, key)) {
            acc[key] = merge(acc[key], value, options);
        } else {
            acc[key] = value;
        }
        return acc;
    }, mergeTarget);
};

var assign = function assignSingleSource(target, source) {
    return Object.keys(source).reduce(function (acc, key) {
        acc[key] = source[key];
        return acc;
    }, target);
};

var decode = function (str, decoder, charset) {
    var strWithoutPlus = str.replace(/\+/g, ' ');
    if (charset === 'iso-8859-1') {
        // unescape never throws, no try...catch needed:
        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
    }
    // utf-8
    try {
        return decodeURIComponent(strWithoutPlus);
    } catch (e) {
        return strWithoutPlus;
    }
};

var encode = function encode(str, defaultEncoder, charset, kind, format) {
    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }

    var string = str;
    if (typeof str === 'symbol') {
        string = Symbol.prototype.toString.call(str);
    } else if (typeof str !== 'string') {
        string = String(str);
    }

    if (charset === 'iso-8859-1') {
        return escape(string).replace(/%u[0-9a-f]{4}/gi, function ($0) {
            return '%26%23' + parseInt($0.slice(2), 16) + '%3B';
        });
    }

    var out = '';
    for (var i = 0; i < string.length; ++i) {
        var c = string.charCodeAt(i);

        if (
            c === 0x2D // -
            || c === 0x2E // .
            || c === 0x5F // _
            || c === 0x7E // ~
            || (c >= 0x30 && c <= 0x39) // 0-9
            || (c >= 0x41 && c <= 0x5A) // a-z
            || (c >= 0x61 && c <= 0x7A) // A-Z
            || (format === formats.RFC1738 && (c === 0x28 || c === 0x29)) // ( )
        ) {
            out += string.charAt(i);
            continue;
        }

        if (c < 0x80) {
            out = out + hexTable[c];
            continue;
        }

        if (c < 0x800) {
            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        if (c < 0xD800 || c >= 0xE000) {
            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        i += 1;
        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
        out += hexTable[0xF0 | (c >> 18)]
            + hexTable[0x80 | ((c >> 12) & 0x3F)]
            + hexTable[0x80 | ((c >> 6) & 0x3F)]
            + hexTable[0x80 | (c & 0x3F)];
    }

    return out;
};

var compact = function compact(value) {
    var queue = [{ obj: { o: value }, prop: 'o' }];
    var refs = [];

    for (var i = 0; i < queue.length; ++i) {
        var item = queue[i];
        var obj = item.obj[item.prop];

        var keys = Object.keys(obj);
        for (var j = 0; j < keys.length; ++j) {
            var key = keys[j];
            var val = obj[key];
            if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
                queue.push({ obj: obj, prop: key });
                refs.push(val);
            }
        }
    }

    compactQueue(queue);

    return value;
};

var isRegExp = function isRegExp(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

var isBuffer = function isBuffer(obj) {
    if (!obj || typeof obj !== 'object') {
        return false;
    }

    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};

var combine = function combine(a, b) {
    return [].concat(a, b);
};

var maybeMap = function maybeMap(val, fn) {
    if (isArray(val)) {
        var mapped = [];
        for (var i = 0; i < val.length; i += 1) {
            mapped.push(fn(val[i]));
        }
        return mapped;
    }
    return fn(val);
};

module.exports = {
    arrayToObject: arrayToObject,
    assign: assign,
    combine: combine,
    compact: compact,
    decode: decode,
    encode: encode,
    isBuffer: isBuffer,
    isRegExp: isRegExp,
    maybeMap: maybeMap,
    merge: merge
};

},{"./formats":148}],153:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Chevre Factory
 */
__exportStar(require("@chevre/factory"), exports);

},{"@chevre/factory":112}],154:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],155:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountType = void 0;
/**
 * 予約済の口座タイプ
 */
var AccountType;
(function (AccountType) {
    AccountType["Checking"] = "Checking";
    AccountType["Current"] = "Current";
    AccountType["Deposit"] = "Deposit";
    AccountType["Loan"] = "Loan";
    AccountType["Personal"] = "Personal";
    AccountType["Prepaid"] = "Prepaid";
    AccountType["Savings"] = "Savings";
    AccountType["Transaction"] = "Transaction";
    AccountType["Transactional"] = "Transactional";
})(AccountType = exports.AccountType || (exports.AccountType = {}));

},{}],156:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionStatusType = void 0;
var chevre = require("../chevre");
exports.ActionStatusType = chevre.actionStatusType;

},{"../chevre":153}],157:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * アクションタイプ
 */
var ActionType;
(function (ActionType) {
    ActionType["AuthorizeAction"] = "AuthorizeAction";
    ActionType["CancelAction"] = "CancelAction";
    ActionType["CheckAction"] = "CheckAction";
    ActionType["ConfirmAction"] = "ConfirmAction";
    ActionType["DeleteAction"] = "DeleteAction";
    ActionType["GiveAction"] = "GiveAction";
    ActionType["InformAction"] = "InformAction";
    ActionType["MoneyTransfer"] = "MoneyTransfer";
    ActionType["OrderAction"] = "OrderAction";
    ActionType["PayAction"] = "PayAction";
    ActionType["PrintAction"] = "PrintAction";
    ActionType["RefundAction"] = "RefundAction";
    ActionType["RegisterAction"] = "RegisterAction";
    ActionType["ReturnAction"] = "ReturnAction";
    ActionType["SendAction"] = "SendAction";
    ActionType["UnRegisterAction"] = "UnRegisterAction";
    ActionType["UpdateAction"] = "UpdateAction";
    ActionType["UseAction"] = "UseAction";
})(ActionType || (ActionType = {}));
exports.default = ActionType;

},{}],158:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectType = void 0;
var ObjectType;
(function (ObjectType) {
    ObjectType["PointAward"] = "PointAward";
})(ObjectType = exports.ObjectType || (exports.ObjectType = {}));

},{}],159:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],160:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],161:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectType = void 0;
var ObjectType;
(function (ObjectType) {
    ObjectType["SeatReservation"] = "SeatReservation";
})(ObjectType = exports.ObjectType || (exports.ObjectType = {}));

},{}],162:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceIdentifier = exports.ResultType = void 0;
var ResultType;
(function (ResultType) {
    ResultType["Payment"] = "Payment";
})(ResultType = exports.ResultType || (exports.ResultType = {}));
var ServiceIdentifier;
(function (ServiceIdentifier) {
    ServiceIdentifier["Chevre"] = "Chevre";
    ServiceIdentifier["GMO"] = "GMO";
    ServiceIdentifier["MovieTicket"] = "MovieTicket";
})(ServiceIdentifier = exports.ServiceIdentifier || (exports.ServiceIdentifier = {}));

},{}],163:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],164:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],165:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],166:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],167:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],168:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],169:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],170:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],171:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectType = void 0;
var ObjectType;
(function (ObjectType) {
    ObjectType["PaymentMethod"] = "PaymentMethod";
})(ObjectType = exports.ObjectType || (exports.ObjectType = {}));

},{}],172:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],173:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectType = void 0;
var point_1 = require("../../authorize/award/point");
exports.ObjectType = point_1.ObjectType;

},{"../../authorize/award/point":158}],174:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],175:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],176:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],177:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],178:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],179:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],180:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],181:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],182:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],183:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],184:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"dup":34}],185:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var common_1 = require("./common");
/**
 * AlreadyInUseError
 */
var AlreadyInUseError = /** @class */ (function (_super) {
    __extends(AlreadyInUseError, _super);
    function AlreadyInUseError(entityName, fieldNames, message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = "The specified '" + entityName + "' value is already in use for: " + fieldNames.join(', ') + ".";
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.AlreadyInUse, actualMessage) /* istanbul ignore next */ || this;
        _this.entityName = entityName;
        _this.fieldNames = fieldNames;
        setPrototypeOf(_this, AlreadyInUseError.prototype);
        return _this;
    }
    return AlreadyInUseError;
}(common_1.CinerinoError));
exports.default = AlreadyInUseError;

},{"../errorCode":184,"./common":188,"setprototypeof":301}],186:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var common_1 = require("./common");
/**
 * ArgumentError
 */
var ArgumentError = /** @class */ (function (_super) {
    __extends(ArgumentError, _super);
    function ArgumentError(argumentName, message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = "Invalid or missing argument supplied: " + argumentName + ".";
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.Argument, actualMessage) /* istanbul ignore next */ || this;
        _this.argumentName = argumentName;
        setPrototypeOf(_this, ArgumentError.prototype);
        return _this;
    }
    return ArgumentError;
}(common_1.CinerinoError));
exports.default = ArgumentError;

},{"../errorCode":184,"./common":188,"setprototypeof":301}],187:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var common_1 = require("./common");
/**
 * ArgumentNullError
 */
var ArgumentNullError = /** @class */ (function (_super) {
    __extends(ArgumentNullError, _super);
    function ArgumentNullError(argumentName, message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = "Missing argument: " + argumentName + ".";
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.ArgumentNull, actualMessage) /* istanbul ignore next */ || this;
        _this.argumentName = argumentName;
        setPrototypeOf(_this, ArgumentNullError.prototype);
        return _this;
    }
    return ArgumentNullError;
}(common_1.CinerinoError));
exports.default = ArgumentNullError;

},{"../errorCode":184,"./common":188,"setprototypeof":301}],188:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CinerinoError = void 0;
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
/**
 * CinerinoError
 */
var CinerinoError = /** @class */ (function (_super) {
    __extends(CinerinoError, _super);
    function CinerinoError(code, message) {
        var _this = 
        // tslint:disable-next-line:no-single-line-block-comment
        _super.call(this, message) /* istanbul ignore next */ || this;
        _this.name = 'CinerinoError';
        _this.reason = code;
        setPrototypeOf(_this, CinerinoError.prototype);
        return _this;
    }
    return CinerinoError;
}(Error));
exports.CinerinoError = CinerinoError;

},{"setprototypeof":301}],189:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var common_1 = require("./common");
/**
 * ForbiddenError
 */
var ForbiddenError = /** @class */ (function (_super) {
    __extends(ForbiddenError, _super);
    function ForbiddenError(message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Forbidden.';
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.Forbidden, actualMessage) /* istanbul ignore next */ || this;
        setPrototypeOf(_this, ForbiddenError.prototype);
        return _this;
    }
    return ForbiddenError;
}(common_1.CinerinoError));
exports.default = ForbiddenError;

},{"../errorCode":184,"./common":188,"setprototypeof":301}],190:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var common_1 = require("./common");
/**
 * NotFoundError
 */
var NotFoundError = /** @class */ (function (_super) {
    __extends(NotFoundError, _super);
    function NotFoundError(entityName, message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = "Not Found: " + entityName + ".";
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.NotFound, actualMessage) /* istanbul ignore next */ || this;
        _this.entityName = entityName;
        setPrototypeOf(_this, NotFoundError.prototype);
        return _this;
    }
    return NotFoundError;
}(common_1.CinerinoError));
exports.default = NotFoundError;

},{"../errorCode":184,"./common":188,"setprototypeof":301}],191:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var common_1 = require("./common");
/**
 * NotImplementedError
 */
var NotImplementedError = /** @class */ (function (_super) {
    __extends(NotImplementedError, _super);
    function NotImplementedError(message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Method is not yet implemented.';
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.NotImplemented, actualMessage) /* istanbul ignore next */ || this;
        setPrototypeOf(_this, NotImplementedError.prototype);
        return _this;
    }
    return NotImplementedError;
}(common_1.CinerinoError));
exports.default = NotImplementedError;

},{"../errorCode":184,"./common":188,"setprototypeof":301}],192:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var common_1 = require("./common");
/**
 * RateLimitExceededError
 */
var RateLimitExceededError = /** @class */ (function (_super) {
    __extends(RateLimitExceededError, _super);
    function RateLimitExceededError(message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Rate limit exceeded.';
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.RateLimitExceeded, actualMessage) /* istanbul ignore next */ || this;
        setPrototypeOf(_this, RateLimitExceededError.prototype);
        return _this;
    }
    return RateLimitExceededError;
}(common_1.CinerinoError));
exports.default = RateLimitExceededError;

},{"../errorCode":184,"./common":188,"setprototypeof":301}],193:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var common_1 = require("./common");
/**
 * ServiceUnavailableError
 */
var ServiceUnavailableError = /** @class */ (function (_super) {
    __extends(ServiceUnavailableError, _super);
    function ServiceUnavailableError(message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Service unavailable temporarily.';
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.ServiceUnavailable, actualMessage) /* istanbul ignore next */ || this;
        setPrototypeOf(_this, ServiceUnavailableError.prototype);
        return _this;
    }
    return ServiceUnavailableError;
}(common_1.CinerinoError));
exports.default = ServiceUnavailableError;

},{"../errorCode":184,"./common":188,"setprototypeof":301}],194:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var common_1 = require("./common");
/**
 * UnauthorizedError
 */
var UnauthorizedError = /** @class */ (function (_super) {
    __extends(UnauthorizedError, _super);
    function UnauthorizedError(message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Unauthorized.';
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.Unauthorized, actualMessage) /* istanbul ignore next */ || this;
        setPrototypeOf(_this, UnauthorizedError.prototype);
        return _this;
    }
    return UnauthorizedError;
}(common_1.CinerinoError));
exports.default = UnauthorizedError;

},{"../errorCode":184,"./common":188,"setprototypeof":301}],195:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unauthorized = exports.Cinerino = exports.ServiceUnavailable = exports.RateLimitExceeded = exports.NotImplemented = exports.NotFound = exports.Forbidden = exports.ArgumentNull = exports.Argument = exports.AlreadyInUse = void 0;
/**
 * errors
 */
var alreadyInUse_1 = require("./error/alreadyInUse");
exports.AlreadyInUse = alreadyInUse_1.default;
var argument_1 = require("./error/argument");
exports.Argument = argument_1.default;
var argumentNull_1 = require("./error/argumentNull");
exports.ArgumentNull = argumentNull_1.default;
var common_1 = require("./error/common");
Object.defineProperty(exports, "Cinerino", { enumerable: true, get: function () { return common_1.CinerinoError; } });
var forbidden_1 = require("./error/forbidden");
exports.Forbidden = forbidden_1.default;
var notFound_1 = require("./error/notFound");
exports.NotFound = notFound_1.default;
var notImplemented_1 = require("./error/notImplemented");
exports.NotImplemented = notImplemented_1.default;
var rateLimitExceeded_1 = require("./error/rateLimitExceeded");
exports.RateLimitExceeded = rateLimitExceeded_1.default;
var serviceUnavailable_1 = require("./error/serviceUnavailable");
exports.ServiceUnavailable = serviceUnavailable_1.default;
var unauthorized_1 = require("./error/unauthorized");
exports.Unauthorized = unauthorized_1.default;

},{"./error/alreadyInUse":185,"./error/argument":186,"./error/argumentNull":187,"./error/common":188,"./error/forbidden":189,"./error/notFound":190,"./error/notImplemented":191,"./error/rateLimitExceeded":192,"./error/serviceUnavailable":193,"./error/unauthorized":194}],196:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],197:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],198:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],199:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seatReservation = void 0;
var SeatReservationOfferFactory = require("./offer/seatReservation");
exports.seatReservation = SeatReservationOfferFactory;

},{"./offer/seatReservation":200}],200:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],201:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderType = void 0;
var OrderType;
(function (OrderType) {
    OrderType["Order"] = "Order";
})(OrderType = exports.OrderType || (exports.OrderType = {}));

},{}],202:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 注文ステータス
 */
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["OrderCancelled"] = "OrderCancelled";
    OrderStatus["OrderDelivered"] = "OrderDelivered";
    OrderStatus["OrderInTransit"] = "OrderInTransit";
    OrderStatus["OrderPaymentDue"] = "OrderPaymentDue";
    OrderStatus["OrderPickupAvailable"] = "OrderPickupAvailable";
    OrderStatus["OrderProblem"] = "OrderProblem";
    OrderStatus["OrderProcessing"] = "OrderProcessing";
    OrderStatus["OrderReturned"] = "OrderReturned";
})(OrderStatus || (OrderStatus = {}));
exports.default = OrderStatus;

},{}],203:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],204:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],205:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 決済ステータス
 */
var PaymentStatusType;
(function (PaymentStatusType) {
    PaymentStatusType["PaymentAutomaticallyApplied"] = "PaymentAutomaticallyApplied";
    PaymentStatusType["PaymentComplete"] = "PaymentComplete";
    PaymentStatusType["PaymentDeclined"] = "PaymentDeclined";
    PaymentStatusType["PaymentDue"] = "PaymentDue";
    PaymentStatusType["PaymentPastDue"] = "PaymentPastDue";
})(PaymentStatusType || (PaymentStatusType = {}));
exports.default = PaymentStatusType;

},{}],206:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],207:[function(require,module,exports){
"use strict";
/**
 * 人物タイプ
 */
Object.defineProperty(exports, "__esModule", { value: true });
var PersonType;
(function (PersonType) {
    PersonType["Person"] = "Person";
})(PersonType || (PersonType = {}));
exports.default = PersonType;

},{}],208:[function(require,module,exports){
arguments[4][68][0].apply(exports,arguments)
},{"dup":68}],209:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],210:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],211:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],212:[function(require,module,exports){
arguments[4][82][0].apply(exports,arguments)
},{"dup":82}],213:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * タスク名
 */
var TaskName;
(function (TaskName) {
    /**
     * イベント予約集計
     */
    TaskName["AggregateEventReservations"] = "aggregateEventReservations";
    /**
     * 予約取消
     */
    TaskName["CancelReservation"] = "cancelReservation";
    /**
     * 予約確定
     */
    TaskName["ConfirmReservation"] = "confirmReservation";
    /**
     * 会員削除
     */
    TaskName["DeleteMember"] = "deleteMember";
    /**
     * ポイントインセンティブ付与
     */
    TaskName["GivePointAward"] = "givePointAward";
    /**
     * 通貨転送
     */
    TaskName["MoneyTransfer"] = "moneyTransfer";
    /**
     * メンバーシップ注文
     */
    TaskName["OrderProgramMembership"] = "orderProgramMembership";
    /**
     * 決済
     */
    TaskName["Pay"] = "pay";
    /**
     * 注文受付
     */
    TaskName["PlaceOrder"] = "placeOrder";
    /**
     * 返金
     */
    TaskName["Refund"] = "refund";
    /**
     * サービス登録
     */
    TaskName["RegisterService"] = "registerService";
    /**
     * 注文返品
     */
    TaskName["ReturnOrder"] = "returnOrder";
    /**
     * ポイントインセンティブ返却
     */
    TaskName["ReturnPointAward"] = "returnPointAward";
    /**
     *  Eメールメッセージ送信
     */
    TaskName["SendEmailMessage"] = "sendEmailMessage";
    /**
     * 注文配送
     */
    TaskName["SendOrder"] = "sendOrder";
    /**
     * ウェブフックをたたく
     */
    TaskName["TriggerWebhook"] = "triggerWebhook";
    /**
     * メンバーシップ登録解除
     */
    TaskName["UnRegisterProgramMembership"] = "unRegisterProgramMembership";
    /**
     * 通貨転送中止
     */
    TaskName["VoidMoneyTransfer"] = "voidMoneyTransfer";
    /**
     * 決済中止
     */
    TaskName["VoidPayment"] = "voidPayment";
    /**
     * サービス登録中止
     */
    TaskName["VoidRegisterService"] = "voidRegisterService";
    /**
     * 予約中止
     */
    TaskName["VoidReserve"] = "voidReserve";
})(TaskName || (TaskName = {}));
exports.default = TaskName;

},{}],214:[function(require,module,exports){
"use strict";
/**
 * タスクステータス
 */
Object.defineProperty(exports, "__esModule", { value: true });
var TaskStatus;
(function (TaskStatus) {
    /**
     * 準備OK
     */
    TaskStatus["Ready"] = "Ready";
    /**
     * 実行中
     */
    TaskStatus["Running"] = "Running";
    /**
     * 実行済
     */
    TaskStatus["Executed"] = "Executed";
    /**
     * 実行中止
     */
    TaskStatus["Aborted"] = "Aborted";
})(TaskStatus || (TaskStatus = {}));
exports.default = TaskStatus;

},{}],215:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],216:[function(require,module,exports){
arguments[4][102][0].apply(exports,arguments)
},{"dup":102}],217:[function(require,module,exports){
arguments[4][103][0].apply(exports,arguments)
},{"dup":103}],218:[function(require,module,exports){
"use strict";
/**
 * 取引タイプ
 */
Object.defineProperty(exports, "__esModule", { value: true });
var TransactionType;
(function (TransactionType) {
    /**
     * 通貨転送
     */
    TransactionType["MoneyTransfer"] = "MoneyTransfer";
    /**
     * 注文取引
     */
    TransactionType["PlaceOrder"] = "PlaceOrder";
    /**
     * 注文返品取引
     */
    TransactionType["ReturnOrder"] = "ReturnOrder";
})(TransactionType || (TransactionType = {}));
exports.default = TransactionType;

},{}],219:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],220:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],221:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reason = void 0;
/**
 * 返品理由
 */
var Reason;
(function (Reason) {
    /**
     * 顧客自身の都合での返品
     */
    Reason["Customer"] = "Customer";
    /**
     * 販売者都合での返品
     */
    Reason["Seller"] = "Seller";
})(Reason = exports.Reason || (exports.Reason = {}));

},{}],222:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionType = exports.transactionTasksExportationStatus = exports.transactionStatusType = exports.transaction = exports.taskStatus = exports.taskName = exports.task = exports.sortType = exports.seller = exports.service = exports.quantitativeValue = exports.propertyValue = exports.project = exports.programMembership = exports.personType = exports.person = exports.paymentStatusType = exports.paymentMethodType = exports.priceCurrency = exports.ownershipInfo = exports.orderStatus = exports.order = exports.offer = exports.invoice = exports.event = exports.creativeWork = exports.authorization = exports.action = exports.actionType = exports.actionStatusType = exports.accountType = exports.errorCode = exports.errors = exports.waiter = exports.pecorino = exports.chevre = exports.cognito = void 0;
/**
 * factory
 */
var pecorino = require("@pecorino/factory");
var waiter = require("@waiter/factory");
var chevre = require("./chevre");
var cognito = require("./cognito");
var PointAwardAuthorizeActionFactory = require("./factory/action/authorize/award/point");
var AuthorizeMonetaryAmountOfferActionFactory = require("./factory/action/authorize/offer/monetaryAmount");
var AuthorizeProductOfferActionFactory = require("./factory/action/authorize/offer/product");
var AuthorizeSeatReservationOfferActionFactory = require("./factory/action/authorize/offer/seatReservation");
var AuthorizeAnyPaymentActionFactory = require("./factory/action/authorize/paymentMethod/any");
var CheckMovieTicketActionFactory = require("./factory/action/check/paymentMethod/movieTicket");
var CheckTokenActionFactory = require("./factory/action/check/token");
var ConfirmReservationActionFactory = require("./factory/action/interact/confirm/reservation");
var InformActionFactory = require("./factory/action/interact/inform");
var RegisterServiceActionFactory = require("./factory/action/interact/register/service");
var UnRegisterProgramMembershipActionFactory = require("./factory/action/interact/unRegister/programMembership");
var CancelActionFactory = require("./factory/action/organize/cancel");
var OrderActionFactory = require("./factory/action/trade/order");
var PayActionFactory = require("./factory/action/trade/pay");
var RefundActionFactory = require("./factory/action/trade/refund");
var GivePointAwardActionFactory = require("./factory/action/transfer/give/pointAward");
var MoneyTransferActionFactory = require("./factory/action/transfer/moneyTransfer");
var PrintTicketActionFactory = require("./factory/action/transfer/print/ticket");
var ReturnOrderActionFactory = require("./factory/action/transfer/return/order");
var ReturnPointAwardActionFactory = require("./factory/action/transfer/return/pointAward");
var SendEmailMessageActionFactory = require("./factory/action/transfer/send/message/email");
var SendOrderActionFactory = require("./factory/action/transfer/send/order");
var DeleteMemberActionFactory = require("./factory/action/update/delete/member");
var actionStatusType_1 = require("./factory/actionStatusType");
var actionType_1 = require("./factory/actionType");
var accountType_1 = require("./factory/accountType");
var AuthorizationFactory = require("./factory/authorization");
var EmailMessageFactory = require("./factory/creativeWork/message/email");
var WebApplicationFactory = require("./factory/creativeWork/softwareApplication/webApplication");
var ScreeningEventFactory = require("./factory/event/screeningEvent");
var ScreeningEventSeriesFactory = require("./factory/event/screeningEventSeries");
var InvoiceFactory = require("./factory/invoice");
var OfferFactory = require("./factory/offer");
var OrderFactory = require("./factory/order");
var orderStatus_1 = require("./factory/orderStatus");
var ProjectFactory = require("./factory/organization/project");
var OwnershipInfoFactory = require("./factory/ownershipInfo");
var paymentStatusType_1 = require("./factory/paymentStatusType");
var PersonFactory = require("./factory/person");
var personType_1 = require("./factory/personType");
var priceCurrency_1 = require("./factory/priceCurrency");
var ProgramMembershipFactory = require("./factory/programMembership");
var PropertyValueFactory = require("./factory/propertyValue");
var QuantitativeValueFactory = require("./factory/quantitativeValue");
var sortType_1 = require("./factory/sortType");
var OrderProgramMembershipTaskFactory = require("./factory/task/orderProgramMembership");
var taskName_1 = require("./factory/taskName");
var taskStatus_1 = require("./factory/taskStatus");
var MoneyTransferTransactionFactory = require("./factory/transaction/moneyTransfer");
var PlaceOrderTransactionFactory = require("./factory/transaction/placeOrder");
var ReturnOrderTransactionFactory = require("./factory/transaction/returnOrder");
var transactionStatusType_1 = require("./factory/transactionStatusType");
var transactionTasksExportationStatus_1 = require("./factory/transactionTasksExportationStatus");
var transactionType_1 = require("./factory/transactionType");
var errorCode_1 = require("./factory/errorCode");
var errors = require("./factory/errors");
exports.cognito = cognito;
exports.chevre = chevre;
exports.pecorino = pecorino;
exports.waiter = waiter;
exports.errors = errors;
exports.errorCode = errorCode_1.default;
exports.accountType = accountType_1.AccountType;
exports.actionStatusType = actionStatusType_1.ActionStatusType;
exports.actionType = actionType_1.default;
var action;
(function (action) {
    var authorize;
    (function (authorize) {
        var award;
        (function (award) {
            award.point = PointAwardAuthorizeActionFactory;
        })(award = authorize.award || (authorize.award = {}));
        var paymentMethod;
        (function (paymentMethod) {
            paymentMethod.any = AuthorizeAnyPaymentActionFactory;
        })(paymentMethod = authorize.paymentMethod || (authorize.paymentMethod = {}));
        // tslint:disable-next-line:no-shadowed-variable
        var offer;
        (function (offer) {
            offer.monetaryAmount = AuthorizeMonetaryAmountOfferActionFactory;
            offer.product = AuthorizeProductOfferActionFactory;
            offer.seatReservation = AuthorizeSeatReservationOfferActionFactory;
        })(offer = authorize.offer || (authorize.offer = {}));
    })(authorize = action.authorize || (action.authorize = {}));
    var check;
    (function (check) {
        // tslint:disable-next-line:no-shadowed-variable
        var paymentMethod;
        (function (paymentMethod) {
            paymentMethod.movieTicket = CheckMovieTicketActionFactory;
        })(paymentMethod = check.paymentMethod || (check.paymentMethod = {}));
        check.token = CheckTokenActionFactory;
    })(check = action.check || (action.check = {}));
    var interact;
    (function (interact) {
        var confirm;
        (function (confirm) {
            confirm.reservation = ConfirmReservationActionFactory;
        })(confirm = interact.confirm || (interact.confirm = {}));
        interact.inform = InformActionFactory;
        var register;
        (function (register) {
            // tslint:disable-next-line:no-shadowed-variable
            register.service = RegisterServiceActionFactory;
        })(register = interact.register || (interact.register = {}));
        var unRegister;
        (function (unRegister) {
            // tslint:disable-next-line:no-shadowed-variable
            unRegister.programMembership = UnRegisterProgramMembershipActionFactory;
        })(unRegister = interact.unRegister || (interact.unRegister = {}));
    })(interact = action.interact || (action.interact = {}));
    var organize;
    (function (organize) {
        organize.cancel = CancelActionFactory;
    })(organize = action.organize || (action.organize = {}));
    var trade;
    (function (trade) {
        // tslint:disable-next-line:no-shadowed-variable
        trade.order = OrderActionFactory;
        trade.pay = PayActionFactory;
        trade.refund = RefundActionFactory;
    })(trade = action.trade || (action.trade = {}));
    var transfer;
    (function (transfer) {
        var give;
        (function (give) {
            // tslint:disable-next-line:no-shadowed-variable
            give.pointAward = GivePointAwardActionFactory;
        })(give = transfer.give || (transfer.give = {}));
        transfer.moneyTransfer = MoneyTransferActionFactory;
        var print;
        (function (print) {
            print.ticket = PrintTicketActionFactory;
        })(print = transfer.print || (transfer.print = {}));
        /**
         * 返却アクション
         * returnはネームスペース名に使えないのでreturnAction
         */
        var returnAction;
        (function (returnAction) {
            // tslint:disable-next-line:no-shadowed-variable
            returnAction.order = ReturnOrderActionFactory;
            returnAction.pointAward = ReturnPointAwardActionFactory;
        })(returnAction = transfer.returnAction || (transfer.returnAction = {}));
        var send;
        (function (send) {
            var message;
            (function (message) {
                message.email = SendEmailMessageActionFactory;
            })(message = send.message || (send.message = {}));
            // tslint:disable-next-line:no-shadowed-variable
            send.order = SendOrderActionFactory;
        })(send = transfer.send || (transfer.send = {}));
    })(transfer = action.transfer || (action.transfer = {}));
    var update;
    (function (update) {
        var deleteAction;
        (function (deleteAction) {
            deleteAction.member = DeleteMemberActionFactory;
        })(deleteAction = update.deleteAction || (update.deleteAction = {}));
    })(update = action.update || (action.update = {}));
})(action = exports.action || (exports.action = {}));
exports.authorization = AuthorizationFactory;
var creativeWork;
(function (creativeWork) {
    var message;
    (function (message) {
        message.email = EmailMessageFactory;
    })(message = creativeWork.message || (creativeWork.message = {}));
    var softwareApplication;
    (function (softwareApplication) {
        softwareApplication.webApplication = WebApplicationFactory;
    })(softwareApplication = creativeWork.softwareApplication || (creativeWork.softwareApplication = {}));
})(creativeWork = exports.creativeWork || (exports.creativeWork = {}));
var event;
(function (event) {
    event.screeningEvent = ScreeningEventFactory;
    event.screeningEventSeries = ScreeningEventSeriesFactory;
})(event = exports.event || (exports.event = {}));
exports.invoice = InvoiceFactory;
exports.offer = OfferFactory;
exports.order = OrderFactory;
exports.orderStatus = orderStatus_1.default;
exports.ownershipInfo = OwnershipInfoFactory;
exports.priceCurrency = priceCurrency_1.default;
exports.paymentMethodType = chevre.paymentMethodType;
exports.paymentStatusType = paymentStatusType_1.default;
exports.person = PersonFactory;
exports.personType = personType_1.default;
exports.programMembership = ProgramMembershipFactory;
exports.project = ProjectFactory;
exports.propertyValue = PropertyValueFactory;
exports.quantitativeValue = QuantitativeValueFactory;
exports.service = chevre.service;
exports.seller = chevre.seller;
exports.sortType = sortType_1.default;
var task;
(function (task) {
    task.orderProgramMembership = OrderProgramMembershipTaskFactory;
})(task = exports.task || (exports.task = {}));
exports.taskName = taskName_1.default;
exports.taskStatus = taskStatus_1.default;
var transaction;
(function (transaction) {
    transaction.moneyTransfer = MoneyTransferTransactionFactory;
    transaction.placeOrder = PlaceOrderTransactionFactory;
    transaction.returnOrder = ReturnOrderTransactionFactory;
})(transaction = exports.transaction || (exports.transaction = {}));
exports.transactionStatusType = transactionStatusType_1.default;
exports.transactionTasksExportationStatus = transactionTasksExportationStatus_1.default;
exports.transactionType = transactionType_1.default;

},{"./chevre":153,"./cognito":154,"./factory/accountType":155,"./factory/action/authorize/award/point":158,"./factory/action/authorize/offer/monetaryAmount":159,"./factory/action/authorize/offer/product":160,"./factory/action/authorize/offer/seatReservation":161,"./factory/action/authorize/paymentMethod/any":162,"./factory/action/check/paymentMethod/movieTicket":163,"./factory/action/check/token":164,"./factory/action/interact/confirm/reservation":165,"./factory/action/interact/inform":166,"./factory/action/interact/register/service":167,"./factory/action/interact/unRegister/programMembership":168,"./factory/action/organize/cancel":169,"./factory/action/trade/order":170,"./factory/action/trade/pay":171,"./factory/action/trade/refund":172,"./factory/action/transfer/give/pointAward":173,"./factory/action/transfer/moneyTransfer":174,"./factory/action/transfer/print/ticket":175,"./factory/action/transfer/return/order":176,"./factory/action/transfer/return/pointAward":177,"./factory/action/transfer/send/message/email":178,"./factory/action/transfer/send/order":179,"./factory/action/update/delete/member":180,"./factory/actionStatusType":156,"./factory/actionType":157,"./factory/authorization":181,"./factory/creativeWork/message/email":182,"./factory/creativeWork/softwareApplication/webApplication":183,"./factory/errorCode":184,"./factory/errors":195,"./factory/event/screeningEvent":196,"./factory/event/screeningEventSeries":197,"./factory/invoice":198,"./factory/offer":199,"./factory/order":201,"./factory/orderStatus":202,"./factory/organization/project":203,"./factory/ownershipInfo":204,"./factory/paymentStatusType":205,"./factory/person":206,"./factory/personType":207,"./factory/priceCurrency":208,"./factory/programMembership":209,"./factory/propertyValue":210,"./factory/quantitativeValue":211,"./factory/sortType":212,"./factory/task/orderProgramMembership":215,"./factory/taskName":213,"./factory/taskStatus":214,"./factory/transaction/moneyTransfer":219,"./factory/transaction/placeOrder":220,"./factory/transaction/returnOrder":221,"./factory/transactionStatusType":216,"./factory/transactionTasksExportationStatus":217,"./factory/transactionType":218,"@pecorino/factory":258,"@waiter/factory":272}],223:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],224:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 口座ステータスタイプ
 */
var AccountStatusType;
(function (AccountStatusType) {
    /**
     * 開設済
     */
    AccountStatusType["Opened"] = "Opened";
    /**
     * 解約済
     */
    AccountStatusType["Closed"] = "Closed";
})(AccountStatusType || (AccountStatusType = {}));
exports.default = AccountStatusType;

},{}],225:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"dup":14}],226:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * アクションタイプ
 */
var ActionType;
(function (ActionType) {
    ActionType["AuthorizeAction"] = "AuthorizeAction";
    ActionType["MoneyTransfer"] = "MoneyTransfer";
    ActionType["OrderAction"] = "OrderAction";
    ActionType["PayAction"] = "PayAction";
    ActionType["PrintAction"] = "PrintAction";
    ActionType["RefundAction"] = "RefundAction";
    ActionType["ReturnAction"] = "ReturnAction";
    ActionType["SendAction"] = "SendAction";
    ActionType["TakeAction"] = "TakeAction";
    ActionType["UseAction"] = "UseAction";
})(ActionType || (ActionType = {}));
exports.default = ActionType;

},{}],227:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],228:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],229:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],230:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 作品タイプ
 */
var CreativeWorkType;
(function (CreativeWorkType) {
    CreativeWorkType["EmailMessage"] = "EmailMessage";
})(CreativeWorkType || (CreativeWorkType = {}));
exports.default = CreativeWorkType;

},{}],231:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],232:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * エラーコード
 */
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["AlreadyInUse"] = "AlreadyInUse";
    ErrorCode["Argument"] = "Argument";
    ErrorCode["ArgumentNull"] = "ArgumentNull";
    ErrorCode["Forbidden"] = "Forbidden";
    ErrorCode["NotFound"] = "NotFound";
    ErrorCode["NotImplemented"] = "NotImplemented";
    ErrorCode["RateLimitExceeded"] = "RateLimitExceeded";
    ErrorCode["ServiceUnavailable"] = "ServiceUnavailable";
    ErrorCode["Unauthorized"] = "Unauthorized";
})(ErrorCode || (ErrorCode = {}));
exports.default = ErrorCode;

},{}],233:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var pecorino_1 = require("./pecorino");
/**
 * AlreadyInUseError
 */
var AlreadyInUseError = /** @class */ (function (_super) {
    __extends(AlreadyInUseError, _super);
    function AlreadyInUseError(entityName, fieldNames, message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = "The specified '" + entityName + "' value is already in use for: " + fieldNames.join(', ') + ".";
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.AlreadyInUse, actualMessage) /* istanbul ignore next */ || this;
        _this.entityName = entityName;
        _this.fieldNames = fieldNames;
        setPrototypeOf(_this, AlreadyInUseError.prototype);
        return _this;
    }
    return AlreadyInUseError;
}(pecorino_1.PecorinoError));
exports.default = AlreadyInUseError;

},{"../errorCode":232,"./pecorino":239,"setprototypeof":301}],234:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var pecorino_1 = require("./pecorino");
/**
 * ArgumentError
 */
var ArgumentError = /** @class */ (function (_super) {
    __extends(ArgumentError, _super);
    function ArgumentError(argumentName, message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = "Invalid or missing argument supplied: " + argumentName + ".";
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.Argument, actualMessage) /* istanbul ignore next */ || this;
        _this.argumentName = argumentName;
        setPrototypeOf(_this, ArgumentError.prototype);
        return _this;
    }
    return ArgumentError;
}(pecorino_1.PecorinoError));
exports.default = ArgumentError;

},{"../errorCode":232,"./pecorino":239,"setprototypeof":301}],235:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var pecorino_1 = require("./pecorino");
/**
 * ArgumentNullError
 */
var ArgumentNullError = /** @class */ (function (_super) {
    __extends(ArgumentNullError, _super);
    function ArgumentNullError(argumentName, message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = "Missing argument: " + argumentName + ".";
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.ArgumentNull, actualMessage) /* istanbul ignore next */ || this;
        _this.argumentName = argumentName;
        setPrototypeOf(_this, ArgumentNullError.prototype);
        return _this;
    }
    return ArgumentNullError;
}(pecorino_1.PecorinoError));
exports.default = ArgumentNullError;

},{"../errorCode":232,"./pecorino":239,"setprototypeof":301}],236:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var pecorino_1 = require("./pecorino");
/**
 * ForbiddenError
 */
var ForbiddenError = /** @class */ (function (_super) {
    __extends(ForbiddenError, _super);
    function ForbiddenError(message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Forbidden.';
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.Forbidden, actualMessage) /* istanbul ignore next */ || this;
        setPrototypeOf(_this, ForbiddenError.prototype);
        return _this;
    }
    return ForbiddenError;
}(pecorino_1.PecorinoError));
exports.default = ForbiddenError;

},{"../errorCode":232,"./pecorino":239,"setprototypeof":301}],237:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var pecorino_1 = require("./pecorino");
/**
 * NotFoundError
 */
var NotFoundError = /** @class */ (function (_super) {
    __extends(NotFoundError, _super);
    function NotFoundError(entityName, message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = "Not Found: " + entityName + ".";
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.NotFound, actualMessage) /* istanbul ignore next */ || this;
        _this.entityName = entityName;
        setPrototypeOf(_this, NotFoundError.prototype);
        return _this;
    }
    return NotFoundError;
}(pecorino_1.PecorinoError));
exports.default = NotFoundError;

},{"../errorCode":232,"./pecorino":239,"setprototypeof":301}],238:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var pecorino_1 = require("./pecorino");
/**
 * NotImplementedError
 */
var NotImplementedError = /** @class */ (function (_super) {
    __extends(NotImplementedError, _super);
    function NotImplementedError(message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Method is not yet implemented.';
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.NotImplemented, actualMessage) /* istanbul ignore next */ || this;
        setPrototypeOf(_this, NotImplementedError.prototype);
        return _this;
    }
    return NotImplementedError;
}(pecorino_1.PecorinoError));
exports.default = NotImplementedError;

},{"../errorCode":232,"./pecorino":239,"setprototypeof":301}],239:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * PecorinoError
 * @extends {Error}
 */
var PecorinoError = /** @class */ (function (_super) {
    __extends(PecorinoError, _super);
    function PecorinoError(code, message) {
        var _this = 
        // tslint:disable-next-line:no-single-line-block-comment
        _super.call(this, message) /* istanbul ignore next */ || this;
        _this.name = 'PecorinoError';
        _this.reason = code;
        return _this;
    }
    return PecorinoError;
}(Error));
exports.PecorinoError = PecorinoError;

},{}],240:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var pecorino_1 = require("./pecorino");
/**
 * RateLimitExceededError
 */
var RateLimitExceededError = /** @class */ (function (_super) {
    __extends(RateLimitExceededError, _super);
    function RateLimitExceededError(message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Rate limit exceeded.';
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.RateLimitExceeded, actualMessage) /* istanbul ignore next */ || this;
        setPrototypeOf(_this, RateLimitExceededError.prototype);
        return _this;
    }
    return RateLimitExceededError;
}(pecorino_1.PecorinoError));
exports.default = RateLimitExceededError;

},{"../errorCode":232,"./pecorino":239,"setprototypeof":301}],241:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var pecorino_1 = require("./pecorino");
/**
 * ServiceUnavailableError
 */
var ServiceUnavailableError = /** @class */ (function (_super) {
    __extends(ServiceUnavailableError, _super);
    function ServiceUnavailableError(message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Service unavailable temporarily.';
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.ServiceUnavailable, actualMessage) /* istanbul ignore next */ || this;
        setPrototypeOf(_this, ServiceUnavailableError.prototype);
        return _this;
    }
    return ServiceUnavailableError;
}(pecorino_1.PecorinoError));
exports.default = ServiceUnavailableError;

},{"../errorCode":232,"./pecorino":239,"setprototypeof":301}],242:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var pecorino_1 = require("./pecorino");
/**
 * UnauthorizedError
 */
var UnauthorizedError = /** @class */ (function (_super) {
    __extends(UnauthorizedError, _super);
    function UnauthorizedError(message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Unauthorized.';
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.Unauthorized, actualMessage) /* istanbul ignore next */ || this;
        setPrototypeOf(_this, UnauthorizedError.prototype);
        return _this;
    }
    return UnauthorizedError;
}(pecorino_1.PecorinoError));
exports.default = UnauthorizedError;

},{"../errorCode":232,"./pecorino":239,"setprototypeof":301}],243:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * errors
 */
var alreadyInUse_1 = require("./error/alreadyInUse");
exports.AlreadyInUse = alreadyInUse_1.default;
var argument_1 = require("./error/argument");
exports.Argument = argument_1.default;
var argumentNull_1 = require("./error/argumentNull");
exports.ArgumentNull = argumentNull_1.default;
var forbidden_1 = require("./error/forbidden");
exports.Forbidden = forbidden_1.default;
var notFound_1 = require("./error/notFound");
exports.NotFound = notFound_1.default;
var notImplemented_1 = require("./error/notImplemented");
exports.NotImplemented = notImplemented_1.default;
var pecorino_1 = require("./error/pecorino");
exports.PECORINO = pecorino_1.PecorinoError;
var rateLimitExceeded_1 = require("./error/rateLimitExceeded");
exports.RateLimitExceeded = rateLimitExceeded_1.default;
var serviceUnavailable_1 = require("./error/serviceUnavailable");
exports.ServiceUnavailable = serviceUnavailable_1.default;
var unauthorized_1 = require("./error/unauthorized");
exports.Unauthorized = unauthorized_1.default;

},{"./error/alreadyInUse":233,"./error/argument":234,"./error/argumentNull":235,"./error/forbidden":236,"./error/notFound":237,"./error/notImplemented":238,"./error/pecorino":239,"./error/rateLimitExceeded":240,"./error/serviceUnavailable":241,"./error/unauthorized":242}],244:[function(require,module,exports){
arguments[4][68][0].apply(exports,arguments)
},{"dup":68}],245:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],246:[function(require,module,exports){
arguments[4][82][0].apply(exports,arguments)
},{"dup":82}],247:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * タスク名
 */
var TaskName;
(function (TaskName) {
    /**
     * 通貨転送中止
     */
    TaskName["CancelMoneyTransfer"] = "cancelMoneyTransfer";
    /**
     * 通貨転送
     */
    TaskName["MoneyTransfer"] = "moneyTransfer";
    /**
     * 通貨転送返金
     */
    TaskName["ReturnMoneyTransfer"] = "returnMoneyTransfer";
})(TaskName || (TaskName = {}));
exports.default = TaskName;

},{}],248:[function(require,module,exports){
arguments[4][85][0].apply(exports,arguments)
},{"dup":85}],249:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],250:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],251:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],252:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 取引ステータス
 */
var TransactionStatusType;
(function (TransactionStatusType) {
    TransactionStatusType["InProgress"] = "InProgress";
    TransactionStatusType["Canceled"] = "Canceled";
    TransactionStatusType["Confirmed"] = "Confirmed";
    TransactionStatusType["Expired"] = "Expired";
    TransactionStatusType["Returned"] = "Returned";
})(TransactionStatusType || (TransactionStatusType = {}));
exports.default = TransactionStatusType;

},{}],253:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 取引タスクエクスポートステータス
 */
var TransactionTasksExportationStatus;
(function (TransactionTasksExportationStatus) {
    /**
     * 未エクスポート
     */
    TransactionTasksExportationStatus["Unexported"] = "Unexported";
    /**
     * エクスポート中
     */
    TransactionTasksExportationStatus["Exporting"] = "Exporting";
    /**
     * エクスポート済
     */
    TransactionTasksExportationStatus["Exported"] = "Exported";
})(TransactionTasksExportationStatus || (TransactionTasksExportationStatus = {}));
exports.default = TransactionTasksExportationStatus;

},{}],254:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 取引タイプ
 */
var TransactionType;
(function (TransactionType) {
    /**
     * 出金取引
     */
    TransactionType["Withdraw"] = "Withdraw";
    /**
     * 入金取引
     */
    TransactionType["Deposit"] = "Deposit";
    /**
     * 転送取引
     */
    TransactionType["Transfer"] = "Transfer";
})(TransactionType || (TransactionType = {}));
exports.default = TransactionType;

},{}],255:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],256:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],257:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],258:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * factory
 */
var AccountFactory = require("./factory/account");
var accountStatusType_1 = require("./factory/accountStatusType");
var MoneyTransferActionFactory = require("./factory/action/transfer/moneyTransfer");
var SendEmailMessageActionFactory = require("./factory/action/transfer/send/message/email");
var actionStatusType_1 = require("./factory/actionStatusType");
var actionType_1 = require("./factory/actionType");
var ClientUserFactory = require("./factory/clientUser");
var EmailMessageFactory = require("./factory/creativeWork/message/email");
var creativeWorkType_1 = require("./factory/creativeWorkType");
var priceCurrency_1 = require("./factory/priceCurrency");
var ProjectFactory = require("./factory/project");
var CancelMoneyTransferTaskFactory = require("./factory/task/cancelMoneyTransfer");
var MoneyTransferTaskFactory = require("./factory/task/moneyTransfer");
var ReturnMoneyTransferTaskFactory = require("./factory/task/returnMoneyTransfer");
var taskName_1 = require("./factory/taskName");
var taskStatus_1 = require("./factory/taskStatus");
var DepositTransactionFactory = require("./factory/transaction/deposit");
var TransferTransactionFactory = require("./factory/transaction/transfer");
var WithdrawTransactionFactory = require("./factory/transaction/withdraw");
var transactionStatusType_1 = require("./factory/transactionStatusType");
var transactionTasksExportationStatus_1 = require("./factory/transactionTasksExportationStatus");
var transactionType_1 = require("./factory/transactionType");
var sortType_1 = require("./factory/sortType");
var errorCode_1 = require("./factory/errorCode");
var errors = require("./factory/errors");
exports.errors = errors;
exports.errorCode = errorCode_1.default;
exports.actionStatusType = actionStatusType_1.default;
exports.actionType = actionType_1.default;
var action;
(function (action) {
    var transfer;
    (function (transfer) {
        transfer.moneyTransfer = MoneyTransferActionFactory;
        var send;
        (function (send) {
            var message;
            (function (message) {
                message.email = SendEmailMessageActionFactory;
            })(message = send.message || (send.message = {}));
        })(send = transfer.send || (transfer.send = {}));
    })(transfer = action.transfer || (action.transfer = {}));
})(action = exports.action || (exports.action = {}));
exports.account = AccountFactory;
exports.accountStatusType = accountStatusType_1.default;
exports.clientUser = ClientUserFactory;
var creativeWork;
(function (creativeWork) {
    var message;
    (function (message) {
        message.email = EmailMessageFactory;
    })(message = creativeWork.message || (creativeWork.message = {}));
})(creativeWork = exports.creativeWork || (exports.creativeWork = {}));
exports.creativeWorkType = creativeWorkType_1.default;
exports.priceCurrency = priceCurrency_1.default;
exports.project = ProjectFactory;
var task;
(function (task) {
    task.cancelMoneyTransfer = CancelMoneyTransferTaskFactory;
    task.moneyTransfer = MoneyTransferTaskFactory;
    task.returnMoneyTransfer = ReturnMoneyTransferTaskFactory;
})(task = exports.task || (exports.task = {}));
exports.sortType = sortType_1.default;
exports.taskName = taskName_1.default;
exports.taskStatus = taskStatus_1.default;
var transaction;
(function (transaction) {
    transaction.withdraw = WithdrawTransactionFactory;
    transaction.deposit = DepositTransactionFactory;
    transaction.transfer = TransferTransactionFactory;
})(transaction = exports.transaction || (exports.transaction = {}));
exports.transactionStatusType = transactionStatusType_1.default;
exports.transactionTasksExportationStatus = transactionTasksExportationStatus_1.default;
exports.transactionType = transactionType_1.default;

},{"./factory/account":223,"./factory/accountStatusType":224,"./factory/action/transfer/moneyTransfer":227,"./factory/action/transfer/send/message/email":228,"./factory/actionStatusType":225,"./factory/actionType":226,"./factory/clientUser":229,"./factory/creativeWork/message/email":231,"./factory/creativeWorkType":230,"./factory/errorCode":232,"./factory/errors":243,"./factory/priceCurrency":244,"./factory/project":245,"./factory/sortType":246,"./factory/task/cancelMoneyTransfer":249,"./factory/task/moneyTransfer":250,"./factory/task/returnMoneyTransfer":251,"./factory/taskName":247,"./factory/taskStatus":248,"./factory/transaction/deposit":255,"./factory/transaction/transfer":256,"./factory/transaction/withdraw":257,"./factory/transactionStatusType":252,"./factory/transactionTasksExportationStatus":253,"./factory/transactionType":254}],259:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],260:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * エラーコード
 */
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["AlreadyInUse"] = "AlreadyInUse";
    ErrorCode["Argument"] = "Argument";
    ErrorCode["ArgumentNull"] = "ArgumentNull";
    ErrorCode["Forbidden"] = "Forbidden";
    ErrorCode["NotFound"] = "NotFound";
    ErrorCode["NotImplemented"] = "NotImplemented";
    ErrorCode["ServiceUnavailable"] = "ServiceUnavailable";
    ErrorCode["RateLimitExceeded"] = "RateLimitExceeded";
})(ErrorCode || (ErrorCode = {}));
exports.default = ErrorCode;

},{}],261:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var waiter_1 = require("./waiter");
/**
 * ArgumentError
 */
var ArgumentError = /** @class */ (function (_super) {
    __extends(ArgumentError, _super);
    function ArgumentError(argumentName, message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = "Invalid or missing argument supplied: " + argumentName;
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.Argument, actualMessage) /* istanbul ignore next */ || this;
        _this.argumentName = argumentName;
        setPrototypeOf(_this, ArgumentError.prototype);
        return _this;
    }
    return ArgumentError;
}(waiter_1.WaiterError));
exports.default = ArgumentError;

},{"../errorCode":260,"./waiter":267,"setprototypeof":301}],262:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var waiter_1 = require("./waiter");
/**
 * ArgumentNullError
 */
var ArgumentNullError = /** @class */ (function (_super) {
    __extends(ArgumentNullError, _super);
    function ArgumentNullError(argumentName, message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = "Missing argument: " + argumentName;
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.Argument, actualMessage) /* istanbul ignore next */ || this;
        _this.argumentName = argumentName;
        setPrototypeOf(_this, ArgumentNullError.prototype);
        return _this;
    }
    return ArgumentNullError;
}(waiter_1.WaiterError));
exports.default = ArgumentNullError;

},{"../errorCode":260,"./waiter":267,"setprototypeof":301}],263:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var waiter_1 = require("./waiter");
/**
 * ForbiddenError
 */
var ForbiddenError = /** @class */ (function (_super) {
    __extends(ForbiddenError, _super);
    function ForbiddenError(message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Forbidden';
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.Forbidden, actualMessage) /* istanbul ignore next */ || this;
        setPrototypeOf(_this, ForbiddenError.prototype);
        return _this;
    }
    return ForbiddenError;
}(waiter_1.WaiterError));
exports.default = ForbiddenError;

},{"../errorCode":260,"./waiter":267,"setprototypeof":301}],264:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var waiter_1 = require("./waiter");
/**
 * NotFoundError
 */
var NotFoundError = /** @class */ (function (_super) {
    __extends(NotFoundError, _super);
    function NotFoundError(entityName, message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = "Not Found: " + entityName;
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.NotFound, actualMessage) /* istanbul ignore next */ || this;
        _this.entityName = entityName;
        setPrototypeOf(_this, NotFoundError.prototype);
        return _this;
    }
    return NotFoundError;
}(waiter_1.WaiterError));
exports.default = NotFoundError;

},{"../errorCode":260,"./waiter":267,"setprototypeof":301}],265:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var waiter_1 = require("./waiter");
/**
 * RateLimitExceededError
 */
var RateLimitExceededError = /** @class */ (function (_super) {
    __extends(RateLimitExceededError, _super);
    function RateLimitExceededError(message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Rate limit exceeded.';
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.RateLimitExceeded, actualMessage) /* istanbul ignore next */ || this;
        setPrototypeOf(_this, RateLimitExceededError.prototype);
        return _this;
    }
    return RateLimitExceededError;
}(waiter_1.WaiterError));
exports.default = RateLimitExceededError;

},{"../errorCode":260,"./waiter":267,"setprototypeof":301}],266:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-require-imports
var setPrototypeOf = require("setprototypeof");
var errorCode_1 = require("../errorCode");
var waiter_1 = require("./waiter");
/**
 * ServiceUnavailableError
 */
var ServiceUnavailableError = /** @class */ (function (_super) {
    __extends(ServiceUnavailableError, _super);
    function ServiceUnavailableError(message) {
        var _this = this;
        var actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Service unavailable temporarily.';
        }
        // tslint:disable-next-line:no-single-line-block-comment
        _this = _super.call(this, errorCode_1.default.ServiceUnavailable, actualMessage) /* istanbul ignore next */ || this;
        setPrototypeOf(_this, ServiceUnavailableError.prototype);
        return _this;
    }
    return ServiceUnavailableError;
}(waiter_1.WaiterError));
exports.default = ServiceUnavailableError;

},{"../errorCode":260,"./waiter":267,"setprototypeof":301}],267:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * WaiterError
 */
var WaiterError = /** @class */ (function (_super) {
    __extends(WaiterError, _super);
    function WaiterError(code, message) {
        var _this = 
        // tslint:disable-next-line:no-single-line-block-comment
        _super.call(this, message) /* istanbul ignore next */ || this;
        _this.name = 'WaiterError';
        _this.reason = code;
        return _this;
    }
    return WaiterError;
}(Error));
exports.WaiterError = WaiterError;

},{}],268:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * errors
 */
var argument_1 = require("./error/argument");
exports.Argument = argument_1.default;
var argumentNull_1 = require("./error/argumentNull");
exports.ArgumentNull = argumentNull_1.default;
var forbidden_1 = require("./error/forbidden");
exports.Forbidden = forbidden_1.default;
var notFound_1 = require("./error/notFound");
exports.NotFound = notFound_1.default;
var rateLimitExceeded_1 = require("./error/rateLimitExceeded");
exports.RateLimitExceeded = rateLimitExceeded_1.default;
var serviceUnavailable_1 = require("./error/serviceUnavailable");
exports.ServiceUnavailable = serviceUnavailable_1.default;
var waiter_1 = require("./error/waiter");
exports.Waiter = waiter_1.WaiterError;

},{"./error/argument":261,"./error/argumentNull":262,"./error/forbidden":263,"./error/notFound":264,"./error/rateLimitExceeded":265,"./error/serviceUnavailable":266,"./error/waiter":267}],269:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],270:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],271:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],272:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * factory index
 */
var client = require("./factory/client");
var errorCode_1 = require("./factory/errorCode");
var errors = require("./factory/errors");
var passport = require("./factory/passport");
var project = require("./factory/project");
var rule = require("./factory/rule");
exports.client = client;
exports.errorCode = errorCode_1.default;
exports.errors = errors;
exports.passport = passport;
exports.project = project;
exports.rule = rule;

},{"./factory/client":259,"./factory/errorCode":260,"./factory/errors":268,"./factory/passport":269,"./factory/project":270,"./factory/rule":271}],273:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],274:[function(require,module,exports){

},{}],275:[function(require,module,exports){
(function (Buffer){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

}).call(this,require("buffer").Buffer)
},{"base64-js":273,"buffer":275,"ieee754":289}],276:[function(require,module,exports){
'use strict';

var GetIntrinsic = require('get-intrinsic');

var callBind = require('./');

var $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'));

module.exports = function callBoundIntrinsic(name, allowMissing) {
	var intrinsic = GetIntrinsic(name, !!allowMissing);
	if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
		return callBind(intrinsic);
	}
	return intrinsic;
};

},{"./":277,"get-intrinsic":283}],277:[function(require,module,exports){
'use strict';

var bind = require('function-bind');
var GetIntrinsic = require('get-intrinsic');

var $apply = GetIntrinsic('%Function.prototype.apply%');
var $call = GetIntrinsic('%Function.prototype.call%');
var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);
var $max = GetIntrinsic('%Math.max%');

if ($defineProperty) {
	try {
		$defineProperty({}, 'a', { value: 1 });
	} catch (e) {
		// IE 8 has a broken defineProperty
		$defineProperty = null;
	}
}

module.exports = function callBind(originalFunction) {
	var func = $reflectApply(bind, $call, arguments);
	if ($gOPD && $defineProperty) {
		var desc = $gOPD(func, 'length');
		if (desc.configurable) {
			// original length, plus the receiver, minus any additional arguments (after the receiver)
			$defineProperty(
				func,
				'length',
				{ value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) }
			);
		}
	}
	return func;
};

var applyBind = function applyBind() {
	return $reflectApply(bind, $apply, arguments);
};

if ($defineProperty) {
	$defineProperty(module.exports, 'apply', { value: applyBind });
} else {
	module.exports.apply = applyBind;
}

},{"function-bind":282,"get-intrinsic":283}],278:[function(require,module,exports){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\-?\d?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

},{}],279:[function(require,module,exports){
(function (process){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
/**
 * Colors.
 */

exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];
/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */
// eslint-disable-next-line complexity

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
    return true;
  } // Internet Explorer and Edge do not support colors.


  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  } // Is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632


  return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
  typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}
/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */


function formatArgs(args) {
  args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);

  if (!this.useColors) {
    return;
  }

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit'); // The final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into

  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function (match) {
    if (match === '%%') {
      return;
    }

    index++;

    if (match === '%c') {
      // We only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });
  args.splice(lastC, 0, c);
}
/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */


function log() {
  var _console;

  // This hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return (typeof console === "undefined" ? "undefined" : _typeof(console)) === 'object' && console.log && (_console = console).log.apply(_console, arguments);
}
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */


function save(namespaces) {
  try {
    if (namespaces) {
      exports.storage.setItem('debug', namespaces);
    } else {
      exports.storage.removeItem('debug');
    }
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}
/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */


function load() {
  var r;

  try {
    r = exports.storage.getItem('debug');
  } catch (error) {} // Swallow
  // XXX (@Qix-) should we be logging these?
  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG


  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}
/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */


function localstorage() {
  try {
    // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
    // The Browser also has localStorage in the global context.
    return localStorage;
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}

module.exports = require('./common')(exports);
var formatters = module.exports.formatters;
/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
  try {
    return JSON.stringify(v);
  } catch (error) {
    return '[UnexpectedJSONParseError]: ' + error.message;
  }
};


}).call(this,require('_process'))
},{"./common":280,"_process":292}],280:[function(require,module,exports){
"use strict";

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */
function setup(env) {
  createDebug.debug = createDebug;
  createDebug.default = createDebug;
  createDebug.coerce = coerce;
  createDebug.disable = disable;
  createDebug.enable = enable;
  createDebug.enabled = enabled;
  createDebug.humanize = require('ms');
  Object.keys(env).forEach(function (key) {
    createDebug[key] = env[key];
  });
  /**
  * Active `debug` instances.
  */

  createDebug.instances = [];
  /**
  * The currently active debug mode names, and names to skip.
  */

  createDebug.names = [];
  createDebug.skips = [];
  /**
  * Map of special "%n" handling functions, for the debug "format" argument.
  *
  * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
  */

  createDebug.formatters = {};
  /**
  * Selects a color for a debug namespace
  * @param {String} namespace The namespace string for the for the debug instance to be colored
  * @return {Number|String} An ANSI color code for the given namespace
  * @api private
  */

  function selectColor(namespace) {
    var hash = 0;

    for (var i = 0; i < namespace.length; i++) {
      hash = (hash << 5) - hash + namespace.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }

    return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
  }

  createDebug.selectColor = selectColor;
  /**
  * Create a debugger with the given `namespace`.
  *
  * @param {String} namespace
  * @return {Function}
  * @api public
  */

  function createDebug(namespace) {
    var prevTime;

    function debug() {
      // Disabled?
      if (!debug.enabled) {
        return;
      }

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var self = debug; // Set `diff` timestamp

      var curr = Number(new Date());
      var ms = curr - (prevTime || curr);
      self.diff = ms;
      self.prev = prevTime;
      self.curr = curr;
      prevTime = curr;
      args[0] = createDebug.coerce(args[0]);

      if (typeof args[0] !== 'string') {
        // Anything else let's inspect with %O
        args.unshift('%O');
      } // Apply any `formatters` transformations


      var index = 0;
      args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {
        // If we encounter an escaped % then don't increase the array index
        if (match === '%%') {
          return match;
        }

        index++;
        var formatter = createDebug.formatters[format];

        if (typeof formatter === 'function') {
          var val = args[index];
          match = formatter.call(self, val); // Now we need to remove `args[index]` since it's inlined in the `format`

          args.splice(index, 1);
          index--;
        }

        return match;
      }); // Apply env-specific formatting (colors, etc.)

      createDebug.formatArgs.call(self, args);
      var logFn = self.log || createDebug.log;
      logFn.apply(self, args);
    }

    debug.namespace = namespace;
    debug.enabled = createDebug.enabled(namespace);
    debug.useColors = createDebug.useColors();
    debug.color = selectColor(namespace);
    debug.destroy = destroy;
    debug.extend = extend; // Debug.formatArgs = formatArgs;
    // debug.rawLog = rawLog;
    // env-specific initialization logic for debug instances

    if (typeof createDebug.init === 'function') {
      createDebug.init(debug);
    }

    createDebug.instances.push(debug);
    return debug;
  }

  function destroy() {
    var index = createDebug.instances.indexOf(this);

    if (index !== -1) {
      createDebug.instances.splice(index, 1);
      return true;
    }

    return false;
  }

  function extend(namespace, delimiter) {
    return createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
  }
  /**
  * Enables a debug mode by namespaces. This can include modes
  * separated by a colon and wildcards.
  *
  * @param {String} namespaces
  * @api public
  */


  function enable(namespaces) {
    createDebug.save(namespaces);
    createDebug.names = [];
    createDebug.skips = [];
    var i;
    var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
    var len = split.length;

    for (i = 0; i < len; i++) {
      if (!split[i]) {
        // ignore empty strings
        continue;
      }

      namespaces = split[i].replace(/\*/g, '.*?');

      if (namespaces[0] === '-') {
        createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
      } else {
        createDebug.names.push(new RegExp('^' + namespaces + '$'));
      }
    }

    for (i = 0; i < createDebug.instances.length; i++) {
      var instance = createDebug.instances[i];
      instance.enabled = createDebug.enabled(instance.namespace);
    }
  }
  /**
  * Disable debug output.
  *
  * @api public
  */


  function disable() {
    createDebug.enable('');
  }
  /**
  * Returns true if the given mode name is enabled, false otherwise.
  *
  * @param {String} name
  * @return {Boolean}
  * @api public
  */


  function enabled(name) {
    if (name[name.length - 1] === '*') {
      return true;
    }

    var i;
    var len;

    for (i = 0, len = createDebug.skips.length; i < len; i++) {
      if (createDebug.skips[i].test(name)) {
        return false;
      }
    }

    for (i = 0, len = createDebug.names.length; i < len; i++) {
      if (createDebug.names[i].test(name)) {
        return true;
      }
    }

    return false;
  }
  /**
  * Coerce `val`.
  *
  * @param {Mixed} val
  * @return {Mixed}
  * @api private
  */


  function coerce(val) {
    if (val instanceof Error) {
      return val.stack || val.message;
    }

    return val;
  }

  createDebug.enable(createDebug.load());
  return createDebug;
}

module.exports = setup;


},{"ms":278}],281:[function(require,module,exports){
'use strict';

/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

},{}],282:[function(require,module,exports){
'use strict';

var implementation = require('./implementation');

module.exports = Function.prototype.bind || implementation;

},{"./implementation":281}],283:[function(require,module,exports){
'use strict';

var undefined;

var $SyntaxError = SyntaxError;
var $Function = Function;
var $TypeError = TypeError;

// eslint-disable-next-line consistent-return
var getEvalledConstructor = function (expressionSyntax) {
	try {
		return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
	} catch (e) {}
};

var $gOPD = Object.getOwnPropertyDescriptor;
if ($gOPD) {
	try {
		$gOPD({}, '');
	} catch (e) {
		$gOPD = null; // this is IE 8, which has a broken gOPD
	}
}

var throwTypeError = function () {
	throw new $TypeError();
};
var ThrowTypeError = $gOPD
	? (function () {
		try {
			// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
			arguments.callee; // IE 8 does not throw here
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
				return $gOPD(arguments, 'callee').get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	}())
	: throwTypeError;

var hasSymbols = require('has-symbols')();

var getProto = Object.getPrototypeOf || function (x) { return x.__proto__; }; // eslint-disable-line no-proto

var needsEval = {};

var TypedArray = typeof Uint8Array === 'undefined' ? undefined : getProto(Uint8Array);

var INTRINSICS = {
	'%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,
	'%Array%': Array,
	'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
	'%ArrayIteratorPrototype%': hasSymbols ? getProto([][Symbol.iterator]()) : undefined,
	'%AsyncFromSyncIteratorPrototype%': undefined,
	'%AsyncFunction%': needsEval,
	'%AsyncGenerator%': needsEval,
	'%AsyncGeneratorFunction%': needsEval,
	'%AsyncIteratorPrototype%': needsEval,
	'%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
	'%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,
	'%Boolean%': Boolean,
	'%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
	'%Date%': Date,
	'%decodeURI%': decodeURI,
	'%decodeURIComponent%': decodeURIComponent,
	'%encodeURI%': encodeURI,
	'%encodeURIComponent%': encodeURIComponent,
	'%Error%': Error,
	'%eval%': eval, // eslint-disable-line no-eval
	'%EvalError%': EvalError,
	'%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
	'%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
	'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,
	'%Function%': $Function,
	'%GeneratorFunction%': needsEval,
	'%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
	'%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
	'%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
	'%isFinite%': isFinite,
	'%isNaN%': isNaN,
	'%IteratorPrototype%': hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined,
	'%JSON%': typeof JSON === 'object' ? JSON : undefined,
	'%Map%': typeof Map === 'undefined' ? undefined : Map,
	'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols ? undefined : getProto(new Map()[Symbol.iterator]()),
	'%Math%': Math,
	'%Number%': Number,
	'%Object%': Object,
	'%parseFloat%': parseFloat,
	'%parseInt%': parseInt,
	'%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
	'%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
	'%RangeError%': RangeError,
	'%ReferenceError%': ReferenceError,
	'%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
	'%RegExp%': RegExp,
	'%Set%': typeof Set === 'undefined' ? undefined : Set,
	'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols ? undefined : getProto(new Set()[Symbol.iterator]()),
	'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
	'%String%': String,
	'%StringIteratorPrototype%': hasSymbols ? getProto(''[Symbol.iterator]()) : undefined,
	'%Symbol%': hasSymbols ? Symbol : undefined,
	'%SyntaxError%': $SyntaxError,
	'%ThrowTypeError%': ThrowTypeError,
	'%TypedArray%': TypedArray,
	'%TypeError%': $TypeError,
	'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
	'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
	'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
	'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
	'%URIError%': URIError,
	'%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
	'%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
	'%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet
};

var doEval = function doEval(name) {
	var value;
	if (name === '%AsyncFunction%') {
		value = getEvalledConstructor('async function () {}');
	} else if (name === '%GeneratorFunction%') {
		value = getEvalledConstructor('function* () {}');
	} else if (name === '%AsyncGeneratorFunction%') {
		value = getEvalledConstructor('async function* () {}');
	} else if (name === '%AsyncGenerator%') {
		var fn = doEval('%AsyncGeneratorFunction%');
		if (fn) {
			value = fn.prototype;
		}
	} else if (name === '%AsyncIteratorPrototype%') {
		var gen = doEval('%AsyncGenerator%');
		if (gen) {
			value = getProto(gen.prototype);
		}
	}

	INTRINSICS[name] = value;

	return value;
};

var LEGACY_ALIASES = {
	'%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
	'%ArrayPrototype%': ['Array', 'prototype'],
	'%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
	'%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
	'%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
	'%ArrayProto_values%': ['Array', 'prototype', 'values'],
	'%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
	'%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
	'%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
	'%BooleanPrototype%': ['Boolean', 'prototype'],
	'%DataViewPrototype%': ['DataView', 'prototype'],
	'%DatePrototype%': ['Date', 'prototype'],
	'%ErrorPrototype%': ['Error', 'prototype'],
	'%EvalErrorPrototype%': ['EvalError', 'prototype'],
	'%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
	'%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
	'%FunctionPrototype%': ['Function', 'prototype'],
	'%Generator%': ['GeneratorFunction', 'prototype'],
	'%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
	'%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
	'%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
	'%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
	'%JSONParse%': ['JSON', 'parse'],
	'%JSONStringify%': ['JSON', 'stringify'],
	'%MapPrototype%': ['Map', 'prototype'],
	'%NumberPrototype%': ['Number', 'prototype'],
	'%ObjectPrototype%': ['Object', 'prototype'],
	'%ObjProto_toString%': ['Object', 'prototype', 'toString'],
	'%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
	'%PromisePrototype%': ['Promise', 'prototype'],
	'%PromiseProto_then%': ['Promise', 'prototype', 'then'],
	'%Promise_all%': ['Promise', 'all'],
	'%Promise_reject%': ['Promise', 'reject'],
	'%Promise_resolve%': ['Promise', 'resolve'],
	'%RangeErrorPrototype%': ['RangeError', 'prototype'],
	'%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
	'%RegExpPrototype%': ['RegExp', 'prototype'],
	'%SetPrototype%': ['Set', 'prototype'],
	'%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
	'%StringPrototype%': ['String', 'prototype'],
	'%SymbolPrototype%': ['Symbol', 'prototype'],
	'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
	'%TypedArrayPrototype%': ['TypedArray', 'prototype'],
	'%TypeErrorPrototype%': ['TypeError', 'prototype'],
	'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
	'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
	'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
	'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
	'%URIErrorPrototype%': ['URIError', 'prototype'],
	'%WeakMapPrototype%': ['WeakMap', 'prototype'],
	'%WeakSetPrototype%': ['WeakSet', 'prototype']
};

var bind = require('function-bind');
var hasOwn = require('has');
var $concat = bind.call(Function.call, Array.prototype.concat);
var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
var $replace = bind.call(Function.call, String.prototype.replace);
var $strSlice = bind.call(Function.call, String.prototype.slice);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
	var first = $strSlice(string, 0, 1);
	var last = $strSlice(string, -1);
	if (first === '%' && last !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
	} else if (last === '%' && first !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
	}
	var result = [];
	$replace(string, rePropName, function (match, number, quote, subString) {
		result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
	});
	return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
	var intrinsicName = name;
	var alias;
	if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
		alias = LEGACY_ALIASES[intrinsicName];
		intrinsicName = '%' + alias[0] + '%';
	}

	if (hasOwn(INTRINSICS, intrinsicName)) {
		var value = INTRINSICS[intrinsicName];
		if (value === needsEval) {
			value = doEval(intrinsicName);
		}
		if (typeof value === 'undefined' && !allowMissing) {
			throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
		}

		return {
			alias: alias,
			name: intrinsicName,
			value: value
		};
	}

	throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};

module.exports = function GetIntrinsic(name, allowMissing) {
	if (typeof name !== 'string' || name.length === 0) {
		throw new $TypeError('intrinsic name must be a non-empty string');
	}
	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
		throw new $TypeError('"allowMissing" argument must be a boolean');
	}

	var parts = stringToPath(name);
	var intrinsicBaseName = parts.length > 0 ? parts[0] : '';

	var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
	var intrinsicRealName = intrinsic.name;
	var value = intrinsic.value;
	var skipFurtherCaching = false;

	var alias = intrinsic.alias;
	if (alias) {
		intrinsicBaseName = alias[0];
		$spliceApply(parts, $concat([0, 1], alias));
	}

	for (var i = 1, isOwn = true; i < parts.length; i += 1) {
		var part = parts[i];
		var first = $strSlice(part, 0, 1);
		var last = $strSlice(part, -1);
		if (
			(
				(first === '"' || first === "'" || first === '`')
				|| (last === '"' || last === "'" || last === '`')
			)
			&& first !== last
		) {
			throw new $SyntaxError('property names with quotes must have matching quotes');
		}
		if (part === 'constructor' || !isOwn) {
			skipFurtherCaching = true;
		}

		intrinsicBaseName += '.' + part;
		intrinsicRealName = '%' + intrinsicBaseName + '%';

		if (hasOwn(INTRINSICS, intrinsicRealName)) {
			value = INTRINSICS[intrinsicRealName];
		} else if (value != null) {
			if (!(part in value)) {
				if (!allowMissing) {
					throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
				}
				return void undefined;
			}
			if ($gOPD && (i + 1) >= parts.length) {
				var desc = $gOPD(value, part);
				isOwn = !!desc;

				// By convention, when a data property is converted to an accessor
				// property to emulate a data property that does not suffer from
				// the override mistake, that accessor's getter is marked with
				// an `originalValue` property. Here, when we detect this, we
				// uphold the illusion by pretending to see that original data
				// property, i.e., returning the value rather than the getter
				// itself.
				if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
					value = desc.get;
				} else {
					value = value[part];
				}
			} else {
				isOwn = hasOwn(value, part);
				value = value[part];
			}

			if (isOwn && !skipFurtherCaching) {
				INTRINSICS[intrinsicRealName] = value;
			}
		}
	}
	return value;
};

},{"function-bind":282,"has":286,"has-symbols":284}],284:[function(require,module,exports){
'use strict';

var origSymbol = typeof Symbol !== 'undefined' && Symbol;
var hasSymbolSham = require('./shams');

module.exports = function hasNativeSymbols() {
	if (typeof origSymbol !== 'function') { return false; }
	if (typeof Symbol !== 'function') { return false; }
	if (typeof origSymbol('foo') !== 'symbol') { return false; }
	if (typeof Symbol('bar') !== 'symbol') { return false; }

	return hasSymbolSham();
};

},{"./shams":285}],285:[function(require,module,exports){
'use strict';

/* eslint complexity: [2, 18], max-statements: [2, 33] */
module.exports = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
	if (typeof Symbol.iterator === 'symbol') { return true; }

	var obj = {};
	var sym = Symbol('test');
	var symObj = Object(sym);
	if (typeof sym === 'string') { return false; }

	if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
	if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

	// temp disabled per https://github.com/ljharb/object.assign/issues/17
	// if (sym instanceof Symbol) { return false; }
	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
	// if (!(symObj instanceof Symbol)) { return false; }

	// if (typeof Symbol.prototype.toString !== 'function') { return false; }
	// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

	var symVal = 42;
	obj[sym] = symVal;
	for (sym in obj) { return false; } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) { return false; }

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
		if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
	}

	return true;
};

},{}],286:[function(require,module,exports){
'use strict';

var bind = require('function-bind');

module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);

},{"function-bind":282}],287:[function(require,module,exports){
// Generated by CoffeeScript 2.3.0
// # node-http-status

// **Reference:**  

// - https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
// - https://tools.ietf.org/html/rfc2324#section-2.3.2

// ## Classes

// The first digit of the status-code defines the class of response. The last two digits do not have any categorization role. There are five values for the first digit:
var classes;

classes = {
  // 1xx - The 1xx (Informational) class of status code indicates an interim response for communicating connection status or request progress prior to completing the requested action and sending a final response.
  '1xx': 'Informational',
  '1xx_NAME': 'INFORMATIONAL',
  '1xx_MESSAGE': 'Indicates an interim response for communicating connection status or request progress prior to completing the requested action and sending a final response.',
  INFORMATIONAL: '1xx',
  // 2xx - The 2xx (Successful) class of status code indicates that the client's request was successfully received, understood, and accepted.
  '2xx': 'Successful',
  '2xx_NAME': 'SUCCESSFUL',
  '2xx_MESSAGE': 'Indicates that the client\'s request was successfully received, understood, and accepted.',
  SUCCESSFUL: '2xx',
  // 3xx - The 3xx (Redirection) class of status code indicates that further action needs to be taken by the user agent in order to fulfill the request.
  '3xx': 'Redirection',
  '3xx_NAME': 'REDIRECTION',
  '3xx_MESSAGE': 'Indicates that further action needs to be taken by the user agent in order to fulfill the request.',
  REDIRECTION: '3xx',
  // 4xx - The 4xx (Client Error) class of status code indicates that the client seems to have erred.
  '4xx': 'Client Error',
  '4xx_NAME': 'CLIENT_ERROR',
  '4xx_MESSAGE': 'Indicates that the client seems to have erred.',
  CLIENT_ERROR: '4xx',
  // 5xx - The 5xx (Server Error) class of status code indicates that the server is aware that it has erred or is incapable of performing the requested method.
  '5xx': 'Server Error',
  '5xx_NAME': 'SERVER_ERROR',
  '5xx_MESSAGE': 'Indicates that the server is aware that it has erred or is incapable of performing the requested method.',
  SERVER_ERROR: '5xx'
};

module.exports = {
  classes: classes,
  // ## Informational 1xx

  // Indicates an interim response for communicating connection status or request progress prior to completing the requested action and sending a final response.

  // 100 - The server has received the request headers and the client should proceed to send the request body.
  100: 'Continue',
  '100_NAME': 'CONTINUE',
  '100_MESSAGE': 'The server has received the request headers and the client should proceed to send the request body.',
  '100_CLASS': classes.INFORMATIONAL,
  CONTINUE: 100,
  // 101 - The requester has asked the server to switch protocols and the server has agreed to do so.
  101: 'Switching Protocols',
  '101_NAME': 'SWITCHING_PROTOCOLS',
  '101_MESSAGE': 'The requester has asked the server to switch protocols and the server has agreed to do so.',
  '101_CLASS': classes.INFORMATIONAL,
  SWITCHING_PROTOCOLS: 101,
  // 102 Processing (WebDAV; RFC 2518) - A WebDAV request may contain many sub-requests involving file operations, requiring a long time to complete the request. This code indicates that the server has received and is processing the request, but no response is available yet.[7] This prevents the client from timing out and assuming the request was lost.
  102: 'Processing',
  '102_NAME': 'PROCESSING',
  '102_MESSAGE': 'A WebDAV request may contain many sub-requests involving file operations, requiring a long time to complete the request. This code indicates that the server has received and is processing the request, but no response is available yet.[7] This prevents the client from timing out and assuming the request was lost.',
  '102_CLASS': classes.INFORMATIONAL,
  PROCESSING: 102,
  // 103 Early Hints (RFC 8297) - Used to return some response headers before final HTTP message.
  103: 'Early Hints',
  '103_NAME': 'EARLY_HINTS',
  '103_MESSAGE': 'Used to return some response headers before final HTTP message.',
  '103_CLASS': classes.INFORMATIONAL,
  EARLY_HINTS: 103,
  // ## Successful 2xx

  // Indicates that the client's request was successfully received, understood, and accepted.

  // 200 - Standard response for successful HTTP requests.
  200: 'OK',
  '200_NAME': 'OK',
  '200_MESSAGE': 'Standard response for successful HTTP requests.',
  '200_CLASS': classes.SUCCESSFUL,
  OK: 200,
  // 201 - The request has been fulfilled, resulting in the creation of a new resource.
  201: 'Created',
  '201_NAME': 'CREATED',
  '201_MESSAGE': 'The request has been fulfilled, resulting in the creation of a new resource.',
  '201_CLASS': classes.SUCCESSFUL,
  CREATED: 201,
  // 202 - The request has been accepted for processing, but the processing has not been completed.
  202: 'Accepted',
  '202_NAME': 'ACCEPTED',
  '202_MESSAGE': 'The request has been accepted for processing, but the processing has not been completed.',
  '202_CLASS': classes.SUCCESSFUL,
  ACCEPTED: 202,
  // 203 (since HTTP/1.1) - The server is a transforming proxy (e.g. a Web accelerator) that received a 200 OK from its origin, but is returning a modified version of the origin's response.
  203: 'Non-Authoritative Information',
  '203_NAME': 'NON_AUTHORITATIVE_INFORMATION',
  '203_MESSAGE': 'The server is a transforming proxy (e.g. a Web accelerator) that received a 200 OK from its origin, but is returning a modified version of the origin\'s response.',
  '203_CLASS': classes.SUCCESSFUL,
  NON_AUTHORITATIVE_INFORMATION: 203,
  // 204 - The server successfully processed the request and is not returning any content.
  204: 'No Content',
  '204_NAME': 'NO_CONTENT',
  '204_MESSAGE': 'The server successfully processed the request and is not returning any content.',
  '204_CLASS': classes.SUCCESSFUL,
  NO_CONTENT: 204,
  // 205 - The server successfully processed the request, but is not returning any content. Unlike a 204 response, this response requires that the requester reset the document view.
  205: 'Reset Content',
  '205_NAME': 'RESET_CONTENT',
  '205_MESSAGE': 'The server successfully processed the request, but is not returning any content. Unlike a 204 response, this response requires that the requester reset the document view.',
  '205_CLASS': classes.SUCCESSFUL,
  RESET_CONTENT: 205,
  // 206 (RFC 7233) - The server is delivering only part of the resource (byte serving) due to a range header sent by the client.
  206: 'Partial Content',
  '206_NAME': 'PARTIAL_CONTENT',
  '206_MESSAGE': 'The server is delivering only part of the resource (byte serving) due to a range header sent by the client.',
  '206_CLASS': classes.SUCCESSFUL,
  PARTIAL_CONTENT: 206,
  // 207 (WebDAV; RFC 4918) - The message body that follows is by default an XML message and can contain a number of separate response codes, depending on how many sub-requests were made.
  207: 'Multi Status',
  '207_NAME': 'MULTI_STATUS',
  '207_MESSAGE': 'The message body that follows is by default an XML message and can contain a number of separate response codes, depending on how many sub-requests were made.',
  '207_CLASS': classes.SUCCESSFUL,
  MULTI_STATUS: 207,
  // 208 (WebDAV; RFC 5842) - The members of a DAV binding have already been enumerated in a preceding part of the (multistatus) response, and are not being included again.
  208: 'Already Reported',
  '208_NAME': 'ALREADY_REPORTED',
  '208_MESSAGE': 'The members of a DAV binding have already been enumerated in a preceding part of the (multistatus) response, and are not being included again.',
  '208_CLASS': classes.SUCCESSFUL,
  ALREADY_REPORTED: 208,
  // 226 (RFC 3229) - The server has fulfilled a request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.
  226: 'IM Used',
  '226_NAME': 'IM_USED',
  '226_MESSAGE': 'The server has fulfilled a request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.',
  '226_CLASS': classes.SUCCESSFUL,
  IM_USED: 226,
  // ## Redirection 3xx

  // Indicates that further action needs to be taken by the user agent in order to fulfill the request.

  // 300 - Indicates multiple options for the resource from which the client may choose.
  300: 'Multiple Choices',
  '300_NAME': 'MULTIPLE_CHOICES',
  '300_MESSAGE': 'Indicates multiple options for the resource from which the client may choose.',
  '300_CLASS': classes.REDIRECTION,
  MULTIPLE_CHOICES: 300,
  // 301 - This and all future requests should be directed to the given URI.
  301: 'Moved Permanently',
  '301_NAME': 'MOVED_PERMANENTLY',
  '301_MESSAGE': 'This and all future requests should be directed to the given URI.',
  '301_CLASS': classes.REDIRECTION,
  MOVED_PERMANENTLY: 301,
  // 302 - This is an example of industry practice contradicting the standard. The HTTP/1.0 specification (RFC 1945) required the client to perform a temporary redirect (the original describing phrase was "Moved Temporarily"), but popular browsers implemented 302 with the functionality of a 303 See Other. Therefore, HTTP/1.1 added status codes 303 and 307 to distinguish between the two behaviours.
  302: 'Found',
  '302_NAME': 'FOUND',
  '302_MESSAGE': 'This is an example of industry practice contradicting the standard. The HTTP/1.0 specification (RFC 1945) required the client to perform a temporary redirect (the original describing phrase was "Moved Temporarily"), but popular browsers implemented 302 with the functionality of a 303 See Other. Therefore, HTTP/1.1 added status codes 303 and 307 to distinguish between the two behaviours.',
  '302_CLASS': classes.REDIRECTION,
  FOUND: 302,
  // 303 (since HTTP/1.1) - The response to the request can be found under another URI using the GET method.
  303: 'See Other',
  '303_NAME': 'SEE_OTHER',
  '303_MESSAGE': 'The response to the request can be found under another URI using the GET method.',
  '303_CLASS': classes.REDIRECTION,
  SEE_OTHER: 303,
  // 304 (RFC 7232) - Indicates that the resource has not been modified since the version specified by the request headers If-Modified-Since or If-None-Match.
  304: 'Not Modified',
  '304_NAME': 'NOT_MODIFIED',
  '304_MESSAGE': 'Indicates that the resource has not been modified since the version specified by the request headers If-Modified-Since or If-None-Match.',
  '304_CLASS': classes.REDIRECTION,
  NOT_MODIFIED: 304,
  // 305 (since HTTP/1.1) - The requested resource is available only through a proxy, the address for which is provided in the response.
  305: 'Use Proxy',
  '305_NAME': 'USE_PROXY',
  '305_MESSAGE': 'The requested resource is available only through a proxy, the address for which is provided in the response.',
  '305_CLASS': classes.REDIRECTION,
  USE_PROXY: 305,
  // 306 - No longer used. Originally meant "Subsequent requests should use the specified proxy.
  306: 'Switch Proxy',
  '306_NAME': 'SWITCH_PROXY',
  '306_MESSAGE': 'No longer used. Originally meant "Subsequent requests should use the specified proxy.',
  '306_CLASS': classes.REDIRECTION,
  SWITCH_PROXY: 306,
  // 307 (since HTTP/1.1) - In this case, the request should be repeated with another URI; however, future requests should still use the original URI.
  307: 'Temporary Redirect',
  '307_NAME': 'TEMPORARY_REDIRECT',
  '307_MESSAGE': 'In this case, the request should be repeated with another URI; however, future requests should still use the original URI.',
  '307_CLASS': classes.REDIRECTION,
  TEMPORARY_REDIRECT: 307,
  // 308 (RFC 7538) - The request and all future requests should be repeated using another URI.
  308: 'Permanent Redirect',
  '308_NAME': 'PERMANENT_REDIRECT',
  '308_MESSAGE': 'The request and all future requests should be repeated using another URI.',
  '308_CLASS': classes.REDIRECTION,
  PERMANENT_REDIRECT: 308,
  // ## Client Error 4xx

  // Indicates that the client seems to have erred.

  // 400 - The server cannot or will not process the request due to an apparent client error.
  400: 'Bad Request',
  '400_NAME': 'BAD_REQUEST',
  '400_MESSAGE': 'The server cannot or will not process the request due to an apparent client error.',
  '400_CLASS': classes.CLIENT_ERROR,
  BAD_REQUEST: 400,
  // 401 (RFC 7235) - Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided.
  401: 'Unauthorized',
  '401_NAME': 'UNAUTHORIZED',
  '401_MESSAGE': 'Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided.',
  '401_CLASS': classes.CLIENT_ERROR,
  UNAUTHORIZED: 401,
  // 402 - Reserved for future use. The original intention was that this code might be used as part of some form of digital cash or micropayment scheme, as proposed for example by GNU Taler, but that has not yet happened, and this code is not usually used.
  402: 'Payment Required',
  '402_NAME': 'PAYMENT_REQUIRED',
  '402_MESSAGE': 'Reserved for future use. The original intention was that this code might be used as part of some form of digital cash or micropayment scheme, as proposed for example by GNU Taler, but that has not yet happened, and this code is not usually used.',
  '402_CLASS': classes.CLIENT_ERROR,
  PAYMENT_REQUIRED: 402,
  // 403 - The request was valid, but the server is refusing action.
  403: 'Forbidden',
  '403_NAME': 'FORBIDDEN',
  '403_MESSAGE': 'The request was valid, but the server is refusing action.',
  '403_CLASS': classes.CLIENT_ERROR,
  FORBIDDEN: 403,
  // 404 - The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.
  404: 'Not Found',
  '404_NAME': 'NOT_FOUND',
  '404_MESSAGE': 'The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.',
  '404_CLASS': classes.CLIENT_ERROR,
  NOT_FOUND: 404,
  // 405 - A request method is not supported for the requested resource.
  405: 'Method Not Allowed',
  '405_NAME': 'METHOD_NOT_ALLOWED',
  '405_MESSAGE': 'A request method is not supported for the requested resource.',
  '405_CLASS': classes.CLIENT_ERROR,
  METHOD_NOT_ALLOWED: 405,
  // 406 - The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request.
  406: 'Not Acceptable',
  '406_NAME': 'NOT_ACCEPTABLE',
  '406_MESSAGE': 'The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request.',
  '406_CLASS': classes.CLIENT_ERROR,
  NOT_ACCEPTABLE: 406,
  // 407 (RFC 7235) - The client must first authenticate itself with the proxy.
  407: 'Proxy Authentication Required',
  '407_NAME': 'PROXY_AUTHENTICATION_REQUIRED',
  '407_MESSAGE': 'The client must first authenticate itself with the proxy.',
  '407_CLASS': classes.CLIENT_ERROR,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  // 408 - The server timed out waiting for the request.
  408: 'Request Time-out',
  '408_NAME': 'REQUEST_TIMEOUT',
  '408_MESSAGE': 'The server timed out waiting for the request.',
  '408_CLASS': classes.CLIENT_ERROR,
  REQUEST_TIMEOUT: 408,
  // 409 - Indicates that the request could not be processed because of conflict in the request, such as an edit conflict between multiple simultaneous updates.
  409: 'Conflict',
  '409_NAME': 'CONFLICT',
  '409_MESSAGE': 'Indicates that the request could not be processed because of conflict in the request, such as an edit conflict between multiple simultaneous updates.',
  '409_CLASS': classes.CLIENT_ERROR,
  CONFLICT: 409,
  // 410 - Indicates that the resource requested is no longer available and will not be available again.
  410: 'Gone',
  '410_NAME': 'GONE',
  '410_MESSAGE': 'Indicates that the resource requested is no longer available and will not be available again.',
  '410_CLASS': classes.CLIENT_ERROR,
  GONE: 410,
  // 411 - The request did not specify the length of its content, which is required by the requested resource.
  411: 'Length Required',
  '411_NAME': 'LENGTH_REQUIRED',
  '411_MESSAGE': 'The request did not specify the length of its content, which is required by the requested resource.',
  '411_CLASS': classes.CLIENT_ERROR,
  LENGTH_REQUIRED: 411,
  // 412 (RFC 7232) - The server does not meet one of the preconditions that the requester put on the request.
  412: 'Precondition Failed',
  '412_NAME': 'PRECONDITION_FAILED',
  '412_MESSAGE': 'The server does not meet one of the preconditions that the requester put on the request.',
  '412_CLASS': classes.CLIENT_ERROR,
  PRECONDITION_FAILED: 412,
  // 413 (RFC 7231) - The request is larger than the server is willing or able to process. Previously called "Request Entity Too Large".
  413: 'Request Entity Too Large',
  '413_NAME': 'REQUEST_ENTITY_TOO_LARGE',
  '413_MESSAGE': 'The request is larger than the server is willing or able to process. Previously called "Request Entity Too Large".',
  '413_CLASS': classes.CLIENT_ERROR,
  REQUEST_ENTITY_TOO_LARGE: 413,
  // 414 (RFC 7231) - The URI provided was too long for the server to process.
  414: 'Request-URI Too Large',
  '414_NAME': 'REQUEST_URI_TOO_LONG',
  '414_MESSAGE': 'The URI provided was too long for the server to process.',
  '414_CLASS': classes.CLIENT_ERROR,
  REQUEST_URI_TOO_LONG: 414,
  // 415 - The request entity has a media type which the server or resource does not support.
  415: 'Unsupported Media Type',
  '415_NAME': 'UNSUPPORTED_MEDIA_TYPE',
  '415_MESSAGE': 'The request entity has a media type which the server or resource does not support.',
  '415_CLASS': classes.CLIENT_ERROR,
  UNSUPPORTED_MEDIA_TYPE: 415,
  // 416 (RFC 7233) - The client has asked for a portion of the file (byte serving), but the server cannot supply that portion.
  416: 'Requested Range not Satisfiable',
  '416_NAME': 'REQUESTED_RANGE_NOT_SATISFIABLE',
  '416_MESSAGE': 'The client has asked for a portion of the file (byte serving), but the server cannot supply that portion.',
  '416_CLASS': classes.CLIENT_ERROR,
  REQUESTED_RANGE_NOT_SATISFIABLE: 416,
  // 417 - The server cannot meet the requirements of the Expect request-header field.
  417: 'Expectation Failed',
  '417_NAME': 'EXPECTATION_FAILED',
  '417_MESSAGE': 'The server cannot meet the requirements of the Expect request-header field.',
  '417_CLASS': classes.CLIENT_ERROR,
  EXPECTATION_FAILED: 417,
  // 418 (RFC 2324, RFC 7168) - Any attempt to brew coffee with a teapot should result in the error code "418 I'm a teapot". The resulting entity body MAY be short and stout. This code was defined in 1998 as one of the traditional IETF April Fools' jokes, in RFC 2324, Hyper Text Coffee Pot Control Protocol, and is not expected to be implemented by actual HTTP servers. The RFC specifies this code should be returned by teapots requested to brew coffee. This HTTP status is used as an Easter egg in some websites, including Google.com.
  418: 'I\'m a teapot',
  '418_NAME': 'IM_A_TEAPOT',
  '418_MESSAGE': 'Any attempt to brew coffee with a teapot should result in the error code "418 I\'m a teapot". The resulting entity body MAY be short and stout.',
  '418_CLASS': classes.CLIENT_ERROR,
  IM_A_TEAPOT: 418,
  // 421 (RFC 7540) - The request was directed at a server that is not able to produce a response.
  421: 'Misdirected Request',
  '421_NAME': 'MISDIRECTED_REQUEST',
  '421_MESSAGE': 'The request was directed at a server that is not able to produce a response.',
  '421_CLASS': classes.CLIENT_ERROR,
  MISDIRECTED_REQUEST: 421,
  // 422 (WebDAV; RFC 4918) - The request was well-formed but was unable to be followed due to semantic errors.
  422: 'Unprocessable Entity',
  '422_NAME': 'UNPROCESSABLE_ENTITY',
  '422_MESSAGE': 'The request was well-formed but was unable to be followed due to semantic errors.',
  '422_CLASS': classes.CLIENT_ERROR,
  UNPROCESSABLE_ENTITY: 422,
  // 423 (WebDAV; RFC 4918) - The resource that is being accessed is locked.
  423: 'Locked',
  '423_NAME': 'LOCKED',
  '423_MESSAGE': 'The resource that is being accessed is locked.',
  '423_CLASS': classes.CLIENT_ERROR,
  LOCKED: 423,
  // 424 (WebDAV; RFC 4918) - The request failed because it depended on another request and that request failed.
  424: 'Failed Dependency',
  '424_NAME': 'FAILED_DEPENDENCY',
  '424_MESSAGE': 'The request failed because it depended on another request and that request failed.',
  '424_CLASS': classes.CLIENT_ERROR,
  FAILED_DEPENDENCY: 424,
  // 426 - The client should switch to a different protocol such as TLS/1.0, given in the Upgrade header field.
  426: 'Upgrade Required',
  '426_NAME': 'UPGRADE_REQUIRED',
  '426_MESSAGE': 'The client should switch to a different protocol such as TLS/1.0, given in the Upgrade header field.',
  '426_CLASS': classes.CLIENT_ERROR,
  UPGRADE_REQUIRED: 426,
  // 428 (RFC 6585) - The origin server requires the request to be conditional.
  428: 'Precondition Required', // RFC 6585
  '428_NAME': 'PRECONDITION_REQUIRED',
  '428_MESSAGE': 'The origin server requires the request to be conditional.',
  '428_CLASS': classes.CLIENT_ERROR,
  PRECONDITION_REQUIRED: 428,
  // 429 (RFC 6585) - The user has sent too many requests in a given amount of time.
  429: 'Too Many Requests',
  '429_NAME': 'TOO_MANY_REQUESTS',
  '429_MESSAGE': 'The user has sent too many requests in a given amount of time.',
  '429_CLASS': classes.CLIENT_ERROR,
  TOO_MANY_REQUESTS: 429,
  // 431 (RFC 6585) - The server is unwilling to process the request because either an individual header field, or all the header fields collectively, are too large.
  431: 'Request Header Fields Too Large', // RFC 6585
  '431_NAME': 'REQUEST_HEADER_FIELDS_TOO_LARGE',
  '431_MESSAGE': 'The server is unwilling to process the request because either an individual header field, or all the header fields collectively, are too large.',
  '431_CLASS': classes.CLIENT_ERROR,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  // 451 (RFC 7725) - A server operator has received a legal demand to deny access to a resource or to a set of resources that includes the requested resource.
  451: 'Unavailable For Legal Reasons',
  '451_NAME': 'UNAVAILABLE_FOR_LEGAL_REASONS',
  '451_MESSAGE': 'A server operator has received a legal demand to deny access to a resource or to a set of resources that includes the requested resource.',
  '451_CLASS': classes.CLIENT_ERROR,
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,
  // ## Server Error 5xx

  // Indicates that the server is aware that it has erred or is incapable of performing the requested method.

  // 500 - A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.
  500: 'Internal Server Error',
  '500_NAME': 'INTERNAL_SERVER_ERROR',
  '500_MESSAGE': 'A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.',
  '500_CLASS': classes.SERVER_ERROR,
  INTERNAL_SERVER_ERROR: 500,
  // 501 - The server either does not recognize the request method, or it lacks the ability to fulfil the request. Usually this implies future availability.
  501: 'Not Implemented',
  '501_NAME': 'NOT_IMPLEMENTED',
  '501_MESSAGE': 'The server either does not recognize the request method, or it lacks the ability to fulfil the request. Usually this implies future availability.',
  '501_CLASS': classes.SERVER_ERROR,
  NOT_IMPLEMENTED: 501,
  // 502 - The server was acting as a gateway or proxy and received an invalid response from the upstream server.
  502: 'Bad Gateway',
  '502_NAME': 'BAD_GATEWAY',
  '502_MESSAGE': 'The server was acting as a gateway or proxy and received an invalid response from the upstream server.',
  '502_CLASS': classes.SERVER_ERROR,
  BAD_GATEWAY: 502,
  // 503 - The server is currently unavailable (because it is overloaded or down for maintenance). Generally, this is a temporary state.
  503: 'Service Unavailable',
  '503_NAME': 'SERVICE_UNAVAILABLE',
  '503_MESSAGE': 'The server is currently unavailable (because it is overloaded or down for maintenance). Generally, this is a temporary state.',
  '503_CLASS': classes.SERVER_ERROR,
  SERVICE_UNAVAILABLE: 503,
  // 504 - The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.
  504: 'Gateway Time-out',
  '504_NAME': 'GATEWAY_TIMEOUT',
  '504_MESSAGE': 'The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.',
  '504_CLASS': classes.SERVER_ERROR,
  GATEWAY_TIMEOUT: 504,
  // 505 - The server does not support the HTTP protocol version used in the request.
  505: 'HTTP Version not Supported',
  '505_NAME': 'HTTP_VERSION_NOT_SUPPORTED',
  '505_MESSAGE': 'The server does not support the HTTP protocol version used in the request.',
  '505_CLASS': classes.SERVER_ERROR,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  // 506 (RFC 2295) - Transparent content negotiation for the request results in a circular reference.
  506: 'Variant Also Negotiates',
  '506_NAME': 'VARIANT_ALSO_NEGOTIATES',
  '506_MESSAGE': 'Transparent content negotiation for the request results in a circular reference.',
  '506_CLASS': classes.SERVER_ERROR,
  VARIANT_ALSO_NEGOTIATES: 506,
  // 507 (WebDAV; RFC 4918) - The server is unable to store the representation needed to complete the request.
  507: 'Insufficient Storage',
  '507_NAME': 'INSUFFICIENT_STORAGE',
  '507_MESSAGE': 'The server is unable to store the representation needed to complete the request.',
  '507_CLASS': classes.SERVER_ERROR,
  INSUFFICIENT_STORAGE: 507,
  // 508 (WebDAV; RFC 5842) - The server detected an infinite loop while processing the request.
  508: 'Loop Detected',
  '508_NAME': 'LOOP_DETECTED',
  '508_MESSAGE': 'The server detected an infinite loop while processing the request.',
  '508_CLASS': classes.SERVER_ERROR,
  LOOP_DETECTED: 508,
  // 510 (RFC 2774) - Further extensions to the request are required for the server to fulfil it.
  510: 'Not Extended',
  '510_NAME': 'NOT_EXTENDED',
  '510_MESSAGE': 'Further extensions to the request are required for the server to fulfil it.',
  '510_CLASS': classes.SERVER_ERROR,
  NOT_EXTENDED: 510,
  // 511 (RFC 6585) - The client needs to authenticate to gain network access. Intended for use by intercepting proxies used to control access to the network.
  511: 'Network Authentication Required',
  '511_NAME': 'NETWORK_AUTHENTICATION_REQUIRED',
  '511_MESSAGE': 'The client needs to authenticate to gain network access. Intended for use by intercepting proxies used to control access to the network.',
  '511_CLASS': classes.SERVER_ERROR,
  NETWORK_AUTHENTICATION_REQUIRED: 511,
  // ## Extra code

  // Extra HTTP code implemented by vendors and other specifications.
  extra: {
    // ### Unofficial codes

    // The following codes are not specified by any standard.
    unofficial: {
      // 103 - Used in the resumable requests proposal to resume aborted PUT or POST requests.
      103: 'Checkpoint',
      '103_NAME': 'CHECKPOINT',
      '103_MESSAGE': 'Used in the resumable requests proposal to resume aborted PUT or POST requests.',
      '103_CLASS': classes.INFORMATIONAL,
      CHECKPOINT: 103,
      // 419 Page Expired (Laravel Framework) - Used by the Laravel Framework when a CSRF Token is missing or expired.
      419: 'Page Expired',
      '419_NAME': 'PAGE_EXPIRED',
      '419_MESSAGE': 'Used by the Laravel Framework when a CSRF Token is missing or expired.',
      '419_CLASS': classes.CLIENT_ERROR,
      PAGE_EXPIRED: 419,
      // 218 This is fine (Apache Web Server) - Used as a catch-all error condition for allowing response bodies to flow through Apache when ProxyErrorOverride is enabled. When ProxyErrorOverride is enabled in Apache, response bodies that contain a status code of 4xx or 5xx are automatically discarded by Apache in favor of a generic response or a custom response specified by the ErrorDocument directive.
      218: 'This is fine',
      '218_NAME': 'THIS_IS_FINE',
      '218_MESSAGE': 'Used as a catch-all error condition for allowing response bodies to flow through Apache when ProxyErrorOverride is enabled. When ProxyErrorOverride is enabled in Apache, response bodies that contain a status code of 4xx or 5xx are automatically discarded by Apache in favor of a generic response or a custom response specified by the ErrorDocument directive.',
      '218_CLASS': classes.SUCCESSFUL,
      THIS_IS_FINE: 218,
      // 420 Enhance Your Calm (Twitter) - Returned by version 1 of the Twitter Search and Trends API when the client is being rate limited; versions 1.1 and later use the 429 Too Many Requests response code instead.
      420: 'Enhance Your Calm',
      '420_NAME': 'ENHANCE_YOUR_CALM',
      '420_MESSAGE': 'Returned by version 1 of the Twitter Search and Trends API when the client is being rate limited; versions 1.1 and later use the 429 Too Many Requests response code instead.',
      '420_CLASS': classes.CLIENT_ERROR,
      ENHANCE_YOUR_CALM: 420,
      // 450 Blocked by Windows Parental (Microsoft) - The Microsoft extension code indicated when Windows Parental Controls are turned on and are blocking access to the requested webpage.
      450: 'Blocked by Windows Parental Controls',
      '450_NAME': 'BLOCKED_BY_WINDOWS_PARENTAL_CONTROLS',
      '450_MESSAGE': 'The Microsoft extension code indicated when Windows Parental Controls are turned on and are blocking access to the requested webpage.',
      '450_CLASS': classes.CLIENT_ERROR,
      BLOCKED_BY_WINDOWS_PARENTAL_CONTROLS: 450,
      // 498 Invalid Token (Esri) - Returned by ArcGIS for Server. Code 498 indicates an expired or otherwise invalid token.
      498: 'Invalid Token',
      '498_NAME': 'INVALID_TOKEN',
      '498_MESSAGE': 'Returned by ArcGIS for Server. Code 498 indicates an expired or otherwise invalid token.',
      '498_CLASS': classes.CLIENT_ERROR,
      INVALID_TOKEN: 498,
      // 499 Token Required (Esri) - Returned by ArcGIS for Server. Code 499 indicates that a token is required but was not submitted.
      499: 'Token Required',
      '499_NAME': 'TOKEN_REQUIRED',
      '499_MESSAGE': 'Returned by ArcGIS for Server. Code 499 indicates that a token is required but was not submitted.',
      '499_CLASS': classes.CLIENT_ERROR,
      TOKEN_REQUIRED: 499,
      // 509 Bandwidth Limit Exceeded (Apache Web Server/cPanel) - The server has exceeded the bandwidth specified by the server administrator.
      509: 'Bandwidth Limit Exceeded',
      '509_NAME': 'BANDWIDTH_LIMIT_EXCEEDED',
      '509_MESSAGE': 'The server has exceeded the bandwidth specified by the server administrator.',
      '509_CLASS': classes.SERVER_ERROR,
      BANDWIDTH_LIMIT_EXCEEDED: 509,
      // 530 Site is frozen - Used by the Pantheon web platform to indicate a site that has been frozen due to inactivity.
      530: 'Site is frozen',
      '530_NAME': 'SITE_IS_FROZEN',
      '530_MESSAGE': 'Used by the Pantheon web platform to indicate a site that has been frozen due to inactivity.',
      '530_CLASS': classes.SERVER_ERROR,
      SITE_IS_FROZEN: 530,
      // 598 (Informal convention) Network read timeout error - Used by some HTTP proxies to signal a network read timeout behind the proxy to a client in front of the proxy.
      598: 'Network read timeout error',
      '598_NAME': 'NETWORK_READ_TIMEOUT_ERROR',
      '598_MESSAGE': 'Used by some HTTP proxies to signal a network read timeout behind the proxy to a client in front of the proxy.',
      '598_CLASS': classes.SERVER_ERROR,
      NETWORK_READ_TIMEOUT_ERROR: 598
    },
    // ### Internet Information Services (IIS)

    // Microsoft's Internet Information Services (IIS) web server expands the 4xx error space to signal errors with the client's request.
    iis: {
      // 440 - The client's session has expired and must log in again.
      440: 'Login Time-out',
      '440_NAME': 'LOGIN_TIME_OUT',
      '440_MESSAGE': 'The client\'s session has expired and must log in again.',
      '440_CLASS': classes.CLIENT_ERROR,
      LOGIN_TIME_OUT: 440,
      // 449 - The server cannot honour the request because the user has not provided the required information.
      449: 'Retry With',
      '449_NAME': 'RETRY_WITH',
      '449_MESSAGE': 'The server cannot honour the request because the user has not provided the required information.',
      '449_CLASS': classes.CLIENT_ERROR,
      RETRY_WITH: 449,
      // 451 - Used in Exchange ActiveSync when either a more efficient server is available or the server cannot access the users' mailbox.
      451: 'Redirect',
      '451_NAME': 'REDIRECT',
      '451_MESSAGE': 'Used in Exchange ActiveSync when either a more efficient server is available or the server cannot access the users\' mailbox.',
      '451_CLASS': classes.CLIENT_ERROR,
      REDIRECT: 451
    },
    // ### NGINX

    // The NGINX web server software expands the 4xx error space to signal issues with the client's request.
    nginx: {
      // 444 - Used internally to instruct the server to return no information to the client and close the connection immediately.
      444: 'No Response',
      '444_NAME': 'NO_RESPONSE',
      '444_MESSAGE': 'Used internally to instruct the server to return no information to the client and close the connection immediately.',
      '444_CLASS': classes.CLIENT_ERROR,
      NO_RESPONSE: 444,
      // 494 - Client sent too large request or too long header line.
      494: 'Request header too large',
      '494_NAME': 'REQUEST_HEADER_TOO_LARGE',
      '494_MESSAGE': 'Client sent too large request or too long header line.',
      '494_CLASS': classes.CLIENT_ERROR,
      REQUEST_HEADER_TOO_LARGE: 494,
      // 495 - An expansion of the 400 Bad Request response code, used when the client has provided an invalid client certificate.
      495: 'SSL Certificate Error',
      '495_NAME': 'SSL_CERTIFICATE_ERROR',
      '495_MESSAGE': 'An expansion of the 400 Bad Request response code, used when the client has provided an invalid client certificate.',
      '495_CLASS': classes.CLIENT_ERROR,
      SSL_CERTIFICATE_ERROR: 495,
      // 496 - An expansion of the 400 Bad Request response code, used when a client certificate is required but not provided.
      496: 'SSL Certificate Required',
      '496_NAME': 'SSL_CERTIFICATE_REQUIRED',
      '496_MESSAGE': 'An expansion of the 400 Bad Request response code, used when a client certificate is required but not provided.',
      '496_CLASS': classes.CLIENT_ERROR,
      SSL_CERTIFICATE_REQUIRED: 496,
      // 497 - An expansion of the 400 Bad Request response code, used when the client has made a HTTP request to a port listening for HTTPS requests.
      497: 'HTTP Request Sent to HTTPS Port',
      '497_NAME': 'HTTP_REQUEST_SENT_TO_HTTPS_PORT',
      '497_MESSAGE': 'An expansion of the 400 Bad Request response code, used when the client has made a HTTP request to a port listening for HTTPS requests.',
      '497_CLASS': classes.CLIENT_ERROR,
      HTTP_REQUEST_SENT_TO_HTTPS_PORT: 497,
      // 499 - Used when the client has closed the request before the server could send a response.
      499: 'Client Closed Request',
      '499_NAME': 'CLIENT_CLOSED_REQUEST',
      '499_MESSAGE': 'Used when the client has closed the request before the server could send a response.',
      '499_CLASS': classes.CLIENT_ERROR,
      CLIENT_CLOSED_REQUEST: 499
    },
    // ### Cloudflare

    // Cloudflare's reverse proxy service expands the 5xx series of errors space to signal issues with the origin server.
    cloudflare: {
      // 520 - The 520 error is used as a "catch-all response for when the origin server returns something unexpected", listing connection resets, large headers, and empty or invalid responses as common triggers.
      520: 'Unknown Error',
      '520_NAME': 'UNKNOWN_ERROR',
      '520_MESSAGE': 'The 520 error is used as a "catch-all response for when the origin server returns something unexpected", listing connection resets, large headers, and empty or invalid responses as common triggers.',
      '520_CLASS': classes.SERVER_ERROR,
      UNKNOWN_ERROR: 520,
      // 521 - The origin server has refused the connection from Cloudflare.
      521: 'Web Server Is Down',
      '521_NAME': 'WEB_SERVER_IS_DOWN',
      '521_MESSAGE': 'The origin server has refused the connection from Cloudflare.',
      '521_CLASS': classes.SERVER_ERROR,
      WEB_SERVER_IS_DOWN: 521,
      // 522 - Cloudflare could not negotiate a TCP handshake with the origin server.
      522: 'Connection Timed Out',
      '522_NAME': 'CONNECTION_TIMED_OUT',
      '522_MESSAGE': 'Cloudflare could not negotiate a TCP handshake with the origin server.',
      '522_CLASS': classes.SERVER_ERROR,
      CONNECTION_TIMED_OUT: 522,
      // 523 - Cloudflare could not reach the origin server.
      523: 'Origin Is Unreachable',
      '523_NAME': 'ORIGIN_IS_UNREACHABLE',
      '523_MESSAGE': 'Cloudflare could not reach the origin server.',
      '523_CLASS': classes.SERVER_ERROR,
      ORIGIN_IS_UNREACHABLE: 523,
      // 524 - Cloudflare was able to complete a TCP connection to the origin server, but did not receive a timely HTTP response.
      524: 'A Timeout Occurred',
      '524_NAME': 'A_TIMEOUT_OCCURRED',
      '524_MESSAGE': 'Cloudflare was able to complete a TCP connection to the origin server, but did not receive a timely HTTP response.',
      '524_CLASS': classes.SERVER_ERROR,
      A_TIMEOUT_OCCURRED: 524,
      // 525 - Cloudflare could not negotiate a SSL/TLS handshake with the origin server.
      525: 'SSL Handshake Failed',
      '525_NAME': 'SSL_HANDSHAKE_FAILED',
      '525_MESSAGE': 'Cloudflare could not negotiate a SSL/TLS handshake with the origin server.',
      '525_CLASS': classes.SERVER_ERROR,
      SSL_HANDSHAKE_FAILED: 525,
      // 526 - Cloudflare could not validate the SSL/TLS certificate that the origin server presented.
      526: 'Invalid SSL Certificate',
      '526_NAME': 'INVALID_SSL_CERTIFICATE',
      '526_MESSAGE': 'Cloudflare could not validate the SSL/TLS certificate that the origin server presented.',
      '526_CLASS': classes.SERVER_ERROR,
      INVALID_SSL_CERTIFICATE: 526,
      // 527 - Error 527 indicates that the request timed out or failed after the WAN connection had been established.
      527: 'Railgun Error',
      '527_NAME': 'RAILGUN_ERROR',
      '527_MESSAGE': 'Error 527 indicates that the request timed out or failed after the WAN connection had been established.',
      '527_CLASS': classes.SERVER_ERROR,
      RAILGUN_ERROR: 527
    }
  }
};

},{}],288:[function(require,module,exports){
(function (process,global){
var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function e(t,e){return t(e={exports:{}},e.exports),e.exports}var r=e(function(t,e){var r;t.exports=r=r||function(t,e){var r=Object.create||function(){function t(){}return function(e){var r;return t.prototype=e,r=new t,t.prototype=null,r}}(),i={},n=i.lib={},o=n.Base={extend:function(t){var e=r(this);return t&&e.mixIn(t),e.hasOwnProperty("init")&&this.init!==e.init||(e.init=function(){e.$super.init.apply(this,arguments)}),e.init.prototype=e,e.$super=this,e},create:function(){var t=this.extend();return t.init.apply(t,arguments),t},init:function(){},mixIn:function(t){for(var e in t)t.hasOwnProperty(e)&&(this[e]=t[e]);t.hasOwnProperty("toString")&&(this.toString=t.toString)},clone:function(){return this.init.prototype.extend(this)}},s=n.WordArray=o.extend({init:function(t,e){t=this.words=t||[],this.sigBytes=null!=e?e:4*t.length},toString:function(t){return(t||a).stringify(this)},concat:function(t){var e=this.words,r=t.words,i=this.sigBytes,n=t.sigBytes;if(this.clamp(),i%4)for(var o=0;o<n;o++)e[i+o>>>2]|=(r[o>>>2]>>>24-o%4*8&255)<<24-(i+o)%4*8;else for(o=0;o<n;o+=4)e[i+o>>>2]=r[o>>>2];return this.sigBytes+=n,this},clamp:function(){var e=this.words,r=this.sigBytes;e[r>>>2]&=4294967295<<32-r%4*8,e.length=t.ceil(r/4)},clone:function(){var t=o.clone.call(this);return t.words=this.words.slice(0),t},random:function(e){for(var r,i=[],n=function(e){e=e;var r=987654321,i=4294967295;return function(){var n=((r=36969*(65535&r)+(r>>16)&i)<<16)+(e=18e3*(65535&e)+(e>>16)&i)&i;return n/=4294967296,(n+=.5)*(t.random()>.5?1:-1)}},o=0;o<e;o+=4){var h=n(4294967296*(r||t.random()));r=987654071*h(),i.push(4294967296*h()|0)}return new s.init(i,e)}}),h=i.enc={},a=h.Hex={stringify:function(t){for(var e=t.words,r=t.sigBytes,i=[],n=0;n<r;n++){var o=e[n>>>2]>>>24-n%4*8&255;i.push((o>>>4).toString(16)),i.push((15&o).toString(16))}return i.join("")},parse:function(t){for(var e=t.length,r=[],i=0;i<e;i+=2)r[i>>>3]|=parseInt(t.substr(i,2),16)<<24-i%8*4;return new s.init(r,e/2)}},u=h.Latin1={stringify:function(t){for(var e=t.words,r=t.sigBytes,i=[],n=0;n<r;n++)i.push(String.fromCharCode(e[n>>>2]>>>24-n%4*8&255));return i.join("")},parse:function(t){for(var e=t.length,r=[],i=0;i<e;i++)r[i>>>2]|=(255&t.charCodeAt(i))<<24-i%4*8;return new s.init(r,e)}},f=h.Utf8={stringify:function(t){try{return decodeURIComponent(escape(u.stringify(t)))}catch(t){throw new Error("Malformed UTF-8 data")}},parse:function(t){return u.parse(unescape(encodeURIComponent(t)))}},c=n.BufferedBlockAlgorithm=o.extend({reset:function(){this._data=new s.init,this._nDataBytes=0},_append:function(t){"string"==typeof t&&(t=f.parse(t)),this._data.concat(t),this._nDataBytes+=t.sigBytes},_process:function(e){var r=this._data,i=r.words,n=r.sigBytes,o=this.blockSize,h=n/(4*o),a=(h=e?t.ceil(h):t.max((0|h)-this._minBufferSize,0))*o,u=t.min(4*a,n);if(a){for(var f=0;f<a;f+=o)this._doProcessBlock(i,f);var c=i.splice(0,a);r.sigBytes-=u}return new s.init(c,u)},clone:function(){var t=o.clone.call(this);return t._data=this._data.clone(),t},_minBufferSize:0}),p=(n.Hasher=c.extend({cfg:o.extend(),init:function(t){this.cfg=this.cfg.extend(t),this.reset()},reset:function(){c.reset.call(this),this._doReset()},update:function(t){return this._append(t),this._process(),this},finalize:function(t){return t&&this._append(t),this._doFinalize()},blockSize:16,_createHelper:function(t){return function(e,r){return new t.init(r).finalize(e)}},_createHmacHelper:function(t){return function(e,r){return new p.HMAC.init(t,r).finalize(e)}}}),i.algo={});return i}(Math)}),i=e(function(t,e){var i;t.exports=(i=r,function(t){var e=i,r=e.lib,n=r.WordArray,o=r.Hasher,s=e.algo,h=[],a=[];!function(){function e(e){for(var r=t.sqrt(e),i=2;i<=r;i++)if(!(e%i))return!1;return!0}function r(t){return 4294967296*(t-(0|t))|0}for(var i=2,n=0;n<64;)e(i)&&(n<8&&(h[n]=r(t.pow(i,.5))),a[n]=r(t.pow(i,1/3)),n++),i++}();var u=[],f=s.SHA256=o.extend({_doReset:function(){this._hash=new n.init(h.slice(0))},_doProcessBlock:function(t,e){for(var r=this._hash.words,i=r[0],n=r[1],o=r[2],s=r[3],h=r[4],f=r[5],c=r[6],p=r[7],l=0;l<64;l++){if(l<16)u[l]=0|t[e+l];else{var d=u[l-15],m=u[l-2];u[l]=((d<<25|d>>>7)^(d<<14|d>>>18)^d>>>3)+u[l-7]+((m<<15|m>>>17)^(m<<13|m>>>19)^m>>>10)+u[l-16]}var v=i&n^i&o^n&o,y=p+((h<<26|h>>>6)^(h<<21|h>>>11)^(h<<7|h>>>25))+(h&f^~h&c)+a[l]+u[l];p=c,c=f,f=h,h=s+y|0,s=o,o=n,n=i,i=y+(((i<<30|i>>>2)^(i<<19|i>>>13)^(i<<10|i>>>22))+v)|0}r[0]=r[0]+i|0,r[1]=r[1]+n|0,r[2]=r[2]+o|0,r[3]=r[3]+s|0,r[4]=r[4]+h|0,r[5]=r[5]+f|0,r[6]=r[6]+c|0,r[7]=r[7]+p|0},_doFinalize:function(){var e=this._data,r=e.words,i=8*this._nDataBytes,n=8*e.sigBytes;return r[n>>>5]|=128<<24-n%32,r[14+(n+64>>>9<<4)]=t.floor(i/4294967296),r[15+(n+64>>>9<<4)]=i,e.sigBytes=4*r.length,this._process(),this._hash},clone:function(){var t=o.clone.call(this);return t._hash=this._hash.clone(),t}});e.SHA256=o._createHelper(f),e.HmacSHA256=o._createHmacHelper(f)}(Math),i.SHA256)}),n=e(function(t,e){var i,n;t.exports=(n=(i=r).lib.WordArray,i.enc.Base64={stringify:function(t){var e=t.words,r=t.sigBytes,i=this._map;t.clamp();for(var n=[],o=0;o<r;o+=3)for(var s=(e[o>>>2]>>>24-o%4*8&255)<<16|(e[o+1>>>2]>>>24-(o+1)%4*8&255)<<8|e[o+2>>>2]>>>24-(o+2)%4*8&255,h=0;h<4&&o+.75*h<r;h++)n.push(i.charAt(s>>>6*(3-h)&63));var a=i.charAt(64);if(a)for(;n.length%4;)n.push(a);return n.join("")},parse:function(t){var e=t.length,r=this._map,i=this._reverseMap;if(!i){i=this._reverseMap=[];for(var o=0;o<r.length;o++)i[r.charCodeAt(o)]=o}var s=r.charAt(64);if(s){var h=t.indexOf(s);-1!==h&&(e=h)}return function(t,e,r){for(var i=[],o=0,s=0;s<e;s++)if(s%4){var h=r[t.charCodeAt(s-1)]<<s%4*2,a=r[t.charCodeAt(s)]>>>6-s%4*2;i[o>>>2]|=(h|a)<<24-o%4*8,o++}return n.create(i,o)}(t,e,i)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="},i.enc.Base64)}),o=e(function(t,e){t.exports=r.enc.Hex}),s=e(function(e,r){(function(){var t;function r(t,e,r){null!=t&&("number"==typeof t?this.fromNumber(t,e,r):this.fromString(t,null==e&&"string"!=typeof t?256:e))}function i(){return new r(null)}var n="undefined"!=typeof navigator;n&&"Microsoft Internet Explorer"==navigator.appName?(r.prototype.am=function(t,e,r,i,n,o){for(var s=32767&e,h=e>>15;--o>=0;){var a=32767&this[t],u=this[t++]>>15,f=h*a+u*s;n=((a=s*a+((32767&f)<<15)+r[i]+(1073741823&n))>>>30)+(f>>>15)+h*u+(n>>>30),r[i++]=1073741823&a}return n},t=30):n&&"Netscape"!=navigator.appName?(r.prototype.am=function(t,e,r,i,n,o){for(;--o>=0;){var s=e*this[t++]+r[i]+n;n=Math.floor(s/67108864),r[i++]=67108863&s}return n},t=26):(r.prototype.am=function(t,e,r,i,n,o){for(var s=16383&e,h=e>>14;--o>=0;){var a=16383&this[t],u=this[t++]>>14,f=h*a+u*s;n=((a=s*a+((16383&f)<<14)+r[i]+n)>>28)+(f>>14)+h*u,r[i++]=268435455&a}return n},t=28),r.prototype.DB=t,r.prototype.DM=(1<<t)-1,r.prototype.DV=1<<t,r.prototype.FV=Math.pow(2,52),r.prototype.F1=52-t,r.prototype.F2=2*t-52;var o,s,h="0123456789abcdefghijklmnopqrstuvwxyz",a=new Array;for(o="0".charCodeAt(0),s=0;s<=9;++s)a[o++]=s;for(o="a".charCodeAt(0),s=10;s<36;++s)a[o++]=s;for(o="A".charCodeAt(0),s=10;s<36;++s)a[o++]=s;function u(t){return h.charAt(t)}function f(t,e){var r=a[t.charCodeAt(e)];return null==r?-1:r}function c(t){var e=i();return e.fromInt(t),e}function p(t){var e,r=1;return 0!=(e=t>>>16)&&(t=e,r+=16),0!=(e=t>>8)&&(t=e,r+=8),0!=(e=t>>4)&&(t=e,r+=4),0!=(e=t>>2)&&(t=e,r+=2),0!=(e=t>>1)&&(t=e,r+=1),r}function l(t){this.m=t}function d(t){this.m=t,this.mp=t.invDigit(),this.mpl=32767&this.mp,this.mph=this.mp>>15,this.um=(1<<t.DB-15)-1,this.mt2=2*t.t}function m(t,e){return t&e}function v(t,e){return t|e}function y(t,e){return t^e}function g(t,e){return t&~e}function w(t){if(0==t)return-1;var e=0;return 0==(65535&t)&&(t>>=16,e+=16),0==(255&t)&&(t>>=8,e+=8),0==(15&t)&&(t>>=4,e+=4),0==(3&t)&&(t>>=2,e+=2),0==(1&t)&&++e,e}function T(t){for(var e=0;0!=t;)t&=t-1,++e;return e}function b(){}function _(t){return t}function A(t){this.r2=i(),this.q3=i(),r.ONE.dlShiftTo(2*t.t,this.r2),this.mu=this.r2.divide(t),this.m=t}l.prototype.convert=function(t){return t.s<0||t.compareTo(this.m)>=0?t.mod(this.m):t},l.prototype.revert=function(t){return t},l.prototype.reduce=function(t){t.divRemTo(this.m,null,t)},l.prototype.mulTo=function(t,e,r){t.multiplyTo(e,r),this.reduce(r)},l.prototype.sqrTo=function(t,e){t.squareTo(e),this.reduce(e)},d.prototype.convert=function(t){var e=i();return t.abs().dlShiftTo(this.m.t,e),e.divRemTo(this.m,null,e),t.s<0&&e.compareTo(r.ZERO)>0&&this.m.subTo(e,e),e},d.prototype.revert=function(t){var e=i();return t.copyTo(e),this.reduce(e),e},d.prototype.reduce=function(t){for(;t.t<=this.mt2;)t[t.t++]=0;for(var e=0;e<this.m.t;++e){var r=32767&t[e],i=r*this.mpl+((r*this.mph+(t[e]>>15)*this.mpl&this.um)<<15)&t.DM;for(t[r=e+this.m.t]+=this.m.am(0,i,t,e,0,this.m.t);t[r]>=t.DV;)t[r]-=t.DV,t[++r]++}t.clamp(),t.drShiftTo(this.m.t,t),t.compareTo(this.m)>=0&&t.subTo(this.m,t)},d.prototype.mulTo=function(t,e,r){t.multiplyTo(e,r),this.reduce(r)},d.prototype.sqrTo=function(t,e){t.squareTo(e),this.reduce(e)},r.prototype.copyTo=function(t){for(var e=this.t-1;e>=0;--e)t[e]=this[e];t.t=this.t,t.s=this.s},r.prototype.fromInt=function(t){this.t=1,this.s=t<0?-1:0,t>0?this[0]=t:t<-1?this[0]=t+this.DV:this.t=0},r.prototype.fromString=function(t,e){var i;if(16==e)i=4;else if(8==e)i=3;else if(256==e)i=8;else if(2==e)i=1;else if(32==e)i=5;else{if(4!=e)return void this.fromRadix(t,e);i=2}this.t=0,this.s=0;for(var n=t.length,o=!1,s=0;--n>=0;){var h=8==i?255&t[n]:f(t,n);h<0?"-"==t.charAt(n)&&(o=!0):(o=!1,0==s?this[this.t++]=h:s+i>this.DB?(this[this.t-1]|=(h&(1<<this.DB-s)-1)<<s,this[this.t++]=h>>this.DB-s):this[this.t-1]|=h<<s,(s+=i)>=this.DB&&(s-=this.DB))}8==i&&0!=(128&t[0])&&(this.s=-1,s>0&&(this[this.t-1]|=(1<<this.DB-s)-1<<s)),this.clamp(),o&&r.ZERO.subTo(this,this)},r.prototype.clamp=function(){for(var t=this.s&this.DM;this.t>0&&this[this.t-1]==t;)--this.t},r.prototype.dlShiftTo=function(t,e){var r;for(r=this.t-1;r>=0;--r)e[r+t]=this[r];for(r=t-1;r>=0;--r)e[r]=0;e.t=this.t+t,e.s=this.s},r.prototype.drShiftTo=function(t,e){for(var r=t;r<this.t;++r)e[r-t]=this[r];e.t=Math.max(this.t-t,0),e.s=this.s},r.prototype.lShiftTo=function(t,e){var r,i=t%this.DB,n=this.DB-i,o=(1<<n)-1,s=Math.floor(t/this.DB),h=this.s<<i&this.DM;for(r=this.t-1;r>=0;--r)e[r+s+1]=this[r]>>n|h,h=(this[r]&o)<<i;for(r=s-1;r>=0;--r)e[r]=0;e[s]=h,e.t=this.t+s+1,e.s=this.s,e.clamp()},r.prototype.rShiftTo=function(t,e){e.s=this.s;var r=Math.floor(t/this.DB);if(r>=this.t)e.t=0;else{var i=t%this.DB,n=this.DB-i,o=(1<<i)-1;e[0]=this[r]>>i;for(var s=r+1;s<this.t;++s)e[s-r-1]|=(this[s]&o)<<n,e[s-r]=this[s]>>i;i>0&&(e[this.t-r-1]|=(this.s&o)<<n),e.t=this.t-r,e.clamp()}},r.prototype.subTo=function(t,e){for(var r=0,i=0,n=Math.min(t.t,this.t);r<n;)i+=this[r]-t[r],e[r++]=i&this.DM,i>>=this.DB;if(t.t<this.t){for(i-=t.s;r<this.t;)i+=this[r],e[r++]=i&this.DM,i>>=this.DB;i+=this.s}else{for(i+=this.s;r<t.t;)i-=t[r],e[r++]=i&this.DM,i>>=this.DB;i-=t.s}e.s=i<0?-1:0,i<-1?e[r++]=this.DV+i:i>0&&(e[r++]=i),e.t=r,e.clamp()},r.prototype.multiplyTo=function(t,e){var i=this.abs(),n=t.abs(),o=i.t;for(e.t=o+n.t;--o>=0;)e[o]=0;for(o=0;o<n.t;++o)e[o+i.t]=i.am(0,n[o],e,o,0,i.t);e.s=0,e.clamp(),this.s!=t.s&&r.ZERO.subTo(e,e)},r.prototype.squareTo=function(t){for(var e=this.abs(),r=t.t=2*e.t;--r>=0;)t[r]=0;for(r=0;r<e.t-1;++r){var i=e.am(r,e[r],t,2*r,0,1);(t[r+e.t]+=e.am(r+1,2*e[r],t,2*r+1,i,e.t-r-1))>=e.DV&&(t[r+e.t]-=e.DV,t[r+e.t+1]=1)}t.t>0&&(t[t.t-1]+=e.am(r,e[r],t,2*r,0,1)),t.s=0,t.clamp()},r.prototype.divRemTo=function(t,e,n){var o=t.abs();if(!(o.t<=0)){var s=this.abs();if(s.t<o.t)return null!=e&&e.fromInt(0),void(null!=n&&this.copyTo(n));null==n&&(n=i());var h=i(),a=this.s,u=t.s,f=this.DB-p(o[o.t-1]);f>0?(o.lShiftTo(f,h),s.lShiftTo(f,n)):(o.copyTo(h),s.copyTo(n));var c=h.t,l=h[c-1];if(0!=l){var d=l*(1<<this.F1)+(c>1?h[c-2]>>this.F2:0),m=this.FV/d,v=(1<<this.F1)/d,y=1<<this.F2,g=n.t,w=g-c,T=null==e?i():e;for(h.dlShiftTo(w,T),n.compareTo(T)>=0&&(n[n.t++]=1,n.subTo(T,n)),r.ONE.dlShiftTo(c,T),T.subTo(h,h);h.t<c;)h[h.t++]=0;for(;--w>=0;){var b=n[--g]==l?this.DM:Math.floor(n[g]*m+(n[g-1]+y)*v);if((n[g]+=h.am(0,b,n,w,0,c))<b)for(h.dlShiftTo(w,T),n.subTo(T,n);n[g]<--b;)n.subTo(T,n)}null!=e&&(n.drShiftTo(c,e),a!=u&&r.ZERO.subTo(e,e)),n.t=c,n.clamp(),f>0&&n.rShiftTo(f,n),a<0&&r.ZERO.subTo(n,n)}}},r.prototype.invDigit=function(){if(this.t<1)return 0;var t=this[0];if(0==(1&t))return 0;var e=3&t;return(e=(e=(e=(e=e*(2-(15&t)*e)&15)*(2-(255&t)*e)&255)*(2-((65535&t)*e&65535))&65535)*(2-t*e%this.DV)%this.DV)>0?this.DV-e:-e},r.prototype.isEven=function(){return 0==(this.t>0?1&this[0]:this.s)},r.prototype.exp=function(t,e){if(t>4294967295||t<1)return r.ONE;var n=i(),o=i(),s=e.convert(this),h=p(t)-1;for(s.copyTo(n);--h>=0;)if(e.sqrTo(n,o),(t&1<<h)>0)e.mulTo(o,s,n);else{var a=n;n=o,o=a}return e.revert(n)},r.prototype.toString=function(t){if(this.s<0)return"-"+this.negate().toString(t);var e;if(16==t)e=4;else if(8==t)e=3;else if(2==t)e=1;else if(32==t)e=5;else{if(4!=t)return this.toRadix(t);e=2}var r,i=(1<<e)-1,n=!1,o="",s=this.t,h=this.DB-s*this.DB%e;if(s-- >0)for(h<this.DB&&(r=this[s]>>h)>0&&(n=!0,o=u(r));s>=0;)h<e?(r=(this[s]&(1<<h)-1)<<e-h,r|=this[--s]>>(h+=this.DB-e)):(r=this[s]>>(h-=e)&i,h<=0&&(h+=this.DB,--s)),r>0&&(n=!0),n&&(o+=u(r));return n?o:"0"},r.prototype.negate=function(){var t=i();return r.ZERO.subTo(this,t),t},r.prototype.abs=function(){return this.s<0?this.negate():this},r.prototype.compareTo=function(t){var e=this.s-t.s;if(0!=e)return e;var r=this.t;if(0!=(e=r-t.t))return this.s<0?-e:e;for(;--r>=0;)if(0!=(e=this[r]-t[r]))return e;return 0},r.prototype.bitLength=function(){return this.t<=0?0:this.DB*(this.t-1)+p(this[this.t-1]^this.s&this.DM)},r.prototype.mod=function(t){var e=i();return this.abs().divRemTo(t,null,e),this.s<0&&e.compareTo(r.ZERO)>0&&t.subTo(e,e),e},r.prototype.modPowInt=function(t,e){var r;return r=t<256||e.isEven()?new l(e):new d(e),this.exp(t,r)},r.ZERO=c(0),r.ONE=c(1),b.prototype.convert=_,b.prototype.revert=_,b.prototype.mulTo=function(t,e,r){t.multiplyTo(e,r)},b.prototype.sqrTo=function(t,e){t.squareTo(e)},A.prototype.convert=function(t){if(t.s<0||t.t>2*this.m.t)return t.mod(this.m);if(t.compareTo(this.m)<0)return t;var e=i();return t.copyTo(e),this.reduce(e),e},A.prototype.revert=function(t){return t},A.prototype.reduce=function(t){for(t.drShiftTo(this.m.t-1,this.r2),t.t>this.m.t+1&&(t.t=this.m.t+1,t.clamp()),this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3),this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);t.compareTo(this.r2)<0;)t.dAddOffset(1,this.m.t+1);for(t.subTo(this.r2,t);t.compareTo(this.m)>=0;)t.subTo(this.m,t)},A.prototype.mulTo=function(t,e,r){t.multiplyTo(e,r),this.reduce(r)},A.prototype.sqrTo=function(t,e){t.squareTo(e),this.reduce(e)};var S,D,B,x=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997],k=(1<<26)/x[x.length-1];function E(){var t;t=(new Date).getTime(),D[B++]^=255&t,D[B++]^=t>>8&255,D[B++]^=t>>16&255,D[B++]^=t>>24&255,B>=N&&(B-=N)}if(r.prototype.chunkSize=function(t){return Math.floor(Math.LN2*this.DB/Math.log(t))},r.prototype.toRadix=function(t){if(null==t&&(t=10),0==this.signum()||t<2||t>36)return"0";var e=this.chunkSize(t),r=Math.pow(t,e),n=c(r),o=i(),s=i(),h="";for(this.divRemTo(n,o,s);o.signum()>0;)h=(r+s.intValue()).toString(t).substr(1)+h,o.divRemTo(n,o,s);return s.intValue().toString(t)+h},r.prototype.fromRadix=function(t,e){this.fromInt(0),null==e&&(e=10);for(var i=this.chunkSize(e),n=Math.pow(e,i),o=!1,s=0,h=0,a=0;a<t.length;++a){var u=f(t,a);u<0?"-"==t.charAt(a)&&0==this.signum()&&(o=!0):(h=e*h+u,++s>=i&&(this.dMultiply(n),this.dAddOffset(h,0),s=0,h=0))}s>0&&(this.dMultiply(Math.pow(e,s)),this.dAddOffset(h,0)),o&&r.ZERO.subTo(this,this)},r.prototype.fromNumber=function(t,e,i){if("number"==typeof e)if(t<2)this.fromInt(1);else for(this.fromNumber(t,i),this.testBit(t-1)||this.bitwiseTo(r.ONE.shiftLeft(t-1),v,this),this.isEven()&&this.dAddOffset(1,0);!this.isProbablePrime(e);)this.dAddOffset(2,0),this.bitLength()>t&&this.subTo(r.ONE.shiftLeft(t-1),this);else{var n=new Array,o=7&t;n.length=1+(t>>3),e.nextBytes(n),o>0?n[0]&=(1<<o)-1:n[0]=0,this.fromString(n,256)}},r.prototype.bitwiseTo=function(t,e,r){var i,n,o=Math.min(t.t,this.t);for(i=0;i<o;++i)r[i]=e(this[i],t[i]);if(t.t<this.t){for(n=t.s&this.DM,i=o;i<this.t;++i)r[i]=e(this[i],n);r.t=this.t}else{for(n=this.s&this.DM,i=o;i<t.t;++i)r[i]=e(n,t[i]);r.t=t.t}r.s=e(this.s,t.s),r.clamp()},r.prototype.changeBit=function(t,e){var i=r.ONE.shiftLeft(t);return this.bitwiseTo(i,e,i),i},r.prototype.addTo=function(t,e){for(var r=0,i=0,n=Math.min(t.t,this.t);r<n;)i+=this[r]+t[r],e[r++]=i&this.DM,i>>=this.DB;if(t.t<this.t){for(i+=t.s;r<this.t;)i+=this[r],e[r++]=i&this.DM,i>>=this.DB;i+=this.s}else{for(i+=this.s;r<t.t;)i+=t[r],e[r++]=i&this.DM,i>>=this.DB;i+=t.s}e.s=i<0?-1:0,i>0?e[r++]=i:i<-1&&(e[r++]=this.DV+i),e.t=r,e.clamp()},r.prototype.dMultiply=function(t){this[this.t]=this.am(0,t-1,this,0,0,this.t),++this.t,this.clamp()},r.prototype.dAddOffset=function(t,e){if(0!=t){for(;this.t<=e;)this[this.t++]=0;for(this[e]+=t;this[e]>=this.DV;)this[e]-=this.DV,++e>=this.t&&(this[this.t++]=0),++this[e]}},r.prototype.multiplyLowerTo=function(t,e,r){var i,n=Math.min(this.t+t.t,e);for(r.s=0,r.t=n;n>0;)r[--n]=0;for(i=r.t-this.t;n<i;++n)r[n+this.t]=this.am(0,t[n],r,n,0,this.t);for(i=Math.min(t.t,e);n<i;++n)this.am(0,t[n],r,n,0,e-n);r.clamp()},r.prototype.multiplyUpperTo=function(t,e,r){var i=r.t=this.t+t.t- --e;for(r.s=0;--i>=0;)r[i]=0;for(i=Math.max(e-this.t,0);i<t.t;++i)r[this.t+i-e]=this.am(e-i,t[i],r,0,0,this.t+i-e);r.clamp(),r.drShiftTo(1,r)},r.prototype.modInt=function(t){if(t<=0)return 0;var e=this.DV%t,r=this.s<0?t-1:0;if(this.t>0)if(0==e)r=this[0]%t;else for(var i=this.t-1;i>=0;--i)r=(e*r+this[i])%t;return r},r.prototype.millerRabin=function(t){var e=this.subtract(r.ONE),n=e.getLowestSetBit();if(n<=0)return!1;var o=e.shiftRight(n);(t=t+1>>1)>x.length&&(t=x.length);for(var s=i(),h=0;h<t;++h){s.fromInt(x[Math.floor(Math.random()*x.length)]);var a=s.modPow(o,this);if(0!=a.compareTo(r.ONE)&&0!=a.compareTo(e)){for(var u=1;u++<n&&0!=a.compareTo(e);)if(0==(a=a.modPowInt(2,this)).compareTo(r.ONE))return!1;if(0!=a.compareTo(e))return!1}}return!0},r.prototype.clone=function(){var t=i();return this.copyTo(t),t},r.prototype.intValue=function(){if(this.s<0){if(1==this.t)return this[0]-this.DV;if(0==this.t)return-1}else{if(1==this.t)return this[0];if(0==this.t)return 0}return(this[1]&(1<<32-this.DB)-1)<<this.DB|this[0]},r.prototype.byteValue=function(){return 0==this.t?this.s:this[0]<<24>>24},r.prototype.shortValue=function(){return 0==this.t?this.s:this[0]<<16>>16},r.prototype.signum=function(){return this.s<0?-1:this.t<=0||1==this.t&&this[0]<=0?0:1},r.prototype.toByteArray=function(){var t=this.t,e=new Array;e[0]=this.s;var r,i=this.DB-t*this.DB%8,n=0;if(t-- >0)for(i<this.DB&&(r=this[t]>>i)!=(this.s&this.DM)>>i&&(e[n++]=r|this.s<<this.DB-i);t>=0;)i<8?(r=(this[t]&(1<<i)-1)<<8-i,r|=this[--t]>>(i+=this.DB-8)):(r=this[t]>>(i-=8)&255,i<=0&&(i+=this.DB,--t)),0!=(128&r)&&(r|=-256),0==n&&(128&this.s)!=(128&r)&&++n,(n>0||r!=this.s)&&(e[n++]=r);return e},r.prototype.equals=function(t){return 0==this.compareTo(t)},r.prototype.min=function(t){return this.compareTo(t)<0?this:t},r.prototype.max=function(t){return this.compareTo(t)>0?this:t},r.prototype.and=function(t){var e=i();return this.bitwiseTo(t,m,e),e},r.prototype.or=function(t){var e=i();return this.bitwiseTo(t,v,e),e},r.prototype.xor=function(t){var e=i();return this.bitwiseTo(t,y,e),e},r.prototype.andNot=function(t){var e=i();return this.bitwiseTo(t,g,e),e},r.prototype.not=function(){for(var t=i(),e=0;e<this.t;++e)t[e]=this.DM&~this[e];return t.t=this.t,t.s=~this.s,t},r.prototype.shiftLeft=function(t){var e=i();return t<0?this.rShiftTo(-t,e):this.lShiftTo(t,e),e},r.prototype.shiftRight=function(t){var e=i();return t<0?this.lShiftTo(-t,e):this.rShiftTo(t,e),e},r.prototype.getLowestSetBit=function(){for(var t=0;t<this.t;++t)if(0!=this[t])return t*this.DB+w(this[t]);return this.s<0?this.t*this.DB:-1},r.prototype.bitCount=function(){for(var t=0,e=this.s&this.DM,r=0;r<this.t;++r)t+=T(this[r]^e);return t},r.prototype.testBit=function(t){var e=Math.floor(t/this.DB);return e>=this.t?0!=this.s:0!=(this[e]&1<<t%this.DB)},r.prototype.setBit=function(t){return this.changeBit(t,v)},r.prototype.clearBit=function(t){return this.changeBit(t,g)},r.prototype.flipBit=function(t){return this.changeBit(t,y)},r.prototype.add=function(t){var e=i();return this.addTo(t,e),e},r.prototype.subtract=function(t){var e=i();return this.subTo(t,e),e},r.prototype.multiply=function(t){var e=i();return this.multiplyTo(t,e),e},r.prototype.divide=function(t){var e=i();return this.divRemTo(t,e,null),e},r.prototype.remainder=function(t){var e=i();return this.divRemTo(t,null,e),e},r.prototype.divideAndRemainder=function(t){var e=i(),r=i();return this.divRemTo(t,e,r),new Array(e,r)},r.prototype.modPow=function(t,e){var r,n,o=t.bitLength(),s=c(1);if(o<=0)return s;r=o<18?1:o<48?3:o<144?4:o<768?5:6,n=o<8?new l(e):e.isEven()?new A(e):new d(e);var h=new Array,a=3,u=r-1,f=(1<<r)-1;if(h[1]=n.convert(this),r>1){var m=i();for(n.sqrTo(h[1],m);a<=f;)h[a]=i(),n.mulTo(m,h[a-2],h[a]),a+=2}var v,y,g=t.t-1,w=!0,T=i();for(o=p(t[g])-1;g>=0;){for(o>=u?v=t[g]>>o-u&f:(v=(t[g]&(1<<o+1)-1)<<u-o,g>0&&(v|=t[g-1]>>this.DB+o-u)),a=r;0==(1&v);)v>>=1,--a;if((o-=a)<0&&(o+=this.DB,--g),w)h[v].copyTo(s),w=!1;else{for(;a>1;)n.sqrTo(s,T),n.sqrTo(T,s),a-=2;a>0?n.sqrTo(s,T):(y=s,s=T,T=y),n.mulTo(T,h[v],s)}for(;g>=0&&0==(t[g]&1<<o);)n.sqrTo(s,T),y=s,s=T,T=y,--o<0&&(o=this.DB-1,--g)}return n.revert(s)},r.prototype.modInverse=function(t){var e=t.isEven();if(this.isEven()&&e||0==t.signum())return r.ZERO;for(var i=t.clone(),n=this.clone(),o=c(1),s=c(0),h=c(0),a=c(1);0!=i.signum();){for(;i.isEven();)i.rShiftTo(1,i),e?(o.isEven()&&s.isEven()||(o.addTo(this,o),s.subTo(t,s)),o.rShiftTo(1,o)):s.isEven()||s.subTo(t,s),s.rShiftTo(1,s);for(;n.isEven();)n.rShiftTo(1,n),e?(h.isEven()&&a.isEven()||(h.addTo(this,h),a.subTo(t,a)),h.rShiftTo(1,h)):a.isEven()||a.subTo(t,a),a.rShiftTo(1,a);i.compareTo(n)>=0?(i.subTo(n,i),e&&o.subTo(h,o),s.subTo(a,s)):(n.subTo(i,n),e&&h.subTo(o,h),a.subTo(s,a))}return 0!=n.compareTo(r.ONE)?r.ZERO:a.compareTo(t)>=0?a.subtract(t):a.signum()<0?(a.addTo(t,a),a.signum()<0?a.add(t):a):a},r.prototype.pow=function(t){return this.exp(t,new b)},r.prototype.gcd=function(t){var e=this.s<0?this.negate():this.clone(),r=t.s<0?t.negate():t.clone();if(e.compareTo(r)<0){var i=e;e=r,r=i}var n=e.getLowestSetBit(),o=r.getLowestSetBit();if(o<0)return e;for(n<o&&(o=n),o>0&&(e.rShiftTo(o,e),r.rShiftTo(o,r));e.signum()>0;)(n=e.getLowestSetBit())>0&&e.rShiftTo(n,e),(n=r.getLowestSetBit())>0&&r.rShiftTo(n,r),e.compareTo(r)>=0?(e.subTo(r,e),e.rShiftTo(1,e)):(r.subTo(e,r),r.rShiftTo(1,r));return o>0&&r.lShiftTo(o,r),r},r.prototype.isProbablePrime=function(t){var e,r=this.abs();if(1==r.t&&r[0]<=x[x.length-1]){for(e=0;e<x.length;++e)if(r[0]==x[e])return!0;return!1}if(r.isEven())return!1;for(e=1;e<x.length;){for(var i=x[e],n=e+1;n<x.length&&i<k;)i*=x[n++];for(i=r.modInt(i);e<n;)if(i%x[e++]==0)return!1}return r.millerRabin(t)},r.prototype.square=function(){var t=i();return this.squareTo(t),t},r.prototype.Barrett=A,null==D){var M;if(D=new Array,B=0,"undefined"!=typeof window&&window.crypto)if(window.crypto.getRandomValues){var I=new Uint8Array(32);for(window.crypto.getRandomValues(I),M=0;M<32;++M)D[B++]=I[M]}else if("Netscape"==navigator.appName&&navigator.appVersion<"5"){var C=window.crypto.random(32);for(M=0;M<C.length;++M)D[B++]=255&C.charCodeAt(M)}for(;B<N;)M=Math.floor(65536*Math.random()),D[B++]=M>>>8,D[B++]=255&M;B=0,E()}function R(){if(null==S){for(E(),(S=new O).init(D),B=0;B<D.length;++B)D[B]=0;B=0}return S.next()}function j(){}function O(){this.i=0,this.j=0,this.S=new Array}j.prototype.nextBytes=function(t){var e;for(e=0;e<t.length;++e)t[e]=R()},O.prototype.init=function(t){var e,r,i;for(e=0;e<256;++e)this.S[e]=e;for(r=0,e=0;e<256;++e)i=this.S[e],this.S[e]=this.S[r=r+this.S[e]+t[e%t.length]&255],this.S[r]=i;this.i=0,this.j=0},O.prototype.next=function(){var t;return this.i=this.i+1&255,this.j=this.j+this.S[this.i]&255,t=this.S[this.i],this.S[this.i]=this.S[this.j],this.S[this.j]=t,this.S[t+this.S[this.i]&255]};var N=256;e.exports={default:r,BigInteger:r,SecureRandom:j}}).call(t)}).BigInteger,h={sha1:"3021300906052b0e03021a05000414",sha224:"302d300d06096086480165030402040500041c",sha256:"3031300d060960864801650304020105000420",sha384:"3041300d060960864801650304020205000430",sha512:"3051300d060960864801650304020305000440",md2:"3020300c06082a864886f70d020205000410",md5:"3020300c06082a864886f70d020505000410",ripemd160:"3021300906052b2403020105000414"},a={sha256:i};function u(t,e){if(this.n=null,this.e=0,!(null!=t&&null!=e&&t.length>0&&e.length>0))throw new Error("Invalid key data");this.n=new s(t,16),this.e=parseInt(e,16)}u.prototype.verify=function(t,e){e=e.replace(/[^0-9a-f]|[\s\n]]/gi,"");var r=new s(e,16);if(r.bitLength()>this.n.bitLength())throw new Error("Signature does not match with the key modulus.");var i=function(t){for(var e in h){var r=h[e],i=r.length;if(t.substring(0,i)===r)return{alg:e,hash:t.substring(i)}}return[]}(r.modPowInt(this.e,this.n).toString(16).replace(/^1f+00/,""));if(0===i.length)return!1;if(!a.hasOwnProperty(i.alg))throw new Error("Hashing algorithm is not supported.");var n=a[i.alg](t).toString();return i.hash===n};for(var f=[],c=[],p="undefined"!=typeof Uint8Array?Uint8Array:Array,l="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",d=0,m=l.length;d<m;++d)f[d]=l[d],c[l.charCodeAt(d)]=d;function v(t){var e=t.length;if(e%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var r=t.indexOf("=");return-1===r&&(r=e),[r,r===e?0:4-r%4]}function y(t,e,r){for(var i,n=[],o=e;o<r;o+=3)n.push(f[(i=(t[o]<<16&16711680)+(t[o+1]<<8&65280)+(255&t[o+2]))>>18&63]+f[i>>12&63]+f[i>>6&63]+f[63&i]);return n.join("")}c["-".charCodeAt(0)]=62,c["_".charCodeAt(0)]=63;var g={byteLength:function(t){var e=v(t),r=e[1];return 3*(e[0]+r)/4-r},toByteArray:function(t){var e,r,i=v(t),n=i[0],o=i[1],s=new p(function(t,e,r){return 3*(e+r)/4-r}(0,n,o)),h=0,a=o>0?n-4:n;for(r=0;r<a;r+=4)e=c[t.charCodeAt(r)]<<18|c[t.charCodeAt(r+1)]<<12|c[t.charCodeAt(r+2)]<<6|c[t.charCodeAt(r+3)],s[h++]=e>>16&255,s[h++]=e>>8&255,s[h++]=255&e;return 2===o&&(e=c[t.charCodeAt(r)]<<2|c[t.charCodeAt(r+1)]>>4,s[h++]=255&e),1===o&&(e=c[t.charCodeAt(r)]<<10|c[t.charCodeAt(r+1)]<<4|c[t.charCodeAt(r+2)]>>2,s[h++]=e>>8&255,s[h++]=255&e),s},fromByteArray:function(t){for(var e,r=t.length,i=r%3,n=[],o=0,s=r-i;o<s;o+=16383)n.push(y(t,o,o+16383>s?s:o+16383));return 1===i?n.push(f[(e=t[r-1])>>2]+f[e<<4&63]+"=="):2===i&&n.push(f[(e=(t[r-2]<<8)+t[r-1])>>10]+f[e>>4&63]+f[e<<2&63]+"="),n.join("")}};function w(t){var e=t.length%4;return 0===e?t:t+new Array(4-e+1).join("=")}function T(t){return t=w(t).replace(/\-/g,"+").replace(/_/g,"/"),decodeURIComponent(function(t){for(var e="",r=0;r<t.length;r++)e+=String.fromCharCode(t[r]);return e}(g.toByteArray(t)).split("").map(function(t){return"%"+("00"+t.charCodeAt(0).toString(16)).slice(-2)}).join(""))}function b(t){return function(t){for(var e="",r=0;r<t.length;r++){var i=t[r].toString(16);e+=2===i.length?i:"0"+i}return e}(g.toByteArray(w(t)))}var _=e(function(e,r){e.exports=function(){function e(t){return"function"==typeof t}var r=Array.isArray?Array.isArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)},i=0,n=void 0,o=void 0,s=function(t,e){l[i]=t,l[i+1]=e,2===(i+=2)&&(o?o(d):w())},h="undefined"!=typeof window?window:void 0,a=h||{},u=a.MutationObserver||a.WebKitMutationObserver,f="undefined"==typeof self&&"undefined"!=typeof process&&"[object process]"==={}.toString.call(process),c="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel;function p(){var t=setTimeout;return function(){return t(d,1)}}var l=new Array(1e3);function d(){for(var t=0;t<i;t+=2)(0,l[t])(l[t+1]),l[t]=void 0,l[t+1]=void 0;i=0}var m,v,y,g,w=void 0;function T(t,e){var r=this,i=new this.constructor(A);void 0===i[_]&&N(i);var n=r._state;if(n){var o=arguments[n-1];s(function(){return j(n,i,o,r._result)})}else C(r,i,t,e);return i}function b(t){if(t&&"object"==typeof t&&t.constructor===this)return t;var e=new this(A);return k(e,t),e}f?w=function(){return process.nextTick(d)}:u?(v=0,y=new u(d),g=document.createTextNode(""),y.observe(g,{characterData:!0}),w=function(){g.data=v=++v%2}):c?((m=new MessageChannel).port1.onmessage=d,w=function(){return m.port2.postMessage(0)}):w=void 0===h?function(){try{var t=Function("return this")().require("vertx");return void 0!==(n=t.runOnLoop||t.runOnContext)?function(){n(d)}:p()}catch(t){return p()}}():p();var _=Math.random().toString(36).substring(2);function A(){}var S=void 0,D=1,B=2;function x(t,r,i){r.constructor===t.constructor&&i===T&&r.constructor.resolve===b?function(t,e){e._state===D?M(t,e._result):e._state===B?I(t,e._result):C(e,void 0,function(e){return k(t,e)},function(e){return I(t,e)})}(t,r):void 0===i?M(t,r):e(i)?function(t,e,r){s(function(t){var i=!1,n=function(r,n,o,s){try{r.call(n,function(r){i||(i=!0,e!==r?k(t,r):M(t,r))},function(e){i||(i=!0,I(t,e))})}catch(t){return t}}(r,e);!i&&n&&(i=!0,I(t,n))},t)}(t,r,i):M(t,r)}function k(t,e){if(t===e)I(t,new TypeError("You cannot resolve a promise with itself"));else if(n=typeof(i=e),null===i||"object"!==n&&"function"!==n)M(t,e);else{var r=void 0;try{r=e.then}catch(e){return void I(t,e)}x(t,e,r)}var i,n}function E(t){t._onerror&&t._onerror(t._result),R(t)}function M(t,e){t._state===S&&(t._result=e,t._state=D,0!==t._subscribers.length&&s(R,t))}function I(t,e){t._state===S&&(t._state=B,t._result=e,s(E,t))}function C(t,e,r,i){var n=t._subscribers,o=n.length;t._onerror=null,n[o]=e,n[o+D]=r,n[o+B]=i,0===o&&t._state&&s(R,t)}function R(t){var e=t._subscribers,r=t._state;if(0!==e.length){for(var i=void 0,n=void 0,o=t._result,s=0;s<e.length;s+=3)n=e[s+r],(i=e[s])?j(r,i,n,o):n(o);t._subscribers.length=0}}function j(t,r,i,n){var o=e(i),s=void 0,h=void 0,a=!0;if(o){try{s=i(n)}catch(t){a=!1,h=t}if(r===s)return void I(r,new TypeError("A promises callback cannot return that same promise."))}else s=n;r._state!==S||(o&&a?k(r,s):!1===a?I(r,h):t===D?M(r,s):t===B&&I(r,s))}var O=0;function N(t){t[_]=O++,t._state=void 0,t._result=void 0,t._subscribers=[]}var P=function(){function t(t,e){this._instanceConstructor=t,this.promise=new t(A),this.promise[_]||N(this.promise),r(e)?(this.length=e.length,this._remaining=e.length,this._result=new Array(this.length),0===this.length?M(this.promise,this._result):(this.length=this.length||0,this._enumerate(e),0===this._remaining&&M(this.promise,this._result))):I(this.promise,new Error("Array Methods must be provided an Array"))}return t.prototype._enumerate=function(t){for(var e=0;this._state===S&&e<t.length;e++)this._eachEntry(t[e],e)},t.prototype._eachEntry=function(t,e){var r=this._instanceConstructor,i=r.resolve;if(i===b){var n=void 0,o=void 0,s=!1;try{n=t.then}catch(t){s=!0,o=t}if(n===T&&t._state!==S)this._settledAt(t._state,e,t._result);else if("function"!=typeof n)this._remaining--,this._result[e]=t;else if(r===V){var h=new r(A);s?I(h,o):x(h,t,n),this._willSettleAt(h,e)}else this._willSettleAt(new r(function(e){return e(t)}),e)}else this._willSettleAt(i(t),e)},t.prototype._settledAt=function(t,e,r){var i=this.promise;i._state===S&&(this._remaining--,t===B?I(i,r):this._result[e]=r),0===this._remaining&&M(i,this._result)},t.prototype._willSettleAt=function(t,e){var r=this;C(t,void 0,function(t){return r._settledAt(D,e,t)},function(t){return r._settledAt(B,e,t)})},t}(),V=function(){function t(e){this[_]=O++,this._result=this._state=void 0,this._subscribers=[],A!==e&&("function"!=typeof e&&function(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}(),this instanceof t?function(t,e){try{e(function(e){k(t,e)},function(e){I(t,e)})}catch(e){I(t,e)}}(this,e):function(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}())}return t.prototype.catch=function(t){return this.then(null,t)},t.prototype.finally=function(t){var r=this.constructor;return e(t)?this.then(function(e){return r.resolve(t()).then(function(){return e})},function(e){return r.resolve(t()).then(function(){throw e})}):this.then(t,t)},t}();return V.prototype.then=T,V.all=function(t){return new P(this,t).promise},V.race=function(t){var e=this;return r(t)?new e(function(r,i){for(var n=t.length,o=0;o<n;o++)e.resolve(t[o]).then(r,i)}):new e(function(t,e){return e(new TypeError("You must pass an array to race."))})},V.resolve=b,V.reject=function(t){var e=new this(A);return I(e,t),e},V._setScheduler=function(t){o=t},V._setAsap=function(t){s=t},V._asap=s,V.polyfill=function(){var e=void 0;if(void 0!==t)e=t;else if("undefined"!=typeof self)e=self;else try{e=Function("return this")()}catch(t){throw new Error("polyfill failed because global object is unavailable in this environment")}var r=e.Promise;if(r){var i=null;try{i=Object.prototype.toString.call(r.resolve())}catch(t){}if("[object Promise]"===i&&!r.cast)return}e.Promise=V},V.Promise=V,V}()}),A=e(function(e){var r,i;r=t,i=function(){return function(){return function(t){var e=[];if(0===t.length)return"";if("string"!=typeof t[0])throw new TypeError("Url must be a string. Received "+t[0]);if(t[0].match(/^[^/:]+:\/*$/)&&t.length>1){var r=t.shift();t[0]=r+t[0]}t[0]=t[0].match(/^file:\/\/\//)?t[0].replace(/^([^/:]+):\/*/,"$1:///"):t[0].replace(/^([^/:]+):\/*/,"$1://");for(var i=0;i<t.length;i++){var n=t[i];if("string"!=typeof n)throw new TypeError("Url must be a string. Received "+n);""!==n&&(i>0&&(n=n.replace(/^[\/]+/,"")),n=n.replace(/[\/]+$/,i<t.length-1?"":"/"),e.push(n))}var o=e.join("/"),s=(o=o.replace(/\/(\?|&|#[^!])/g,"$1")).split("?");return s.shift()+(s.length>0?"?":"")+s.join("&")}("object"==typeof arguments[0]?arguments[0]:[].slice.call(arguments))}},e.exports?e.exports=i():r.urljoin=i()});function S(t){if(t.ok)return t.json();var e=new Error(t.statusText);return e.response=t,Promise.reject(e)}function D(t){this.name="ConfigurationError",this.message=t||""}function B(t){this.name="TokenValidationError",this.message=t||""}_.polyfill(),D.prototype=Error.prototype,B.prototype=Error.prototype;var x=function(){};x.prototype.get=function(){return null},x.prototype.has=function(){return null},x.prototype.set=function(){return null};var k="RS256",E=function(t){return"number"==typeof t},M=function(){return new Date},I=60;function C(t){var e=t||{};if(this.jwksCache=e.jwksCache||new x,this.expectedAlg=e.expectedAlg||"RS256",this.issuer=e.issuer,this.audience=e.audience,this.leeway=0===e.leeway?0:e.leeway||I,this.jwksURI=e.jwksURI,this.maxAge=e.maxAge,this.__clock="function"==typeof e.__clock?e.__clock:M,this.leeway<0||this.leeway>300)throw new D("The leeway should be positive and lower than five minutes.");if(k!==this.expectedAlg)throw new D('Signature algorithm of "'+this.expectedAlg+'" is not supported. Expected the ID token to be signed with "'+k+'".')}C.prototype.verify=function(t,e,r){if(!t)return r(new B("ID token is required but missing"),!1);var i=this.decode(t);if(i instanceof Error)return r(new B("ID token could not be decoded"),!1);var n=i.encoded.header+"."+i.encoded.payload,o=b(i.encoded.signature),s=i.header.alg,h=i.header.kid,a=i.payload.aud,u=i.payload.sub,f=i.payload.iss,c=i.payload.exp,p=i.payload.nbf,l=i.payload.iat,d=i.payload.azp,m=i.payload.auth_time,v=i.payload.nonce,y=this.__clock(),g=this;if(g.expectedAlg!==s)return r(new B('Signature algorithm of "'+s+'" is not supported. Expected the ID token to be signed with "'+k+'".'),!1);this.getRsaVerifier(f,h,function(t,s){if(t)return r(t);if(!s.verify(n,o))return r(new B("Invalid ID token signature."));if(!f||"string"!=typeof f)return r(new B("Issuer (iss) claim must be a string present in the ID token",!1));if(g.issuer!==f)return r(new B('Issuer (iss) claim mismatch in the ID token, expected "'+g.issuer+'", found "'+f+'"'),!1);if(!u||"string"!=typeof u)return r(new B("Subject (sub) claim must be a string present in the ID token"),!1);if(!a||"string"!=typeof a&&!Array.isArray(a))return r(new B("Audience (aud) claim must be a string or array of strings present in the ID token"));if(Array.isArray(a)&&!a.includes(g.audience))return r(new B('Audience (aud) claim mismatch in the ID token; expected "'+g.audience+'" but was not one of "'+a.join(", ")+'"'));if("string"==typeof a&&g.audience!==a)return r(new B('Audience (aud) claim mismatch in the ID token; expected "'+g.audience+'" but found "'+a+'"'),!1);if(e){if(!v||"string"!=typeof v)return r(new B("Nonce (nonce) claim must be a string present in the ID token"),!1);if(v!==e)return r(new B('Nonce (nonce) claim value mismatch in the ID token; expected "'+e+'", found "'+v+'"'),!1)}if(Array.isArray(a)&&a.length>1){if(!d||"string"!=typeof d)return r(new B("Authorized Party (azp) claim must be a string present in the ID token when Audience (aud) claim has multiple values",!1));if(d!==g.audience)return r(new B('Authorized Party (azp) claim mismatch in the ID token; expected "'+g.audience+'", found "'+d+'"',!1))}if(!c||!E(c))return r(new B("Expiration Time (exp) claim must be a number present in the ID token",!1));if(!l||!E(l))return r(new B("Issued At (iat) claim must be a number present in the ID token"));var h=c+g.leeway,w=new Date(0);if(w.setUTCSeconds(h),y>w)return r(new B('Expiration Time (exp) claim error in the ID token; current time "'+y+'" is after expiration time "'+w+'"',!1));if(p&&E(p)){var T=p-g.leeway,b=new Date(0);if(b.setUTCSeconds(T),y<b)return r(new B('Not Before Time (nbf) claim error in the ID token; current time "'+y+'" is before the not before time "'+b+'"'))}if(g.maxAge){if(!m||!E(m))return r(new B("Authentication Time (auth_time) claim must be a number present in the ID token when Max Age (max_age) is specified"));var _=m+g.maxAge+g.leeway,A=new Date(0);if(A.setUTCSeconds(_),y>A)return r(new B('Authentication Time (auth_time) claim in the ID token indicates that too much time has passed since the last end-user authentication. Current time "'+y+'" is after last auth time at "'+A+'"'))}return r(null,i.payload)})},C.prototype.getRsaVerifier=function(t,e,r){var i=this,n=t+e;if(this.jwksCache.has(n)){var o=this.jwksCache.get(n);r(null,new u(o.modulus,o.exp))}else!function(t,e){("undefined"==typeof fetch?function(t,e){return e=e||{},new Promise(function(r,i){var n=new XMLHttpRequest,o=[],s=[],h={},a=function(){return{ok:2==(n.status/100|0),statusText:n.statusText,status:n.status,url:n.responseURL,text:function(){return Promise.resolve(n.responseText)},json:function(){return Promise.resolve(JSON.parse(n.responseText))},blob:function(){return Promise.resolve(new Blob([n.response]))},clone:a,headers:{keys:function(){return o},entries:function(){return s},get:function(t){return h[t.toLowerCase()]},has:function(t){return t.toLowerCase()in h}}}};for(var u in n.open(e.method||"get",t,!0),n.onload=function(){n.getAllResponseHeaders().replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm,function(t,e,r){o.push(e=e.toLowerCase()),s.push([e,r]),h[e]=h[e]?h[e]+","+r:r}),r(a())},n.onerror=i,n.withCredentials="include"==e.credentials,e.headers)n.setRequestHeader(u,e.headers[u]);n.send(e.body||null)})}:fetch)(t.jwksURI||A(t.iss,".well-known","jwks.json")).then(S).then(function(r){var i,n,o,s=null;for(i=0;i<r.keys.length&&null===s;i++)(n=r.keys[i]).kid===t.kid&&(s=n);return s?e(null,{modulus:b((o=s).n),exp:b(o.e)}):e(new Error('Could not find a public key for Key ID (kid) "'+t.kid+'"'))}).catch(function(t){e(t)})}({jwksURI:this.jwksURI,iss:t,kid:e},function(t,e){return t?r(t):(i.jwksCache.set(n,e),r(null,new u(e.modulus,e.exp)))})},C.prototype.decode=function(t){var e,r,i=t.split(".");if(3!==i.length)return new B("Cannot decode a malformed JWT");try{e=JSON.parse(T(i[0])),r=JSON.parse(T(i[1]))}catch(t){return new B("Token header or payload is not valid JSON")}return{header:e,payload:r,encoded:{header:i[0],payload:i[1],signature:i[2]}}},C.prototype.validateAccessToken=function(t,e,r,s){if(this.expectedAlg!==e)return s(new B('Signature algorithm of "'+e+'" is not supported. Expected "'+this.expectedAlg+'"'));var h,a=i(t),u=o.stringify(a),f=u.substring(0,u.length/2),c=o.parse(f),p=n.stringify(c);return s((h={"+":"-","/":"_","=":""},p.replace(/[+/=]/g,function(t){return h[t]})!==r?new B("Invalid access_token"):null))},module.exports=C;


}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":292}],289:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],290:[function(require,module,exports){
// the whatwg-fetch polyfill installs the fetch() function
// on the global object (window or self)
//
// Return that as the export for use in Webpack, Browserify etc.
require('whatwg-fetch');
module.exports = self.fetch.bind(self);

},{"whatwg-fetch":303}],291:[function(require,module,exports){
var hasMap = typeof Map === 'function' && Map.prototype;
var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, 'size') : null;
var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === 'function' ? mapSizeDescriptor.get : null;
var mapForEach = hasMap && Map.prototype.forEach;
var hasSet = typeof Set === 'function' && Set.prototype;
var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, 'size') : null;
var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === 'function' ? setSizeDescriptor.get : null;
var setForEach = hasSet && Set.prototype.forEach;
var hasWeakMap = typeof WeakMap === 'function' && WeakMap.prototype;
var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
var hasWeakSet = typeof WeakSet === 'function' && WeakSet.prototype;
var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
var booleanValueOf = Boolean.prototype.valueOf;
var objectToString = Object.prototype.toString;
var functionToString = Function.prototype.toString;
var match = String.prototype.match;
var bigIntValueOf = typeof BigInt === 'function' ? BigInt.prototype.valueOf : null;
var gOPS = Object.getOwnPropertySymbols;
var symToString = typeof Symbol === 'function' ? Symbol.prototype.toString : null;
var isEnumerable = Object.prototype.propertyIsEnumerable;

var inspectCustom = require('./util.inspect').custom;
var inspectSymbol = inspectCustom && isSymbol(inspectCustom) ? inspectCustom : null;

module.exports = function inspect_(obj, options, depth, seen) {
    var opts = options || {};

    if (has(opts, 'quoteStyle') && (opts.quoteStyle !== 'single' && opts.quoteStyle !== 'double')) {
        throw new TypeError('option "quoteStyle" must be "single" or "double"');
    }
    if (
        has(opts, 'maxStringLength') && (typeof opts.maxStringLength === 'number'
            ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity
            : opts.maxStringLength !== null
        )
    ) {
        throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
    }
    var customInspect = has(opts, 'customInspect') ? opts.customInspect : true;
    if (typeof customInspect !== 'boolean') {
        throw new TypeError('option "customInspect", if provided, must be `true` or `false`');
    }

    if (
        has(opts, 'indent')
        && opts.indent !== null
        && opts.indent !== '\t'
        && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)
    ) {
        throw new TypeError('options "indent" must be "\\t", an integer > 0, or `null`');
    }

    if (typeof obj === 'undefined') {
        return 'undefined';
    }
    if (obj === null) {
        return 'null';
    }
    if (typeof obj === 'boolean') {
        return obj ? 'true' : 'false';
    }

    if (typeof obj === 'string') {
        return inspectString(obj, opts);
    }
    if (typeof obj === 'number') {
        if (obj === 0) {
            return Infinity / obj > 0 ? '0' : '-0';
        }
        return String(obj);
    }
    if (typeof obj === 'bigint') {
        return String(obj) + 'n';
    }

    var maxDepth = typeof opts.depth === 'undefined' ? 5 : opts.depth;
    if (typeof depth === 'undefined') { depth = 0; }
    if (depth >= maxDepth && maxDepth > 0 && typeof obj === 'object') {
        return isArray(obj) ? '[Array]' : '[Object]';
    }

    var indent = getIndent(opts, depth);

    if (typeof seen === 'undefined') {
        seen = [];
    } else if (indexOf(seen, obj) >= 0) {
        return '[Circular]';
    }

    function inspect(value, from, noIndent) {
        if (from) {
            seen = seen.slice();
            seen.push(from);
        }
        if (noIndent) {
            var newOpts = {
                depth: opts.depth
            };
            if (has(opts, 'quoteStyle')) {
                newOpts.quoteStyle = opts.quoteStyle;
            }
            return inspect_(value, newOpts, depth + 1, seen);
        }
        return inspect_(value, opts, depth + 1, seen);
    }

    if (typeof obj === 'function') {
        var name = nameOf(obj);
        var keys = arrObjKeys(obj, inspect);
        return '[Function' + (name ? ': ' + name : ' (anonymous)') + ']' + (keys.length > 0 ? ' { ' + keys.join(', ') + ' }' : '');
    }
    if (isSymbol(obj)) {
        var symString = symToString.call(obj);
        return typeof obj === 'object' ? markBoxed(symString) : symString;
    }
    if (isElement(obj)) {
        var s = '<' + String(obj.nodeName).toLowerCase();
        var attrs = obj.attributes || [];
        for (var i = 0; i < attrs.length; i++) {
            s += ' ' + attrs[i].name + '=' + wrapQuotes(quote(attrs[i].value), 'double', opts);
        }
        s += '>';
        if (obj.childNodes && obj.childNodes.length) { s += '...'; }
        s += '</' + String(obj.nodeName).toLowerCase() + '>';
        return s;
    }
    if (isArray(obj)) {
        if (obj.length === 0) { return '[]'; }
        var xs = arrObjKeys(obj, inspect);
        if (indent && !singleLineValues(xs)) {
            return '[' + indentedJoin(xs, indent) + ']';
        }
        return '[ ' + xs.join(', ') + ' ]';
    }
    if (isError(obj)) {
        var parts = arrObjKeys(obj, inspect);
        if (parts.length === 0) { return '[' + String(obj) + ']'; }
        return '{ [' + String(obj) + '] ' + parts.join(', ') + ' }';
    }
    if (typeof obj === 'object' && customInspect) {
        if (inspectSymbol && typeof obj[inspectSymbol] === 'function') {
            return obj[inspectSymbol]();
        } else if (typeof obj.inspect === 'function') {
            return obj.inspect();
        }
    }
    if (isMap(obj)) {
        var mapParts = [];
        mapForEach.call(obj, function (value, key) {
            mapParts.push(inspect(key, obj, true) + ' => ' + inspect(value, obj));
        });
        return collectionOf('Map', mapSize.call(obj), mapParts, indent);
    }
    if (isSet(obj)) {
        var setParts = [];
        setForEach.call(obj, function (value) {
            setParts.push(inspect(value, obj));
        });
        return collectionOf('Set', setSize.call(obj), setParts, indent);
    }
    if (isWeakMap(obj)) {
        return weakCollectionOf('WeakMap');
    }
    if (isWeakSet(obj)) {
        return weakCollectionOf('WeakSet');
    }
    if (isNumber(obj)) {
        return markBoxed(inspect(Number(obj)));
    }
    if (isBigInt(obj)) {
        return markBoxed(inspect(bigIntValueOf.call(obj)));
    }
    if (isBoolean(obj)) {
        return markBoxed(booleanValueOf.call(obj));
    }
    if (isString(obj)) {
        return markBoxed(inspect(String(obj)));
    }
    if (!isDate(obj) && !isRegExp(obj)) {
        var ys = arrObjKeys(obj, inspect);
        if (ys.length === 0) { return '{}'; }
        if (indent) {
            return '{' + indentedJoin(ys, indent) + '}';
        }
        return '{ ' + ys.join(', ') + ' }';
    }
    return String(obj);
};

function wrapQuotes(s, defaultStyle, opts) {
    var quoteChar = (opts.quoteStyle || defaultStyle) === 'double' ? '"' : "'";
    return quoteChar + s + quoteChar;
}

function quote(s) {
    return String(s).replace(/"/g, '&quot;');
}

function isArray(obj) { return toStr(obj) === '[object Array]'; }
function isDate(obj) { return toStr(obj) === '[object Date]'; }
function isRegExp(obj) { return toStr(obj) === '[object RegExp]'; }
function isError(obj) { return toStr(obj) === '[object Error]'; }
function isSymbol(obj) { return toStr(obj) === '[object Symbol]'; }
function isString(obj) { return toStr(obj) === '[object String]'; }
function isNumber(obj) { return toStr(obj) === '[object Number]'; }
function isBigInt(obj) { return toStr(obj) === '[object BigInt]'; }
function isBoolean(obj) { return toStr(obj) === '[object Boolean]'; }

var hasOwn = Object.prototype.hasOwnProperty || function (key) { return key in this; };
function has(obj, key) {
    return hasOwn.call(obj, key);
}

function toStr(obj) {
    return objectToString.call(obj);
}

function nameOf(f) {
    if (f.name) { return f.name; }
    var m = match.call(functionToString.call(f), /^function\s*([\w$]+)/);
    if (m) { return m[1]; }
    return null;
}

function indexOf(xs, x) {
    if (xs.indexOf) { return xs.indexOf(x); }
    for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) { return i; }
    }
    return -1;
}

function isMap(x) {
    if (!mapSize || !x || typeof x !== 'object') {
        return false;
    }
    try {
        mapSize.call(x);
        try {
            setSize.call(x);
        } catch (s) {
            return true;
        }
        return x instanceof Map; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakMap(x) {
    if (!weakMapHas || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakMapHas.call(x, weakMapHas);
        try {
            weakSetHas.call(x, weakSetHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakMap; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isSet(x) {
    if (!setSize || !x || typeof x !== 'object') {
        return false;
    }
    try {
        setSize.call(x);
        try {
            mapSize.call(x);
        } catch (m) {
            return true;
        }
        return x instanceof Set; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakSet(x) {
    if (!weakSetHas || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakSetHas.call(x, weakSetHas);
        try {
            weakMapHas.call(x, weakMapHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakSet; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isElement(x) {
    if (!x || typeof x !== 'object') { return false; }
    if (typeof HTMLElement !== 'undefined' && x instanceof HTMLElement) {
        return true;
    }
    return typeof x.nodeName === 'string' && typeof x.getAttribute === 'function';
}

function inspectString(str, opts) {
    if (str.length > opts.maxStringLength) {
        var remaining = str.length - opts.maxStringLength;
        var trailer = '... ' + remaining + ' more character' + (remaining > 1 ? 's' : '');
        return inspectString(str.slice(0, opts.maxStringLength), opts) + trailer;
    }
    // eslint-disable-next-line no-control-regex
    var s = str.replace(/(['\\])/g, '\\$1').replace(/[\x00-\x1f]/g, lowbyte);
    return wrapQuotes(s, 'single', opts);
}

function lowbyte(c) {
    var n = c.charCodeAt(0);
    var x = {
        8: 'b',
        9: 't',
        10: 'n',
        12: 'f',
        13: 'r'
    }[n];
    if (x) { return '\\' + x; }
    return '\\x' + (n < 0x10 ? '0' : '') + n.toString(16).toUpperCase();
}

function markBoxed(str) {
    return 'Object(' + str + ')';
}

function weakCollectionOf(type) {
    return type + ' { ? }';
}

function collectionOf(type, size, entries, indent) {
    var joinedEntries = indent ? indentedJoin(entries, indent) : entries.join(', ');
    return type + ' (' + size + ') {' + joinedEntries + '}';
}

function singleLineValues(xs) {
    for (var i = 0; i < xs.length; i++) {
        if (indexOf(xs[i], '\n') >= 0) {
            return false;
        }
    }
    return true;
}

function getIndent(opts, depth) {
    var baseIndent;
    if (opts.indent === '\t') {
        baseIndent = '\t';
    } else if (typeof opts.indent === 'number' && opts.indent > 0) {
        baseIndent = Array(opts.indent + 1).join(' ');
    } else {
        return null;
    }
    return {
        base: baseIndent,
        prev: Array(depth + 1).join(baseIndent)
    };
}

function indentedJoin(xs, indent) {
    if (xs.length === 0) { return ''; }
    var lineJoiner = '\n' + indent.prev + indent.base;
    return lineJoiner + xs.join(',' + lineJoiner) + '\n' + indent.prev;
}

function arrObjKeys(obj, inspect) {
    var isArr = isArray(obj);
    var xs = [];
    if (isArr) {
        xs.length = obj.length;
        for (var i = 0; i < obj.length; i++) {
            xs[i] = has(obj, i) ? inspect(obj[i], obj) : '';
        }
    }
    for (var key in obj) { // eslint-disable-line no-restricted-syntax
        if (!has(obj, key)) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
        if (isArr && String(Number(key)) === key && key < obj.length) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
        if ((/[^\w$]/).test(key)) {
            xs.push(inspect(key, obj) + ': ' + inspect(obj[key], obj));
        } else {
            xs.push(key + ': ' + inspect(obj[key], obj));
        }
    }
    if (typeof gOPS === 'function') {
        var syms = gOPS(obj);
        for (var j = 0; j < syms.length; j++) {
            if (isEnumerable.call(obj, syms[j])) {
                xs.push('[' + inspect(syms[j]) + ']: ' + inspect(obj[syms[j]], obj));
            }
        }
    }
    return xs;
}

},{"./util.inspect":274}],292:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],293:[function(require,module,exports){
'use strict';

var replace = String.prototype.replace;
var percentTwenties = /%20/g;

var util = require('./utils');

var Format = {
    RFC1738: 'RFC1738',
    RFC3986: 'RFC3986'
};

module.exports = util.assign(
    {
        'default': Format.RFC3986,
        formatters: {
            RFC1738: function (value) {
                return replace.call(value, percentTwenties, '+');
            },
            RFC3986: function (value) {
                return String(value);
            }
        }
    },
    Format
);

},{"./utils":297}],294:[function(require,module,exports){
arguments[4][149][0].apply(exports,arguments)
},{"./formats":293,"./parse":295,"./stringify":296,"dup":149}],295:[function(require,module,exports){
'use strict';

var utils = require('./utils');

var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;

var defaults = {
    allowDots: false,
    allowPrototypes: false,
    arrayLimit: 20,
    charset: 'utf-8',
    charsetSentinel: false,
    comma: false,
    decoder: utils.decode,
    delimiter: '&',
    depth: 5,
    ignoreQueryPrefix: false,
    interpretNumericEntities: false,
    parameterLimit: 1000,
    parseArrays: true,
    plainObjects: false,
    strictNullHandling: false
};

var interpretNumericEntities = function (str) {
    return str.replace(/&#(\d+);/g, function ($0, numberStr) {
        return String.fromCharCode(parseInt(numberStr, 10));
    });
};

var parseArrayValue = function (val, options) {
    if (val && typeof val === 'string' && options.comma && val.indexOf(',') > -1) {
        return val.split(',');
    }

    return val;
};

var maybeMap = function maybeMap(val, fn) {
    if (isArray(val)) {
        var mapped = [];
        for (var i = 0; i < val.length; i += 1) {
            mapped.push(fn(val[i]));
        }
        return mapped;
    }
    return fn(val);
};

// This is what browsers will submit when the ✓ character occurs in an
// application/x-www-form-urlencoded body and the encoding of the page containing
// the form is iso-8859-1, or when the submitted form has an accept-charset
// attribute of iso-8859-1. Presumably also with other charsets that do not contain
// the ✓ character, such as us-ascii.
var isoSentinel = 'utf8=%26%2310003%3B'; // encodeURIComponent('&#10003;')

// These are the percent-encoded utf-8 octets representing a checkmark, indicating that the request actually is utf-8 encoded.
var charsetSentinel = 'utf8=%E2%9C%93'; // encodeURIComponent('✓')

var parseValues = function parseQueryStringValues(str, options) {
    var obj = {};
    var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
    var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
    var parts = cleanStr.split(options.delimiter, limit);
    var skipIndex = -1; // Keep track of where the utf8 sentinel was found
    var i;

    var charset = options.charset;
    if (options.charsetSentinel) {
        for (i = 0; i < parts.length; ++i) {
            if (parts[i].indexOf('utf8=') === 0) {
                if (parts[i] === charsetSentinel) {
                    charset = 'utf-8';
                } else if (parts[i] === isoSentinel) {
                    charset = 'iso-8859-1';
                }
                skipIndex = i;
                i = parts.length; // The eslint settings do not allow break;
            }
        }
    }

    for (i = 0; i < parts.length; ++i) {
        if (i === skipIndex) {
            continue;
        }
        var part = parts[i];

        var bracketEqualsPos = part.indexOf(']=');
        var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;

        var key, val;
        if (pos === -1) {
            key = options.decoder(part, defaults.decoder, charset);
            val = options.strictNullHandling ? null : '';
        } else {
            key = options.decoder(part.slice(0, pos), defaults.decoder, charset);
            val = maybeMap(
                parseArrayValue(part.slice(pos + 1), options),
                function (encodedVal) {
                    return options.decoder(encodedVal, defaults.decoder, charset);
                }
            );
        }

        if (val && options.interpretNumericEntities && charset === 'iso-8859-1') {
            val = interpretNumericEntities(val);
        }

        if (part.indexOf('[]=') > -1) {
            val = isArray(val) ? [val] : val;
        }

        if (has.call(obj, key)) {
            obj[key] = utils.combine(obj[key], val);
        } else {
            obj[key] = val;
        }
    }

    return obj;
};

var parseObject = function (chain, val, options, valuesParsed) {
    var leaf = valuesParsed ? val : parseArrayValue(val, options);

    for (var i = chain.length - 1; i >= 0; --i) {
        var obj;
        var root = chain[i];

        if (root === '[]' && options.parseArrays) {
            obj = [].concat(leaf);
        } else {
            obj = options.plainObjects ? Object.create(null) : {};
            var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
            var index = parseInt(cleanRoot, 10);
            if (!options.parseArrays && cleanRoot === '') {
                obj = { 0: leaf };
            } else if (
                !isNaN(index)
                && root !== cleanRoot
                && String(index) === cleanRoot
                && index >= 0
                && (options.parseArrays && index <= options.arrayLimit)
            ) {
                obj = [];
                obj[index] = leaf;
            } else {
                obj[cleanRoot] = leaf;
            }
        }

        leaf = obj; // eslint-disable-line no-param-reassign
    }

    return leaf;
};

var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
    if (!givenKey) {
        return;
    }

    // Transform dot notation to bracket notation
    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

    // The regex chunks

    var brackets = /(\[[^[\]]*])/;
    var child = /(\[[^[\]]*])/g;

    // Get the parent

    var segment = brackets.exec(key);
    var parent = segment ? key.slice(0, segment.index) : key;

    // Stash the parent if it exists

    var keys = [];
    if (parent) {
        // If we aren't using plain objects, optionally prefix keys that would overwrite object prototype properties
        if (!options.plainObjects && has.call(Object.prototype, parent)) {
            if (!options.allowPrototypes) {
                return;
            }
        }

        keys.push(parent);
    }

    // Loop through children appending to the array until we hit depth

    var i = 0;
    while ((segment = child.exec(key)) !== null && i < options.depth) {
        i += 1;
        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
            if (!options.allowPrototypes) {
                return;
            }
        }
        keys.push(segment[1]);
    }

    // If there's a remainder, just add whatever is left

    if (segment) {
        keys.push('[' + key.slice(segment.index) + ']');
    }

    return parseObject(keys, val, options, valuesParsed);
};

var normalizeParseOptions = function normalizeParseOptions(opts) {
    if (!opts) {
        return defaults;
    }

    if (opts.decoder !== null && opts.decoder !== undefined && typeof opts.decoder !== 'function') {
        throw new TypeError('Decoder has to be a function.');
    }

    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
    }
    var charset = typeof opts.charset === 'undefined' ? defaults.charset : opts.charset;

    return {
        allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
        allowPrototypes: typeof opts.allowPrototypes === 'boolean' ? opts.allowPrototypes : defaults.allowPrototypes,
        arrayLimit: typeof opts.arrayLimit === 'number' ? opts.arrayLimit : defaults.arrayLimit,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        comma: typeof opts.comma === 'boolean' ? opts.comma : defaults.comma,
        decoder: typeof opts.decoder === 'function' ? opts.decoder : defaults.decoder,
        delimiter: typeof opts.delimiter === 'string' || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
        depth: typeof opts.depth === 'number' ? opts.depth : defaults.depth,
        ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
        interpretNumericEntities: typeof opts.interpretNumericEntities === 'boolean' ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
        parameterLimit: typeof opts.parameterLimit === 'number' ? opts.parameterLimit : defaults.parameterLimit,
        parseArrays: opts.parseArrays !== false,
        plainObjects: typeof opts.plainObjects === 'boolean' ? opts.plainObjects : defaults.plainObjects,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
    };
};

module.exports = function (str, opts) {
    var options = normalizeParseOptions(opts);

    if (str === '' || str === null || typeof str === 'undefined') {
        return options.plainObjects ? Object.create(null) : {};
    }

    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
    var obj = options.plainObjects ? Object.create(null) : {};

    // Iterate over the keys and setup the new object

    var keys = Object.keys(tempObj);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options, typeof str === 'string');
        obj = utils.merge(obj, newObj, options);
    }

    return utils.compact(obj);
};

},{"./utils":297}],296:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var formats = require('./formats');
var has = Object.prototype.hasOwnProperty;

var arrayPrefixGenerators = {
    brackets: function brackets(prefix) {
        return prefix + '[]';
    },
    comma: 'comma',
    indices: function indices(prefix, key) {
        return prefix + '[' + key + ']';
    },
    repeat: function repeat(prefix) {
        return prefix;
    }
};

var isArray = Array.isArray;
var push = Array.prototype.push;
var pushToArray = function (arr, valueOrArray) {
    push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);
};

var toISO = Date.prototype.toISOString;

var defaultFormat = formats['default'];
var defaults = {
    addQueryPrefix: false,
    allowDots: false,
    charset: 'utf-8',
    charsetSentinel: false,
    delimiter: '&',
    encode: true,
    encoder: utils.encode,
    encodeValuesOnly: false,
    format: defaultFormat,
    formatter: formats.formatters[defaultFormat],
    // deprecated
    indices: false,
    serializeDate: function serializeDate(date) {
        return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
};

var stringify = function stringify(
    object,
    prefix,
    generateArrayPrefix,
    strictNullHandling,
    skipNulls,
    encoder,
    filter,
    sort,
    allowDots,
    serializeDate,
    formatter,
    encodeValuesOnly,
    charset
) {
    var obj = object;
    if (typeof filter === 'function') {
        obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
        obj = serializeDate(obj);
    } else if (generateArrayPrefix === 'comma' && isArray(obj)) {
        obj = obj.join(',');
    }

    if (obj === null) {
        if (strictNullHandling) {
            return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset) : prefix;
        }

        obj = '';
    }

    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || utils.isBuffer(obj)) {
        if (encoder) {
            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset);
            return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder, charset))];
        }
        return [formatter(prefix) + '=' + formatter(String(obj))];
    }

    var values = [];

    if (typeof obj === 'undefined') {
        return values;
    }

    var objKeys;
    if (isArray(filter)) {
        objKeys = filter;
    } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (skipNulls && obj[key] === null) {
            continue;
        }

        if (isArray(obj)) {
            pushToArray(values, stringify(
                obj[key],
                typeof generateArrayPrefix === 'function' ? generateArrayPrefix(prefix, key) : prefix,
                generateArrayPrefix,
                strictNullHandling,
                skipNulls,
                encoder,
                filter,
                sort,
                allowDots,
                serializeDate,
                formatter,
                encodeValuesOnly,
                charset
            ));
        } else {
            pushToArray(values, stringify(
                obj[key],
                prefix + (allowDots ? '.' + key : '[' + key + ']'),
                generateArrayPrefix,
                strictNullHandling,
                skipNulls,
                encoder,
                filter,
                sort,
                allowDots,
                serializeDate,
                formatter,
                encodeValuesOnly,
                charset
            ));
        }
    }

    return values;
};

var normalizeStringifyOptions = function normalizeStringifyOptions(opts) {
    if (!opts) {
        return defaults;
    }

    if (opts.encoder !== null && opts.encoder !== undefined && typeof opts.encoder !== 'function') {
        throw new TypeError('Encoder has to be a function.');
    }

    var charset = opts.charset || defaults.charset;
    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
    }

    var format = formats['default'];
    if (typeof opts.format !== 'undefined') {
        if (!has.call(formats.formatters, opts.format)) {
            throw new TypeError('Unknown format option provided.');
        }
        format = opts.format;
    }
    var formatter = formats.formatters[format];

    var filter = defaults.filter;
    if (typeof opts.filter === 'function' || isArray(opts.filter)) {
        filter = opts.filter;
    }

    return {
        addQueryPrefix: typeof opts.addQueryPrefix === 'boolean' ? opts.addQueryPrefix : defaults.addQueryPrefix,
        allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        delimiter: typeof opts.delimiter === 'undefined' ? defaults.delimiter : opts.delimiter,
        encode: typeof opts.encode === 'boolean' ? opts.encode : defaults.encode,
        encoder: typeof opts.encoder === 'function' ? opts.encoder : defaults.encoder,
        encodeValuesOnly: typeof opts.encodeValuesOnly === 'boolean' ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
        filter: filter,
        formatter: formatter,
        serializeDate: typeof opts.serializeDate === 'function' ? opts.serializeDate : defaults.serializeDate,
        skipNulls: typeof opts.skipNulls === 'boolean' ? opts.skipNulls : defaults.skipNulls,
        sort: typeof opts.sort === 'function' ? opts.sort : null,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
    };
};

module.exports = function (object, opts) {
    var obj = object;
    var options = normalizeStringifyOptions(opts);

    var objKeys;
    var filter;

    if (typeof options.filter === 'function') {
        filter = options.filter;
        obj = filter('', obj);
    } else if (isArray(options.filter)) {
        filter = options.filter;
        objKeys = filter;
    }

    var keys = [];

    if (typeof obj !== 'object' || obj === null) {
        return '';
    }

    var arrayFormat;
    if (opts && opts.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = opts.arrayFormat;
    } else if (opts && 'indices' in opts) {
        arrayFormat = opts.indices ? 'indices' : 'repeat';
    } else {
        arrayFormat = 'indices';
    }

    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

    if (!objKeys) {
        objKeys = Object.keys(obj);
    }

    if (options.sort) {
        objKeys.sort(options.sort);
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (options.skipNulls && obj[key] === null) {
            continue;
        }
        pushToArray(keys, stringify(
            obj[key],
            key,
            generateArrayPrefix,
            options.strictNullHandling,
            options.skipNulls,
            options.encode ? options.encoder : null,
            options.filter,
            options.sort,
            options.allowDots,
            options.serializeDate,
            options.formatter,
            options.encodeValuesOnly,
            options.charset
        ));
    }

    var joined = keys.join(options.delimiter);
    var prefix = options.addQueryPrefix === true ? '?' : '';

    if (options.charsetSentinel) {
        if (options.charset === 'iso-8859-1') {
            // encodeURIComponent('&#10003;'), the "numeric entity" representation of a checkmark
            prefix += 'utf8=%26%2310003%3B&';
        } else {
            // encodeURIComponent('✓')
            prefix += 'utf8=%E2%9C%93&';
        }
    }

    return joined.length > 0 ? prefix + joined : '';
};

},{"./formats":293,"./utils":297}],297:[function(require,module,exports){
'use strict';

var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;

var hexTable = (function () {
    var array = [];
    for (var i = 0; i < 256; ++i) {
        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
    }

    return array;
}());

var compactQueue = function compactQueue(queue) {
    while (queue.length > 1) {
        var item = queue.pop();
        var obj = item.obj[item.prop];

        if (isArray(obj)) {
            var compacted = [];

            for (var j = 0; j < obj.length; ++j) {
                if (typeof obj[j] !== 'undefined') {
                    compacted.push(obj[j]);
                }
            }

            item.obj[item.prop] = compacted;
        }
    }
};

var arrayToObject = function arrayToObject(source, options) {
    var obj = options && options.plainObjects ? Object.create(null) : {};
    for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== 'undefined') {
            obj[i] = source[i];
        }
    }

    return obj;
};

var merge = function merge(target, source, options) {
    if (!source) {
        return target;
    }

    if (typeof source !== 'object') {
        if (isArray(target)) {
            target.push(source);
        } else if (target && typeof target === 'object') {
            if ((options && (options.plainObjects || options.allowPrototypes)) || !has.call(Object.prototype, source)) {
                target[source] = true; // eslint-disable-line no-param-reassign
            }
        } else {
            return [target, source];
        }

        return target;
    }

    if (!target || typeof target !== 'object') {
        return [target].concat(source);
    }

    var mergeTarget = target;
    if (isArray(target) && !isArray(source)) {
        mergeTarget = arrayToObject(target, options);
    }

    if (isArray(target) && isArray(source)) {
        source.forEach(function (item, i) {
            if (has.call(target, i)) {
                var targetItem = target[i];
                if (targetItem && typeof targetItem === 'object' && item && typeof item === 'object') {
                    target[i] = merge(targetItem, item, options); // eslint-disable-line no-param-reassign
                } else {
                    target.push(item);
                }
            } else {
                target[i] = item; // eslint-disable-line no-param-reassign
            }
        });
        return target;
    }

    return Object.keys(source).reduce(function (acc, key) {
        var value = source[key];

        if (has.call(acc, key)) {
            acc[key] = merge(acc[key], value, options); // eslint-disable-line no-param-reassign
        } else {
            acc[key] = value; // eslint-disable-line no-param-reassign
        }
        return acc;
    }, mergeTarget);
};

var assign = function assignSingleSource(target, source) {
    return Object.keys(source).reduce(function (acc, key) {
        acc[key] = source[key]; // eslint-disable-line no-param-reassign
        return acc;
    }, target);
};

var decode = function (str, decoder, charset) {
    var strWithoutPlus = str.replace(/\+/g, ' ');
    if (charset === 'iso-8859-1') {
        // unescape never throws, no try...catch needed:
        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
    }
    // utf-8
    try {
        return decodeURIComponent(strWithoutPlus);
    } catch (e) {
        return strWithoutPlus;
    }
};

var encode = function encode(str, defaultEncoder, charset) {
    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }

    var string = typeof str === 'string' ? str : String(str);

    if (charset === 'iso-8859-1') {
        return escape(string).replace(/%u[0-9a-f]{4}/gi, function ($0) {
            return '%26%23' + parseInt($0.slice(2), 16) + '%3B';
        });
    }

    var out = '';
    for (var i = 0; i < string.length; ++i) {
        var c = string.charCodeAt(i);

        if (
            c === 0x2D // -
            || c === 0x2E // .
            || c === 0x5F // _
            || c === 0x7E // ~
            || (c >= 0x30 && c <= 0x39) // 0-9
            || (c >= 0x41 && c <= 0x5A) // a-z
            || (c >= 0x61 && c <= 0x7A) // A-Z
        ) {
            out += string.charAt(i);
            continue;
        }

        if (c < 0x80) {
            out = out + hexTable[c];
            continue;
        }

        if (c < 0x800) {
            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        if (c < 0xD800 || c >= 0xE000) {
            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        i += 1;
        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
        out += hexTable[0xF0 | (c >> 18)]
            + hexTable[0x80 | ((c >> 12) & 0x3F)]
            + hexTable[0x80 | ((c >> 6) & 0x3F)]
            + hexTable[0x80 | (c & 0x3F)];
    }

    return out;
};

var compact = function compact(value) {
    var queue = [{ obj: { o: value }, prop: 'o' }];
    var refs = [];

    for (var i = 0; i < queue.length; ++i) {
        var item = queue[i];
        var obj = item.obj[item.prop];

        var keys = Object.keys(obj);
        for (var j = 0; j < keys.length; ++j) {
            var key = keys[j];
            var val = obj[key];
            if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
                queue.push({ obj: obj, prop: key });
                refs.push(val);
            }
        }
    }

    compactQueue(queue);

    return value;
};

var isRegExp = function isRegExp(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

var isBuffer = function isBuffer(obj) {
    if (!obj || typeof obj !== 'object') {
        return false;
    }

    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};

var combine = function combine(a, b) {
    return [].concat(a, b);
};

module.exports = {
    arrayToObject: arrayToObject,
    assign: assign,
    combine: combine,
    compact: compact,
    decode: decode,
    encode: encode,
    isBuffer: isBuffer,
    isRegExp: isRegExp,
    merge: merge
};

},{}],298:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],299:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],300:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":298,"./encode":299}],301:[function(require,module,exports){
'use strict'
/* eslint no-proto: 0 */
module.exports = Object.setPrototypeOf || ({ __proto__: [] } instanceof Array ? setProtoOf : mixinProperties)

function setProtoOf (obj, proto) {
  obj.__proto__ = proto
  return obj
}

function mixinProperties (obj, proto) {
  for (var prop in proto) {
    if (!Object.prototype.hasOwnProperty.call(obj, prop)) {
      obj[prop] = proto[prop]
    }
  }
  return obj
}

},{}],302:[function(require,module,exports){
'use strict';

var GetIntrinsic = require('get-intrinsic');
var callBound = require('call-bind/callBound');
var inspect = require('object-inspect');

var $TypeError = GetIntrinsic('%TypeError%');
var $WeakMap = GetIntrinsic('%WeakMap%', true);
var $Map = GetIntrinsic('%Map%', true);

var $weakMapGet = callBound('WeakMap.prototype.get', true);
var $weakMapSet = callBound('WeakMap.prototype.set', true);
var $weakMapHas = callBound('WeakMap.prototype.has', true);
var $mapGet = callBound('Map.prototype.get', true);
var $mapSet = callBound('Map.prototype.set', true);
var $mapHas = callBound('Map.prototype.has', true);

/*
 * This function traverses the list returning the node corresponding to the
 * given key.
 *
 * That node is also moved to the head of the list, so that if it's accessed
 * again we don't need to traverse the whole list. By doing so, all the recently
 * used nodes can be accessed relatively quickly.
 */
var listGetNode = function (list, key) { // eslint-disable-line consistent-return
	for (var prev = list, curr; (curr = prev.next) !== null; prev = curr) {
		if (curr.key === key) {
			prev.next = curr.next;
			curr.next = list.next;
			list.next = curr; // eslint-disable-line no-param-reassign
			return curr;
		}
	}
};

var listGet = function (objects, key) {
	var node = listGetNode(objects, key);
	return node && node.value;
};
var listSet = function (objects, key, value) {
	var node = listGetNode(objects, key);
	if (node) {
		node.value = value;
	} else {
		// Prepend the new node to the beginning of the list
		objects.next = { // eslint-disable-line no-param-reassign
			key: key,
			next: objects.next,
			value: value
		};
	}
};
var listHas = function (objects, key) {
	return !!listGetNode(objects, key);
};

module.exports = function getSideChannel() {
	var $wm;
	var $m;
	var $o;
	var channel = {
		assert: function (key) {
			if (!channel.has(key)) {
				throw new $TypeError('Side channel does not contain ' + inspect(key));
			}
		},
		get: function (key) { // eslint-disable-line consistent-return
			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
				if ($wm) {
					return $weakMapGet($wm, key);
				}
			} else if ($Map) {
				if ($m) {
					return $mapGet($m, key);
				}
			} else {
				if ($o) { // eslint-disable-line no-lonely-if
					return listGet($o, key);
				}
			}
		},
		has: function (key) {
			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
				if ($wm) {
					return $weakMapHas($wm, key);
				}
			} else if ($Map) {
				if ($m) {
					return $mapHas($m, key);
				}
			} else {
				if ($o) { // eslint-disable-line no-lonely-if
					return listHas($o, key);
				}
			}
			return false;
		},
		set: function (key, value) {
			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
				if (!$wm) {
					$wm = new $WeakMap();
				}
				$weakMapSet($wm, key, value);
			} else if ($Map) {
				if (!$m) {
					$m = new $Map();
				}
				$mapSet($m, key, value);
			} else {
				if (!$o) {
					/*
					 * Initialize the linked list as an empty node, so that we don't have
					 * to special-case handling of the first node: we can always refer to
					 * it as (previous node).next, instead of something like (list).head
					 */
					$o = { key: {}, next: null };
				}
				listSet($o, key, value);
			}
		}
	};
	return channel;
};

},{"call-bind/callBound":276,"get-intrinsic":283,"object-inspect":291}],303:[function(require,module,exports){
(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1])
      }, this)
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue+','+value : value
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this)
      }
    }
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf)
    var chars = new Array(view.length)

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i])
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    this.text = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = String(input)
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ')
    preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = options.status === undefined ? 200 : options.status
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init)
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      } else if (request.credentials === 'omit') {
        xhr.withCredentials = false
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);

},{}]},{},[1]);
