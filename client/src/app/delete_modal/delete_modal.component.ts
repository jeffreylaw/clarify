import { Component, Input } from '@angular/core';
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
        console.log(result);
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
        console.log(result);
        _this.activeModal.dismiss('Cross click')
        if (result.errorMessage === '') {
            _this.router.navigate(['/']);
        }
    }
}