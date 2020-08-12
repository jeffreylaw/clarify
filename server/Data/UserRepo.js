const User = require('../Models/User');


class UserRepo {

    UserRepo() { }

    async allUsers() {
        let users = await User.find().exec();
        return users;
    }

    async getUserByUsername(username) {
        let user = await User.findOne({ username: username });
        if (user) {
            let response = { user: user, errorMessage: '' };
            return response;
        } else {
            return null;
        }
    }

    async getUserByEmail(email) {
        let user = await User.findOne({ email: email });
        if (user) {
            let response = { user: user, errorMessage: '' };
            return response;
        } else {
            return null;
        }
    }

    async getRolesByUsername(username) {
        let user = await User.findOne({ username: username });
        if (user.roles) {
            return user.roles;
        } else {
            return [];
        }
    }

    async promoteUser(username, role) {
        let response = await User.updateOne(
            { username: username },
            { $addToSet: { roles: role } }
        );
        return response;
    }

    async demoteUser(username) {
        let response = await User.updateOne(
            { username: username },
            { $set: { roles: [] } }
        );
        return response;
    }
}

module.exports = UserRepo;