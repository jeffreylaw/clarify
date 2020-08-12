const mongoose = require('mongoose');
const User = require('../Models/User');
const Question = require('../Models/Question');


const replySchema = mongoose.Schema({
    user: User.schema,
    contents: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
},
    {
        versionKey: false, collection: 'replies'
    }
);

replySchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
    }
})

const Reply = mongoose.model('Reply', replySchema);
module.exports = Reply;