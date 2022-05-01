"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserDao_1 = __importDefault(require("../daos/UserDao"));
/**
 * @class UserController Implements RESTful Web service API for users resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /users to retrieve all the user instances</li>
 *     <li>GET /users/:uid to retrieve an individual user instance </li>
 *     <li>POST /users to create a new user instance</li>
 *     <li>PUT /users/:uid to modify an individual user instance </li>
 *     <li>DELETE /users/:uid to remove a particular user instance</li>
 * </ul>
 * @property {UserDao} userDao Singleton DAO implementing user CRUD operations
 * @property {UserController} userController Singleton controller implementing
 * RESTful Web service API
 */
class UserController {
    constructor() {
        this.userDao = UserDao_1.default.getInstance();
        /**
         * Retrieves all users from the database and returns an array of users.
         * @param {Request} req Represents request from client
         * @param {Response} res Represents response to client, including the
         * body formatted as JSON arrays containing the user objects
         */
        this.findAllUsers = (req, res) => this.userDao.findAllUsers()
            .then(users => res.json(users));
        /**
         * Retrieves the user by their primary key
         * @param {Request} req Represents request from client, including path
         * parameter uid identifying the primary key of the user to be retrieved
         * @param {Response} res Represents response to client, including the
         * body formatted as JSON containing the user that matches uid
         */
        this.findUserById = (req, res) => this.userDao.findUserById(req.params.uid)
            .then(user => res.json(user));
        /**
         * Creates a new user instance
         * @param {Request} req Represents request from client, including body
         * containing the JSON object for the new user to be inserted in the database
         * @param {Response} res Represents response to client, including the
         * body formatted as JSON containing the new user that was inserted in the database
         */
        this.createUser = (req, res) => this.userDao.createUser(req.body)
            .then(user => res.json(user));
        /**
         * Modifies an existing user instance
         * @param {Request} req Represents request from client, including path
         * parameter uid identifying the primary key of the user to be modified
         * @param {Response} res Represents response to client, including status
         * on whether updating a user was successful or not
         */
        this.updateUser = (req, res) => this.userDao.updateUser(req.params.uid, req.body)
            .then(status => res.json(status));
        /**
         * Removes a user instance from the database
         * @param {Request} req Represents request from client, including path
         * parameter uid identifying the primary key of the user to be removed
         * @param {Response} res Represents response to client, including status
         * on whether deleting a user was successful or not
         */
        this.deleteUser = (req, res) => this.userDao.deleteUser(req.params.uid)
            .then(status => res.json(status));
        //login
        this.login = (req, res) => this.userDao.findUserByCredentials(req.body.username, req.body.password)
            .then(user => {
            res.json(user);
        });
        // just for test, delete user by username
        this.deleteUserByUsername = (req, res) => this.userDao.deleteUserByUsername(req.params.username)
            .then(status => res.send(status));
    }
}
exports.default = UserController;
//use Singleton design pattern to get a UserControllerI instance
UserController.userController = null;
/**
 * Creates singleton controller instance
 * @param {Express} app Express instance to declare the RESTful Web service API
 * @returns userController
 */
UserController.getInstance = (app) => {
    if (UserController.userController === null) {
        UserController.userController = new UserController();
        //define HTTP request address
        app.get("/users", UserController.userController.findAllUsers);
        app.get("/users/:uid", UserController.userController.findUserById);
        app.post("/users", UserController.userController.createUser);
        app.put("/users/:uid", UserController.userController.updateUser);
        app.delete("/users/:uid", UserController.userController.deleteUser);
        app.post("/api/login", UserController.userController.login);
        //for testing, not RESTful
        app.delete("/users/username/:username/delete", UserController.userController.deleteUserByUsername);
    }
    return UserController.userController;
};
