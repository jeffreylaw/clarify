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
    password              = 'x';         
    username              = 'pmcgee';
    
    token                 = '';
    message               = 'Not logged in.';
    secureData:string     = '';
    managerData:string    = '';
    reqInfo:any           = {};
    msgFromServer:string  = '';
    _apiService:ApiService;
    public site='http://localhost:1337/';
    isLoggedIn;
    _username;
    _roles;

    // Since we are using a provider above we can receive 
    // an instance through an constructor.
    constructor(private http: HttpClient, private routeEventsService: RouteEventsService, private router: Router, private auth:AuthService) {
        // Pass in http module and pointer to AppComponent.
        this._apiService = new ApiService(http, this);
        this.updateContent();
    }

    ngOnInit() {
        this.router.events.subscribe(event => {
            if (event.constructor.name === 'NavigationEnd' || event.constructor.name === 'NavigationStart') {
                this.isLoggedIn = this.auth.isLoggedIn;
                if (this.isLoggedIn) {
                    this.updateContent();
                }
            }
        })
    }

    ngAfterViewInit() {
        // this.updateContent();
    }

    //------------------------------------------------------------
    // Either shows content when logged in or clears contents.
    //------------------------------------------------------------
    updateContent() {
        // Logged in if token exists in browser cache.
        if(sessionStorage.getItem('auth_token')!=null) {
            this.token   = sessionStorage.getItem('auth_token');
            this._username = JSON.parse(sessionStorage.getItem('username'));
            this._roles = JSON.parse(sessionStorage.getItem('roles'));
            this.message = "The user has been logged in."
        }
        else {
            this.message = "Not logged in.";
            this._username = '';
            this._roles = '';
            this.token   = ''
        }
    }

    getSecureData() {  
        this._apiService.getData('User/SecureAreaJwt', 
                                 this.secureDataCallback);
    }
    // Callback needs a pointer '_this' to current instance.
    secureDataCallback(result, _this) {
        if(result.errorMessage == "") {
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
        if(result.errorMessage == "") {
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
        if(result.errorMessage == '') {
            _this.msgFromServer = result['msgFromServer']; 
        }
        else {
            alert(JSON.stringify(result.errorMessage)); 
        }   
    }

    //------------------------------------------------------------
    // Log user in. 
    //------------------------------------------------------------
    login() {
        let url = this.site + "auth";
    
        // This free online service receives post submissions.
        this.http.post(url, {
                username:  this.username,
                password:  this.password,
            })
        .subscribe( 
        // Data is received from the post request.
        (data) => {
            // Inspect the data to know how to parse it.
            console.log(JSON.stringify(data));
            
            if(data["token"]  != null)  {
                this.token = data["token"]     
                sessionStorage.setItem('auth_token', data["token"]);
                this.message = "The user has been logged in."  
                this.updateContent();
            }    
        },
        // An error occurred. Data is not received. 
        error => {
            alert(JSON.stringify(error));             
        });
    }

    //------------------------------------------------------------
    // Log user out. Destroy token.
    //------------------------------------------------------------
    logout() {
        sessionStorage.clear();
        this.updateContent();
        this.auth.isLoggedIn = false;

        // Clear data.
        this.secureData    = ""; 
        this.managerData   = "";
        this.reqInfo       = {};
        this.msgFromServer = "";
    }
}
