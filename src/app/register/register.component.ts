import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegisterModel } from '../shared/models/register.model';
import { CustomValidationService } from '../shared/custom-validation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { first } from 'rxjs/operators';
import { AuthService } from '../shared/services/auth.service';

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
  mode;
  buttonName='Register'

  constructor(
    private fb: FormBuilder,
    private customValidator: CustomValidationService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.mode = this.route.snapshot.queryParamMap.get('mode');
    if (this.mode == 'edit') {
      this.user = this.authService.getCurrentUser;
      this.buttonName='Save'
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
    if (this.registerForm.invalid) return;

    if (this.mode == 'edit') {
      const object = this.registerForm.value;
      object.id = this.user.id;
      this.authService
        .registerUser(object)
        .pipe(first())
        .subscribe((data) => {
          this._snackBar.open('Saved Successful', 'Success', {
            duration: 1000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });

          this.router.navigate(['']);
        });
    } else {
      this.userService
        .register(this.registerForm.value)
        .pipe(first())
        .subscribe((data) => {
          this._snackBar.open('Registration Successful', 'Success', {
            duration: 1000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
          this.router.navigate(['login']);
        });
    }
  }
}
