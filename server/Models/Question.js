var mongoose = require('mongoose')
const Reply = require('../Models/Reply')

var questionSchema = mongoose.Schema({
    title: {"type": "String", required: true},
    contents: {"type": "String", required: true},
    topic: {"type": "String", required: true},
    date: {"type": Date, required: true},
    replies: [Reply.schema],
    },
    {
        versionKey: false, collection: "questions"
    }
);
var Question = mongoose.model('Question', questionSchema);
module.exports = Question;