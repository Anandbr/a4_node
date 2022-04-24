"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @class Tuit Represents a tuit posted by a user
 * @property {string} tuit tuit's content
 * @property {Date} postedOn tuit's creation time
 * @property {ObjectId} postedBy user reference
 */
class Tuit {
    constructor() {
        this.tuit = '';
        this.postedOn = new Date();
        this.postedBy = null;
    }
}
exports.default = Tuit;
