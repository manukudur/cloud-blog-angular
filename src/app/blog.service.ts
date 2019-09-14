import { Injectable, OnInit } from "@angular/core";
import { environment } from "../environments/environment";
import { Blog } from "./models/blog.model";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class BlogService implements OnInit {
  url: string = environment.url;
  private blogs: Blog[];
  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  getBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${this.url}blog/`);
  }

  postBlog(blog: Blog): Observable<{ message: string; data: Blog }> {
    return this.http.post<{ message: string; data: Blog }>(
      `${this.url}blog/create/`,
      blog
    );
  }
  updateBlog(blog: Blog): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(
      `${this.url}blog/` + blog._id,
      blog
    );
  }
  deleteBlogs(blogId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.url}blog/` + blogId);
  }
}
