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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MessageModel_1 = __importDefault(require("../mongoose/messages/MessageModel"));
/**
 * @class MessageDao Implements Data Access Object managing data storage of messages
 * @implements {MessageDaoI} MessageDaoI
 * @property {MessageDao} messageDao Private single instance of MessageDao
 */
class MessageDao {
    constructor() {
        /**
         * Retrieve all messages that sent by a user
         * @param {string} uid User's primary key
         * @returns {Promise} To be notified when the messages are retrieved from database
         */
        this.findAllMessagesSentByUser = (uid) => __awaiter(this, void 0, void 0, function* () {
            return MessageModel_1.default
                .find({ sentFrom: uid })
                .exec();
        });
        /**
         * Retrieve all messages that sent to a user
         * @param {string} uid User's primary key
         * @returns {Promise} To be notified when the messages are retrieved from database
         */
        this.findAllMessagesSentToUser = (uid) => __awaiter(this, void 0, void 0, function* () {
            return MessageModel_1.default
                .find({ sentTo: uid })
                .exec();
        });
        /**
         * Inserts follow instance into the database
         * @param {string} uid1 User's primary key
         * @param {string} uid2 User's primary key
         * @param {Message} message Instance to be inserted into the database
         * @returns {Promise} To be notified when message is inserted into the database
         */
        this.userSendsMessage = (uid1, uid2, message) => __awaiter(this, void 0, void 0, function* () { 
        //use "..." to parse object into key-value pairs instead of casting message object to string
        return MessageModel_1.default.create(Object.assign(Object.assign({}, message), { sentFrom: uid1, sentTo: uid2 })); });
        /**
         * Removes follow instance from the database
         * @param {string} mid Message's primary key
         * @returns {Promise} To be notified when message is removed from the database
         */
        this.userDeletesMessage = (mid) => __awaiter(this, void 0, void 0, function* () { return MessageModel_1.default.deleteOne({ _id: mid }); });
    }
}
exports.default = MessageDao;
MessageDao.messageDao = null;
/**
 * Creates singleton DAO instance
 * @returns messageDao
 */
MessageDao.getInstance = () => {
    if (MessageDao.messageDao === null) {
        MessageDao.messageDao = new MessageDao();
    }
    return MessageDao.messageDao;
};
