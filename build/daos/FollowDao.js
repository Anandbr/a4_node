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
const FollowModel_1 = __importDefault(require("../mongoose/follows/FollowModel"));
/**
 * @class FollowDao Implements Data Access Object managing data storage of follows
 * @implements {FollowDaoI} FollowDaoI
 * @property {FollowDao} followDao Private single instance of FollowDao
 */
class FollowDao {
    constructor() {
        /**
         * Retrieve all users that one user are following
         * @param {string} uid Follower(User)'s primary key
         * @returns {Promise} To be notified when the users are retrieved from database
         */
        this.findAllUsersFollowedByUser = (uid) => __awaiter(this, void 0, void 0, function* () {
            return FollowModel_1.default
                .find({ follower: uid })
                .populate("user")
                .exec();
        });
        /**
         * Retrieve all users that following one user
         * @param {string} uid User's primary key
         * @returns {Promise} To be notified when the users are retrieved from database
         */
        this.findAllFollowers = (uid) => __awaiter(this, void 0, void 0, function* () {
            return FollowModel_1.default
                .find({ user: uid })
                .populate("follower")
                .exec();
        });
        /**
         * Retrieve all follows data
         * @returns {Promise} To be notified when the follows' data are retrieved from database
         */
        this.findAllFollows = () => __awaiter(this, void 0, void 0, function* () {
            return FollowModel_1.default
                .find()
                .populate("user follower")
                .exec();
        });
        /**
         * Inserts follow instance into the database
         * @param {string} uid1 Follower(User)'s primary key
         * @param {string} uid2 User's primary key
         * @returns {Promise} To be notified when follow is inserted into the database
         */
        this.userFollowsAnotherUser = (uid1, uid2) => __awaiter(this, void 0, void 0, function* () { return FollowModel_1.default.create({ follower: uid1, user: uid2 }); });
        /**
         * Removes follow instance from the database
         * @param {string} uid1 Follower(User)'s primary key
         * @param {string} uid2 User's primary key
         * @returns {Promise} To be notified when follow is removed from the database
         */
        this.userUnfollowsAnotherUser = (uid1, uid2) => __awaiter(this, void 0, void 0, function* () { return FollowModel_1.default.deleteOne({ follower: uid1, user: uid2 }); });
    }
}
exports.default = FollowDao;
FollowDao.followDao = null;
/**
 * Creates singleton DAO instance
 * @returns followDao
 */
FollowDao.getInstance = () => {
    if (FollowDao.followDao === null) {
        FollowDao.followDao = new FollowDao();
    }
    return FollowDao.followDao;
};
