import { Component  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
const BASE_URL = 'http://localhost:1337/';

@Component({
    templateUrl: './login.html'
})
export class LoginComponent {
    _username: String;
    _password: String;

    constructor(private http: HttpClient, private router: Router) {
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
            }
            this.router.navigate(['/']);
        },
        error => {
            alert(JSON.stringify("Could not log in. Please try again."))
        });
    }
}