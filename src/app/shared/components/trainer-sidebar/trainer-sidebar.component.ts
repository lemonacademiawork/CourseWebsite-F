import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-trainer-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './trainer-sidebar.component.html'
})
export class TrainerSidebarComponent {
  authService = inject(AuthService);

  handleLogout(): void {
    this.authService.logout();
  }
}
