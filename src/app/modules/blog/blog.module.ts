import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "src/app/core/auth/auth.interceptor";

import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatDividerModule } from "@angular/material/divider";
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatDatepickerModule } from "@angular/material/datepicker";

import { BlogComponent } from "./blog.component";
import { BlogRoutingModule } from "./blog-routing.module";
import { SettingsComponent } from "./settings/settings.component";
import { ProfileComponent } from "./settings/profile/profile.component";
import { SecurityComponent } from "./settings/security/security.component";
import { AccountComponent } from "./settings/account/account.component";
import { ConfirmDialogComponent } from "src/app/shared/components/confirm-dialog/confirm-dialog.component";

@NgModule({
  declarations: [
    BlogComponent,
    SettingsComponent,
    ProfileComponent,
    SecurityComponent,
    AccountComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    BlogRoutingModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatButtonModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatDatepickerModule
  ],
  entryComponents: [ConfirmDialogComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  exports: [BlogComponent]
})
export class BlogModule {}
