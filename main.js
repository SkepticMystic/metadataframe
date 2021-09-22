'use strict';

var obsidian = require('obsidian');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
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
}

var DEFAULT_SETTINGS = {
    mySetting: 'default',
    defaultSavePath: ''
};
var MyPlugin = /** @class */ (function (_super) {
    __extends(MyPlugin, _super);
    function MyPlugin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MyPlugin.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Loading Metadataframe plugin');
                        return [4 /*yield*/, this.loadSettings()];
                    case 1:
                        _a.sent();
                        this.addCommand({
                            id: 'write-metadataframe',
                            name: 'Write Metadataframe',
                            callback: function () { return __awaiter(_this, void 0, void 0, function () {
                                var jsDF;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            jsDF = this.createJSDF();
                                            console.log(jsDF);
                                            return [4 /*yield*/, this.writeMetadataframe(jsDF)];
                                        case 1:
                                            _a.sent();
                                            return [3 /*break*/, 3];
                                        case 2:
                                            _a.sent();
                                            new obsidian.Notice('An error occured. Please check the console.');
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }
                        });
                        this.addSettingTab(new MetadataframeSettings(this.app, this));
                        return [2 /*return*/];
                }
            });
        });
    };
    // Source: https://stackoverflow.com/questions/11257062/converting-json-object-to-csv-format-in-javascript
    MyPlugin.prototype.arrayToCSV = function (objArray) {
        var array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
        var str = "" + Object.keys(array[0]).map(function (value) { return "\"" + value + "\""; }).join(",") + '\r\n';
        return array.reduce(function (str, next) {
            str += "" + Object.values(next).map(function (value) { return "\"" + value + "\""; }).join(",") + '\r\n';
            return str;
        }, str);
    };
    MyPlugin.prototype.createJSDF = function () {
        var _this = this;
        var files = this.app.vault.getMarkdownFiles();
        var yamldf = [];
        var uniqueKeys = [];
        files.forEach(function (file, i) {
            // Add a new object for each file
            yamldf.push({ file: file.path });
            // Grab the dv metadata cache for it
            if (!_this.app.plugins.plugins.dataview.api) {
                new obsidian.Notice('Dataview must be enabled');
                return;
            }
            var cache = _this.app.plugins.plugins.dataview.api.page(file.path);
            Object.keys(cache).forEach(function (key) {
                // Collect unique keys for later
                if (!uniqueKeys.includes(key))
                    uniqueKeys.push(key);
                // Process values
                if (key !== 'file' && key !== 'position') {
                    var value = cache[key];
                    if (!value) { // Null values
                        yamldf[i][key] = null;
                    }
                    else if (typeof value === 'string') { // String values
                        yamldf[i][key] = value;
                    }
                    else if (value.ts) { //Dates
                        yamldf[i][key] = value.ts;
                    }
                    else if (Array.isArray(value)) { // Arrays are joined into strings
                        yamldf[i][key] = value.join(', ');
                    }
                    else if (value.path) { // Link objects
                        yamldf[i][key] = value.path;
                    }
                }
            });
        });
        // Make the jagged array square
        /// If a file doesn't have all fields, then add those fields as null
        /// Maybe use undefined instead?
        Object.keys(yamldf).forEach(function (file, i) {
            uniqueKeys.forEach(function (key) {
                if (yamldf[i][key] === undefined) {
                    yamldf[i][key] = null;
                }
            });
        });
        return yamldf;
    };
    MyPlugin.prototype.writeMetadataframe = function (jsDF) {
        return __awaiter(this, void 0, void 0, function () {
            var csv, savePath, now;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        csv = this.arrayToCSV(jsDF);
                        console.log(csv);
                        if (!(this.settings.defaultSavePath === '')) return [3 /*break*/, 1];
                        new obsidian.Notice('Please choose a path to save to in settings');
                        return [3 /*break*/, 4];
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        savePath = obsidian.normalizePath(this.settings.defaultSavePath);
                        now = window.moment().format("YYYY-MM-DD HHmmss");
                        return [4 /*yield*/, this.app.vault.createBinary(savePath + " " + now + ".csv", csv)];
                    case 2:
                        _a.sent();
                        new obsidian.Notice('Write Metadataframe complete');
                        return [3 /*break*/, 4];
                    case 3:
                        _a.sent();
                        new obsidian.Notice('File already exists');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    MyPlugin.prototype.onunload = function () {
        console.log('unloading plugin');
    };
    MyPlugin.prototype.loadSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = this;
                        _c = (_b = Object).assign;
                        _d = [{}, DEFAULT_SETTINGS];
                        return [4 /*yield*/, this.loadData()];
                    case 1:
                        _a.settings = _c.apply(_b, _d.concat([_e.sent()]));
                        return [2 /*return*/];
                }
            });
        });
    };
    MyPlugin.prototype.saveSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.saveData(this.settings)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return MyPlugin;
}(obsidian.Plugin));
var MetadataframeSettings = /** @class */ (function (_super) {
    __extends(MetadataframeSettings, _super);
    function MetadataframeSettings(app, plugin) {
        var _this = _super.call(this, app, plugin) || this;
        _this.plugin = plugin;
        return _this;
    }
    MetadataframeSettings.prototype.display = function () {
        var _this = this;
        var settings = this.plugin.settings;
        var containerEl = this.containerEl;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Settings for Metadataframe.' });
        new obsidian.Setting(containerEl)
            .setName('Default save path')
            .setDesc('The full file path to save the metadataframe to. Don\'t include the file extension. For example, this is a correct file path: SubFolder/metadataframe. Use "/" to save to the root of your vault.')
            .addText(function (text) { return text
            .setValue(settings.defaultSavePath)
            .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        settings.defaultSavePath = value;
                        return [4 /*yield*/, this.plugin.saveSettings()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }); });
    };
    return MetadataframeSettings;
}(obsidian.PluginSettingTab));

module.exports = MyPlugin;
