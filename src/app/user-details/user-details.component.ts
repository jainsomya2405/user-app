import { Component, OnInit } from '@angular/core';
import { RegisterModel } from '../shared/models/register.model';
import { AuthService } from '../shared/services/auth.service';
import { UserService } from '../shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit {
  currentUser: RegisterModel;
  users = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
  }

  ngOnInit(): void {
    // this.userService
    //   .getAll()
    //   .pipe()
    //   .subscribe(
    //     (users) => {
    //       this.users = users;
    //       console.log(this.users);
    //     },
    //     (error) => {
    //       console.log(error);
    //     }
    //   );
  }

  edit() {
    this.router.navigate(['register'], {
      queryParams: { mode: 'edit' },
    });
  }
}
