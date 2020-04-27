import { Component  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../ApiService';
import { Router } from '@angular/router'
import * as $ from 'jquery';


@Component({
    templateUrl: './create_question.html'
})
export class CreateQuestionComponent {
    _apiService;
    _title;
    _question;
    selectedTopic;
    topics = [
        { name: "ACIT 2911 - Agile Development Project", value: "acit2911"},
        { name: "ACIT 4770 - Legal and Ethical Issues in IT", value: "acit4770"},
        { name: "ACIT 2811 - UX/UI Development", value: "acit2811"},
        { name: "Other", value: "other"}
    ]
   
    constructor(private http: HttpClient, private router: Router) {
        this._apiService = new ApiService(http, this);
        $('#alert').hide();
    }

    createQuestion() {
        if (this.selectedTopic == null) {
            // alert("Select a topic")
            $('#alert').show();

        } else {
            let data = {
                title: this._title,
                contents: this._question,
                topic: this.selectedTopic.value,
            }
            $('#alert').hide();
            console.log(this.selectedTopic.value)
            this._apiService.postData('Question/CreateQuestion', data, this.redirectCallback)
        }
    }

    redirectCallback(result, _this) {
        _this.router.navigate(['/']);
    }
}