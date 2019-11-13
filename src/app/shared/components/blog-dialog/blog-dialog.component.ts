import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";

import { Blog } from "src/app/shared/models/blog.model";
import { BlogService } from "src/app/core/services/blog.service";

@Component({
  selector: "app-blog-dialog",
  templateUrl: "./blog-dialog.component.html",
  styleUrls: ["./blog-dialog.component.css"]
})
export class BlogDialogComponent implements OnInit {
  public form: FormGroup;
  loading: boolean = false;
  error: string = null;

  constructor(
    public blogService: BlogService,
    public dialogRef: MatDialogRef<BlogDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { dialogType: string; blog?: Blog }
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.initilizeForm();
    if (this.data.blog) {
      this.loading = true;
      this.blogService.getBlog(this.data.blog._id).subscribe((blog: any) => {
        this.form.setValue({
          _id: blog._id,
          title: blog.title,
          desc: blog.desc,
          image_url: blog.image_url
        });
        this.loading = false;
      });
    }
  }

  submitBlogForm() {
    this.loading = true;
    if (this.data.dialogType === "Edit") {
      this.blogService.updateBlog(this.form.value).subscribe(
        received => {
          this.onNoClick(received);
        },
        error => {
          this.error = error.error.message;
          this.loading = false;
        }
      );
    } else {
      this.blogService.postBlog(this.form.value).subscribe(
        received => {
          this.onNoClick(received);
        },
        (error: HttpErrorResponse) => {
          this.error = error.error.message;
          this.loading = false;
        }
      );
    }
  }

  onNoClick(data?: { message: string }): void {
    this.dialogRef.close(data);
  }

  initilizeForm() {
    this.form = new FormGroup({
      _id: new FormControl(null),
      title: new FormControl(null, [
        Validators.required,
        Validators.minLength(3)
      ]),
      desc: new FormControl(null, [
        Validators.required,
        Validators.minLength(10)
      ]),
      image_url: new FormControl(null)
    });
  }
}
