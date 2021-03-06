"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file Implements mongoose schema for users
 */
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Create the UserSchema to represent user document instances stored in a MongoDB database.
 * @typedef User represents a tuiter users
 * @property {String} username user's account name
 * @property {String} password user's account password
 * @property {String} firstName user's first name
 * @property {String} lastName user's last name
 * @property {String} email user's email
 * @property {String} profilePhoto user's profile photo
 * @property {String} headerImage user's header image
 * @property {String} accountType user's account type
 * @property {String} maritalStatus user's marital status
 * @property {String} biography user's biography
 * @property {Date} dateOfBirth user's birthday
 * @property {Date} joined user account's creation time
 * @property {Number} latitude user's location latitude
 * @property {Number} longitude user's location longitude
 *
 */
const UserSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    firstName: String,
    lastName: String,
    email: { type: String, required: true },
    profilePhoto: String,
    headerImage: String,
    accountType: { type: String, enum: ['PERSONAL', 'ACADEMIC', 'PROFESSIONAL'] },
    maritalStatus: { type: String, enum: ['MARRIED', 'SINGLE', 'WIDOWED'] },
    biography: String,
    dateOfBirth: Date,
    joined: { type: Date, default: Date.now },
    location: {
        latitude: Number,
        longitude: Number
    }
}, { collection: 'users' });
exports.default = UserSchema;
