import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminSidebarComponent } from '../../shared/components/admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, AdminSidebarComponent],
  template: `
    <app-admin-sidebar></app-admin-sidebar>
    <div class="md:ml-60 min-h-screen bg-[#FBF8F1]">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AdminLayoutComponent {}
