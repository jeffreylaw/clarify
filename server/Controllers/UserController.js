const User           = require('../Models/User');
var   passport       = require('passport');
const RequestService = require('../Services/RequestService');
const UserRepo       = require('../Data/UserRepo');
const _userRepo      = new UserRepo();

// Displays registration form.
exports.Register = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    res.render('User/Register', {errorMessage:"", user:{}, reqInfo:reqInfo})
};

// Handles 'POST' with registration form submission.
exports.RegisterUser  = async function(req, res){

    var username = req.body.obj.username;
    var firstName = req.body.obj.firstName;
    var password        = req.body.obj.password;
    var passwordConfirm = req.body.obj.passwordConfirm;

    if (password == passwordConfirm) {

        var newUser = new User({
            firstName:    firstName,
            username:     username,
        });
       
        // Uses passport to register the user.
        // Pass in user object without password
        // and password as next parameter.
        User.register(new User(newUser), password,
                function(err, account) {
                    // Show registration form with errors if fail.
                    if (err) {
                        res.json({msg:'You could not be registered. Please try again'})
                        let reqInfo = RequestService.reqHelper(req);
                        return res.render('User/Register',
                        { user : newUser, errorMessage: err,
                          reqInfo:reqInfo });
                    }
                    res.json({msg:'You are registered. Please login'})
                    // User registered so authenticate and redirect to secure 
                    // area.
                    // passport.authenticate('local') (req, res,
                    //         function () { res.redirect('/User/SecureArea'); });
                });

    } else {
        // res.json({msg:'Passwords do not match."'})
      res.render('User/Register', { user:newUser,
              errorMessage: "Passwords do not match.",
              reqInfo:reqInfo})
    }
};

// Shows login form.
exports.Login = async function(req, res) {
    let reqInfo      = RequestService.reqHelper(req);
    let errorMessage = req.query.errorMessage; 

    res.render('User/Login', { user:{}, errorMessage:errorMessage, 
                               reqInfo:reqInfo});
}

exports.LoginUser = async function(req, res, next) {
    let roles = await _userRepo.getRolesByUsername(req.body.username);
    sessionData = req.session;
    sessionData.roles  = roles;
  
    passport.authenticate('local', {
        successRedirect : '/User/SecureArea', 
        failureRedirect : '/User/Login?errorMessage=Invalid login.', 
    }) (req, res, next);
  };
  

// Log user out and direct them to the login screen.
exports.Logout = (req, res) => {
    req.logout();
    let reqInfo = RequestService.reqHelper(req);

    res.render('User/Login', { user:{}, isLoggedIn:false, errorMessage : "", 
                               reqInfo:reqInfo});
};


// This displays a view called 'securearea' but only 
// if user is authenticated.
exports.SecureArea  = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);

    if(reqInfo.authenticated) {
        res.render('User/SecureArea', {errorMessage:"", reqInfo:reqInfo})
    }
    else {
        res.redirect('/User/Login?errorMessage=You ' + 
                     'must be logged in to view this page.')
    }
}

// This displays a view called 'securearea' but only 
// if user is authenticated.
exports.ManagerArea  = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req, ['Admin', 'Manager']);

    if(reqInfo.rolePermitted) {
        res.render('User/ManagerArea', {errorMessage:"", reqInfo:reqInfo})
    }
    else {
        res.redirect('/User/Login?errorMessage=You ' + 
                     'must be logged in with proper permissions to view this page.')
    }
}

// This function returns data to authenticated users only.
exports.SecureAreaJwt  = async function(req, res) {
    let reqInfo = await RequestService.jwtReqHelper(req);

    if(reqInfo.authenticated) {
        res.json({errorMessage:"", reqInfo:reqInfo,
            secureData: "Congratulations! You are authenticated and you have "
                +  "successfully accessed this message."})
    }
    else {
        res.json( {errorMessage:'/User/Login?errorMessage=You ' +
                'must be logged in to view this page.'})
    }
}

// This function returns data to logged in managers only.
exports.ManagerAreaJwt  = async function(req, res) {
    let reqInfo = await RequestService.jwtReqHelper(req, ['Admin', 'Manager']);

    if(reqInfo.rolePermitted) {
        res.json({errorMessage:"", reqInfo:reqInfo})
    }
    else {
        res.json({errorMessage:'You must be logged in with proper ' +
                'permissions to view this page.'});
    }
}

// This function receives a post from logged in users only.
exports.PostAreaJwt = async function(req, res) {
    let reqInfo = await RequestService.jwtReqHelper(req, []);
    console.log(req.body.obj.msgFromClient);
    res.json({errorMessage:"", reqInfo:reqInfo,
        msgFromServer:"Hi from server"})
};
