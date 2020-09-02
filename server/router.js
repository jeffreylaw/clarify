const UserController   = require('./Controllers/UserController');
const QuestionController = require('./Controllers/QuestionController');
const CourseController = require('./Controllers/CourseController');
const authMiddleware = require('./authHelper')
const cors           = require('cors');


// Routes
module.exports = function(app){  
    app.get('/api/User/Login', UserController.Login);
    app.post('/api/User/LoginUser', UserController.LoginUser);
    app.get('/api/User/Logout', UserController.Logout);
    
    // Sign in
    app.post(
        '/api/auth', cors(),
        // middleware that handles the sign in process
        authMiddleware.signIn,
        authMiddleware.signJWTForUser
    )
    app.post('/api/User/RegisterUser', UserController.RegisterUser);
    app.post('/api/User/Promote', UserController.Promote);
    
    app.get('/api/Course', cors(), CourseController.Index);
    app.get('/api/Course/:id', cors(), CourseController.Details);
    app.get('/api/Course/Questions/:id', cors(), QuestionController.QuestionsByCourse);
    app.post('/api/Course/CreateCourse', cors(), authMiddleware.requireJWT, CourseController.CreateCourse);
    app.post('/api/Course/DeleteCourse', cors(), authMiddleware.requireJWT, CourseController.DeleteCourse);

    app.get('/api/Question/:id', cors(), QuestionController.Details);
    app.post('/api/Question/CreateQuestion', cors(), authMiddleware.requireJWT, QuestionController.CreateQuestion);
    app.put('/api/Question/UpdateQuestion', cors(), authMiddleware.requireJWT, QuestionController.UpdateQuestion);
    app.post('/api/Question/DeleteQuestion', cors(), authMiddleware.requireJWT, QuestionController.DeleteQuestion);
    app.post('/api/Question/Reply', cors(), authMiddleware.requireJWT, QuestionController.Reply);
    app.post('/api/Question/DeleteReply', cors(), authMiddleware.requireJWT, QuestionController.DeleteReply)

    app.get('/api/Users', cors(), authMiddleware.requireJWT, UserController.AllUsers);
    app.post('/api/Users/Promote', cors(), authMiddleware.requireJWT, UserController.Promote);
    app.post('/api/Users/Demote', cors(), authMiddleware.requireJWT, UserController.Demote);
};
