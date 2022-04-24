"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @class Message Represents a message sent by a user to another user
 * @property {string} tuit tuit's content
 * @property {Date} postedOn tuit's creation time
 * @property {ObjectId} postedBy user reference
 */
class Message {
    constructor() {
        this.content = '';
        this.sentFrom = null;
        this.sentTo = null;
        this.sentOn = new Date();
    }
}
exports.default = Message;
