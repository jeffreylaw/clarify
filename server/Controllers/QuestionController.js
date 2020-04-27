const QuestionRepo = require('../Data/QuestionRepo');
const _questionRepo = new QuestionRepo();
const Question = require('../Models/Question');
const RequestService = require('../Services/RequestService');

exports.Index = async function(req, res) {
    let questions = await _questionRepo.allQuestions();
    if (questions != null) {
        res.json({questions:questions})
    }
}

exports.CreateQuestion = async function(req, res) {
    var title = req.body.obj.title;
    var contents = req.body.obj.contents;
    var topic = req.body.obj.topic;
    var date = new Date();
    let tempQuestionObj = new Question({
        "title": title,
        "contents": contents,
        "topic": topic,
        "date": date,
    });
    let responseObj = await _questionRepo.create(tempQuestionObj);
    console.log(responseObj);
    if (responseObj.errorMessage == "") {
        res.json({question:responseObj.obj, errorMessage:""})
    } else {
        res.json({question:responseObj.obj, errorMessage: responseObj.errorMessage});
    }
}

exports.DeleteQuestion = async function(req, res) {
    // let reqInfo = await RequestService.jwtReqHelper(req, ['Admin']);
    // if (reqInfo.rolePermitted) {
    let questionID = req.body.obj.questionID;
    await _questionRepo.delete(questionID);
    let questions = await _questionRepo.allQuestions();

    console.log('Deleted Question')
    res.json({questions: questions})
}

exports.Details = async function(req, res) {
    let questionID = req.params.id;
    if (questionID) {
        let question = await _questionRepo.getQuestionById(questionID)
        res.json({question:question})
    }
}

exports.Reply = async function(req, res) {
    let questionID = req.body.obj.questionID;
    let username = req.body.obj.username;
    let contents = req.body.obj.contents;
    let resObj = await _questionRepo.reply({questionID:questionID, username: username, contents: contents});
    res.json(resObj)
}

exports.DeleteReply = async function(req, res) {
    let questionID = req.body.obj.questionID;
    let replyID = req.body.obj.replyID;
    let resObj = await _questionRepo.deleteReply({questionID: questionID, replyID: replyID})
    res.json({questions: resObj})
}