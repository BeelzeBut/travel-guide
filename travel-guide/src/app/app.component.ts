import { Component, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements DoCheck {
  title: string = 'travel-guide';
  isMenuRequired: boolean = false;
  isAdmin: boolean = false;
  constructor(private router: Router, private authService: AuthService) { }

  ngDoCheck() {
    const currentUrl = this.router.url;
    if (currentUrl === '/login' || currentUrl === '/register') {
      this.isMenuRequired = false;
    } else {
      this.isMenuRequired = true;
    }

    this.isAdmin = this.authService.getIsAdmin();
  }

  logout() {
    this.authService.logout();
  }
}
