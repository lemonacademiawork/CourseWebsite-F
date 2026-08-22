import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-content-upload',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <main class="p-6 max-w-2xl mx-auto text-xs text-on-surface">
      <div class="mb-6 flex items-center justify-between">
        <a routerLink="/admin/content" class="text-primary hover:underline font-semibold flex items-center gap-1">
          <span class="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to Content
        </a>
      </div>

      <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        <h1 class="text-xl font-bold">Upload Course Content</h1>

        @if (success()) {
          <div class="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-xs">
            Content file uploaded successfully!
          </div>
        }

        <form (ngSubmit)="handleUpload()" class="space-y-4">
          <div>
            <label class="block font-semibold mb-1">Content Title</label>
            <input 
              type="text" 
              placeholder="e.g. Masterclass Lesson 3"
              [ngModel]="title()"
              (ngModelChange)="title.set($event)"
              name="title"
              required
              class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <div>
            <label class="block font-semibold mb-1">Select Associated Course</label>
            <select 
              [ngModel]="courseId()"
              (ngModelChange)="courseId.set($event)"
              name="courseId"
              class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none">
              <option value="lippan-art">The Art of Lippan</option>
              <option value="mosaic-art">Mosaic Art Workshop</option>
              <option value="resin-art">Ocean Resin Pour</option>
            </select>
          </div>

          <div>
            <label class="block font-semibold mb-1">File URL / Media Embed Link</label>
            <input 
              type="url" 
              placeholder="https://storage.googleapis.com/..."
              [ngModel]="fileUrl()"
              (ngModelChange)="fileUrl.set($event)"
              name="fileUrl"
              required
              class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <button 
            type="submit" 
            class="w-full py-3 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-sm cursor-pointer">
            Upload &amp; Attach Content
          </button>
        </form>
      </div>
    </main>
  `
})
export class AdminContentUploadComponent {
  title = signal<string>('');
  courseId = signal<string>('lippan-art');
  fileUrl = signal<string>('');
  success = signal<boolean>(false);

  handleUpload(): void {
    if (!this.title().trim() || !this.fileUrl().trim()) return;
    this.success.set(true);
    setTimeout(() => {
      this.success.set(false);
      this.title.set('');
      this.fileUrl.set('');
    }, 2000);
  }
}
