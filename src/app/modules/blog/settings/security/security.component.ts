import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";

import { AuthService } from "src/app/core/services/auth.service";

@Component({
  selector: "app-security",
  templateUrl: "./security.component.html",
  styleUrls: ["./security.component.css"]
})
export class SecurityComponent implements OnInit {
  changepassword: FormGroup;
  error: string = null;
  loadingProgressBar: boolean = false;

  constructor(
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.changepassword = new FormGroup({
      old_password: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
        Validators.pattern(
          /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[" !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"])[0-9A-Za-z" !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"]{6,20}$/
        )
      ]),
      new_password: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
        Validators.pattern(
          /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[" !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"])[0-9A-Za-z" !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"]{6,20}$/
        )
      ]),
      confirm_password: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
        Validators.pattern(
          /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[" !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"])[0-9A-Za-z" !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"]{6,20}$/
        )
      ])
    });
  }

  update(formDirective: FormGroupDirective) {
    this.loadingProgressBar = true;
    const value = this.changepassword.value;
    this.changepassword.reset();
    formDirective.resetForm();
    this.authService.updatePassword(value).subscribe(
      data => {
        this.error = null;
        this.loadingProgressBar = false;
        this._snackBar.open(data.message, "", {
          duration: 5000
        });
      },
      err => {
        this.loadingProgressBar = false;
        this.error = err.error.message;
      }
    );
  }
}
