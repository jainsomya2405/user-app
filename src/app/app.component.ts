import { Component, OnInit } from '@angular/core';
import { IUser } from './shared/models/register';
import { AuthService } from './shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  currentUser: IUser;
  constructor(private authService: AuthService, private router: Router) {
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
  }

  ngOnInit() {}

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

  // register() {
  //   if (this.authService.getCurrentUser) {
  //     this.router.navigate(['register'], { queryParams: { mode: 'edit' } });
  //   } else {
  //     this.router.navigate(['register']);
  //   }
  // }
}
