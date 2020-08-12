const Question = require('../Models/Question');
const Course = require('../Models/Course');
const User = require('../Models/User');
const Reply = require('../Models/Reply');


class QuestionRepo {

    QuestionRepo() { }

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
                errorMessage: ''
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

    async update(editedObj) {
        let response = {
            obj: editedObj,
            errorMessage: ""
        };
        try {
            var error = await editedObj.validateSync(['contents']);
            if (error) {
                response.errorMessage = error.message;
                return response;
            }
            let question = await this.getQuestionByID(editedObj.id);
            if (question) {
                let updated = await Question.updateOne(
                    { _id: editedObj.id }, // Match id.
                    { $set: { contents: editedObj.contents } });

                if (updated.nModified != 0) {
                    response.obj = editedObj;
                    return response;
                }
                else {
                    response.errorMessage =
                        "An error occurred during the update. The item did not save."
                };
                return response;
            }
            else {
                response.errorMessage = "An question with this id cannot be found."
            };
            return response;
        }
        catch (err) {
            response.errorMessage = err.message;
            return response;
        }
    }

    async delete(id) {
        let response = await Question.deleteOne({ _id: id }).exec();
        return response;
    }

    async deleteQuestionsByCourseID(id) {
        let course = await Course.findOne({ _id: id }).exec();
        let questions = await Question.find({ course: course }).exec();
        questions.forEach(question => {
            question.replies.forEach(async reply => {
                await Reply.deleteOne({ _id: reply.id }).exec();
            })
        })
        await Question.deleteMany({ course: course }).exec();
    }


    async getQuestionByID(id) {
        let question = await Question.findOne({ _id: id }).exec();
        return question;
    }

    async getQuestionsByCourseID(id) {
        let course = await Course.findOne({ _id: id }).exec();
        let questions = await Question.find({ course: course }).exec();
        return questions;
    }

    async addReplyToQuestion(reqObj) {
        let reply = await Reply.findOne({ _id: reqObj.replyID }).exec();
        let updated = await Question.updateOne(
            { _id: reqObj.questionID },
            { $push: { replies: reply } }
        ).exec();

        if (updated.nModified != 0) {
            return { obj: reply, errorMessage: '' };
        } else {
            return { obj: {}, errorMessage: 'Could not save reply.' };
        }
    }

    async deleteReply(reqObj) {
        let response = await Question.updateOne(
            { _id: reqObj.questionID },
            { $pull: { replies: { _id: reqObj.replyID } } }
        ).exec();
        console.log(response);
        return response;
    }
}

module.exports = QuestionRepo;