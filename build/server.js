"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file Implements an Express Node HTTP server. Declares RESTful Web services
 * enabling CRUD operations on the following resources:
 * <ul>
 *     <li>users</li>
 *     <li>tuits</li>
 *     <li>likes</li>
 *     <li>follows</li>
 *     <li>bookmarks</li>
 *     <li>messages</li>
 * </ul>
 *
 * Connects to a remote MongoDB instance hosted on the Atlas cloud database
 * service
 */
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const UserController_1 = __importDefault(require("./controllers/UserController"));
const TuitController_1 = __importDefault(require("./controllers/TuitController"));
const LikeController_1 = __importDefault(require("./controllers/LikeController"));
const FollowController_1 = __importDefault(require("./controllers/FollowController"));
const BookmarkController_1 = __importDefault(require("./controllers/BookmarkController"));
const MessageController_1 = __importDefault(require("./controllers/MessageController"));
var cors = require('cors');
//read database username && password through process.env
const dotenv = require("dotenv");
dotenv.config();
mongoose_1.default.connect('mongodb+srv://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD
    + '@cluster0.pstb3.mongodb.net/FSEDatabase2?retryWrites=true&w=majority');
mongoose_1.default.connection.once("open", function () {
    console.log("Database connected successfully");
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
//cross network domain
app.use(cors());
app.get('/hello', (req, res) => res.send('Hello World!'));
app.get('/add/:a/:b', (req, res) => {
    res.send(req.params.a + req.params.b);
});
//instantiate controllers
const userController = UserController_1.default.getInstance(app);
const tuitController = TuitController_1.default.getInstance(app);
const likeController = LikeController_1.default.getInstance(app);
const followController = FollowController_1.default.getInstance(app);
const bookmarkController = BookmarkController_1.default.getInstance(app);
const messageController = MessageController_1.default.getInstance(app);
/**
 * Start a server listening at port 4000 locally
 * but use environment variable PORT on Heroku if available.
 */
const PORT = 4000;
app.listen(process.env.PORT || PORT);
