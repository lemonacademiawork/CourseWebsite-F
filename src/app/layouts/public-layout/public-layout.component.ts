import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNavbarComponent } from '../../shared/components/top-navbar/top-navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, TopNavbarComponent, FooterComponent],
  template: `
    <div class="flex flex-col min-h-screen">
      <app-top-navbar></app-top-navbar>
      <div class="flex-grow">
        <router-outlet></router-outlet>
      </div>
      <app-footer></app-footer>
    </div>
  `
})
export class PublicLayoutComponent {}
