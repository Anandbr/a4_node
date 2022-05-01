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
const UserModel_1 = __importDefault(require("../mongoose/users/UserModel"));
/**
 * @class UserDao Implements Data Access Object managing data storage of users
 * @implements {UserDaoI} UserDaoI
 * @property {UserDao} userDao Private single instance of UserDao
 */
class UserDao {
    constructor() {
        /**
         * Retrieve all user documents from users collection
         * @returns {Promise} To be notified when the users are retrieved from database
         */
        this.findAllUsers = () => __awaiter(this, void 0, void 0, function* () { return UserModel_1.default.find().exec(); });
        /**
         * Retrieve single user document from users collection
         * @param {string} uid User's primary key
         * @returns {Promise} To be notified when user is retrieved from the database
         */
        this.findUserById = (uid) => __awaiter(this, void 0, void 0, function* () { return UserModel_1.default.findById(uid).exec(); });
        /**
         * Uses UserModel to retrieve single user document from users collection
         * by their username
         * @param {string} username User's username
         * @returns Promise To be notified when user is retrieved from the database
         */
        this.findUserByUsername = (username) => __awaiter(this, void 0, void 0, function* () { return UserModel_1.default.findOne({ username }); });
        /**
         * Inserts user instance into the database
         * @param {User} user Instance to be inserted into the database
         * @returns {Promise} To be notified when user is inserted into the database
         */
        this.createUser = (user) => __awaiter(this, void 0, void 0, function* () { return yield UserModel_1.default.create(user); });
        /**
         * Removes user from the database
         * @param {string} uid Primary key of user to be removed
         * @returns {Promise} To be notified when user is removed from the database
         */
        this.deleteUser = (uid) => __awaiter(this, void 0, void 0, function* () { return UserModel_1.default.deleteOne({ _id: uid }); });
        /**
         * Updates user with new values in database
         * @param {string} uid Primary key of user to be modified
         * @param {User} user User object containing properties and their new values
         * @returns {Promise} To be notified when user is updated in the database
         */
        this.updateUser = (uid, user) => __awaiter(this, void 0, void 0, function* () {
            return UserModel_1.default.updateOne({ _id: uid }, { $set: user });
        });
        // just for test, delete user by username
        this.deleteUserByUsername = (username) => __awaiter(this, void 0, void 0, function* () { return UserModel_1.default.deleteMany({ username: username }); });
        // login
        this.findUserByCredentials = (username, password) => __awaiter(this, void 0, void 0, function* () { return UserModel_1.default.findOne({ username: username, password: password }); });
    }
}
exports.default = UserDao;
UserDao.userDao = null;
/**
 * Creates singleton DAO instance
 * @returns UserDao
 */
UserDao.getInstance = () => {
    if (UserDao.userDao === null) {
        UserDao.userDao = new UserDao();
    }
    return UserDao.userDao;
};
