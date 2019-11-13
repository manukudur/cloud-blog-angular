import { Component, OnInit } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";

import { AuthService } from "src/app/core/services/auth.service";
import { UniqueValidator } from "src/app/core/validators/unique.validator";
import { ProfileService } from "src/app/core/services/profile.service";
import { ConfirmDialogComponent } from "src/app/shared/components/confirm-dialog/confirm-dialog.component";
import { ErrorDialogComponent } from "src/app/shared/components/error-dialog/error-dialog.component";
import { ConfirmPasswordComponent } from "src/app/shared/components/confirm-password/confirm-password.component";

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.css"]
})
export class AccountComponent implements OnInit {
  loading: boolean = false;
  form: FormGroup;
  editMode: boolean = true;

  constructor(
    private authService: AuthService,
    private uniqueValidator: UniqueValidator,
    private profileService: ProfileService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.initilizeForm();
  }

  ngOnInit() {
    this.loadValue();
  }

  initilizeForm() {
    this.form = new FormGroup({
      username: new FormControl(
        null,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
          Validators.pattern(/^[a-z0-9]{4,50}$/)
        ],
        [this.uniqueValidator.uniqueUsernameValidatorWhileUpdating()]
      )
    });
  }

  getUsernameErrorMessage() {
    return this.form.get("username").hasError("required")
      ? "Username is required"
      : this.form.get("username").hasError("minlength")
      ? "Enter atleast 4 characters"
      : this.form.get("username").hasError("pattern")
      ? "Enter only lowercase Alphanumerics, without space"
      : "Username already exists";
  }

  toggleEdit() {
    this.editMode = !this.editMode;
    this.loadValue();
  }

  loadValue() {
    this.loading = true;
    this.profileService.getProfile().subscribe(
      data => {
        this.form.setValue({
          username: data.username
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

  update() {
    this.loading = true;
    this.profileService.updateUsername(this.form.value).subscribe(response => {
      localStorage.setItem("user", response.user);
      localStorage.setItem("token", response.token);
      this.editMode = !this.editMode;
      this._snackBar.open(response.message, "", {
        duration: 5000
      });
      this.loading = false;
    });
  }

  deleteAccount(password: string) {
    this.loading = true;
    this.profileService.deleteUser(password).subscribe(
      response => {
        this.authService.logout();
        this._snackBar.open(response.message, "", {
          duration: 5000
        });
        this.loading = false;
        this.router.navigate(["/"]);
      },
      (error: HttpErrorResponse) => {
        this.loading = false;
        switch (error.status) {
          case 0:
            this.connectionRefused("delete");
            break;
          case 400:
            this.confirmPassword(error.error.message, "delete");
            break;
          default:
            break;
        }
      }
    );
  }

  openConfirmDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      width: "500px",
      data: {
        message: "Are you sure to Delete ?",
        notes: [
          "By clicking 'Confirm' your account will be removed from database.",
          "And Deletes your Blogs."
        ]
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.confirmPassword(null, "delete");
      }
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
          case "delete":
            this.deleteAccount(result);
            break;
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
          case "delete":
            this.openConfirmDialog();
            break;
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
}
