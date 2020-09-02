import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isLoggedIn: BehaviorSubject<boolean>;

    constructor() {
        this.isLoggedIn = new BehaviorSubject<boolean>(false);
    }

    setValue(newValue) : void {
        this.isLoggedIn.next(newValue)
    }

    getValue() : Observable<boolean> {
        return this.isLoggedIn.asObservable();
    }
}