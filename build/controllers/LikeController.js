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
const LikeDao_1 = __importDefault(require("../daos/LikeDao"));
const TuitDao_1 = __importDefault(require("../daos/TuitDao"));
const DislikeDao_1 = __importDefault(require("../daos/DislikeDao"));
/**
 * @class LikeController Implements RESTful Web service API for likes resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /users/:uid/likes to retrieve all the tuits liked by a user </li>
 *     <li>GET /likes/tuits/:tid to retrieve all users that liked a tuit </li>
 *     <li>GET /users/:uid/likes/:tid to retrieve the like distance with particular user and tuit </li>
 *     <li>PUT /users/:uid/likes/:tid to record that a user toggles like in a tuit </li>
 * </ul>
 * @property {LikeDao} likeDao Singleton DAO implementing likes CRUD operations
 * @property {LikeController} likeController Singleton controller implementing
 * RESTful Web service API
 */
class LikeController {
    constructor() {
        /**
         * Retrieves all users that liked a tuit from the database
         * @param {Request} req Represents request from client, including the path
         * parameter tid representing the liked tuit
         * @param {Response} res Represents response to client, including the
         * body formatted as JSON arrays containing the user objects
         */
        this.findAllUsersThatLikedTuit = (req, res) => LikeController.likeDao.findAllUsersThatLikedTuit(req.params.tid)
            .then(likes => res.json(likes));
        /**
         * Retrieves all tuits liked by a user from the database
         * @param {Request} req Represents request from client, including the path
         * parameter uid representing the user liked the tuits
         * @param {Response} res Represents response to client, including the
         * body formatted as JSON arrays containing the tuit objects that were liked
         */
        this.findAllTuitsLikedByUser = (req, res) => {
            const uid = req.params.uid;
            // @ts-ignore
            const profile = req.session['profile'];
            const userId = uid === "me" && profile ?
                profile._id : uid;
            LikeController.likeDao.findAllTuitsLikedByUser(userId)
                .then((likes) => __awaiter(this, void 0, void 0, function* () {
                // filter out likes with null tuit
                const likesNonNullTuits = likes.filter(like => like.tuit);
                // extract tuit objects and assign them to elements in the new array
                const tuitsFromLikes = likesNonNullTuits.map(like => like.tuit);
                //update isLiked/isDisliked properties
                yield this.addProperty(tuitsFromLikes, userId);
                res.json(tuitsFromLikes);
            }));
        };
        /**
         * Retrieves the like data with particular user and tuit
         * @param {Request} req Represents request from client, including the path
         * parameter uid representing the user liked the tuit,
         * and the path parameter tid representing the tuit being liked
         * @param {Response} res Represents response to client, including the
         * body formatted as JSON arrays containing the tuit objects that were liked
         */
        this.findUserLikesTuit = (req, res) => {
            const uid = req.params.uid;
            const tid = req.params.tid;
            // @ts-ignore
            const profile = req.session['profile'];
            const userId = uid === "me" && profile ?
                profile._id : uid;
            LikeController.likeDao.findUserLikesTuit(userId, tid)
                .then(likes => res.json(likes));
        };
        /**
         * Update tuit stats based on user's click event
         * @param {Request} req Represents request from client, including the
         * path parameters uid and tid representing the user that is liking the tuit
         * and the tuit being liked
         * @param {Response} res Represents response to client, including the
         * body formatted as JSON containing the new likes that was inserted in the
         * database
         */
        this.userTogglesTuitLikes = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const dislikeDao = LikeController.dislikeDao;
            const likeDao = LikeController.likeDao;
            const tuitDao = LikeController.tuitDao;
            const uid = req.params.uid;
            const tid = req.params.tid;
            // @ts-ignore
            const profile = req.session['profile'];
            // if logged in, get ID from profile, otherwise use parameter
            const userId = uid === "me" && profile ?
                profile._id : uid;
            try {
                // check if user already has liked tuit
                const userAlreadyLikedTuit = yield likeDao.findUserLikesTuit(userId, tid);
                const likeNumber = yield likeDao.countHowManyLikedTuit(tid);
                let tuit = yield tuitDao.findTuitById(tid);
                if (userAlreadyLikedTuit) {
                    // user unlikes tuit
                    yield likeDao.userUnlikesTuit(userId, tid);
                    tuit.stats.likes = likeNumber - 1;
                }
                else {
                    // user likes tuit
                    yield LikeController.likeDao.userLikesTuit(userId, tid);
                    tuit.stats.likes = likeNumber + 1;
                    // if user disliked this tuit before, undislike this tuit
                    const userAlreadyDislikedTuit = yield dislikeDao.findUserDislikesTuit(userId, tid);
                    const dislikeNumber = yield dislikeDao.countHowManyDislikedTuit(tid);
                    if (userAlreadyDislikedTuit) {
                        yield dislikeDao.userUndislikesTuit(userId, tid);
                        tuit.stats.dislikes = dislikeNumber - 1;
                    }
                }
                // update tuit stats
                yield tuitDao.updateLikes(tid, tuit.stats);
                res.sendStatus(200);
            }
            catch (e) {
                res.sendStatus(404);
            }
        });
    }
    addProperty(tuits, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < tuits.length; i++) {
                const userAlreadyLikedTuit = yield LikeController.likeDao.findUserLikesTuit(userId, tuits[i]._id);
                const userAlreadyDislikedTuit = yield LikeController.dislikeDao.findUserDislikesTuit(userId, tuits[i]._id);
                //update isliked/isDisliked property
                tuits[i].isLiked = Boolean(userAlreadyLikedTuit);
                tuits[i].isDisliked = Boolean(userAlreadyDislikedTuit);
            }
        });
    }
}
exports.default = LikeController;
LikeController.likeDao = LikeDao_1.default.getInstance();
LikeController.dislikeDao = DislikeDao_1.default.getInstance();
LikeController.tuitDao = TuitDao_1.default.getInstance();
LikeController.likeController = null;
/**
 * Creates singleton controller instance
 * @param {Express} app Express instance to declare the RESTful Web service API
 * @return likeController
 */
LikeController.getInstance = (app) => {
    if (LikeController.likeController === null) {
        LikeController.likeController = new LikeController();
        app.get("/users/:uid/likes", LikeController.likeController.findAllTuitsLikedByUser);
        app.get("/likes/tuits/:tid", LikeController.likeController.findAllUsersThatLikedTuit);
        app.get("/users/:uid/likes/:tid", LikeController.likeController.findUserLikesTuit);
        app.put("/users/:uid/likes/:tid", LikeController.likeController.userTogglesTuitLikes);
    }
    return LikeController.likeController;
};
;
