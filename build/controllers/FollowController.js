"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FollowDao_1 = __importDefault(require("../daos/FollowDao"));
/**
 * @class FollowController Implements RESTful Web service API for follows resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /users/:uid/follows to retrieve all the users that followed by a user </li>
 *     <li>GET /users/:uid/followers to retrieve all the users that follow a user </li>
 *     <li>GET /follows to retrieve all the follows' data </li>
 *     <li>POST /users/:uid1/follows/:uid2 to record that a user follows another user </li>
 *     <li>DELETE /users/:uid1/follows/:uid2 to record that a user
 *     no londer follows another user</li>
 * </ul>
 * @property {FollowDao} followDao Singleton DAO implementing follows CRUD operations
 * @property {FollowController} followController Singleton controller implementing
 * RESTful Web service API
 */
class FollowController {
    constructor() {
        /**
         * Retrieves all users that followed by another user from the database
         * @param {Request} req Represents request from client, including the path
         * parameter uid representing the user
         * @param {Response} res Represents response to client, including the
         * body formatted as JSON arrays containing the user objects
         */
        this.findAllUsersFollowedByUser = (req, res) => FollowController.followDao.findAllUsersFollowedByUser(req.params.uid)
            .then(follows => res.json(follows));
        /**
         * Retrieves all users that follow another user from the database
         * @param {Request} req Represents request from client, including the path
         * parameter uid representing the user that is being followed
         * @param {Response} res Represents response to client, including the
         * body formatted as JSON arrays containing the user objects
         */
        this.findAllFollowers = (req, res) => FollowController.followDao.findAllFollowers(req.params.uid)
            .then(follows => res.json(follows));
        /**
         * Retrieves all follows' data from the database
         * @param {Request} req Represents request from client
         * @param {Response} res Represents response to client, including the
         * body formatted as JSON arrays containing the follows objects
         */
        this.findAllFollows = (req, res) => FollowController.followDao.findAllFollows()
            .then(follows => res.json(follows));
        /**
         * @param {Request} req Represents request from client, including the
         * path parameters uid1 and uid2 representing the user that is following
         * the other user and the other user being followed
         * @param {Response} res Represents response to client, including the
         * body formatted as JSON containing the new follow that was inserted in the
         * database
         */
        this.userFollowsAnotherUser = (req, res) => FollowController.followDao.userFollowsAnotherUser(req.params.uid1, req.params.uid2)
            .then(follows => res.json(follows));
        /**
         * @param {Request} req Represents request from client, including the
         * path parameters uid1 and uid2 representing the user that is un following
         * the other user and the other user being unfollowed
         * @param {Response} res Represents response to client, including status
         * on whether deleting the follow was successful or not
         */
        this.userUnfollowsAnotherUser = (req, res) => FollowController.followDao.userUnfollowsAnotherUser(req.params.uid1, req.params.uid2)
            .then(status => res.send(status));
    }
}
exports.default = FollowController;
FollowController.followDao = FollowDao_1.default.getInstance();
FollowController.followController = null;
/**
 * Creates singleton controller instance
 * @param {Express} app Express instance to declare the RESTful Web service API
 * @return followController
 */
FollowController.getInstance = (app) => {
    if (FollowController.followController === null) {
        FollowController.followController = new FollowController();
        app.get("/users/:uid/follows", FollowController.followController.findAllUsersFollowedByUser);
        app.get("/users/:uid/followers", FollowController.followController.findAllFollowers);
        app.get("/follows", FollowController.followController.findAllFollows);
        app.post("/users/:uid1/follows/:uid2", FollowController.followController.userFollowsAnotherUser);
        app.delete("/users/:uid1/follows/:uid2", FollowController.followController.userUnfollowsAnotherUser);
    }
    return FollowController.followController;
};
;
