import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../core/services/course.service';
import { CourseResource } from '../../../core/models/common.model';

@Component({
  selector: 'app-trainer-resources',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="p-6 max-w-container-max mx-auto text-xs text-on-surface">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-xl font-bold text-on-surface">Course Resources &amp; Blueprints</h1>
          <p class="text-xs text-on-surface-variant mt-0.5">Upload downloadable templates and guides for Lippan Art students.</p>
        </div>
        <button 
          (click)="isUploading.set(!isUploading())"
          class="bg-primary text-on-primary font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 flex items-center gap-1.5 shadow-sm cursor-pointer">
          <span class="material-symbols-outlined text-sm">upload_file</span>
          Upload Resource
        </button>
      </div>

      @if (isUploading()) {
        <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-xl p-6 mb-6 shadow-sm space-y-4">
          <h3 class="font-bold text-sm">Add Resource File</h3>
          <form (ngSubmit)="handleUpload()" class="space-y-3">
            <div>
              <label class="block font-semibold mb-1">Title</label>
              <input 
                type="text" 
                placeholder="e.g. Clay Mixture Proportion Chart"
                [ngModel]="title()"
                (ngModelChange)="title.set($event)"
                name="title"
                required
                class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs"
              />
            </div>
            <div>
              <label class="block font-semibold mb-1">Download URL</label>
              <input 
                type="url" 
                placeholder="https://..."
                [ngModel]="url()"
                (ngModelChange)="url.set($event)"
                name="url"
                required
                class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs"
              />
            </div>
            <button type="submit" class="w-full py-2.5 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90 cursor-pointer">
              Upload Blueprint
            </button>
          </form>
        </div>
      }

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        @for (res of resources(); track res.id) {
          <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 flex justify-between items-center shadow-sm">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-primary text-2xl">picture_as_pdf</span>
              <div>
                <h4 class="font-bold text-xs">{{ res.title }}</h4>
                <p class="text-[10px] text-on-surface-variant">{{ res.type }} • {{ res.fileSize || '1.5 MB' }}</p>
              </div>
            </div>
            <a [href]="res.fileUrl" target="_blank" class="bg-primary/10 text-primary font-semibold px-3 py-1.5 rounded text-xs hover:bg-primary/20">
              Download
            </a>
          </div>
        }

        @if (resources().length === 0) {
          <div class="col-span-2 text-center py-8 text-on-surface-variant bg-surface-container-low rounded-xl">
            No resources uploaded yet.
          </div>
        }
      </div>
    </main>
  `
})
export class TrainerResourcesComponent implements OnInit {
  private courseService = inject(CourseService);
  resources = signal<CourseResource[]>([]);
  isUploading = signal<boolean>(false);

  title = signal<string>('');
  url = signal<string>('');

  ngOnInit(): void {
    this.courseService.getResources('lippan-art').subscribe({
      next: (list) => this.resources.set(list),
      error: () => this.resources.set([])
    });
  }

  handleUpload(): void {
    if (!this.title().trim() || !this.url().trim()) return;

    this.courseService.addResource('lippan-art', {
      title: this.title(),
      type: 'PDF',
      fileUrl: this.url()
    }).subscribe({
      next: (item) => {
        this.resources.update(list => [item, ...list]);
        this.isUploading.set(false);
        this.title.set('');
        this.url.set('');
      }
    });
  }
}
