import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../core/services/course.service';
import { UploadService } from '../../../core/services/upload.service';
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
          class="bg-primary text-on-primary font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 flex items-center gap-1.5 shadow-sm cursor-pointer transition-all">
          <span class="material-symbols-outlined text-sm">{{ isUploading() ? 'close' : 'upload_file' }}</span>
          {{ isUploading() ? 'Cancel' : 'Upload Resource' }}
        </button>
      </div>

      @if (isUploading()) {
        <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-2xl p-6 mb-6 shadow-sm space-y-5 animate-fadeIn">
          <div class="flex items-center justify-between border-b border-outline-variant/20 pb-3">
            <div>
              <h3 class="font-bold text-sm text-on-surface">Add Resource File</h3>
              <p class="text-[11px] text-on-surface-variant">Attach downloadable PDF guides, templates, or blueprint documents.</p>
            </div>

            <!-- Upload Mode Switcher -->
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

          @if (errorMsg()) {
            <div class="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg p-2.5 flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">error</span>
              {{ errorMsg() }}
            </div>
          }

          <form (ngSubmit)="handleUpload()" class="space-y-4">
            <!-- Media Picker / File Dropzone -->
            @if (uploadMode() === 'file') {
              <div>
                <label class="block font-semibold mb-1.5 text-on-surface">Media File / Document</label>
                
                <input 
                  #fileInput 
                  type="file" 
                  (change)="onFileSelected($event)" 
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.png,.jpg,.jpeg,.webp,.svg" 
                  class="hidden" 
                />

                @if (!selectedFile() && !url()) {
                  <div 
                    (click)="fileInput.click()"
                    (dragover)="onDragOver($event)"
                    (dragleave)="onDragLeave($event)"
                    (drop)="onFileDropped($event)"
                    [class.border-primary]="isDragging()"
                    [class.bg-primary/5]="isDragging()"
                    class="border-2 border-dashed border-outline-variant/50 hover:border-primary rounded-xl p-6 text-center cursor-pointer transition-all bg-surface-container-low/40 hover:bg-surface-container-low">
                    <div class="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
                      <span class="material-symbols-outlined text-2xl">attach_file</span>
                    </div>
                    <p class="font-bold text-xs text-on-surface">Click to browse or drag and drop your file</p>
                    <p class="text-[10px] text-on-surface-variant mt-1">PDF, DOCX, ZIP, PNG, or JPG (Max 50MB)</p>
                  </div>
                } @else {
                  <div class="bg-surface-container-low border border-outline-variant/35 rounded-xl p-3.5 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <span class="material-symbols-outlined text-xl">{{ getFileIcon(fileType()) }}</span>
                      </div>
                      <div>
                        <p class="font-bold text-xs text-on-surface">{{ selectedFile()?.name || title() || 'Uploaded Resource' }}</p>
                        <p class="text-[10px] text-on-surface-variant">
                          {{ formatFileSize(fileSizeBytes()) }} • {{ fileType() }}
                        </p>
                      </div>
                    </div>

                    <div class="flex items-center gap-2">
                      @if (isUploadingFile()) {
                        <div class="flex items-center gap-1 text-primary font-semibold text-[11px]">
                          <span class="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                          Uploading...
                        </div>
                      } @else {
                        <span class="text-green-700 bg-green-100 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span class="material-symbols-outlined text-[12px]">check</span> Ready
                        </span>
                        <button 
                          type="button" 
                          (click)="clearSelectedFile()" 
                          class="p-1 hover:bg-surface-container text-on-surface-variant hover:text-red-600 rounded cursor-pointer transition-colors"
                          title="Remove file">
                          <span class="material-symbols-outlined text-sm">close</span>
                        </button>
                      }
                    </div>
                  </div>
                }
              </div>
            } @else {
              <!-- URL Input Mode -->
              <div>
                <label class="block font-semibold mb-1 text-on-surface">Download URL / Cloud Storage Link</label>
                <div class="relative">
                  <span class="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[16px]">link</span>
                  <input 
                    type="url" 
                    placeholder="https://drive.google.com/... or https://..."
                    [ngModel]="url()"
                    (ngModelChange)="url.set($event)"
                    name="url"
                    required
                    class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg py-2.5 pl-9 pr-3 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>
            }

            <!-- Title Input -->
            <div>
              <label class="block font-semibold mb-1 text-on-surface">Resource Title</label>
              <input 
                type="text" 
                placeholder="e.g. Clay Mixture Proportion Chart &amp; Template"
                [ngModel]="title()"
                (ngModelChange)="title.set($event)"
                name="title"
                required
                class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            <button 
              type="submit" 
              [disabled]="isUploadingFile() || !title().trim() || (!url().trim() && !selectedFile())"
              class="w-full py-2.5 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90 cursor-pointer transition-opacity flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50">
              <span class="material-symbols-outlined text-sm">save</span>
              {{ isUploadingFile() ? 'Uploading File...' : 'Attach Resource Blueprint' }}
            </button>
          </form>
        </div>
      }

      <!-- Uploaded Resources Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        @for (res of resources(); track res.id) {
          <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 flex justify-between items-center shadow-sm hover:border-primary/40 transition-colors">
            <div class="flex items-center gap-3 min-w-0 pr-2">
              <div class="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <span class="material-symbols-outlined text-2xl">{{ getFileIcon(res.fileType || res.type) }}</span>
              </div>
              <div class="min-w-0">
                <h4 class="font-bold text-xs truncate">{{ res.title }}</h4>
                <p class="text-[10px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                  <span class="uppercase font-semibold">{{ res.fileType || res.type || 'PDF' }}</span>
                  <span>•</span>
                  <span>{{ res.fileSize || '1.5 MB' }}</span>
                </p>
              </div>
            </div>

            <div class="flex items-center gap-1.5 flex-shrink-0">
              <a 
                [href]="res.fileUrl" 
                target="_blank" 
                download
                class="bg-primary/10 text-primary font-semibold px-3 py-1.5 rounded-lg text-xs hover:bg-primary/20 transition-colors flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">download</span>
                Download
              </a>
              <button 
                (click)="deleteResource(res.id)" 
                class="p-1.5 text-on-surface-variant hover:text-red-600 hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer"
                title="Delete Resource">
                <span class="material-symbols-outlined text-[16px]">delete</span>
              </button>
            </div>
          </div>
        }

        @if (resources().length === 0) {
          <div class="col-span-2 text-center py-12 text-on-surface-variant bg-surface-container-low rounded-2xl border border-dashed border-outline-variant/40">
            <span class="material-symbols-outlined text-primary text-3xl mb-1">inventory_2</span>
            <p class="font-semibold text-xs text-on-surface">No resources uploaded yet.</p>
            <p class="text-[11px] text-on-surface-variant mt-0.5 mb-3">Upload downloadable templates, guides, or PDFs for your enrolled students.</p>
            <button 
              (click)="isUploading.set(true)"
              class="px-3.5 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:opacity-90 cursor-pointer">
              Upload First Resource
            </button>
          </div>
        }
      </div>
    </main>
  `
})
export class TrainerResourcesComponent implements OnInit {
  private courseService = inject(CourseService);
  private uploadService = inject(UploadService);

  resources = signal<CourseResource[]>([]);
  isUploading = signal<boolean>(false);
  uploadMode = signal<'file' | 'url'>('file');

  title = signal<string>('');
  url = signal<string>('');
  fileType = signal<string>('PDF');
  fileSizeBytes = signal<number>(0);
  selectedFile = signal<File | null>(null);

  isDragging = signal<boolean>(false);
  isUploadingFile = signal<boolean>(false);
  errorMsg = signal<string>('');

  ngOnInit(): void {
    this.loadResources();
  }

  loadResources(): void {
    this.courseService.getResources('lippan-art').subscribe({
      next: (list) => this.resources.set(list),
      error: () => this.resources.set([])
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.processFile(event.dataTransfer.files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
    }
  }

  processFile(file: File): void {
    this.errorMsg.set('');
    this.selectedFile.set(file);
    this.fileSizeBytes.set(file.size);

    // Auto-detect file extension
    const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF';
    this.fileType.set(ext);

    // Auto-populate title if empty
    if (!this.title().trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      this.title.set(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }

    // Upload directly to Cloudinary
    this.isUploadingFile.set(true);
    this.uploadService.uploadDocument(file, 'resources').subscribe({
      next: (res: any) => {
        this.isUploadingFile.set(false);
        const fileUrl = res.url || res.secure_url || res.data?.url;
        this.url.set(fileUrl);
      },
      error: () => {
        // Fallback to media endpoint if document upload route varies
        this.uploadService.uploadMedia(file, 'resources').subscribe({
          next: (res: any) => {
            this.isUploadingFile.set(false);
            const fileUrl = res.url || res.secure_url || res.data?.url;
            this.url.set(fileUrl);
          },
          error: (err) => {
            this.isUploadingFile.set(false);
            this.errorMsg.set(err?.error?.message || 'File upload failed. You can paste the direct URL manually.');
          }
        });
      }
    });
  }

  clearSelectedFile(): void {
    this.selectedFile.set(null);
    this.url.set('');
    this.fileSizeBytes.set(0);
  }

  getFileIcon(type?: string): string {
    const t = (type || '').toUpperCase();
    if (t.includes('PDF')) return 'picture_as_pdf';
    if (t.includes('DOC') || t.includes('WORD') || t.includes('TXT')) return 'description';
    if (t.includes('XLS') || t.includes('SHEET') || t.includes('CSV')) return 'table_view';
    if (t.includes('ZIP') || t.includes('RAR') || t.includes('TAR')) return 'folder_zip';
    if (t.includes('PNG') || t.includes('JPG') || t.includes('JPEG') || t.includes('WEBP')) return 'image';
    if (t.includes('MP4') || t.includes('VIDEO') || t.includes('MOV')) return 'movie';
    return 'attach_file';
  }

  formatFileSize(bytes?: number): string {
    if (!bytes || bytes <= 0) return '1.2 MB';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  handleUpload(): void {
    if (!this.title().trim() || !this.url().trim()) {
      this.errorMsg.set('Please select a file or enter a valid URL.');
      return;
    }

    this.courseService.addResource('lippan-art', {
      title: this.title().trim(),
      fileType: this.fileType(),
      fileUrl: this.url().trim(),
      fileSize: this.fileSizeBytes() || undefined
    }).subscribe({
      next: (item) => {
        this.resources.update(list => [item, ...list]);
        this.isUploading.set(false);
        this.title.set('');
        this.url.set('');
        this.selectedFile.set(null);
      },
      error: (err) => {
        this.errorMsg.set(err?.error?.message || 'Failed to save resource blueprint.');
      }
    });
  }

  deleteResource(id: string): void {
    if (!confirm('Are you sure you want to delete this resource blueprint?')) return;
    this.courseService.deleteResource('lippan-art', id).subscribe({
      next: () => {
        this.resources.update(list => list.filter(r => r.id !== id));
      },
      error: () => {
        this.resources.update(list => list.filter(r => r.id !== id));
      }
    });
  }
}

