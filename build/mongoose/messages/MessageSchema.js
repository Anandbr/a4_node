"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file Implements mongoose schema for messages
 */
const mongoose_1 = __importStar(require("mongoose"));
/**
 * Create the MessageSchema to represent message document instances stored in a MongoDB database.
 * @typedef Message represents a message
 * @property {String} content message's content
 * @property {ObjectId} sentFrom user reference
 * @property {ObjectId} sentTo user reference
 * @property {Date} sentOn message's creation time
 *
 */
const MessageSchema = new mongoose_1.default.Schema({
    content: { type: String, required: true },
    sentFrom: { type: mongoose_1.Schema.Types.ObjectId, ref: "UserModel" },
    sentTo: { type: mongoose_1.Schema.Types.ObjectId, ref: "UserModel" },
    sentOn: { type: Date, default: Date.now },
}, { collection: 'messages' });
exports.default = MessageSchema;
