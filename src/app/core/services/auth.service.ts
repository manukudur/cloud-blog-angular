import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";

import { environment } from "src/environments/environment";

import { SignupForm } from "src/app/shared/models/signup.model";
import { LoginForm } from "src/app/shared/models/login.model";

const URL: string = environment.url;
@Injectable({
  providedIn: "root"
})
export class AuthService {
  private isLogin = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  get loginState(): Subject<boolean> {
    return this.isLogin;
  }
  setloginState(state: boolean) {
    this.isLogin.next(state);
  }

  signup(signupForm: SignupForm): Observable<{ response: string }> {
    return this.http.post<{ response: string }>(
      `${URL}user/signup`,
      signupForm
    );
  }
  login(loginForm: LoginForm): Observable<{ user: string; token: string }> {
    return this.http.post<{ user: string; token: string }>(
      `${URL}user/login`,
      loginForm
    );
  }
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.isLogin.next(false);
  }
}
