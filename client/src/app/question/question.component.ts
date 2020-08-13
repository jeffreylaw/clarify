import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../ApiService';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    templateUrl:'./question.html',
    styleUrls: ['./question.css']
})
export class QuestionComponent {
    _apiService;
    _questionID;
    _question;
    _repliesArray;
    _msg;
    _sessionUsername;
    _sessionRoles;

    constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
        this._apiService = new ApiService(http, this);
        this._sessionUsername = JSON.parse(sessionStorage.getItem('username'));
        this._sessionRoles = JSON.parse(sessionStorage.getItem('roles'));
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this._questionID = params['id'];
            this.getQuestion(this._questionID);
        })
    }

    getQuestion(id) {
        this._apiService.getData('Question/' + id, this.dataCallback);
    }

    dataCallback(result, _this) {
        _this._question = result.question;
        _this._repliesArray = result.question.replies;
    }

    deleteReply(id) {
        let data = {
            questionID: this._questionID,
            replyID: id,
        }
        this._apiService.postData('Question/DeleteReply', data, this.deleteCallback);
    }

    deleteCallback(result, _this) {
        if (result.errorMessage === '') {
            if (result.response.nModified === 1) {
                _this.getQuestion(_this._questionID);
            }
        } else if (result.errorMessage) {
            try {
                let jsonResult = JSON.parse(result.errorMessage);
                if (jsonResult.status === 401) {
                    _this._msg = result.errorMessage;
                    _this.clearMsg();
                }
            } catch (err) {
                _this._msg = result.errorMessage;
                _this.clearMsg();
            }
        }
    }

    appendReply(reply: any) {
        this._repliesArray = this._repliesArray.concat(reply);
    }

    clearMsg() {
        setTimeout(() => {
            this._msg = ''
        }, 1500)
    }
}