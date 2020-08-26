import { Component, OnInit } from '@angular/core';
import { IUser } from '../shared/models/register';
import { AuthService } from '../shared/services/auth.service';
import { UserService } from '../shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit {
  currentUser: IUser;
  users = [];
  userName = '';
  mainItems = new Array();
  selectedItems = new Array();

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

  submit(value) {
    let object = {};
    object = {
      id: this.mainItems.length == 0 ? 1 : this.mainItems.length + 1,
      name: value,
      active: false,
    };
    this.mainItems.push(object);
    console.log(this.mainItems);
    this.userName = '';
  }

  changeText(id) {
    debugger;
    var array = this.mainItems.filter((data) => data.id == id);
    this.selectedItems.push(array);
    this.mainItems.forEach((data) => {
      if (data.id == id) {
        data.active = true;
      }
    });
    console.log(this.mainItems);
  }
}
