import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { Subscription } from "rxjs";
import * as moment from "moment";

import { BlogDialogComponent } from "../../shared/components/blog-dialog/blog-dialog.component";
import { Blog } from "../../shared/models/blog.model";
import { BlogService } from "../../core/services/blog.service";
import { ConfirmDialogComponent } from "src/app/shared/components/confirm-dialog/confirm-dialog.component";

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
    private _snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params["username"]) {
        this.loadUserBlogs();
      } else {
        this.loadBlogs();
      }
      this.reloadSubscription = this.blogService.reloadBlogs.subscribe(() => {
        if (params["username"]) {
          this.loadUserBlogs();
        } else {
          this.loadBlogs();
        }
      });
    });
  }

  loadBlogs() {
    this.blogService.getBlogs().subscribe(data => {
      this.blogs = data;
      this.initialLoading = true;
    });
  }

  loadUserBlogs() {
    let username = this.activatedRoute.snapshot.params["username"];
    this.blogService.getUserBlogs(username).subscribe(
      (data: Blog[]) => {
        this.blogs = data;
        this.initialLoading = true;
      },
      (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.router.navigate(["/"]);
        }
      }
    );
  }

  formatTime(time: Date) {
    return moment(time).fromNow();
  }

  authUserActionButton(creator: string) {
    if (creator === localStorage.getItem("user")) return false;
    return true;
  }

  deleteBlog(blog: Blog) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      width: "500px",
      data: {
        message: "Are you sure to Delete this Blog ?"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.blogService.deleteBlogs(blog._id).subscribe(data => {
          this._snackBar.open("Blog " + data.message + " successfully", "", {
            duration: 2000
          });
          this.blogService.reloadBlogs.next();
        });
      }
    });
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
        this.blogService.reloadBlogs.next();
      }
    });
  }

  ngOnDestroy() {
    this.reloadSubscription.unsubscribe();
  }
}
