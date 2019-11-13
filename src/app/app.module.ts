import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { MatDialogModule } from "@angular/material/dialog";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatCardModule } from "@angular/material/card";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatMenuModule } from "@angular/material/menu";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatDividerModule } from "@angular/material/divider";
import { MatTabsModule } from "@angular/material/tabs";

import { AppComponent } from "./app.component";
import { NavbarComponent } from "./shared/components/navbar/navbar.component";
import { BlogDialogComponent } from "./shared/components/blog-dialog/blog-dialog.component";
import { LoginComponent } from "./core/auth/login/login.component";
import { SignupComponent } from "./shared/components/signup/signup.component";
import { ErrorDialogComponent } from "./shared/components/error-dialog/error-dialog.component";
import { SuccessDialogComponent } from "./shared/components/success-dialog/success-dialog.component";
import { LogoutComponent } from "./core/auth/logout/logout.component";
import { LoginSignupGuard } from "./core/guards/login-signup.guard";
import { BlogModule } from "./modules/blog/blog.module";
import { AuthGuard } from "./core/guards/auth.guard";
import { ConfirmDialogComponent } from "./shared/components/confirm-dialog/confirm-dialog.component";
import { ConfirmPasswordComponent } from "./shared/components/confirm-password/confirm-password.component";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    BlogDialogComponent,
    LoginComponent,
    SignupComponent,
    ErrorDialogComponent,
    SuccessDialogComponent,
    LogoutComponent,
    ConfirmDialogComponent,
    ConfirmPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatCardModule,
    HttpClientModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatMenuModule,
    MatExpansionModule,
    MatDividerModule,
    MatTabsModule,
    BlogModule
  ],
  entryComponents: [
    BlogDialogComponent,
    ErrorDialogComponent,
    SuccessDialogComponent,
    ConfirmPasswordComponent
  ],
  providers: [MatDatepickerModule, LoginSignupGuard, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}
