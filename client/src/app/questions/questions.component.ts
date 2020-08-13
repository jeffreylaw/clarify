import { Component, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../ApiService';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DeleteModal } from '../delete_modal/delete_modal.component';
import { EditModal } from '../edit_modal/edit_modal.component';

@Component({
    templateUrl: './questions.html',
    styleUrls: ['./questions.css']
})
export class QuestionsComponent {
    _apiService;
    _questionsArray;
    _courseID;
    _msg;
    _course;
    _showCoverMessage;
    _coverMessage;
    _sessionUsername;
    _sessionRoles;
    _modalResult;

    public isCollapsed = false;


    constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private modalService: NgbModal) {
        this._apiService = new ApiService(http, this);
        this._showCoverMessage = false;
        this._sessionUsername = JSON.parse(sessionStorage.getItem('username'));
        this._sessionRoles = JSON.parse(sessionStorage.getItem('roles'));
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this._courseID = params['id'];
        });
        this.getCourse();
        this.getQuestions();
    }

    getCourse() {
        this._apiService.getData('Course/' + this._courseID, this.getCourseCallback);
    }

    getCourseCallback(result, _this) {
        _this._course = result.course;
    }

    getQuestions() {
        this._apiService.getData('Course/Questions/' + this._courseID, this.getQuestionsCallback);
    }

    getQuestionsCallback(result, _this) {
        _this._questionsArray = result.questions;
        _this._questionsArray.sort((a, b) => {
            return new Date(b.date).valueOf() - new Date(a.date).valueOf();
        });
    }

    appendQuestion(question: any) {
        this._questionsArray.unshift(question);
    }

    open(type, id) {
        const modalRef = this.modalService.open(DeleteModal);
        modalRef.componentInstance.type = type;
        if (type === 'course') {
            modalRef.componentInstance.courseID = id;
        } else if (type === 'question') {
            modalRef.componentInstance.questionID = id;
            modalRef.componentInstance.result.subscribe(($e) => {
                if ($e.deleted) {
                    this.getQuestions();
                }
            })
        }
    }

    openEdit(id) {
        const modalRef = this.modalService.open(EditModal, { size: 'xl' });
        modalRef.componentInstance.questionID = id;
        modalRef.componentInstance.emitData.subscribe(($e) => {
            this.getQuestions();
        })
    }
}