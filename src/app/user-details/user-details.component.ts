import { Component, OnInit } from '@angular/core';
import { RegisterModel } from '../shared/models/register.model';
import { AuthService } from '../shared/services/auth.service';
import { UserService } from '../shared/services/user.service';
import { first } from 'rxjs/operators';

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
    private userService: UserService
  ) {
    this.currentUser = this.authService.getCurrentUser;
  }

  ngOnInit(): void {
    this.usersList();
  }

  private usersList() {
    this.userService
      .getAll()
      .pipe(first())
      .subscribe((users) => (this.users = users));
  }
}
