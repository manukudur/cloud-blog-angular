import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BlogsComponent } from "./blogs/blogs.component";

const routes: Routes = [
  { path: "", component: BlogsComponent },
  { path: "**", redirectTo: "/", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
