const RequestService = require('../Services/RequestService');
const CourseRepo = require('../Data/CourseRepo');
const _courseRepo = new CourseRepo();
const Course = require('../Models/Course');
const QuestionRepo = require('../Data/QuestionRepo');
const _questionRepo = new QuestionRepo();
const ReplyRepo = require('../Data/ReplyRepo');
const _replyRepo = new ReplyRepo();

exports.Index = async function (req, res) {
    let courses = await _courseRepo.allCourses();
    if (courses) {
        res.json({ courses: courses });
    } else {
        res.json({ courses: [] });
    }
}

exports.Details = async function (req, res) {
    let courseID = req.params.id;
    let course = await _courseRepo.getCourseByID(courseID);
    if (course) {
        res.json({ course: course });
    } else {
        res.json({ course: {} });
    }
}

exports.CreateCourse = async function (req, res) {
    let reqInfo = await RequestService.jwtReqHelper(req, ['instructor', 'admin']);
    if (reqInfo.rolePermitted) {
        let code = req.body.obj.code;
        let name = req.body.obj.name;
        let instructor = req.body.obj.instructor;
        let crn = req.body.obj.crn;
    
        let tempCourseObj = new Course( {
            'code': code,
            'name': name,
            'instructor': instructor,
            'crn': crn,
        });
        let responseObj = await _courseRepo.create(tempCourseObj);
        if (responseObj.errorMessage === '') {
            res.json({ question: responseObj.obj, errorMessage: '' })
        } else {
            res.json({ errorMessage: responseObj.errorMessage });
        }
    } else {
        res.json({ errorMessage: 'You are not authorized to create a course.' })
    }
}

exports.DeleteCourse = async function (req, res) {
    let reqInfo = await RequestService.jwtReqHelper(req, ['instructor', 'admin']);
    if (reqInfo.rolePermitted) {
        let courseID = req.body.obj.courseID;
        await _questionRepo.deleteQuestionsByCourseID(courseID);
        let response = await _courseRepo.delete(courseID);
        if (response && response.deletedCount === 1) {
            res.json({ errorMessage: '' })
        } else {
            res.json({ errorMessage: 'Failed to delete course.' })
        }
    } else {
        res.json({ errorMessage: 'You are not authorized to delete a course.' })
    }
}