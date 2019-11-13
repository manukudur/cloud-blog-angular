import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";

import { UniqueValidator } from "src/app/core/validators/unique.validator";
import { ProfileService } from "src/app/core/services/profile.service";
import { ErrorDialogComponent } from "src/app/shared/components/error-dialog/error-dialog.component";
import { AuthService } from "src/app/core/services/auth.service";
import { ConfirmPasswordComponent } from "src/app/shared/components/confirm-password/confirm-password.component";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit {
  loading: boolean = false;
  profile: FormGroup;
  startDate: Date;
  maxDate = new Date();
  editMode: boolean = true;

  constructor(
    private profileService: ProfileService,
    private uniqueValidator: UniqueValidator,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) {
    this.initilizeForm();
  }

  ngOnInit() {
    this.loadValue();
  }

  initilizeForm() {
    this.profile = new FormGroup({
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
        [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)],
        [this.uniqueValidator.uniquePhoneNumberValidatorWhileUpdating()]
      ),
      email_id: new FormControl(
        null,
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
        ],
        [this.uniqueValidator.uniqueEmailValidatorWhileUpdating()]
      )
    });
  }

  toggleEdit() {
    this.editMode = !this.editMode;
    this.loadValue();
  }

  loadValue() {
    this.loading = true;
    this.profileService.getProfile().subscribe(
      data => {
        this.startDate = data.dob;
        this.profile.setValue({
          first_name: data.first_name,
          last_name: data.last_name,
          email_id: data.email_id,
          phone_number: data.phone_number,
          dob: data.dob
        });
        this.loading = false;
      },
      (error: HttpErrorResponse) => {
        this.loading = false;
        switch (error.status) {
          case 0:
            this.connectionRefused("loadValue");
            break;
          case 401:
            this.confirmPassword(null, "login");
            break;
          default:
            break;
        }
      }
    );
  }

  updateProfile() {
    this.loading = true;
    this.profileService
      .updateProfile(this.profile.value)
      .subscribe(response => {
        localStorage.setItem("user", response.user);
        localStorage.setItem("token", response.token);
        this.editMode = !this.editMode;
        this._snackBar.open(response.message, "", {
          duration: 5000
        });
        this.loading = false;
      });
  }

  confirmPassword(errMessage?: string, next?: string) {
    const dialogRef = this.dialog.open(ConfirmPasswordComponent, {
      width: "300px",
      data: { message: errMessage },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        switch (next) {
          case "login":
            if (result) {
              let username = localStorage.getItem("user");
              this.authService
                .login({ username: username, password: result })
                .subscribe(
                  response => {
                    localStorage.setItem("token", response.token);
                    this.loadValue();
                  },
                  (error: HttpErrorResponse) => {
                    this.loading = false;
                    switch (error.status) {
                      case 0:
                        this.connectionRefused("login");
                        break;
                      case 400:
                        this.confirmPassword("Invalid Password", "login");
                        break;
                      default:
                        break;
                    }
                  }
                );
              return;
            }
            break;
          default:
            break;
        }
        return;
      }
      if (next === "login") {
        this.authService.logout();
        this.router.navigate(["/"]);
      }
    });
  }

  connectionRefused(next?: string) {
    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: "500px",
      data: {
        message: "Oops! Something went wrong. Please try again.",
        notes: [
          "Could not connect to server, Please check your Internet connection",
          "try Again."
        ]
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        switch (next) {
          case "loadValue":
            this.loadValue();
            break;
          case "login":
            this.confirmPassword(null, "login");
            break;
          default:
            break;
        }
      }
    });
  }

  getFirstNameErrorMessage() {
    return this.profile.get("first_name").hasError("required")
      ? "First Name is required"
      : this.profile.get("first_name").hasError("minlength")
      ? "Enter atleast 3 characters"
      : this.profile.get("first_name").hasError("pattern")
      ? "Should be alphabet letters"
      : "";
  }

  getLastNameErrorMessage() {
    return this.profile.get("last_name").hasError("required")
      ? "Last name is required, atleast 1 alphabet"
      : this.profile.get("last_name").hasError("pattern")
      ? "Should be alphabet letters"
      : "";
  }

  getDobErrorMessage() {
    return this.profile.get("dob").hasError("required")
      ? "Date of Birth is required"
      : "";
  }

  getUsernameErrorMessage() {
    return this.profile.get("username").hasError("required")
      ? "Username is required"
      : this.profile.get("username").hasError("minlength")
      ? "Enter atleast 4 characters"
      : this.profile.get("username").hasError("pattern")
      ? "Enter only lowercase Alphanumerics, without space"
      : "Username already exists";
  }

  getPhoneNumberErrorMessage() {
    return this.profile.get("phone_number").hasError("required")
      ? "Phone number is required"
      : this.profile.get("phone_number").hasError("pattern")
      ? "Phone number should be valid, alphabets not alowed"
      : "This Phone number already in use";
  }

  getEmailErrorMessage() {
    return this.profile.get("email_id").hasError("required")
      ? "Email ID is required"
      : this.profile.get("email_id").hasError("email")
      ? "Please enter a valid email address"
      : this.profile.get("email_id").hasError("pattern")
      ? "Please enter a valid email address"
      : "This Email ID already in use";
  }
}
