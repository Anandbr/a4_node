"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @class Bookmark Represents bookmarks relationship between a user and a tuit,
 * as in a user bookmarks a tuit
 * @property {Tuit} bookmarkedTuit tuit being bookmarked
 * @property {User} bookmarkedBy user bookmarking the tuit
 */
class Bookmark {
    constructor() {
        this.bookmarkedTuit = null;
        this.bookmarkedBy = null;
    }
}
exports.default = Bookmark;
;
