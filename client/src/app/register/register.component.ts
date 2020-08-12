import { Component  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../ApiService';
import { Router } from '@angular/router';
import { AuthService } from '../AuthService';

const BASE_URL = "http://localhost:1337/";

@Component({
    templateUrl: './register.html',
    styleUrls: ['./register.css']
})
export class RegisterComponent {
    _apiService:ApiService;
    _http: HttpClient;
    _username: String;
    _password: String;
    _firstName: String;
    _lastName: String;
    _passwordConfirm: String;
    _msg;


    constructor(private http: HttpClient, private router: Router, private auth:AuthService) {
        this._http = http;
        this._apiService = new ApiService(http, this);
    }

    createUser() {
        if (!this._username || !this._firstName || !this._lastName || !this._password || !this._passwordConfirm) {
            this._msg = 'Please fill out the form.';
            setTimeout(() => {
                this._msg = '';
            }, 2000);
            return;
        }

        let data = {
            username: this._username.trim(),
            firstName: this._firstName.trim(),
            lastName: this._lastName.trim(),
            password: this._password.trim(),
            passwordConfirm: this._passwordConfirm.trim(),
        }

        this._apiService.postData('User/RegisterUser', data, this.callback);
    }    

    callback(result, _this) {
        console.log(result)
        if (result.errorMessage === '') {
            _this.login();
        } else {
            _this._msg = result['errorMessage'];
            setTimeout(() => {
                _this._msg = '';
            }, 2000);
        }
    }

    login() {
        let url = BASE_URL + 'auth';

        this.http.post(url, {
            username: this._username,
            password: this._password,
        }).subscribe((data) => {
            console.log(data);
            if (data['token'] != null) {
                sessionStorage.setItem('auth_token', data['token']);
            }
            if (data['user'] != null) {
                sessionStorage.setItem('username', JSON.stringify(data["user"].username))
                sessionStorage.setItem('roles', JSON.stringify(data['user'].roles))
            }
            this.auth.isLoggedIn = true;
            this.router.navigate(['/']);
        },
        error => {
            this._msg = "Could not log in. Please try again.";
            setTimeout(() => {
                this._msg = '';
            }, 1500);
        });
    }
}