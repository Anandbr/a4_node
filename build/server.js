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
const AuthenticationController_1 = __importDefault(require("./controllers/AuthenticationController"));
const DislikeController_1 = __importDefault(require("./controllers/DislikeController"));
const cors = require('cors');
const session = require("express-session");
//read database username && password through process.env
const dotenv = require("dotenv");
dotenv.config();
/*
connect to local mongoDB database
mongoose.connect('mongodb://localhost:27017/tuiter');
 */
/*
 * connect to remote mongoDB database
 * mongoose.connect('mongodb+srv://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD
 *     +'@cluster0.wenpq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
 *
 * This is for Assignment 1
 */
/*
 * connect to remote mongoDB database
 * mongoose.connect('mongodb+srv://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD
 * + '@cluster0.yzklt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
 *
 * This is for Assignment 2
 */
/*
 * connect to remote mongoDB database
 * mongoose.connect('mongodb+srv://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD
 * + '@cluster0.lyb73.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
 *
 * This is for Assignment 3
 */
/*
 * connect to remote mongoDB database
 * mongoose.connect('mongodb+srv://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD
 * + '@cluster0.iylq3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
 *
 * This is for Assignment 4
 */
// mongoose.connect('mongodb+srv://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD
//     + '@cluster0.lhdzm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
// mongoose.connection.once("open", function(){
//     console.log("Database connected successfully");
// })
mongoose_1.default.connect('mongodb+srv://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD
    + '@cluster0.pstb3.mongodb.net/FSEDatabase2?retryWrites=true&w=majority');
mongoose_1.default.connection.once("open", function () {
    console.log("Database connected successfully");
});
const app = (0, express_1.default)();
//cross network domain
app.use(cors({
    // support cookie header
    credentials: true,
    // must whitelists allowed domains(if using credentials)
    // http://localhost:3000
    origin: ['http://localhost:3000', process.env.CORS_ORIGIN]
}));
const SECRET = 'process.env.SECRET';
//session configure
let sess = {
    secret: SECRET,
    saveUninitialized: true,
    resave: true,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        // sameSite: none allows cookies to be sent in all contexts
        sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
    }
};
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1); // trust first proxy
}
app.use(session(sess));
app.use(express_1.default.json());
app.get('/hello', (req, res) => res.send('Hello World!'));
app.get('/add/:a/:b', (req, res) => {
    res.send(req.params.a + req.params.b);
});
//instantiate controllers
const userController = UserController_1.default.getInstance(app);
const tuitController = TuitController_1.default.getInstance(app);
const likeController = LikeController_1.default.getInstance(app);
const dislikeController = DislikeController_1.default.getInstance(app);
const followController = FollowController_1.default.getInstance(app);
const bookmarkController = BookmarkController_1.default.getInstance(app);
const messageController = MessageController_1.default.getInstance(app);
(0, AuthenticationController_1.default)(app);
/**
 * Start a server listening at port 4000 locally
 * but use environment variable PORT on Heroku if available.
 */
const PORT = 4000;
app.listen(process.env.PORT || PORT);
