import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";

import { AuthService } from "../../../core/services/auth.service";
import { PasswordStateMatcher } from "src/app/shared/classes/PasswordStateMatcher";
import { UniqueValidator } from "../../../core/validators/unique.validator";
import { ErrorDialogComponent } from "src/app/shared/components/error-dialog/error-dialog.component";
import { SuccessDialogComponent } from "src/app/shared/components/success-dialog/success-dialog.component";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit {
  hide: boolean = true;
  signup: FormGroup;
  loadingProgressBar: boolean = false;
  passwordMatcher = new PasswordStateMatcher();
  maxDate = new Date();
  startDate = new Date(1990, 0, 1);
  constructor(
    public authService: AuthService,
    private uniueValidator: UniqueValidator,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.signup = new FormGroup(
      {
        first_name: new FormControl(null, [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z ]*$/)
        ]),
        last_name: new FormControl(null, [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z ]*$/)
        ]),
        dob: new FormControl(null, [Validators.required]),
        phone_number: new FormControl(
          null,
          [Validators.required, Validators.pattern(/^\d{10}$/)],
          [this.uniueValidator.uniquePhoneNumberValidator()]
        ),
        username: new FormControl(
          null,
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(50),
            Validators.pattern(/^[a-z0-9]{4,50}$/)
          ],
          [this.uniueValidator.uniqueUsernameValidator()]
        ),
        email_id: new FormControl(
          null,
          [
            Validators.required,
            Validators.email,
            Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
          ],
          [this.uniueValidator.uniqueEmailValidator()]
        ),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
          Validators.pattern(
            /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[" !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"])[0-9A-Za-z" !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"]{6,20}$/
          )
        ]),
        confirm_password: new FormControl(null, Validators.required)
      },
      { validators: this.checkPasswords }
    );
  }
  getFirstNameErrorMessage() {
    return this.signup.get("first_name").hasError("required")
      ? "First Name is required"
      : this.signup.get("first_name").hasError("minlength")
      ? "Enter atleast 3 characters"
      : this.signup.get("first_name").hasError("pattern")
      ? "Should be alphabet letters"
      : "";
  }
  getLastNameErrorMessage() {
    return this.signup.get("last_name").hasError("required")
      ? "Last name is required, atleast 1 alphabet"
      : this.signup.get("last_name").hasError("pattern")
      ? "Should be alphabet letters"
      : "";
  }
  getDobErrorMessage() {
    return this.signup.get("dob").hasError("required")
      ? "Date of Birth is required"
      : "";
  }
  getUsernameErrorMessage() {
    return this.signup.get("username").hasError("required")
      ? "Username is required"
      : this.signup.get("username").hasError("minlength")
      ? "Enter atleast 4 characters"
      : this.signup.get("username").hasError("pattern")
      ? "Enter only lowercase Alphanumerics, without space"
      : "Username already exists";
  }
  getPhoneNumberErrorMessage() {
    return this.signup.get("phone_number").hasError("required")
      ? "Phone number is required"
      : this.signup.get("phone_number").hasError("pattern")
      ? "Phone number should be 10 digits, alphabets not alowed"
      : "This Phone number already in use";
  }
  getEmailErrorMessage() {
    return this.signup.get("email_id").hasError("required")
      ? "Email ID is required"
      : this.signup.get("email_id").hasError("email")
      ? "Please enter a valid email address"
      : "This Email ID already in use";
  }
  getPasswordErrorMessage() {
    return this.signup.get("password").hasError("required")
      ? "Password is required"
      : this.signup.get("password").hasError("minlength")
      ? "Enter atleast 6 characters"
      : this.signup.get("password").hasError("pattern")
      ? "Include lowercase, uppercase, numeric, and special character."
      : "";
  }
  checkPasswords(group: FormGroup) {
    let pass = group.get("password").value;
    let confirmPass = group.get("confirm_password").value;
    return pass === confirmPass ? null : { notSame: true };
  }
  submitSignupForm() {
    let signupForm = this.signup.value;
    this.signup.get("password").reset();
    this.signup.get("confirm_password").reset();

    this.loadingProgressBar = true;
    this.authService.signup(signupForm).subscribe(
      data => {
        this.loadingProgressBar = false;
        this.openSuccessDialog();
      },
      (error: HttpErrorResponse) => {
        this.openErrorDialog();
      }
    );
  }
  openErrorDialog(): void {
    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: "500px"
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadingProgressBar = false;
      if (result) {
        return;
      }
      this.signup.reset();
    });
  }
  openSuccessDialog(): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: "500px"
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadingProgressBar = false;
      this.signup.reset();
    });
  }
}
