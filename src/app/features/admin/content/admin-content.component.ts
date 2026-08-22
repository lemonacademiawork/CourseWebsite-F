import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-content',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="p-6 max-w-container-max mx-auto text-xs text-on-surface">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-xl font-bold text-on-surface">Creative Content Management</h1>
          <p class="text-xs text-on-surface-variant mt-0.5">Manage lesson modules, video files, and assets.</p>
        </div>
        <a routerLink="/admin/content/upload" class="bg-primary text-on-primary font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 flex items-center gap-1.5 shadow-sm">
          <span class="material-symbols-outlined text-sm">upload</span>
          Upload Media
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-xl p-4 shadow-sm space-y-3">
          <div class="h-36 bg-surface-container-low rounded-lg overflow-hidden relative">
            <img class="w-full h-full object-cover" src="https://images.unsplash.com/photo-1513364776144-60967b0f800f" alt="Media" />
            <span class="absolute top-2 left-2 bg-black/60 text-white px-2 py-0.5 rounded text-[10px] font-bold">Video MP4</span>
          </div>
          <h3 class="font-bold text-sm">Lippan Clay Mixing 4K Tutorial</h3>
          <p class="text-[11px] text-on-surface-variant">Course: The Art of Lippan • Duration: 12m 40s</p>
        </div>

        <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-xl p-4 shadow-sm space-y-3">
          <div class="h-36 bg-surface-container-low rounded-lg overflow-hidden relative">
            <img class="w-full h-full object-cover" src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119" alt="Media" />
            <span class="absolute top-2 left-2 bg-black/60 text-white px-2 py-0.5 rounded text-[10px] font-bold">PDF Material</span>
          </div>
          <h3 class="font-bold text-sm">Geometric Kutchi Grid Blueprints</h3>
          <p class="text-[11px] text-on-surface-variant">Course: The Art of Lippan • File: 2.4 MB</p>
        </div>
      </div>
    </main>
  `
})
export class AdminContentComponent {}
