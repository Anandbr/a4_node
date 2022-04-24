"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @class Follow Represents follows relationship between a user and another user,
 * as in a user follows another user
 * @property {User} user user being followed
 * @property {User} follower another user following this user
 */
class Follow {
    constructor() {
        this.user = null;
        this.follower = null;
    }
}
exports.default = Follow;
;
