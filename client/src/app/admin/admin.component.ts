import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../ApiService';
import { Router } from '@angular/router';

@Component({
    templateUrl: './admin.html',
    styleUrls: ['./admin.css']
})
export class AdminComponent {
    _apiService;
    _code;
    _name;
    _instructor;
    _semester;
    _msg;
    _usersArray;
    _selectedUser;
    _selectedRole;
    _showErrorMessage;

    _roles = [
        { id: 'mod', name: 'Moderator' },
        { id: 'instructor', name: 'Instructor' },
        { id: 'demote', name: 'Demote to user' },
    ]

    constructor(private http: HttpClient, private router: Router) {
        this._apiService = new ApiService(http, this);
        this.getUsers();
        this._showErrorMessage = false;
    }

    getUsers() {
        this._apiService.getData('Users', this.getUsersCallback);
    }

    getUsersCallback(result, _this) {
        _this._usersArray = result.users;
    }

    createCourse() {
        let data = {
            code: this._code,
            name: this._name,
            instructor: this._instructor,
            semester: this._semester,
        }
        this._apiService.postData('Course/CreateCourse', data, this.postCallback);
    }

    postCallback(result, _this) {
        if (result.question) {
            _this.router.navigate(['/']);
        } else if (result.errorMessage) {
            try {
                let jsonResult = JSON.parse(result.errorMessage);
                if (jsonResult.status === 401) {
                    _this.router.navigate(['/']);
                }
            } catch (err) {
                _this._msg = result.errorMessage;
                _this._showErrorMessage = true;
                setTimeout(() => {
                    _this._msg = ''
                    _this._showErrorMessage = false;
                }, 2000);
            }

        }
    }

    updateUser() {
        const array = this._usersArray.filter(user => {
            return !user.roles.includes('admin');
        })
        if (array.length === 0) {
            return;
        }
        if (!this._selectedUser || !this._selectedRole) {
            this._msg = 'Select an user and the role to promote them to.';
            this._showErrorMessage = true;
            setTimeout(() => {
                this._msg = ''
                this._showErrorMessage = false;
            }, 2000);
            return
        }
        if (this._selectedRole === 'instructor' || this._selectedRole === 'mod') {
            let username = this._selectedUser.username;
            let role = this._selectedRole;
            let data = {
                username: username,
                role: role
            }
            this._apiService.postData('Users/Promote', data, this.updateUserCallback);
        } else if (this._selectedRole === 'demote') {
            if (this._selectedUser.roles.length === 0) {
                this._msg = 'This user has no roles.';
                this._showErrorMessage = true;
                setTimeout(() => {
                    this._msg = ''
                    this._showErrorMessage = false;
                }, 2000);
            } else {
                let username = this._selectedUser.username;
                let data = {
                    username: username
                }
                this._apiService.postData('Users/Demote', data, this.updateUserCallback);
            }
        }
    }

    updateUserCallback(result, _this) {
        if (result.response === "Successfully demoted user." || result.response === "Successfully promoted user.") {
            _this.getUsers();
            _this._selectedRole = null;
        } else {
            _this._msg = result.errorMessage;
            _this._showErrorMessage = true;
            setTimeout(() => {
                _this._msg = ''
                _this._showErrorMessage = false;
            }, 2000);
        }
    }
}