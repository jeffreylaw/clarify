import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouteEventsService } from '../route-events.service';
import { AuthService } from '../AuthService';
const BASE_URL = 'http://localhost:1337/';

@Component({
    templateUrl: './login.html',
    styleUrls: ['./login.css']
})
export class LoginComponent {
    _username: String;
    _password: String;
    _msg;

    constructor(private http: HttpClient, private router: Router, private routeEventsService: RouteEventsService, private auth:AuthService) {
    }


    login() {
        if (!this._username || !this._password) {
            this._msg = 'Enter a username and password.'
            this.clearMsg();
            return;
        }
        let url = BASE_URL + 'auth';
        this.http.post(url, {
            username: this._username.trim(),
            password: this._password.trim(),
        }).subscribe((data) => {
            if (data['token'] != null) {
                sessionStorage.setItem('auth_token', data['token']);
            }
            if (data['user'] != null) {
                sessionStorage.setItem('username', JSON.stringify(data['user'].username))
                sessionStorage.setItem('roles', JSON.stringify(data['user'].roles))
            }
            let replyRoute = /^\/courses\/question\/\w*/
            let questionRoute = /^\/courses\/w*/
            if (replyRoute.test(this.routeEventsService.previousRoutePath.value)) {
                this.auth.isLoggedIn = true;
                this.router.navigate([this.routeEventsService.previousRoutePath.value]);
            } else if (questionRoute.test(this.routeEventsService.previousRoutePath.value)) {
                this.auth.isLoggedIn = true;
                this.router.navigate([this.routeEventsService.previousRoutePath.value]);
            } else {
                this.auth.isLoggedIn = true;
                this.router.navigate(['/']);
            }
        },
        error => {
            this._msg = 'Could not login, please try again.'
            this.clearMsg();
        });
    }

    clearMsg() {
        setTimeout(() => {
            this._msg = '';
        }, 2000);
    }
}