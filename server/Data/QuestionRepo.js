const Question = require('../Models/Question');
const User = require('../Models/User');
const Reply = require('../Models/Reply')

class QuestionRepo {

    QuestionRepo() {}

    async allQuestions() {
        let questions = await Question.find().exec();
        return questions;
    }

    async create(questionObj) {
        try {
            var error = await questionObj.validateSync();
            if (error) {
                let response = {
                    obj: questionObj,
                    errorMessage: error.message
                };
                return response;
            }
            const result = await questionObj.save();
            let response = {
                obj: result,
                errorMessage: ""
            };
            return response;
        } catch (error) {
            let response = {
                obj: questionObj,
                errorMessage: error.message
            };
            return response;
        }
    }

    async delete(id) {
        let deletedItem = await Question.find({_id: id}).remove().exec();
        return deletedItem;
    }

    async getQuestionById(id) {
        let question = await Question.find({_id: id}).exec();
        return question;
    }

    async reply(reqObj) {
        // var question = Question.findOne({_id: questionID});

        let updated = await Question.updateOne(
            { _id: reqObj.questionID },
            { $push: { replies: {username: reqObj.username, contents: reqObj.contents }}}
        )
        console.log(updated)
        if (updated.nModified !=0) {
            return {msg: ""}
        } else {
            return {msg: "Error occurred."}
        }
    }

    async deleteReply(reqObj) {
        let updated = await Question.updateOne(
            { _id: reqObj.questionID },
            { $pull: { replies: { _id: reqObj.replyID }}}
        )
        let questions = await Question.find().exec();
        return questions;
    }
}
module.exports = QuestionRepo;