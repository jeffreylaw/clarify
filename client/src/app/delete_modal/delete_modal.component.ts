import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../ApiService';
import { Router } from '@angular/router';


@Component({
    selector: 'delete-modal',
    templateUrl: './delete_modal.html',
})
export class DeleteModal {
    _apiService;
    @Input() type;
    @Input() courseID;
    @Input() questionID;
    @Output() result = new EventEmitter();

    constructor(public activeModal: NgbActiveModal, private http: HttpClient, private router: Router) {
        this._apiService = new ApiService(http, this);
    }

    deleteCourse(id) {
        let data = {
            courseID: id
        }
        this._apiService.postData('Course/DeleteCourse', data, this.deleteCourseCallback);
    }

    deleteCourseCallback(result, _this) {
        _this.activeModal.dismiss('Cross click')
        if (result.errorMessage === '') {
            _this.router.navigate(['/']);
        }
    }

    deleteQuestion(id) {
        let data = {
            questionID: id
        }
        this._apiService.postData('Question/DeleteQuestion', data, this.deleteQuestionCallback);
    }

    deleteQuestionCallback(result, _this) {
        _this.activeModal.dismiss('Cross click')
        if (result.errorMessage === '') {
            // _this.router.navigate(['/']);
            _this.result.next({deleted: true});
        }
        if (result.errorMessage === 'You can only delete questions you authored.') {
            _this._showCoverMessage = true;
            _this._coverMessage = result.errorMessage;
            setTimeout(() => {
                _this._showCoverMessage = false;
                _this._coverMessage = '';
            }, 2000);
        } else if (result.errorMessage) {
            _this._showCoverMessage = true;
            _this._coverMessage = result.errorMessage;
            setTimeout(() => {
                _this._showCoverMessage = false;
                _this._coverMessage = '';
            }, 2000);
        }
    }
}