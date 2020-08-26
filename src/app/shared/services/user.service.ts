import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../models/register';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  dummyURL: string =
    'https://raw.githubusercontent.com/sagarshirbhate/Country-State-City-Database/master/Contries.json';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<IUser[]>(`/users`);
  }

  register(user: IUser) {
    return this.http.post(`/users/register`, user);
  }

  allCountries(): Observable<any> {
    return this.http.get(this.dummyURL);
  }

  // delete(id: number) {
  //   return this.http.delete(`/users/${id}`);
  // }
}
