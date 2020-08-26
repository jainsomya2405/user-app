import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IUser } from '../shared/models/register';
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
  user: IUser;
  registerForm: FormGroup;
  countryList: any;
  stateList: any;
  genderList: string[] = ['Male', 'Female'];
  hidePassword = true;
  mode: string;
  cityList: any;
  buttonName = 'Register';

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
    this.userService.allCountries().subscribe((data) => {
      this.countryList = data.Countries;
      if (this.mode == 'edit') {
        this.stateList = this.countryList.filter(
          (data: any) => data.CountryName == this.user.country
        )[0].States;
        this.cityList = this.stateList.filter(
          (data: any) => data.StateName == this.user.state
        )[0].Cities;
      }
    });
    if (this.mode == 'edit') {
      this.user = this.authService.getCurrentUser;
      this.buttonName = 'Save';
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
      city: [this.user.city],
      gender: [this.user.gender],
    });
  }

  get formControls() {
    return this.registerForm.controls;
  }

  onChangeCountry(countryValue: any) {
    this.stateList = this.getStates(countryValue.value);
    this.cityList = this.stateList[0].Cities;
  }

  onChangeState(stateValue: any) {
    this.cityList = this.getCities(stateValue.value);
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
            duration: 2000,
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
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
          this.router.navigate(['login']);
        });
    }
  }

  getStates(countryName: string) {
    return this.countryList.filter(
      (data: any) => data.CountryName == countryName
    )[0].States;
  }

  getCities(stateName: string) {
    return this.stateList.filter((data: any) => data.StateName == stateName)[0]
      .Cities;
  }
}
