"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Tag_1 = __importDefault(require("../tuits/Tag"));
const Tuit_1 = __importDefault(require("../tuits/Tuit"));
/**
 * Mapping class which replace many to many relationships between Tuit and Tag classes.
 */
class Tuit2Tag {
    constructor() {
        this.tag = new Tag_1.default();
        this.tuit = new Tuit_1.default();
    }
}
exports.default = Tuit2Tag;
