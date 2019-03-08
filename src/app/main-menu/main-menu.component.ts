import {Component} from '@angular/core';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent {

  navbarCollapsed = true;

  toggleNav() {
    this.navbarCollapsed = !this.navbarCollapsed;
  }
}
