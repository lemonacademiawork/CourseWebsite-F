import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="min-h-screen bg-[#FBF8F1] flex flex-col items-center justify-center px-4 text-center text-xs">
      <div class="w-16 h-16 bg-surface-container flex items-center justify-center rounded-full text-primary mb-6">
        <span class="material-symbols-outlined text-3xl">question_mark</span>
      </div>
      <h1 class="playfair text-3xl font-bold text-on-surface mb-2">404 - Not Found</h1>
      <p class="text-on-surface-variant max-w-sm mb-8 leading-relaxed">
        Page not found
      </p>
      <a 
        routerLink="/"
        class="bg-primary text-on-primary font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity shadow-sm inline-block">
        Back to Home
      </a>
    </main>
  `
})
export class NotFoundComponent {}
