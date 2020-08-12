const RequestService = require('../Services/RequestService');
const QuestionRepo = require('../Data/QuestionRepo');
const _questionRepo = new QuestionRepo();
const ReplyRepo = require('../Data/ReplyRepo');
const _replyRepo = new ReplyRepo();
const UserRepo = require('../Data/UserRepo');
const _userRepo = new UserRepo();
const Question = require('../Models/Question');
const Course = require('../Models/Course');
const Reply = require('../Models/Reply');
const User = require('../Models/User');


/* Question by id */
exports.Details = async function (req, res) {
    let questionID = req.params.id;
    let question = await _questionRepo.getQuestionByID(questionID);
    if (question) {
        res.json({ question: question });
    } else {
        res.json({ question: {} });
    }
}

/* Questions by course id */
exports.QuestionsByCourse = async function (req, res) {
    let courseID = req.params.id;
    let questions = await _questionRepo.getQuestionsByCourseID(courseID);
    if (questions) {
        res.json({ questions: questions });
    } else {
        res.json({ questions: [] });
    }
}


exports.UpdateQuestion = async function (req, res) {
    let questionID = req.body.obj.questionID;
    console.log(questionID)
    console.log(req.body.obj.contents)
    let tempQuestionObj = new Question({
        _id: questionID,
        contents: req.body.obj.contents
    })
    let response = await _questionRepo.update(tempQuestionObj);
    if (response.errorMessage == "") {
        res.json({
            question: response.obj,
            errorMessage: ""
        });
    }
    else {
        res.json({
            question: response.obj,
            errorMessage: response.errorMessage
        });
    }
}

/* Create question */
exports.CreateQuestion = async function (req, res) {
    let reqInfo = await RequestService.jwtReqHelper(req, []);
    if (reqInfo.authenticated) {
        let courseID = req.body.obj.courseID;
        let course = await Course.findById(courseID);
        let user = await User.findOne({ username: reqInfo.username }).exec()

        let title = req.body.obj.title;
        let contents = req.body.obj.contents;

        let tempQuestionObj = new Question({
            'title': title,
            'contents': contents,
            'date': new Date(),
            'course': course,
            'user': user,
        });
        let responseObj = await _questionRepo.create(tempQuestionObj);
        console.log(responseObj);
        if (responseObj.errorMessage === '') {
            res.json({ question: responseObj.obj, errorMessage: '' })
        } else {
            res.json({ errorMessage: responseObj.errorMessage });
        }
    }
}

/* Reply to a question */
exports.Reply = async function (req, res) {
    let reqInfo = await RequestService.jwtReqHelper(req, []);
    if (reqInfo.authenticated) {
        let questionID = req.body.obj.questionID;
        let contents = req.body.obj.contents;
        let userRepoResponse = await _userRepo.getUserByUsername(reqInfo.username);
        let question = await _questionRepo.getQuestionByID(questionID);
        let tempReplyObj = new Reply({
            'user': userRepoResponse.user,
            'contents': contents,
            'date': new Date(),
            'question': question
        })
        let replyRepoResponse = await _replyRepo.create(tempReplyObj);
        let responseObj = await _questionRepo.addReplyToQuestion({ questionID: questionID, replyID: replyRepoResponse.obj._id });
        console.log(responseObj)
        if (responseObj.errorMessage === '') {
            res.json({ reply: responseObj.obj, errorMessage: '' })
        } else {
            res.json({ errorMessage: responseObj.errorMessage });
        }
    } else {
        res.json({ errorMessage: 'You are not logged in.' })
    }
}

/* Delete question */
exports.DeleteQuestion = async function (req, res) {
    let reqInfo = await RequestService.jwtReqHelper(req, ['instructor', 'admin']);
    if (reqInfo.authenticated) {
        let questionID = req.body.obj.questionID;
        if (reqInfo.roles.includes('admin') || reqInfo.roles.includes('instructor')) {
            await _replyRepo.deleteRepliesByQuestionID(questionID);
            let response = await _questionRepo.delete(questionID);
            console.log('response', response);
            return res.json({ errorMessage: '', response: response });
        }

        let question = await Question.findOne({ _id: questionID }).exec();
        if (question.user.username === reqInfo.username) {
            await _replyRepo.deleteRepliesByQuestionID(questionID);
            let response = await _questionRepo.delete(questionID);
            console.log('response', response);
            return res.json({ errorMessage: '', response: response });
        } else {
            return res.json({ errorMessage: 'You can only delete questions you authored.' });
        }
    } else {
        return res.json({ errorMessage: 'You are not logged in.' })
    }
}

/* Delete reply to question */
exports.DeleteReply = async function (req, res) {
    let reqInfo = await RequestService.jwtReqHelper(req, ['instructor', 'admin']);
    if (reqInfo.authenticated) {
        let questionID = req.body.obj.questionID;
        let replyID = req.body.obj.replyID;

        if (reqInfo.roles.includes('admin') || reqInfo.roles.includes('instructor')) {
            let response = await _questionRepo.deleteReply({ questionID: questionID, replyID: replyID })
            console.log('response', response);
            return res.json({ errorMessage: '', response: response });
        }

        let reply = await Reply.findOne({ _id: replyID }).exec();
        if (reply.user.username === reqInfo.username) {
            let response = await _questionRepo.deleteReply({ questionID: questionID, replyID: replyID })
            console.log('response', response);
            return res.json({ errorMessage: '', response: response });
        } else {
            return res.json({ errorMessage: 'You can only delete posts you authored.' });
        }
    } else {
        return res.json({ errorMessage: 'You are not logged in.' })
    }
}