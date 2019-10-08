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
  private header = {
    headers: new HttpHeaders().set(
      "Authorization",
      localStorage.getItem("token")
    )
  };
  // private Blogs = new Subject<[Blog]>();

  constructor(private http: HttpClient) {}
  ngOnInit(): void {}

  getBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${this.url}`);
  }

  postBlog(blog: Blog): Observable<{ message: string; data: Blog }> {
    return this.http.post<{ message: string; data: Blog }>(
      `${this.url}create/`,
      blog,
      this.header
    );
  }
  updateBlog(blog: Blog): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(
      `${this.url}` + blog._id,
      blog,
      this.header
    );
  }
  deleteBlogs(blogId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.url}` + blogId,
      this.header
    );
  }
}
