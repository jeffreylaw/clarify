import { Component  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../ApiService';
import { Router, ActivatedRoute } from '@angular/router'

@Component({
    templateUrl: './create_reply.html'
})
export class CreateReplyComponent {
    _apiService;
    _questionID;
    _title;
    _contents;
    _date;
    _replyContents;

    constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
        this._apiService = new ApiService(http, this);
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this._questionID = params['id'];
        })
        this.getQuestionById(this._questionID);
    }

    getQuestionById(id) {
        this._apiService.getData('Question/Details/' + this._questionID, this.setData);
    }

    setData(result, _this) {
        console.log(result);
        _this._title = result["question"][0].title;
        _this._contents = result["question"][0].contents;
        _this._date = result["question"][0].date;
    }

    submitReply() {
        if (this._replyContents) {
            let data = {questionID: this._questionID, username: JSON.parse(sessionStorage.getItem('username')), contents: this._replyContents}
            this._apiService.postData('Question/Reply/' + this._questionID, data, this.returnData);
        }
    }

    returnData(result, _this) {
        console.log(result);
        if (result["msg"] == "") {
            _this.router.navigate(['/']);
        } else {
            alert(result["msg"]);
        }
    }
}