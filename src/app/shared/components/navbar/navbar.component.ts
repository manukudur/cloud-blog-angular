import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { AuthService } from "src/app/core/services/auth.service";
import { BlogDialogComponent } from "../blog-dialog/blog-dialog.component";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit {
  isLoginMode: boolean;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    if (localStorage.getItem("token") && localStorage.getItem("user")) {
      this.isLoginMode = false;
    } else {
      this.isLoginMode = true;
    }
    this.authService.loginState.subscribe(loginState => {
      this.isLoginMode = !loginState;
    });
  }
  createBlogDialog() {
    const dialogRef = this.dialog.open(BlogDialogComponent, {
      width: "500px",
      data: { dialogType: "Create" }
    });

    dialogRef.afterClosed().subscribe(received => {
      if (received) {
        this._snackBar.open("Blog " + received.message + " successfully", "", {
          duration: 2000
        });
      }
    });
  }
}
