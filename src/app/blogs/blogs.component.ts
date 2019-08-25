import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatButton } from "@angular/material/button";

import { BlogDialogComponent } from "./blog-dialog/blog-dialog.component";
import { Blog } from "../models/blog.model";
import { BlogService } from "../blog.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-blogs",
  templateUrl: "./blogs.component.html",
  styleUrls: ["./blogs.component.css"]
})
export class BlogsComponent implements OnInit {
  initialLoading: boolean = false;
  blogs: Blog[] = [];
  constructor(
    public dialog: MatDialog,
    public blogService: BlogService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadBlogs();
  }
  loadBlogs() {
    this.blogService.getBlogs().subscribe(data => {
      this.blogs = data;
      this.initialLoading = true;
    });
  }
  deleteBlog(blog: Blog) {
    if (confirm("Are you sure to Delete this Blog ?")) {
      this.blogService.deleteBlogs(blog._id).subscribe(data => {
        this._snackBar.open("Blog " + data.message + " successfully", "", {
          duration: 2000
        });
        this.loadBlogs();
      });
    }
  }
  blogDialog(createBlog: MatButton, buttonType?: string, blog?: Blog): void {
    createBlog.disabled = true;
    const dialogRef = this.dialog.open(BlogDialogComponent, {
      width: "450px",
      height: "450px",
      data: { dialogType: buttonType, blog: blog }
    });

    dialogRef.afterClosed().subscribe(received => {
      createBlog.disabled = false;
      this._snackBar.open("Blog " + received.message + " successfully", "", {
        duration: 2000
      });
      this.loadBlogs();
    });
  }
}
