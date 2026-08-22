import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trainer-blogs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="p-6 max-w-container-max mx-auto text-xs text-on-surface">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-xl font-bold text-on-surface">Artisan Blog Contributions</h1>
          <p class="text-xs text-on-surface-variant mt-0.5">Your published tutorials and crafting articles.</p>
        </div>
      </div>

      <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-xl p-4 shadow-sm">
        <h3 class="font-bold text-sm mb-2">10 Essential Tools for Lippan Art Beginners</h3>
        <p class="text-xs text-on-surface-variant mb-4">Published on Aug 10, 2026 • 5 min read • 1,240 Views</p>
        <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
          Published Live
        </span>
      </div>
    </main>
  `
})
export class TrainerBlogsComponent {}
