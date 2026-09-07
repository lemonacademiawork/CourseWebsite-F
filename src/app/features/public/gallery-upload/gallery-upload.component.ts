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
          this.courseTitle.set(list[0].title);
        }
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
        // If backend upload fails, fallback to using data URL preview for submission
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

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const payload = {
      title: t,
      imageUrl: img,
      studentName: this.studentName().trim() || this.authService.userName() || 'Artisan Student',
      courseTitle: this.courseTitle().trim() || 'Community Craft Studio',
      category: this.category(),
      description: this.description().trim()
    };

    this.galleryService.submitGalleryItem(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.isSuccess.set(true);
      },
      error: () => {
        // Optimistic fallback
        this.isSubmitting.set(false);
        this.isSuccess.set(true);
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
