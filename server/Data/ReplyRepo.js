const Question = require('../Models/Question');
const Reply = require('../Models/Reply');


class ReplyRepo {

    ReplyRepo() { }

    async create(replyObj) {
        try {
            var error = await replyObj.validateSync();
            if (error) {
                let response = {
                    obj: replyObj,
                    errorMessage: error.message
                };
                return response;
            }
            const result = await replyObj.save();
            let response = {
                obj: result,
                errorMessage: ''
            };
            return response;
        } catch (error) {
            let response = {
                obj: replyObj,
                errorMessage: error.message
            };
            return response;
        }
    }

    async deleteRepliesByQuestionID(id) {
        let question = await Question.findOne({ _id: id }).exec();
        question.replies.forEach( async reply => {
            await Reply.deleteOne({ _id: reply.id }).exec();
        })
    }

    async delete(id) {
        let response = await Reply.deleteOne({ _id: id }).exec();
        return response;
    }
}

module.exports = ReplyRepo;