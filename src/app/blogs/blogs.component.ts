import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import * as moment from "moment";

import { BlogDialogComponent } from "../shared/components/blog-dialog/blog-dialog.component";
import { Blog } from "../shared/models/blog.model";
import { BlogService } from "../core/services/blog.service";

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
  formatTime(time: Date) {
    return moment(time).fromNow();
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
  editBlogDialog(blog: Blog): void {
    const dialogRef = this.dialog.open(BlogDialogComponent, {
      width: "500px",
      data: { dialogType: "Edit", blog: blog }
    });

    dialogRef.afterClosed().subscribe(received => {
      if (received) {
        this._snackBar.open("Blog " + received.message + " successfully", "", {
          duration: 2000
        });
        this.loadBlogs();
      }
    });
  }
}
