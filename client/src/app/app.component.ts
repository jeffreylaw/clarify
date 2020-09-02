import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from './ApiService';
import { RouteEventsService } from './route-events.service';
import { AuthService } from '../app/AuthService';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css']
})
export class AppComponent {
    // Hard-code credentials for convenience.
    password = 'x';
    username = '';

    token = '';
    message = 'Not logged in.';
    secureData: string = '';
    managerData: string = '';
    reqInfo: any = {};
    msgFromServer: string = '';
    isLoggedIn;
    _apiService: ApiService;
    _username;
    _roles;
    openChat;
    chatReplies;
    chatReply;
    ws;

    // Since we are using a provider above we can receive 
    // an instance through an constructor.
    constructor(private http: HttpClient, private routeEventsService: RouteEventsService, private router: Router, private auth: AuthService) {
        // Pass in http module and pointer to AppComponent.
        this._apiService = new ApiService(http, this);
        this.updateContent();
        this.openChat = false;
        this.chatReplies = [];

        // Localhost development
        // this.ws = new WebSocket('ws://localhost:3000')
        let host = location.origin.replace(/^http/, 'ws')
        this.ws = new WebSocket(host)
        this.ws.onopen = () => {
            console.log('WS opened on browser')
            this.ws.send('User has entered the chatroom')
        }

        this.ws.onmessage = (message) => {
            try {
                const reply = JSON.parse(message.data)
                this.chatReplies = this.chatReplies.concat(reply)
            } catch (exception) {
                console.log(exception)
            }
        }
    }

    ngOnInit() {
        this.auth.getValue().subscribe((value) => {
            this.isLoggedIn = value;
            this.updateContent()
        })
    }

    //------------------------------------------------------------
    // Either shows content when logged in or clears contents.
    //------------------------------------------------------------
    updateContent() {
        // Logged in if token exists in browser cache.
        if (sessionStorage.getItem('auth_token') != null) {
            this.token = sessionStorage.getItem('auth_token');
            this._username = JSON.parse(sessionStorage.getItem('username'));
            this._roles = JSON.parse(sessionStorage.getItem('roles'));
            this.message = "The user has been logged in."
        }
        else {
            this.message = "Not logged in.";
            this._username = '';
            this._roles = '';
            this.token = ''
        }
    }

    getSecureData() {
        this._apiService.getData('User/SecureAreaJwt',
            this.secureDataCallback);
    }
    // Callback needs a pointer '_this' to current instance.
    secureDataCallback(result, _this) {
        if (result.errorMessage == "") {
            _this.secureData = result.secureData;
        }
        else {
            alert(JSON.stringify(result.errorMessage));
        }
    }

    getManagerData() {
        this._apiService.getData('User/ManagerAreaJwt',
            this.managerDataCallback);
    }
    // Callback needs a pointer '_this' to current instance.
    managerDataCallback(result, _this) {
        if (result.errorMessage == "") {
            _this.reqInfo = result.reqInfo;
        }
        else {
            alert(JSON.stringify(result.errorMessage));
        }
    }

    postSecureMessage() {
        let dataObject = {
            msgFromClient: 'hi from client'
        }
        this._apiService.postData('User/PostAreaJwt', dataObject,
            this.securePostCallback);
    }
    // Callback needs a pointer '_this' to current instance.
    securePostCallback(result, _this) {
        if (result.errorMessage == '') {
            _this.msgFromServer = result['msgFromServer'];
        }
        else {
            alert(JSON.stringify(result.errorMessage));
        }
    }

    //------------------------------------------------------------
    // Log user out. Destroy token.
    //------------------------------------------------------------
    logout() {
        sessionStorage.clear();
        this.updateContent();
        this.auth.setValue(false);

        // Clear data.
        this.secureData = "";
        this.managerData = "";
        this.reqInfo = {};
        this.msgFromServer = "";
    }


    toggleChatroom() {
        this.openChat = !this.openChat;
    }

    sendMessage() {
        if (this.chatReply) {
            if (this.chatReply && this._username) {
                let responseObject = { username: this._username, message: this.chatReply }
                this.ws.send(JSON.stringify(responseObject));
                this.chatReply = "";
            }
        }
    }
}
