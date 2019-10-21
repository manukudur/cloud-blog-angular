import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subscription } from "rxjs";
import * as moment from "moment";

import { BlogDialogComponent } from "../../shared/components/blog-dialog/blog-dialog.component";
import { Blog } from "../../shared/models/blog.model";
import { BlogService } from "../../core/services/blog.service";

@Component({
  selector: "app-blog",
  templateUrl: "./blog.component.html",
  styleUrls: ["./blog.component.css"]
})
export class BlogComponent implements OnInit, OnDestroy {
  initialLoading: boolean = false;
  reloadSubscription: Subscription;
  blogs: Blog[] = [];

  constructor(
    public dialog: MatDialog,
    public blogService: BlogService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadBlogs();
    this.reloadSubscription = this.blogService.reloadBlogs.subscribe(() => {
      this.loadBlogs();
    });
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

  authUserActionButton(creator: string) {
    if (creator === localStorage.getItem("user")) return false;
    return true;
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
      panelClass: "custom-dialog-container",
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
  ngOnDestroy() {
    this.reloadSubscription.unsubscribe();
  }
}
