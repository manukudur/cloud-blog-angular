import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "./core/auth/login/login.component";
import { SignupComponent } from "./shared/components/signup/signup.component";
import { LogoutComponent } from "./core/auth/logout/logout.component";
import { LoginSignupGuard } from "./core/guards/login-signup.guard";
import { BlogComponent } from "./modules/blog/blog.component";
import { AuthGuard } from "./core/guards/auth.guard";

const routes: Routes = [
  { path: "", component: BlogComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent, canActivate: [LoginSignupGuard] },
  { path: "logout", component: LogoutComponent },
  {
    path: "signup",
    component: SignupComponent,
    canActivate: [LoginSignupGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
