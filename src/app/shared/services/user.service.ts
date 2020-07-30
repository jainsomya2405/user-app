import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterModel } from '../models/register.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<RegisterModel[]>(`/users`);
  }

  register(user: RegisterModel) {
    return this.http.post(`/users/register`, user);
  }

  // delete(id: number) {
  //   return this.http.delete(`/users/${id}`);
  // }
}
