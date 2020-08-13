const HomeController   = require('./Controllers/HomeController');
const UserController   = require('./Controllers/UserController');
const QuestionController = require('./Controllers/QuestionController');
const CourseController = require('./Controllers/CourseController');
const authMiddleware = require('./authHelper')
const cors           = require('cors');


// Routes
module.exports = function(app){  
    // Routes for backend
    app.get('/',      HomeController.Index);
    app.get('/User/Register', UserController.Register);
    app.get('/User/Login', UserController.Login);
    app.post('/User/LoginUser', UserController.LoginUser);
    app.get('/User/Logout', UserController.Logout);
    
    // Routes for frontend 

    // Sign in
    app.post(
        '/auth', cors(),
        // middleware that handles the sign in process
        authMiddleware.signIn,
        authMiddleware.signJWTForUser
    )
    app.post('/User/RegisterUser', UserController.RegisterUser);
    app.post('/User/Promote', UserController.Promote);
    
    app.get('/Course', cors(), CourseController.Index);
    app.get('/Course/:id', cors(), CourseController.Details);
    app.get('/Course/Questions/:id', cors(), QuestionController.QuestionsByCourse);
    app.post('/Course/CreateCourse', cors(), authMiddleware.requireJWT, CourseController.CreateCourse);
    app.post('/Course/DeleteCourse', cors(), authMiddleware.requireJWT, CourseController.DeleteCourse);

    app.get('/Question/:id', cors(), QuestionController.Details);
    app.post('/Question/CreateQuestion', cors(), authMiddleware.requireJWT, QuestionController.CreateQuestion);
    app.put('/Question/UpdateQuestion', cors(), authMiddleware.requireJWT, QuestionController.UpdateQuestion);
    app.post('/Question/DeleteQuestion', cors(), authMiddleware.requireJWT, QuestionController.DeleteQuestion);
    app.post('/Question/Reply', cors(), authMiddleware.requireJWT, QuestionController.Reply);
    app.post('/Question/DeleteReply', cors(), authMiddleware.requireJWT, QuestionController.DeleteReply)

    app.get('/Users', cors(), authMiddleware.requireJWT, UserController.AllUsers);
    app.post('/Users/Promote', cors(), authMiddleware.requireJWT, UserController.Promote);
    app.post('/Users/Demote', cors(), authMiddleware.requireJWT, UserController.Demote);
};
