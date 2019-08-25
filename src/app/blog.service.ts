import { Injectable, OnInit } from "@angular/core";
import { Blog } from "./models/blog.model";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class BlogService implements OnInit {
  private blogs: Blog[];
  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  getBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>("https://manukudur.herokuapp.com/api/blog/");
  }

  postBlog(blog: Blog): Observable<{ message: string; data: Blog }> {
    return this.http.post<{ message: string; data: Blog }>(
      "https://manukudur.herokuapp.com/api/blog/create/",
      blog
    );
  }
  updateBlog(blog: Blog): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(
      "https://manukudur.herokuapp.com/api/blog/" + blog._id,
      blog
    );
  }
  deleteBlogs(blogId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      "https://manukudur.herokuapp.com/api/blog/" + blogId
    );
  }
}
