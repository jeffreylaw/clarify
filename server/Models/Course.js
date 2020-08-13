const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    instructor: {
        type: String,
        required: true
    },
    semester: {
        type: String,
        required: true
    },
},
    {
        versionKey: false, collection: 'courses'
    }
);

courseSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
    }
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;