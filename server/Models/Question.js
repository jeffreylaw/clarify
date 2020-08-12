const mongoose = require('mongoose');
const User = require('../Models/User');
const Course = require('../Models/Course');
const Reply = require('../Models/Reply');


const questionSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    contents: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    user: User.schema,
    course: Course.schema,
    replies: [Reply.schema]
},
    {
        versionKey: false, collection: 'questions'
    }
);

questionSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
    }
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;