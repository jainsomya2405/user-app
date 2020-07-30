import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegisterModel } from '../shared/models/register.model';
import { CustomValidationService } from '../shared/custom-validation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  user: RegisterModel = new RegisterModel();
  registerForm: FormGroup;
  countryList: string[] = [
    'Argentina',
    'Bangladesh',
    'Belgium',
    'Brazil',
    'Canada',
    'Egypt',
    'France',
    'Germany',
    'Hungary',
    'India',
    'Japan',
    'Nepal',
    'Pakistan',
    'Singapore',
    'Switzerland',
    'United States of America',
  ];

  stateList: string[] = [
    'Andhra Pradesh',
    'Bihar',
    'Goa',
    'Jammu and Kashmir',
    'Madhya Pradesh',
    'Maharashtra',
    'Punjab',
    'Telangana',
    'West Bengal',
  ];

  genderList: string[] = ['Male', 'Female'];
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private customValidator: CustomValidationService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    let mode = this.route.snapshot.queryParamMap.get('mode');
    if (mode == 'edit') {
      this.user = JSON.parse(localStorage.getItem('user'));
    }
    this.registerForm = this.fb.group({
      name: [this.user.name, [Validators.required, Validators.minLength(4)]],
      email: [
        this.user.email,
        [
          Validators.required,
          Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/),
        ],
      ],
      password: [
        this.user.password,
        [Validators.required, this.customValidator.patternValidator()],
      ],
      country: [this.user.country],
      state: [this.user.state],
      gender: [this.user.gender],
    });
  }

  get formControls() {
    return this.registerForm.controls;
  }

  register() {
    console.log(this.registerForm.value);
    if (this.registerForm.invalid) return;

    this.userService
      .register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        (data) => {
          this._snackBar.open('Registration Successful', 'Success', {
            duration: 1000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
          this.router.navigate(['login']);
        },
        (error) => {
          this._snackBar.open('Registration Failed', 'Failed', {
            duration: 1000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        }
      );
  }
}
