import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { CustomValidationService } from '../shared/custom-validation.service';
import { first } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginDetails: FormGroup;
  isLoading = false;
  hidePassword = true;
  returnUrl: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private customValidator: CustomValidationService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {
    if (this.authService.getCurrentUser) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.loginDetails = this.fb.group({
      email: [
        null,
        [
          Validators.required,
          Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/),
        ],
      ],
      password: [
        null,
        Validators.compose([
          Validators.required,
          this.customValidator.patternValidator(),
        ]),
      ],
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login() {
    if (this.loginDetails.invalid) return;
    this.isLoading = true;

    // setTimeout(() => {
    this.authService
      .login(this.loginDetails.value)
      .pipe(first())
      .subscribe(
        (data) => {
          console.log(data);
          this.router.navigate([this.returnUrl]);
        },
        (error) => {
          this.isLoading = false;
          this._snackBar.open(error, 'Failed', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        }
      );
    // this.router.navigateByUrl('');
    // }, 1000);
  }

  get formControls() {
    return this.loginDetails.controls;
  }
}
