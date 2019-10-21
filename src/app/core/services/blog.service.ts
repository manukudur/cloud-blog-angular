import { Injectable, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from "rxjs";

import { environment } from "../../../environments/environment";

import { Blog } from "../../shared/models/blog.model";

@Injectable({
  providedIn: "root"
})
export class BlogService implements OnInit {
  private url: string = environment.url;
  reloadBlogs = new Subject();

  constructor(private http: HttpClient) {}
  ngOnInit(): void {}

  getBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${this.url}`);
  }

  postBlog(blog: Blog): Observable<{ message: string; data: Blog }> {
    return this.http.post<{ message: string; data: Blog }>(
      `${this.url}create/`,
      blog,
      {
        headers: new HttpHeaders().set(
          "Authorization",
          localStorage.getItem("token")
        )
      }
    );
  }
  updateBlog(blog: Blog): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(
      `${this.url}` + blog._id,
      blog,
      {
        headers: new HttpHeaders().set(
          "Authorization",
          localStorage.getItem("token")
        )
      }
    );
  }
  deleteBlogs(blogId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.url}` + blogId, {
      headers: new HttpHeaders().set(
        "Authorization",
        localStorage.getItem("token")
      )
    });
  }
  getBlog(blogId: string): Observable<{ blog: Blog }> {
    return this.http.get<{ blog: Blog }>(`${this.url}` + blogId);
  }
}
