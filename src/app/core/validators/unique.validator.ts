import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { Observable, timer } from "rxjs";
import { map, switchMap, retry } from "rxjs/operators";

import { environment } from "src/environments/environment";

const URL: string = environment.url;

@Injectable({
  providedIn: "root"
})
export class UniqueValidator {
  constructor(private http: HttpClient) {}

  private searchUniques(value) {
    // debounce
    return timer(500).pipe(
      switchMap(() => {
        // Check if unique data is available
        return this.http.post<any>(`${URL}user/signup_check`, value);
      })
    );
  }

  uniqueUsernameValidator(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<{ [key: string]: any } | null> => {
      return this.searchUniques({ username: control.value }).pipe(
        map(res => {
          // if unique data is already taken
          if (res.length) {
            // return error
            return { uniqueDataExists: false };
          }
        }),
        retry()
      );
    };
  }
  uniqueEmailValidator(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<{ [key: string]: any } | null> => {
      return this.searchUniques({ email_id: control.value }).pipe(
        map(res => {
          // if unique data is already taken
          if (res.length) {
            // return error
            return { uniqueDataExists: false };
          }
        }),
        retry()
      );
    };
  }
  uniquePhoneNumberValidator(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<{ [key: string]: any } | null> => {
      return this.searchUniques({ phone_number: control.value }).pipe(
        map(res => {
          // if unique data is already taken
          if (res.length) {
            // return error
            return { uniqueDataExists: false };
          }
        }),
        retry()
      );
    };
  }
}
