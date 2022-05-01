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
const TuitDao_1 = __importDefault(require("../daos/TuitDao"));
const LikeDao_1 = __importDefault(require("../daos/LikeDao"));
const DislikeDao_1 = __importDefault(require("../daos/DislikeDao"));
/**
 * @class TuitController Implements RESTful Web service API for tuits resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /tuits to retrieve all the tuit instances</li>
 *     <li>GET /tuits/:tid to retrieve a particular tuit instances</li>
 *     <li>GET /users/:uid/tuits to retrieve tuits for a given user </li>
 *     <li>POST /users/:uid/tuits to create a new tuit instance for a given user</li>
 *     <li>PUT /tuits/:tid to modify an individual tuit instance </li>
 *     <li>DELETE /tuits/:tid to remove a particular tuit instance</li>
 * </ul>
 * @property {TuitDao} tuitDao Singleton DAO implementing tuit CRUD operations
 * @property {TuitController} tuitController Singleton controller implementing
 * RESTful Web service API
 */
class TuitController {
    constructor() {
        this.tuitDao = TuitDao_1.default.getInstance();
        this.likeDao = LikeDao_1.default.getInstance();
        this.dislikeDao = DislikeDao_1.default.getInstance();
        /**
         * Retrieves all tuits from the database and returns an array of tuits.
         * @param {Request} req Represents request from client
         * @param {Response} res Represents response to client, including the
         * body formatted as JSON arrays containing the tuit objects
         */
        this.findAllTuits = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let tuits = yield this.tuitDao.findAllTuits();
            // @ts-ignore
            // user already login
            if (req.session['profile']) {
                // @ts-ignore
                let userId = req.session['profile']._id;
                //update isLiked && isDisliked property
                yield this.addProperty(tuits, userId);
            }
            res.json(tuits);
        });
        /**
         * Retrieves all tuits from the database for a particular user and returns
         * an array of tuits.
         * @param {Request} req Represents request from client
         * @param {Response} res Represents response to client, including the
         * body formatted as JSON arrays containing the tuit objects
         */
        this.findTuitsByUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            let userId = req.params.uid === "my" && req.session['profile'] ?
                // @ts-ignore
                req.session['profile']._id : req.params.uid;
            // avoid server crash
            if (userId === "my") {
                res.sendStatus(503);
                return;
            }
            let tuits = yield this.tuitDao.findTuitsByUser(userId);
            //update isLiked && isDisliked property
            yield this.addProperty(tuits, userId);
            return res.json(tuits);
        });
        /**
         * @param {Request} req Represents request from client, including path
         * parameter tid identifying the primary key of the tuit to be retrieved
         * @param {Response} res Represents response to client, including the
         * body formatted as JSON containing the tuit that matches the tid
         */
        this.findTuitById = (req, res) => this.tuitDao.findTuitById(req.params.tid)
            .then(tuit => res.json(tuit));
        /**
         * @param {Request} req Represents request from client, including body
         * containing the JSON object for the new tuit to be inserted in the
         * database
         * @param {Response} res Represents response to client, including the
         * body formatted as JSON containing the new tuit that was inserted in the
         * database
         */
        this.createTuitByUser = (req, res) => {
            // retrieve _id from session or parameter's uid
            // @ts-ignore
            let userId = req.params.uid === "my" && req.session['profile'] ?
                // @ts-ignore
                req.session['profile']._id : req.params.uid;
            // avoid server crash
            if (userId === "my") {
                res.sendStatus(503);
                return;
            }
            this.tuitDao.createTuitByUser(userId, req.body)
                .then(tuit => res.json(tuit));
        };
        /**
         * @param {Request} req Represents request from client, including path
         * parameter tid identifying the primary key of the tuit to be modified
         * @param {Response} res Represents response to client, including status
         * on whether updating a tuit was successful or not
         */
        this.updateTuit = (req, res) => this.tuitDao.updateTuit(req.params.tid, req.body)
            .then(status => res.json(status));
        /**
         * @param {Request} req Represents request from client, including path
         * parameter tid identifying the primary key of the tuit to be removed
         * @param {Response} res Represents response to client, including status
         * on whether deleting a tuit was successful or not
         */
        this.deleteTuit = (req, res) => this.tuitDao.deleteTuit(req.params.tid)
            .then(status => res.json(status));
        // just for test, delete tuit by content
        this.deleteTuitByContent = (req, res) => this.tuitDao.deleteTuitByContent(req.params.content)
            .then(status => res.json(status));
    }
    addProperty(tuits, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < tuits.length; i++) {
                const userAlreadyLikedTuit = yield this.likeDao.findUserLikesTuit(userId, tuits[i]._id);
                const userAlreadyDislikedTuit = yield this.dislikeDao.findUserDislikesTuit(userId, tuits[i]._id);
                //update isliked/isDisliked property
                tuits[i].isLiked = Boolean(userAlreadyLikedTuit);
                tuits[i].isDisliked = Boolean(userAlreadyDislikedTuit);
            }
        });
    }
}
exports.default = TuitController;
TuitController.tuitController = null;
/**
 * Creates singleton controller instance
 * @param {Express} app Express instance to declare the RESTful Web service API
 * @return tuitController
 */
TuitController.getInstance = (app) => {
    if (TuitController.tuitController === null) {
        TuitController.tuitController = new TuitController();
        //define HTTP request address
        app.get("/tuits", TuitController.tuitController.findAllTuits);
        app.get("/tuits/:tid", TuitController.tuitController.findTuitById);
        app.get("/users/:uid/tuits", TuitController.tuitController.findTuitsByUser);
        app.post("/users/:uid/tuits", TuitController.tuitController.createTuitByUser);
        app.put("/tuits/:tid", TuitController.tuitController.updateTuit);
        app.delete("/tuits/:tid", TuitController.tuitController.deleteTuit);
        //for testing, not RESTful
        app.delete("/tuits/content/:content/delete", TuitController.tuitController.deleteTuitByContent);
    }
    return TuitController.tuitController;
};
