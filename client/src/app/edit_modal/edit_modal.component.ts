import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../ApiService';
import { Router } from '@angular/router';


@Component({
    templateUrl: './edit_modal.html',
    styleUrls: ['./edit_modal.css']
})
export class EditModal {
    _apiService;
    @Output() emitData = new EventEmitter();
    @Input() questionID;
    _contents;

    constructor(public activeModal: NgbActiveModal, private http: HttpClient, private router: Router) {
        this._apiService = new ApiService(http, this);
    }

    updateQuestion(id) {
        if (this._contents) {
            let data = {
                questionID: id,
                contents: this._contents
            }
            this._apiService.putData('Question/UpdateQuestion', data, this.updateQuestionCallback);
        }
    }

    updateQuestionCallback(result, _this) {
        console.log(result)
        if (result.errorMessage === '') {
            _this.emitData.next({question: result.question});
            _this.activeModal.close()
        } else if (result.errorMessage === 'An error occured during the update. The item did not save.') {
            _this.activeModal.close()
        }
    }
}