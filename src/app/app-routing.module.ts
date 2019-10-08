import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { BlogsComponent } from "./blogs/blogs.component";
import { LoginComponent } from "./core/auth/login/login.component";
import { SignupComponent } from "./shared/components/signup/signup.component";
import { LogoutComponent } from "./core/auth/logout/logout.component";

const routes: Routes = [
  { path: "", component: BlogsComponent },
  { path: "login", component: LoginComponent },
  { path: "logout", component: LogoutComponent },
  { path: "signup", component: SignupComponent },
  { path: "**", redirectTo: "/", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
