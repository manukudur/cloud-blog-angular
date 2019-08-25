import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { Blog } from "src/app/models/blog.model";
import { BlogService } from "src/app/blog.service";

@Component({
  selector: "app-blog-dialog",
  templateUrl: "./blog-dialog.component.html",
  styleUrls: ["./blog-dialog.component.css"]
})
export class BlogDialogComponent implements OnInit {
  public form: FormGroup;
  loading: boolean = true;
  constructor(
    public blogService: BlogService,
    public dialogRef: MatDialogRef<BlogDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { dialogType: string; blog?: Blog }
  ) {}
  ngOnInit(): void {
    if (this.data.blog) {
      this.form = new FormGroup({
        _id: new FormControl(this.data.blog._id),
        title: new FormControl(this.data.blog.title, Validators.required),
        desc: new FormControl(this.data.blog.desc, Validators.required),
        imageUrl: new FormControl(this.data.blog.imageUrl, Validators.required)
      });
    } else {
      this.form = new FormGroup({
        title: new FormControl(null, Validators.required),
        desc: new FormControl(null, Validators.required),
        imageUrl: new FormControl(null, Validators.required)
      });
    }
  }
  submitBlogForm() {
    this.loading = false;
    if (this.data.blog) {
      this.blogService.updateBlog(this.form.value).subscribe(received => {
        this.onNoClick(received);
      });
    } else {
      this.blogService.postBlog(this.form.value).subscribe(received => {
        this.onNoClick(received);
      });
    }
  }
  onNoClick(data: { message: string }): void {
    this.dialogRef.close(data);
  }
}
