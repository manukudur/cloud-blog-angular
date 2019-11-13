import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "src/environments/environment";

import { Profile } from "src/app/shared/models/profile.model";

const URL: string = environment.url;
@Injectable({
  providedIn: "root"
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${URL}user/profile`);
  }

  updateProfile(
    profile: Profile
  ): Observable<{ token: string; user: string; message: string }> {
    return this.http.post<{ token: string; user: string; message: string }>(
      `${URL}user/updateProfile`,
      profile
    );
  }

  updateUsername(
    username: string
  ): Observable<{ token: string; user: string; message: string }> {
    return this.http.post<{ token: string; user: string; message: string }>(
      `${URL}user/updateUsername`,
      username
    );
  }

  deleteUser(password: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${URL}user/delete`, {
      password: password
    });
  }
}
