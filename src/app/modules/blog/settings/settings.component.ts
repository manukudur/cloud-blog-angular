import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.css"]
})
export class SettingsComponent implements OnInit {
  links = [
    { name: "Profile", path: "./profile" },
    { name: "Security", path: "./security" },
    { name: "Account", path: "./account" }
  ];
  activeLink = this.links[0];

  constructor() {}

  ngOnInit() {}
}
