import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { customHotelIcon, customUserIcon } from '../../constants/custom-icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [RouterLink, FontAwesomeModule],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent {
  authService = inject(AuthService);
  private router = inject(Router);
  
  faSearch = faSearch;
  customHotel = customHotelIcon;
  customUser = customUserIcon;

  login() {
    this.router.navigate(['/auth']);
  }

  goToBookings() {
    this.router.navigate(['/user/bookings']);
  }

  logout() {
    this.authService.logout();
  }
}
