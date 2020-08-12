const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


const userSchema = mongoose.Schema({
    username: {
        type: String,
        index: true, // Index ensures property is unique in db.
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    roles: {
        type: Array
    }
},
    {
        versionKey: false, collection: 'users'
    }
);

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
    }
});

userSchema.plugin(passportLocalMongoose);
const User = module.exports = mongoose.model('User', userSchema);
module.exports = User;
