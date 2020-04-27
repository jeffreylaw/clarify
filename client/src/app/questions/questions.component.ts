import { Component  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../ApiService';
import { Router } from '@angular/router'

@Component({
    templateUrl:'./questions.html',
    styleUrls: ['./questions.css']
})
export class QuestionsComponent {
    _questionsArray;
    _apiService;
    authorized = false;
    showForm = false;
    reply;

    constructor(private http: HttpClient, private router: Router) {
        this._apiService = new ApiService(http, this);
        this.getQuestions();
    }

    getQuestions() {
        this._apiService.getData('Question/Index', this.setData);
    }

    setData(result, _this) {
        _this._questionsArray = result.questions;
    }

    updateContent() {
        if (sessionStorage.getItem('auth_token')) {
            this.authorized = true;
        } else {
            this.authorized = false;
        }

    }

    toggleForm() {
        this.showForm = !this.showForm;
    }

    deleteReply(data) {
        this._apiService.postData('Question/DeleteReply', data, this.setData);
    }

    deleteQuestion(id) {
        
    }
}