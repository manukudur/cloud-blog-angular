import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";

import { AuthService } from "../../services/auth.service";
import { LoginForm } from "src/app/shared/models/login.model";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  hide = true;
  login: FormGroup;
  loading: boolean = false;
  error: string = null;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.login = new FormGroup({
      usernameOrEmail: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });
  }

  submitLoginForm() {
    this.loading = !this.loading;
    let loginForm: LoginForm = this.validateUsernameOrEmail();
    this.login.get("password").reset();
    this.authService.login(loginForm).subscribe(
      response => {
        this.loading = !this.loading;
        this.error = null;
        this.authService.setloginState(true);
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", response.user);
        this.router.navigate(["/"]);
      },
      (error: HttpErrorResponse) => {
        this.loading = !this.loading;
        this.error = error.error.message;
      }
    );
  }

  validateUsernameOrEmail() {
    var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let usernameOrEmail = this.login.get("usernameOrEmail").value;
    let password = this.login.get("password").value;
    if (regex.test(String(usernameOrEmail).toLowerCase())) {
      return { email_id: usernameOrEmail, password };
    }
    return { username: usernameOrEmail, password };
  }
}
