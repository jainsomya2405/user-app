import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

// array in local storage for registered users
let users = JSON.parse(localStorage.getItem('users')) || [];

@Injectable()
export class MockInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;
    return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
      .pipe(delay(500))
      .pipe(dematerialize());

    function handleRoute() {
      switch (true) {
        case url.endsWith('/users/authenticate') && method === 'POST':
          return authenticate();
        case url.endsWith('/users/register') && method === 'POST':
          return register();
        case url.endsWith('/users/edit') && method === 'POST':
          return updateUser();
        case url.endsWith('/users') && method === 'GET':
          return getUsers();
        // case url.match(/\/users\/\d+$/) && method === 'DELETE':
        //   return deleteUser();

        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    function authenticate() {
      const { email, password } = body;
      const user = users.find(
        (x) => x.email === email && x.password === password
      );
      if (!user) return error('email or password is incorrect');
      return ok({
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        country: user.country,
        state: user.state,
        gender: user.gender,
        token: 'fake-jwt-token',
      });
    }

    function register() {
      const user = body;

      if (users.find((x) => x.email === user.email)) {
        return error('email "' + user.email + '" is already taken');
      }

      user.id = users.length ? Math.max(...users.map((x) => x.id)) + 1 : 1;
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));

      return ok();
    }

    function updateUser() {
      const user = body;
      let itemIndex = users.findIndex((item) => item.id == user.id);
      users[itemIndex] = user;
      localStorage.setItem('users', JSON.stringify(users));

      return ok({
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        country: user.country,
        state: user.state,
        gender: user.gender,
        token: 'fake-jwt-token',
      });
    }

    function getUsers() {
      if (!isLoggedIn()) return unauthorized();
      return ok(users);
    }

    // function deleteUser() {
    //   if (!isLoggedIn()) return unauthorized();

    //   users = users.filter((x) => x.id !== idFromUrl());
    //   localStorage.setItem('users', JSON.stringify(users));
    //   return ok();
    // }

    // helper functions

    function ok(body?) {
      return of(new HttpResponse({ status: 200, body }));
    }

    function error(message) {
      return throwError({ error: { message } });
    }

    function unauthorized() {
      return throwError({ status: 401, error: { message: 'Unauthorised' } });
    }

    function isLoggedIn() {
      return headers.get('Authorization') === 'Bearer fake-jwt-token';
    }

    function idFromUrl() {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1]);
    }
  }
}
