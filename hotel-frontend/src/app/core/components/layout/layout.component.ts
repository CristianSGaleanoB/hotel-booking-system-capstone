import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { AuthService } from '../../services/auth.service';
import { RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, SideMenuComponent, RouterOutlet, FontAwesomeModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  authService = inject(AuthService);
  isSidebarOpen = signal(false);
  faBars = faBars;
  faTimes = faTimes;

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }
}
