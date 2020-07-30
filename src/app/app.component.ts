import { Component, OnInit } from '@angular/core';
import { RegisterModel } from './shared/models/register.model';
import { AuthService } from './shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  currentUser: RegisterModel;
  loginMode = 'Login';
  registerMode = 'Register';
  mode={};
  constructor(private authService: AuthService, private router: Router) {
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
    console.log(this.currentUser);
    this.mode = this.authService.getCurrentUser;
    console.log(this.mode);
  }

  ngOnInit() {
    if (this.authService.getCurrentUser) {
      this.loginMode = 'LogOut';
      this.registerMode = 'Edit Profile';
    }
  }

  logout() {
    this.mode = null;
    this.authService.logout();
    this.router.navigate(['login']);
  }

  register() {
    if (this.authService.getCurrentUser) {
      this.router.navigate(['register'], { queryParams: { mode: 'edit' } });
    } else {
      this.router.navigate(['register']);
    }
  }
}
