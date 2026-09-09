import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { GalleryService } from '../../../core/services/gallery.service';
import { UploadService } from '../../../core/services/upload.service';
import { AuthService } from '../../../core/services/auth.service';
import { CourseService } from '../../../core/services/course.service';
import { Course } from '../../../core/models/course.model';

@Component({
  selector: 'app-gallery-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './gallery-upload.component.html'
})
export class GalleryUploadComponent implements OnInit {
  private galleryService = inject(GalleryService);
  private uploadService = inject(UploadService);
  public authService = inject(AuthService);
  private courseService = inject(CourseService);
  private router = inject(Router);

  // Form Signals
  title = signal<string>('');
  category = signal<string>('Lippan Art');
  courseId = signal<string>('');
  courseTitle = signal<string>('');
  studentName = signal<string>('');
  description = signal<string>('');
  imageUrl = signal<string>('');

  // Upload & File State
  selectedFile = signal<File | null>(null);
  previewUrl = signal<string>('');
  isUploadingImage = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  isSuccess = signal<boolean>(false);
  errorMessage = signal<string>('');
  dragOver = signal<boolean>(false);

  // My Uploads list for deletion
  myUploads = signal<any[]>([]);

  // Courses dropdown list
  courses = signal<Course[]>([]);

  categories = [
    'Lippan Art',
    'Ceramics & Clay',
    'Resin & Glass',
    'Mosaic & Tile',
    'Artisan Painting',
    'Traditional Crafts',
    'Digital Illustration',
    'Sculpting & Terracotta'
  ];

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.studentName.set(this.authService.userName() || 'Artisan Student');
    }

    this.courseService.getCourses().subscribe({
      next: (list) => {
        if (list && list.length > 0) {
          this.courses.set(list);
          this.courseId.set(list[0].id);
          this.courseTitle.set(list[0].title);
        }
      }
    });

    this.loadMyUploads();
  }

  loadMyUploads(): void {
    this.galleryService.getMyGallerySubmissions().subscribe({
      next: (list) => {
        if (list && list.length > 0) {
          this.myUploads.set(list);
        } else {
          // Fallback to public gallery filtered by user name
          this.galleryService.getPublicGallery().subscribe(pub => {
            const userName = (this.authService.userName() || '').toLowerCase().trim();
            const matched = (pub || []).filter(i => (i.studentName || '').toLowerCase().trim() === userName);
            this.myUploads.set(matched);
          });
        }
      },
      error: () => {}
    });
  }

  deleteUpload(item: any): void {
    if (!confirm(`Delete your uploaded artwork "${item.title}"?`)) return;

    this.galleryService.deleteGalleryItem(item.id).subscribe({
      next: () => {
        this.myUploads.update(list => list.filter(i => i.id !== item.id));
      },
      error: () => {
        this.myUploads.update(list => list.filter(i => i.id !== item.id));
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(false);
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.processFile(event.dataTransfer.files[0]);
    }
  }

  processFile(file: File): void {
    if (!file.type.startsWith('image/')) {
      this.errorMessage.set('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    // Max 15MB
    if (file.size > 15 * 1024 * 1024) {
      this.errorMessage.set('File size exceeds 15MB. Please choose a smaller image.');
      return;
    }

    this.selectedFile.set(file);
    this.errorMessage.set('');

    // Local Preview
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewUrl.set(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary backend
    this.isUploadingImage.set(true);
    this.uploadService.uploadImage(file, 'gallery').subscribe({
      next: (res) => {
        this.isUploadingImage.set(false);
        if (res && res.url) {
          this.imageUrl.set(res.url);
        }
      },
      error: () => {
        this.isUploadingImage.set(false);
        // Fallback to data URL
        if (this.previewUrl()) {
          this.imageUrl.set(this.previewUrl());
        }
      }
    });
  }

  removeSelectedImage(): void {
    this.selectedFile.set(null);
    this.previewUrl.set('');
    this.imageUrl.set('');
  }

  submitArtwork(): void {
    const t = this.title().trim();
    const img = this.imageUrl().trim() || this.previewUrl().trim();

    if (!t) {
      this.errorMessage.set('Please enter a title for your artwork.');
      return;
    }

    if (!img) {
      this.errorMessage.set('Please select or upload an image of your artwork.');
      return;
    }

    if (!this.authService.isLoggedIn()) {
      this.errorMessage.set('Please log in to submit your artwork to the gallery showcase.');
      return;
    }

    const resolvedCourseId = this.courseId() || (this.courses().length > 0 ? this.courses()[0].id : '');
    if (!resolvedCourseId) {
      this.errorMessage.set('Please select a course for this artwork.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const payload = {
      courseId: resolvedCourseId,
      title: t,
      description: this.description().trim() || `${this.category()} handcrafted project`,
      mediaUrl: img,
      mediaType: 'IMAGE',
      imageUrl: img,
      studentName: this.studentName().trim() || this.authService.userName() || 'Artisan Student',
      category: this.category()
    };

    this.galleryService.submitGalleryItem(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.isSuccess.set(true);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        const backendMsg = err.error?.message || (err.status === 401 ? 'Please log in as an enrolled student to submit artwork.' : 'Failed to submit artwork. Please verify your details.');
        this.errorMessage.set(backendMsg);
      }
    });
  }

  resetForm(): void {
    this.isSuccess.set(false);
    this.title.set('');
    this.description.set('');
    this.removeSelectedImage();
  }
}
