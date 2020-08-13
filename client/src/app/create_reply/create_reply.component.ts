import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../ApiService';
import { Router, ActivatedRoute } from '@angular/router'

@Component({
    selector: 'CreateReplyComponent',
    templateUrl: './create_reply.html',
    styleUrls: ['./create_reply.css']
})
export class CreateReplyComponent {
    @Output() replyCreated = new EventEmitter<any>();
    @Input()
    _questionID: String;
    _showCoverMessage; 
    _coverMessage
    _apiService;
    _contents;
    _msg;

    constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
        this._apiService = new ApiService(http, this);
        this._showCoverMessage = false;
    }

    submitReply() {
        if (!this._contents) {
            this._showCoverMessage = true;
            this._coverMessage = 'Reply cannot be empty.'
            setTimeout(() => {
                this._coverMessage = '';
                this._showCoverMessage = false;
            }, 2000);
        } else {
            let data = {
                questionID: this._questionID, 
                username: JSON.parse(sessionStorage.getItem('username')), 
                contents: this._contents.trim(),
            }
            this._apiService.postData('Question/Reply', data, this.postCallback);
        }
    }

    postCallback(result, _this) {
        if (result.reply) {
            _this.clearReplyForm();
            _this.replyCreated.emit(result.reply);

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

    clearReplyForm() {
        this._contents = '';
    }
}