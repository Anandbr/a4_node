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
const LikeModel_1 = __importDefault(require("../mongoose/likes/LikeModel"));
/**
 * @class LikeDao Implements Data Access Object managing data storage of likes
 * @implements {LikeDaoI} LikeDaoI
 * @property {likeDao} likeDao Private single instance of LikeDao
 */
class LikeDao {
    constructor() {
        /**
         * Retrieve all users documents from likes collection
         * @param {string} tid Tuit's primary key
         * @returns {Promise} To be notified when the users are retrieved from database
         */
        this.findAllUsersThatLikedTuit = (tid) => __awaiter(this, void 0, void 0, function* () {
            return LikeModel_1.default
                .find({ tuit: tid })
                .populate("likedBy")
                .exec();
        });
        /**
         * Retrieve all tuits documents from likes collection
         * @param {string} uid User's primary key
         * @returns {Promise} To be notified when the tuits are retrieved from database
         */
        this.findAllTuitsLikedByUser = (uid) => __awaiter(this, void 0, void 0, function* () {
            return LikeModel_1.default
                .find({ likedBy: uid })
                .lean()
                .populate({
                path: "tuit",
                populate: {
                    path: "postedBy"
                }
            })
                .exec();
        });
        /**
         * Inserts like instance into the database
         * @param {string} uid User's primary key
         * @param {string} tid Tuit's primary key
         * @returns {Promise} To be notified when like is inserted into the database
         */
        this.userLikesTuit = (uid, tid) => __awaiter(this, void 0, void 0, function* () { return LikeModel_1.default.create({ tuit: tid, likedBy: uid }); });
        /**
         * Removes like instance from the database
         * @param {string} uid User's primary key
         * @param {string} tid Tuit's primary key
         * @returns {Promise} To be notified when like is removed from the database
         */
        this.userUnlikesTuit = (uid, tid) => __awaiter(this, void 0, void 0, function* () { return LikeModel_1.default.deleteOne({ tuit: tid, likedBy: uid }); });
        /**
         * Counts the total likes a particular tuit has
         * @param {string} tid Tuit's primary key
         * @returns {Promise} To be notified when total count is calculated
         */
        this.countHowManyLikedTuit = (tid) => __awaiter(this, void 0, void 0, function* () { return LikeModel_1.default.count({ tuit: tid }); });
        /**
         * Find out if a user has liked a particular tuit
         * @param {string} uid User's primary key
         * @param {string} tid Tuit's primary key
         * @returns {Promise} To be notified when data is retrived from the database
         */
        this.findUserLikesTuit = (uid, tid) => __awaiter(this, void 0, void 0, function* () { return LikeModel_1.default.findOne({ tuit: tid, likedBy: uid }); });
    }
}
exports.default = LikeDao;
LikeDao.likeDao = null;
/**
 * Creates singleton DAO instance
 * @returns likeDao
 */
LikeDao.getInstance = () => {
    if (LikeDao.likeDao === null) {
        LikeDao.likeDao = new LikeDao();
    }
    return LikeDao.likeDao;
};
