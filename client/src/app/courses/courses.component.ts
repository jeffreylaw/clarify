import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../ApiService';
import { Router } from '@angular/router';

@Component({
    templateUrl:'./courses.html',
    styleUrls: ['./courses.css']
})
export class CoursesComponent {
    _apiService;
    _coursesArray;
    role = [];
    _sessionRoles;

    constructor(private http: HttpClient, private router: Router) {
        this._apiService = new ApiService(http, this);
        this.getCourses();
    }

    ngOnChanges() {
        console.log('test')
        this._sessionRoles = JSON.parse(sessionStorage.getItem('roles'));
    }


    getCourses() {
        this._apiService.getData('Course', this.setData);
    }

    setData(result, _this) {
        _this._coursesArray = result.courses;
    }
}