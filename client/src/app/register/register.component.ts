import { Component  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../ApiService';
import { Router } from '@angular/router';

const BASE_URL = "http://localhost:1337/";

@Component({
    templateUrl: './register.html'
})
export class RegisterComponent {
    _apiService:ApiService;
    _http: HttpClient;
    _username: String;
    _password: String;
    _passwordConfirm: String;
    _authorized: Boolean;
    _secretCode = '';
    _msg;

    constructor(private http: HttpClient, private router: Router) {
        this._http = http;
        this._apiService = new ApiService(http, this);
        this._authorized = false;
    }

    createUser() {
        let data = {
            username: this._username,
            password: this._password,
            passwordConfirm: this._passwordConfirm,
        }

        this._apiService.postData('User/RegisterUser', data, this.callback);
    }    

    callback(result, _this) {
        _this._msg = result['msg'];
    }

    checkAuthorization() {
        if (this._secretCode == 'LOL') {
            this._authorized = true;
        } else {
            alert("Hey, you're not an instructor! Go away")
        }
    }
}