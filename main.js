"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
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
exports.__esModule = true;
var Discord = require('discord.js');
var client = new Discord.Client();
var path = require("path");
var wavConverter = require("wav-converter");
var onCooldown = false;
var fs = require("fs");
var stream_1 = require("stream");
var SILENCE_FRAME = Buffer.from([0xF8, 0xFF, 0xFE]);
var _a = require("./config.json"), prefix = _a.prefix, token = _a.token, text_channel = _a.text_channel;
var tf = require('@tensorflow/tfjs-node');
var nsfw = require('nsfwjs');
var axios = require('axios');
var WaveFile = require('wavefile').WaveFile;
var Silence = /** @class */ (function (_super) {
    __extends(Silence, _super);
    function Silence() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Silence.prototype._read = function () {
        this.push(SILENCE_FRAME);
        this.destroy();
    };
    return Silence;
}(stream_1.Readable));
client.on('ready', function () {
    console.log('Js bot is Ready!');
});
client.on('message', function (message) { return __awaiter(void 0, void 0, void 0, function () {
    function wav_complete(wav_filepath) {
        return __awaiter(this, void 0, void 0, function () {
            var wav;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        wav = new WaveFile(fs.readFileSync(wav_filepath));
                        wav.toSampleRate(16000, { method: "sinc" });
                        wav.toBitDepth("16");
                        fs.writeFileSync(wav_filepath, wav.toBuffer());
                        return [4 /*yield*/, message.channel.send("Saved wav recording at " + wav_filepath)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    var bot_response_path_1, voiceChannel, connection_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (message.attachments.size > 0) {
                    message.attachments.forEach(function (Attachment) { return __awaiter(void 0, void 0, void 0, function () {
                        function fn() {
                            return __awaiter(this, void 0, void 0, function () {
                                var pic, model, image, predictions, rule, unholy_1, e_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, axios.get(link, {
                                                responseType: 'arraybuffer'
                                            })];
                                        case 1:
                                            pic = _a.sent();
                                            _a.label = 2;
                                        case 2:
                                            _a.trys.push([2, 6, , 7]);
                                            return [4 /*yield*/, nsfw.load()];
                                        case 3:
                                            model = _a.sent();
                                            return [4 /*yield*/, tf.node.decodeImage(pic.data, 3)];
                                        case 4:
                                            image = _a.sent();
                                            return [4 /*yield*/, model.classify(image)];
                                        case 5:
                                            predictions = _a.sent();
                                            image.dispose();
                                            console.log(predictions);
                                            rule = predictions;
                                            unholy_1 = "\n  a\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nA\n";
                                            rule.forEach(function (item) {
                                                if (item.className == "Hentai" && item.probability >= 0.6) {
                                                    message.channel.send(unholy_1);
                                                }
                                                if (item.className == "Porn" && item.probability >= 0.6) {
                                                    message.channel.send(unholy_1);
                                                }
                                                if (item.className == "Sexy" && item.probability >= 0.6) {
                                                    message.channel.send(unholy_1);
                                                }
                                            });
                                            return [3 /*break*/, 7];
                                        case 6:
                                            e_1 = _a.sent();
                                            console.log(e_1);
                                            return [3 /*break*/, 7];
                                        case 7: return [2 /*return*/];
                                    }
                                });
                            });
                        }
                        var link;
                        return __generator(this, function (_a) {
                            link = Attachment.url;
                            fn();
                            return [2 /*return*/];
                        });
                    }); });
                }
                if (message.author.bot && message.channel.id == text_channel) {
                    if (message.content.includes("Saved response at ")) {
                        bot_response_path_1 = message.content.replace("Saved response at ", "");
                        console.log(bot_response_path_1);
                        voiceChannel = message.member.voice.channel;
                        voiceChannel.join().then(function (connection) {
                            var dispatcher = connection.play(bot_response_path_1);
                            dispatcher.on("finish", function (finish) {
                                console.log("ended playing response");
                                fs.unlink(bot_response_path_1, function (err) {
                                    if (err)
                                        throw err;
                                    // if no error, file has been deleted successfully
                                    message.channel.send('Response audio deleted!');
                                });
                            });
                        })["catch"](function (err) { return console.log(err); });
                    }
                }
                if (!(message.content === prefix + "speak" && message.member.voice.channel)) return [3 /*break*/, 2];
                return [4 /*yield*/, message.member.voice.channel.join()];
            case 1:
                connection_1 = _a.sent();
                connection_1.on('speaking', function (user, speaking) { return __awaiter(void 0, void 0, void 0, function () {
                    var voicechannel, audioStream, filepath_1, writer;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!onCooldown) return [3 /*break*/, 1];
                                return [2 /*return*/];
                            case 1:
                                if (!speaking) return [3 /*break*/, 5];
                                onCooldown = true;
                                setTimeout(function () {
                                    onCooldown = false;
                                }, 8000);
                                return [4 /*yield*/, message.channel.send("I'm listening to <@" + user + ">")];
                            case 2:
                                _a.sent();
                                voicechannel = message.member.voice.channel;
                                if (!!voicechannel) return [3 /*break*/, 4];
                                return [4 /*yield*/, message.channel.send("Please join a voice channel first!")];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                            case 4:
                                audioStream = connection_1.receiver.createStream(message.member, {
                                    mode: "pcm",
                                    end: "silence"
                                });
                                filepath_1 = "./components/recordings/" + message.author.id + ".pcm";
                                writer = audioStream.pipe(fs.createWriteStream(filepath_1));
                                writer.on("finish", function () { return __awaiter(void 0, void 0, void 0, function () {
                                    function makewav() {
                                        return __awaiter(this, void 0, void 0, function () {
                                            var pcmData, wavData, wav_filepath;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        pcmData = fs.readFileSync(path.resolve(__dirname, filepath_1));
                                                        wavData = wavConverter.encodeWav(pcmData, {
                                                            numChannels: 2,
                                                            sampleRate: 48000,
                                                            byteRate: 2
                                                        });
                                                        wav_filepath = "./components/speaking_audio/" + message.author.id + ".wav";
                                                        fs.writeFileSync(path.resolve(__dirname, wav_filepath), wavData);
                                                        return [4 /*yield*/, wav_complete(wav_filepath)];
                                                    case 1:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        });
                                    }
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                ;
                                                return [4 /*yield*/, makewav()];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); });
                                connection_1.play(new Silence(), { type: 'opus' });
                                _a.label = 5;
                            case 5: return [2 /*return*/];
                        }
                    });
                }); });
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); });
client.login(token);
