import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { customHotelIcon, customUserIcon } from '../../constants/custom-icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FontAwesomeModule],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent {
  authService = inject(AuthService);
  
  faSearch = faSearch;
  customHotel = customHotelIcon;
  customUser = customUserIcon;

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }
}
