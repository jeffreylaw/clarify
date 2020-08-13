const Course = require('../Models/Course');


class CourseRepo {

    CourseRepo() { }

    async allCourses() {
        let courses = await Course.find().exec();
        return courses;
    }

    async create(courseObj) {
        try {
            var error = await courseObj.validateSync();
            if (error) {
                let response = {
                    obj: courseObj,
                    errorMessage: error.message
                };
                return response;
            }
            const result = await courseObj.save();
            let response = {
                obj: result,
                errorMessage: ''
            };
            return response;
        } catch (error) {
            let response = {
                obj: courseObj,
                errorMessage: error.message
            };
            return response;
        }
    }

    async delete(id) {
        let deletedItem = await Course.deleteOne({ _id: id }).exec();
        return deletedItem;
    }

    async getCourseByID(id) {
        let course = await Course.findOne({ _id: id}).exec();
        return course;
    }
}

module.exports = CourseRepo;