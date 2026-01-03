import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  items: MenuItem[] = [];
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
  }

  updateMenu() {
    this.items = [
      {
        label: 'FlyHigh',
        icon: 'pi pi-fw pi-send',
        routerLink: '/',
      },
      {
        label: 'search Flights',
        icon: 'pi pi-fw pi-search',
        routerLink: '/booking/search',
        visible: this.isLoggedIn,
      },
      {
        label: 'New Booking',
        icon: 'pi pi-fw pi-plus',
        routerLink: '/booking',
        visible: this.isLoggedIn,
      },
    ];
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
