const User = require('../Models/User');
let passport = require('passport');
const RequestService = require('../Services/RequestService');
const UserRepo = require('../Data/UserRepo');
const _userRepo = new UserRepo();

exports.AllUsers = async function (req, res) {
    let reqInfo = await RequestService.jwtReqHelper(req, ['admin']);
    if (reqInfo.rolePermitted) {
        let users = await _userRepo.allUsers();
        if (users) {
            res.json({ users: users });
        } else {
            res.json({ users: [] });
        }
    }
}

exports.Register = async function (req, res) {
    let reqInfo = RequestService.reqHelper(req);
    res.render('User/Register', { errorMessage: "", user: {}, reqInfo: reqInfo })
};

// Handles 'POST' with registration form submission.
exports.RegisterUser = async function (req, res) {
    let username = req.body.obj.username;
    let password = req.body.obj.password;
    let passwordConfirm = req.body.obj.passwordConfirm;
    let firstName = req.body.obj.firstName;
    let lastName = req.body.obj.lastName;

    if (password.length < 6) {
        return res.json({errorMessage:'Password must be longer than 6 characters.'})
    }

    if (password == passwordConfirm) {
        let newUser = new User({
            username: username,
            firstName: firstName,
            lastName: lastName
        });
        User.register(new User(newUser), password,
            function (err, account) {
                if (err) {
                    console.log(err)
                    return res.json({ errorMessage: err.message });
                } else {
                    return res.json({ user: newUser, errorMessage: '' });
                }
            });
    } else {
        return res.json({errorMessage:'Passwords do not match.'})
    }
};

exports.Promote = async function (req, res) {
    let reqInfo = await RequestService.jwtReqHelper(req, ['admin']);
    if (reqInfo.rolePermitted) {
        let role = req.body.obj.role;
        let username = req.body.obj.username;
        if (role === 'mod' || role === 'instructor') {
            let response = await _userRepo.promoteUser(username, role);
            if (response && response.nModified === 1) {
                return res.json({ errorMessage: '', response: 'Successfully promoted user.'});
            } else {
                return res.json({ errorMessage: 'Failed to promote user.'});
            }
        } else {
            return res.json({ errorMessage: 'Attempted to promote user to an invalid role.' });
        }
    } else {
        return res.json({ errorMessage: 'You are not authorized to access this page.' });
    }
}

exports.Demote = async function (req, res) {
    let reqInfo = await RequestService.jwtReqHelper(req, ['admin']);
    if (reqInfo.rolePermitted) {
        let username = req.body.obj.username;
        let user = await User.findOne({ username: username });
        if (user.roles.includes('admin')) {
            return res.json({ errorMessage: 'You can\'t demote admins' });
        }
        let response = await _userRepo.demoteUser(username);
        console.log(response);
        if (response && response.nModified === 1) {
            return res.json({ errorMessage: '', response: 'Successfully demoted user.'});
        } else {
            return res.json({ errorMessage: 'Failed to demote user.'});
        }
    } else {
        return res.json({ errorMessage: 'You are not authorized to access this page.' });
    } 
}

exports.Login = async function (req, res) {
    let reqInfo = RequestService.reqHelper(req);
    let errorMessage = req.query.errorMessage;

    res.render('User/Login', {
        user: {}, errorMessage: errorMessage,
        reqInfo: reqInfo
    });
}

exports.LoginUser = async function (req, res, next) {
    let roles = await _userRepo.getRolesByUsername(req.body.username);
    sessionData = req.session;
    sessionData.roles = roles;

    passport.authenticate('local', {
        successRedirect: '/User/SecureArea',
        failureRedirect: '/User/Login?errorMessage=Invalid login.',
    })(req, res, next);
};

exports.Logout = (req, res) => {
    req.logout();
    let reqInfo = RequestService.reqHelper(req);

    res.render('User/Login', {
        user: {}, isLoggedIn: false, errorMessage: "",
        reqInfo: reqInfo
    });
};



// This displays a view called 'securearea' but only 
// if user is authenticated.
exports.SecureArea = async function (req, res) {
    let reqInfo = RequestService.reqHelper(req);

    if (reqInfo.authenticated) {
        res.render('User/SecureArea', { errorMessage: "", reqInfo: reqInfo })
    }
    else {
        res.redirect('/User/Login?errorMessage=You ' +
            'must be logged in to view this page.')
    }
}

// This displays a view called 'securearea' but only 
// if user is authenticated.
exports.ManagerArea = async function (req, res) {
    let reqInfo = RequestService.reqHelper(req, ['Admin', 'Manager']);

    if (reqInfo.rolePermitted) {
        res.render('User/ManagerArea', { errorMessage: "", reqInfo: reqInfo })
    }
    else {
        res.redirect('/User/Login?errorMessage=You ' +
            'must be logged in with proper permissions to view this page.')
    }
}

// This function returns data to authenticated users only.
exports.SecureAreaJwt = async function (req, res) {
    let reqInfo = await RequestService.jwtReqHelper(req);

    if (reqInfo.authenticated) {
        res.json({
            errorMessage: "", reqInfo: reqInfo,
            secureData: "Congratulations! You are authenticated and you have "
                + "successfully accessed this message."
        })
    }
    else {
        res.json({
            errorMessage: '/User/Login?errorMessage=You ' +
                'must be logged in to view this page.'
        })
    }
}

// This function returns data to logged in managers only.
exports.ManagerAreaJwt = async function (req, res) {
    let reqInfo = await RequestService.jwtReqHelper(req, ['Admin', 'Manager']);

    if (reqInfo.rolePermitted) {
        res.json({ errorMessage: "", reqInfo: reqInfo })
    }
    else {
        res.json({
            errorMessage: 'You must be logged in with proper ' +
                'permissions to view this page.'
        });
    }
}

// This function receives a post from logged in users only.
exports.PostAreaJwt = async function (req, res) {
    let reqInfo = await RequestService.jwtReqHelper(req, []);
    console.log(req.body.obj.msgFromClient);
    res.json({
        errorMessage: "", reqInfo: reqInfo,
        msgFromServer: "Hi from server"
    })
};
