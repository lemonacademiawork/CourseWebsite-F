import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UploadService } from '../../../core/services/upload.service';

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
        <div class="flex items-center justify-between border-b border-outline-variant/20 pb-4">
          <div>
            <h1 class="text-xl font-bold">Upload Course Content</h1>
            <p class="text-xs text-on-surface-variant mt-0.5">Attach video lessons, masterclass slides, or downloadable documents.</p>
          </div>

          <!-- Upload Mode Toggle -->
          <div class="flex bg-surface-container-low p-1 rounded-lg border border-outline-variant/30">
            <button 
              type="button"
              (click)="uploadMode.set('file')"
              [class.bg-surface-container-lowest]="uploadMode() === 'file'"
              [class.shadow-xs]="uploadMode() === 'file'"
              [class.text-primary]="uploadMode() === 'file'"
              class="px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer">
              <span class="material-symbols-outlined text-[14px]">cloud_upload</span>
              Upload File
            </button>
            <button 
              type="button"
              (click)="uploadMode.set('url')"
              [class.bg-surface-container-lowest]="uploadMode() === 'url'"
              [class.shadow-xs]="uploadMode() === 'url'"
              [class.text-primary]="uploadMode() === 'url'"
              class="px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer">
              <span class="material-symbols-outlined text-[14px]">link</span>
              Paste Link
            </button>
          </div>
        </div>

        @if (success()) {
          <div class="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-xs flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">check_circle</span>
            Content file uploaded successfully!
          </div>
        }

        @if (error()) {
          <div class="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">error</span>
            {{ error() }}
          </div>
        }

        <form (ngSubmit)="handleUpload()" class="space-y-4">
          <!-- Title -->
          <div>
            <label class="block font-semibold mb-1">Content Title</label>
            <input 
              type="text" 
              placeholder="e.g. Masterclass Lesson 3 — Gold Foil Application"
              [ngModel]="title()"
              (ngModelChange)="title.set($event)"
              name="title"
              required
              class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <!-- Course Selection -->
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

          <!-- Media Picker / Dropzone -->
          @if (uploadMode() === 'file') {
            <div>
              <label class="block font-semibold mb-1">Media File / Video / Document</label>
              <input 
                #fileInput 
                type="file" 
                (change)="onFileSelected($event)" 
                accept=".mp4,.mov,.webm,.pdf,.doc,.docx,.png,.jpg,.jpeg,.zip"
                class="hidden" 
              />

              @if (!selectedFile() && !fileUrl()) {
                <div 
                  (click)="fileInput.click()"
                  class="border-2 border-dashed border-outline-variant/50 hover:border-primary rounded-xl p-6 text-center cursor-pointer transition-all bg-surface-container-low/40 hover:bg-surface-container-low">
                  <div class="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
                    <span class="material-symbols-outlined text-2xl">video_file</span>
                  </div>
                  <p class="font-bold text-xs text-on-surface">Click to browse or drop media file</p>
                  <p class="text-[10px] text-on-surface-variant mt-1">MP4, PDF, DOCX, PNG, or ZIP (Max 100MB)</p>
                </div>
              } @else {
                <div class="bg-surface-container-low border border-outline-variant/35 rounded-xl p-3.5 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <span class="material-symbols-outlined text-xl">file_present</span>
                    </div>
                    <div>
                      <p class="font-bold text-xs text-on-surface">{{ selectedFile()?.name || title() || 'Attached File' }}</p>
                      <p class="text-[10px] text-on-surface-variant">Cloudinary Upload</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    @if (isUploading()) {
                      <div class="flex items-center gap-1 text-primary font-semibold text-[11px]">
                        <span class="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                        Uploading...
                      </div>
                    } @else {
                      <span class="text-green-700 bg-green-100 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span class="material-symbols-outlined text-[12px]">check</span> Uploaded
                      </span>
                      <button 
                        type="button" 
                        (click)="clearFile()" 
                        class="p-1 hover:bg-surface-container text-on-surface-variant hover:text-red-600 rounded cursor-pointer"
                        title="Remove file">
                        <span class="material-symbols-outlined text-sm">close</span>
                      </button>
                    }
                  </div>
                </div>
              }
            </div>
          } @else {
            <!-- URL / Embed Link -->
            <div>
              <label class="block font-semibold mb-1">File URL / Media Embed Link</label>
              <input 
                type="url" 
                placeholder="https://storage.googleapis.com/... or https://..."
                [ngModel]="fileUrl()"
                (ngModelChange)="fileUrl.set($event)"
                name="fileUrl"
                required
                class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
          }

          <button 
            type="submit" 
            [disabled]="isUploading() || !title().trim() || !fileUrl().trim()"
            class="w-full py-3 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-sm cursor-pointer disabled:opacity-50">
            {{ isUploading() ? 'Uploading...' : 'Upload & Attach Content' }}
          </button>
        </form>
      </div>
    </main>
  `
})
export class AdminContentUploadComponent {
  private uploadService = inject(UploadService);

  title = signal<string>('');
  courseId = signal<string>('lippan-art');
  fileUrl = signal<string>('');
  uploadMode = signal<'file' | 'url'>('file');
  selectedFile = signal<File | null>(null);
  isUploading = signal<boolean>(false);
  success = signal<boolean>(false);
  error = signal<string>('');

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile.set(file);
      this.error.set('');

      if (!this.title().trim()) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        this.title.set(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }

      this.isUploading.set(true);
      this.uploadService.uploadMedia(file, 'courses').subscribe({
        next: (res: any) => {
          this.isUploading.set(false);
          const url = res.url || res.secure_url || res.data?.url;
          this.fileUrl.set(url);
        },
        error: (err) => {
          this.isUploading.set(false);
          this.error.set(err?.error?.message || 'Upload failed. You can paste the direct link instead.');
        }
      });
    }
  }

  clearFile(): void {
    this.selectedFile.set(null);
    this.fileUrl.set('');
  }

  handleUpload(): void {
    if (!this.title().trim() || !this.fileUrl().trim()) return;
    this.success.set(true);
    setTimeout(() => {
      this.success.set(false);
      this.title.set('');
      this.fileUrl.set('');
      this.selectedFile.set(null);
    }, 2000);
  }
}

