import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="min-h-screen bg-[#FBF8F1] flex flex-col items-center justify-center px-4 text-center text-xs">
      <div class="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6">
        <span class="material-symbols-outlined text-3xl">gavel</span>
      </div>
      <h1 class="playfair text-3xl font-bold text-on-surface mb-2">403 - Forbidden</h1>
      <p class="text-on-surface-variant max-w-sm mb-8 leading-relaxed">
        You don't have access to this area.
      </p>
      <a 
        [routerLink]="workspaceLink()"
        class="bg-primary text-on-primary font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity shadow-sm inline-block">
        Return to your workspace
      </a>
    </main>
  `
})
export class ForbiddenComponent implements OnInit {
  private authService = inject(AuthService);
  workspaceLink = signal<string>('/');

  ngOnInit(): void {
    const role = this.authService.userRole();
    if (role === 'admin') {
      this.workspaceLink.set('/admin/dashboard');
    } else if (role === 'trainer') {
      this.workspaceLink.set('/trainer/dashboard');
    } else {
      this.workspaceLink.set('/');
    }
  }
}
