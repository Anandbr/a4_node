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
const TuitModel_1 = __importDefault(require("../mongoose/tuits/TuitModel"));
/**
 * @class TuitDao Implements Data Access Object managing data storage of tuits
 * @implements {TuitDaoI} TuitDaoI
 * @property {TuitDao} tuitDao Private single instance of TuitDao
 */
class TuitDao {
    constructor() {
        /**
         * Retrieve all tuit documents from tuits collection
         * @returns {Promise} To be notified when the tuits are retrieved from database
         */
        this.findAllTuits = () => __awaiter(this, void 0, void 0, function* () {
            return TuitModel_1.default.find()
                .lean()
                .populate("postedBy")
                .exec();
        });
        //Populated paths are no longer set to their original _id ,
        //their value is replaced with the mongoose document returned from the database
        //by performing a separate query before returning the results.
        /**
         * Retrieve single user document from tuits collection
         * @param {string} tid Tuit's primary key
         * @returns {Promise} To be notified when tuit is retrieved from the database
         */
        this.findTuitById = (tid) => __awaiter(this, void 0, void 0, function* () {
            return TuitModel_1.default
                .findById(tid)
                .populate("postedBy")
                .exec();
        });
        /**
         * Retrieve one user's all tuits documents from tuits collection
         * @param {string} uid User's primary key
         * @returns {Promise} To be notified when tuits are retrieved from the database
         */
        this.findTuitsByUser = (uid) => __awaiter(this, void 0, void 0, function* () {
            return TuitModel_1.default
                .find({ postedBy: uid })
                .lean() //use lean() tells Mongoose to skip instantiating a full Mongoose document and just give you the POJO
                .populate("postedBy")
                .exec();
        });
        /**
         * Inserts tuit instance into the database
         * @param {string} uid User's primary key
         * @param {Tuit} tuit Instance to be inserted into the database
         * @returns {Promise} To be notified when tuit is inserted into the database
         *
         */
        this.createTuitByUser = (uid, tuit) => __awaiter(this, void 0, void 0, function* () { 
        //use "...tuit" to parse object into key-value pair instead of casting tuit to string
        return yield TuitModel_1.default.create(Object.assign(Object.assign({}, tuit), { postedBy: uid })); });
        /**
         * Removes tuit from the database.
         * @param {string} tid Primary key of tuit to be removed
         * @returns {Promise} To be notified when tuit is removed from the database
         */
        this.deleteTuit = (tid) => __awaiter(this, void 0, void 0, function* () { return TuitModel_1.default.deleteOne({ _id: tid }); });
        /**
         * Updates tuit with new values in database
         * @param {string} tid Primary key of tuit to be modified
         * @param {Tuit} tuit Tuit object containing properties and their new values
         * @returns {Promise} To be notified when tuit is updated in the database
         */
        this.updateTuit = (tid, tuit) => __awaiter(this, void 0, void 0, function* () {
            return TuitModel_1.default.updateOne({ _id: tid }, { $set: tuit });
        });
        /**
         * Updates the stats nested schema for a particular tuit
         * @param {string} tid Primary key of tuit to be modified
         * @param {any} newStats Nested schema representing tuits stats
         * @returns {Promise} To be notified when tuit is updated in the database
         */
        this.updateLikes = (tid, newStats) => __awaiter(this, void 0, void 0, function* () {
            return TuitModel_1.default.updateOne({ _id: tid }, { $set: { stats: newStats } });
        });
        // just for test, delete tuit by content
        this.deleteTuitByContent = (tuit) => __awaiter(this, void 0, void 0, function* () { return TuitModel_1.default.deleteMany({ tuit: tuit }); });
    }
}
exports.default = TuitDao;
//use Singleton to create a TuitDaoI instance
TuitDao.tuitDao = null;
/**
 * Creates singleton DAO instance
 * @returns TuitDao
 */
TuitDao.getInstance = () => {
    if (TuitDao.tuitDao === null) {
        TuitDao.tuitDao = new TuitDao();
    }
    return TuitDao.tuitDao;
};
