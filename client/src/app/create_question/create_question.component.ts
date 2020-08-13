import { Component, Output, EventEmitter, Input  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../ApiService';
import { Router } from '@angular/router'

@Component({
    selector: 'CreateQuestionComponent',
    templateUrl: './create_question.html',
    styleUrls: ['./create_question.css']
})
export class CreateQuestionComponent {
    @Output() questionCreated = new EventEmitter<any>();
    @Input() _course;
    _apiService;
    _title;
    _contents;
    _msg;
    showForm;

    constructor(private http: HttpClient, private router: Router) {
        this._apiService = new ApiService(http, this);
        this.getCourses();
    }

    getCourses() {
        this._apiService.getData('Course', this.setData);
    }

    setData(result, _this) {
        _this._coursesArray = result.courses;
    }

    clearMsg() {
        setTimeout(() => {
            this._msg = ''
        }, 1500)
    }

    createQuestion() {
        if (!this._title) {
            this._msg = 'Please enter a title.'
            this.clearMsg();
        } else if (!this._contents) {
            this._msg = 'Contents cannot be blank.'
            this.clearMsg();
        }

        if (this._title && this._contents) {
            let data = {
                title: this._title.trim(),
                contents: this._contents.trim(),
                courseID: this._course.id
            }
            this._apiService.postData('Question/CreateQuestion', data, this.dataCallback);
        }
    }

    dataCallback(result, _this) {
        if (result.question) {
            _this.clearCreateQuestionForm();
            _this.questionCreated.emit(result.question);
            _this.showForm = false;
        } else if (result.errorMessage) {
            try {
                let jsonResult = JSON.parse(result.errorMessage);
                if (jsonResult.status === 401) {
                    _this.router.navigate(['/login']);
                }
            } catch (err) {
                _this._msg = result.errorMessage;
                setTimeout(() => {
                    _this._msg = ''
                }, 2000);
            }
        } 
    }

    clearCreateQuestionForm() {
        this._title = '';
        this._contents = '';
    }

    checkIfLoggedIn() {
        if (!sessionStorage.getItem('auth_token')) {
            this.router.navigate(['/login']);
        }
    }
}