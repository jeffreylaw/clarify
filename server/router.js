var HomeController   = require('./Controllers/HomeController');
var UserController   = require('./Controllers/UserController');
var QuestionController = require('./Controllers/QuestionController');
const authMiddleware = require('./authHelper')
const cors           = require('cors');


// Routes
module.exports = function(app){  
    // Main Routes
    app.get('/',      HomeController.Index);

    app.get('/User/Register', UserController.Register);
    app.post('/User/RegisterUser', UserController.RegisterUser);
    app.get('/User/Login', UserController.Login);
    app.post('/User/LoginUser', UserController.LoginUser);
    app.get('/User/Logout', UserController.Logout);
    // app.get('/User/SecureArea', UserController.SecureArea);
    // app.get('/User/ManagerArea', UserController.ManagerArea);

    // Sign in
    app.post(
        '/auth', cors(),
        // middleware that handles the sign in process
        authMiddleware.signIn,
        authMiddleware.signJWTForUser
    )

    app.get('/Question/Index', cors(), QuestionController.Index);
    app.get('/Question/Details/:id', cors(), QuestionController.Details);
    app.post('/Question/Reply/:id', cors(), QuestionController.Reply);
    app.post('/Question/DeleteReply', cors(), QuestionController.DeleteReply)
    app.post('/Question/CreateQuestion', cors(), QuestionController.CreateQuestion);
    app.post('/Question/Delete', cors(), QuestionController.DeleteQuestion);

    // app.get('/User/SecureAreaJwt', cors(),
    //     authMiddleware.requireJWT, UserController.SecureAreaJwt)
    //
    // app.get('/User/ManagerAreaJwt', cors(),
    //     authMiddleware.requireJWT, UserController.ManagerAreaJwt)
    //
    // app.post('/User/PostAreaJwt', cors(),
    //     authMiddleware.requireJWT, UserController.PostAreaJwt)

};
