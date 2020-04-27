var mongoose = require('mongoose')

var replySchema = mongoose.Schema({
    username: {"type": "String", required: true},
    contents: {"type": "String", required: true},
    },
    {
        versionKey: false,
    }
);
var Reply = mongoose.model('Reply', replySchema);
module.exports = Reply;