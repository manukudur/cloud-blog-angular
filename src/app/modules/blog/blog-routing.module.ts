import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { BlogComponent } from "./blog.component";
import { SettingsComponent } from "./settings/settings.component";
import { AuthGuard } from "src/app/core/guards/auth.guard";
import { ProfileComponent } from "./settings/profile/profile.component";
import { SecurityComponent } from "./settings/security/security.component";
import { AccountComponent } from "./settings/account/account.component";

const routes: Routes = [
  { path: "", component: BlogComponent },
  { path: "settings", redirectTo: "settings/profile", pathMatch: "full" },
  {
    path: "settings",
    component: SettingsComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "profile", component: ProfileComponent },
      { path: "security", component: SecurityComponent },
      { path: "account", component: AccountComponent }
    ]
  },
  {
    path: ":username",
    component: BlogComponent
  },
  { path: "**", redirectTo: "/", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule {}
