import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RegisterModel } from '../models/register.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject: BehaviorSubject<RegisterModel>;
  public currentUser: Observable<RegisterModel>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<RegisterModel>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get getCurrentUser(): RegisterModel {
    return this.currentUserSubject.value;
  }

  login(user) {
    return this.http.post<any>(`/users/authenticate`, user).pipe(
      map((user) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
