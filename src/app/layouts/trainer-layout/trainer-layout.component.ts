import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TrainerSidebarComponent } from '../../shared/components/trainer-sidebar/trainer-sidebar.component';

@Component({
  selector: 'app-trainer-layout',
  standalone: true,
  imports: [RouterOutlet, TrainerSidebarComponent],
  template: `
    <app-trainer-sidebar></app-trainer-sidebar>
    <div class="md:ml-60 min-h-screen bg-[#FBF8F1]">
      <router-outlet></router-outlet>
    </div>
  `
})
export class TrainerLayoutComponent {}
