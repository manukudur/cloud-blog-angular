import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { Blog } from "src/app/shared/models/blog.model";
import { BlogService } from "src/app/core/services/blog.service";

@Component({
  selector: "app-blog-dialog",
  templateUrl: "./blog-dialog.component.html",
  styleUrls: ["./blog-dialog.component.css"]
})
export class BlogDialogComponent implements OnInit {
  public form: FormGroup;
  loading: boolean = true;
  error: string = null;
  constructor(
    public blogService: BlogService,
    public dialogRef: MatDialogRef<BlogDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { dialogType: string; blog?: Blog }
  ) {}
  ngOnInit(): void {
    if (this.data.blog) {
      this.form = new FormGroup({
        _id: new FormControl(this.data.blog._id),
        title: new FormControl(this.data.blog.title, [
          Validators.required,
          Validators.minLength(3)
        ]),
        desc: new FormControl(this.data.blog.desc, [
          Validators.required,
          Validators.minLength(10)
        ]),
        image_url: new FormControl(this.data.blog.image_url)
      });
    } else {
      this.form = new FormGroup({
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
  submitBlogForm() {
    this.loading = false;
    if (this.data.dialogType === "Edit") {
      this.blogService.updateBlog(this.form.value).subscribe(
        received => {
          this.onNoClick(received);
        },
        error => {
          this.error = error.error.message.errors.title.message;
          this.loading = true;
        }
      );
    } else {
      this.blogService.postBlog(this.form.value).subscribe(
        received => {
          this.onNoClick(received);
        },
        error => {
          this.error = error.error.message.errors.title.message;
          this.loading = true;
        }
      );
    }
  }
  onNoClick(data: { message: string }): void {
    this.dialogRef.close(data);
  }
  onCancleClick(): void {
    this.dialogRef.close();
  }
}
