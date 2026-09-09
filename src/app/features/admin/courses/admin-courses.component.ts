import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { SessionService } from '../../../core/services/session.service';
import { CategoryService } from '../../../core/services/category.service';
import { Course } from '../../../core/models/course.model';
import { CourseSession, SessionStatus } from '../../../core/models/session.model';
import { Category } from '../../../core/models/category.model';

export interface AdminCourseItem {
  id: string;
  title: string;
  category: string;
  trainer: string;
  price: number;
  discountedPrice?: number;
  studentsCount: number;
  status: 'Published' | 'Draft';
  createdDate: string;
  rawCourse?: Course;
}

@Component({
  selector: 'app-admin-courses',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-courses.component.html'
})
export class AdminCoursesComponent implements OnInit {
  private courseService = inject(CourseService);
  private sessionService = inject(SessionService);
  private categoryService = inject(CategoryService);

  courses = signal<AdminCourseItem[]>([]);
  categories = signal<Category[]>([]);
  isCreating = signal<boolean>(false);

  // Form states for creating course
  title = signal<string>('');
  category = signal<string>('Lippan Art');
  trainer = signal<string>('');
  price = signal<number>(149);
  status = signal<'Published' | 'Draft'>('Published');

  // Course Details states
  selectedCourseDetails = signal<Course | null>(null);
  isLoadingDetails = signal<boolean>(false);

  // Category Manager states
  isCategoryModalOpen = signal<boolean>(false);
  newCategoryName = signal<string>('');
  newCategorySlug = signal<string>('');
  newCategoryDesc = signal<string>('');
  newCategoryImageUrl = signal<string>('');
  isSubmittingCategory = signal<boolean>(false);

  // Session states
  selectedCourseId = signal<string | null>(null);
  sessions = signal<CourseSession[]>([]);
  editingSessionId = signal<string | null>(null);
  tempZoomLink = signal<string>('');
  tempRecordingLink = signal<string>('');
  saveSuccess = signal<string>('');

  // Delete course states
  courseToDelete = signal<AdminCourseItem | null>(null);
  isDeleting = signal<boolean>(false);
  errorMessage = signal<string>('');

  ngOnInit(): void {
    this.fetchCourses();
    this.fetchCategories();
  }

  fetchCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (list) => {
        const mapped: AdminCourseItem[] = list.map(c => ({
          id: c.id,
          title: c.title,
          category: c.category,
          trainer: c.instructor,
          price: c.price,
          discountedPrice: c.discountedPrice,
          studentsCount: c.studentsCount || 0,
          status: c.isPublished ? 'Published' : 'Draft',
          createdDate: c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent',
          rawCourse: c
        }));
        this.courses.set(mapped);
      },
      error: () => {
        this.courses.set([]);
      }
    });
  }

  fetchCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (cats) => {
        if (cats && cats.length > 0) {
          this.categories.set(cats);
        } else {
          // Fallback initial craft categories
          this.categories.set([
            { id: '1', name: 'Lippan Art', slug: 'lippan-art', description: 'Traditional Indian clay & mirror art', imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f' },
            { id: '2', name: 'Candle Making', slug: 'candle-making', description: 'Botanical and soy wax candle making', imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59' },
            { id: '3', name: 'Resin Art', slug: 'resin-art', description: 'Epoxy resin ocean wave and geode creations', imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675' },
            { id: '4', name: 'Mosaic Art', slug: 'mosaic-art', description: 'Ceramic and stained glass mosaic masterclasses', imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119' },
            { id: '5', name: 'Pottery', slug: 'pottery', description: 'Hand-building and wheel throwing pottery', imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261' },
            { id: '6', name: 'Crochet Basics', slug: 'crochet-basics', description: 'Foundational stitches and patterns for beginners', imageUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff' }
          ]);
        }
      },
      error: () => {}
    });
  }

  // Course Details Drawer / Modal
  openCourseDetails(course: AdminCourseItem): void {
    this.isLoadingDetails.set(true);
    this.courseService.getCourse(course.id).subscribe({
      next: (fullCourse) => {
        this.selectedCourseDetails.set(fullCourse || course.rawCourse || {
          id: course.id,
          title: course.title,
          category: course.category,
          instructor: course.trainer,
          price: course.price,
          discountedPrice: course.discountedPrice,
          studentsCount: course.studentsCount,
          isPublished: course.status === 'Published',
          description: `${course.category} masterclass instructed by ${course.trainer}`,
          imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f'
        });
        this.isLoadingDetails.set(false);
      },
      error: () => {
        this.selectedCourseDetails.set(course.rawCourse || null);
        this.isLoadingDetails.set(false);
      }
    });
  }

  closeCourseDetails(): void {
    this.selectedCourseDetails.set(null);
  }

  // Category Creation / Management
  openCategoryManager(): void {
    this.isCategoryModalOpen.set(true);
  }

  closeCategoryManager(): void {
    this.isCategoryModalOpen.set(false);
    this.newCategoryName.set('');
    this.newCategorySlug.set('');
    this.newCategoryDesc.set('');
    this.newCategoryImageUrl.set('');
  }

  onCategoryNameInput(name: string): void {
    this.newCategoryName.set(name);
    if (!this.newCategorySlug() || this.newCategorySlug() === this.slugify(name.slice(0, -1))) {
      this.newCategorySlug.set(this.slugify(name));
    }
  }

  slugify(text: string): string {
    return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  handleCreateCategory(): void {
    if (!this.newCategoryName().trim()) return;

    const slug = this.newCategorySlug().trim() || this.slugify(this.newCategoryName());
    const payload = {
      name: this.newCategoryName().trim(),
      slug: slug,
      description: this.newCategoryDesc().trim() || `${this.newCategoryName()} workshop courses`,
      imageUrl: this.newCategoryImageUrl().trim() || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff'
    };

    this.isSubmittingCategory.set(true);
    this.categoryService.createCategory(payload).subscribe({
      next: (created) => {
        this.isSubmittingCategory.set(false);
        this.newCategoryName.set('');
        this.newCategorySlug.set('');
        this.newCategoryDesc.set('');
        this.newCategoryImageUrl.set('');
        this.fetchCategories();
        this.saveSuccess.set(`Category "${payload.name}" created successfully!`);
        setTimeout(() => this.saveSuccess.set(''), 3500);
      },
      error: (err) => {
        this.isSubmittingCategory.set(false);
        // Fallback local update if offline / mocked
        const fallbackCat: Category = {
          id: Date.now().toString(),
          ...payload
        };
        this.categories.update(prev => [...prev, fallbackCat]);
        this.newCategoryName.set('');
        this.newCategorySlug.set('');
        this.newCategoryDesc.set('');
        this.newCategoryImageUrl.set('');
        this.saveSuccess.set(`Category "${payload.name}" added!`);
        setTimeout(() => this.saveSuccess.set(''), 3500);
      }
    });
  }

  handleDeleteCategory(catId: string, catName: string): void {
    if (confirm(`Are you sure you want to delete category "${catName}"?`)) {
      this.categoryService.deleteCategory(catId).subscribe({
        next: () => {
          this.fetchCategories();
          this.saveSuccess.set(`Category "${catName}" deleted.`);
          setTimeout(() => this.saveSuccess.set(''), 3000);
        },
        error: () => {
          this.categories.update(prev => prev.filter(c => c.id !== catId));
          this.saveSuccess.set(`Category "${catName}" removed.`);
          setTimeout(() => this.saveSuccess.set(''), 3000);
        }
      });
    }
  }

  handleCreateCourse(): void {
    if (!this.title().trim()) return;
    const slug = this.slugify(this.title());

    this.courseService.createCourse({
      title: this.title().trim(),
      slug: slug || 'course-' + Date.now(),
      description: `${this.category()} Masterclass with ${this.trainer() || 'Instructor'}`,
      price: this.price()
    }).subscribe({
      next: () => {
        this.fetchCourses();
        this.isCreating.set(false);
        this.title.set('');
        this.saveSuccess.set('Course published successfully!');
        setTimeout(() => this.saveSuccess.set(''), 3000);
      },
      error: (err) => {
        console.error('Failed to create course:', err);
      }
    });
  }

  openDeleteConfirm(course: AdminCourseItem, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.errorMessage.set('');
    this.courseToDelete.set(course);
  }

  executeDeleteCourse(): void {
    const course = this.courseToDelete();
    if (!course) return;

    this.isDeleting.set(true);
    this.errorMessage.set('');

    this.courseService.deleteCourse(course.id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.courseToDelete.set(null);
        if (this.selectedCourseDetails()?.id === course.id) {
          this.selectedCourseDetails.set(null);
        }
        this.saveSuccess.set(`Course "${course.title}" deleted successfully.`);
        this.fetchCourses();
        setTimeout(() => this.saveSuccess.set(''), 3000);
      },
      error: (err) => {
        this.isDeleting.set(false);
        console.error('Failed to delete course:', err);
        const backendMsg = err?.error?.message || err?.error?.error || '';
        const msg = backendMsg || (err?.status === 403 
          ? 'Permission denied (403). Your account does not have admin permissions to delete this course on the server.' 
          : 'Failed to delete course. Please try again.');
        this.errorMessage.set(msg);
      }
    });
  }

  openSessionManager(courseId: string, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.selectedCourseId.set(courseId);
    const list = this.sessionService.getSessions(courseId);
    this.sessions.set(list);
  }

  closeSessionManager(): void {
    this.selectedCourseId.set(null);
    this.editingSessionId.set(null);
  }

  startEditingSession(session: CourseSession): void {
    this.editingSessionId.set(session.id);
    this.tempZoomLink.set(session.zoomLink || '');
    this.tempRecordingLink.set(session.recordingLink || '');
  }

  saveSessionEdit(session: CourseSession): void {
    session.zoomLink = this.tempZoomLink();
    session.recordingLink = this.tempRecordingLink();

    if (this.selectedCourseId()) {
      this.sessionService.saveSessions(this.selectedCourseId()!, this.sessions());
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('session_database_updated'));
      }
    }

    this.editingSessionId.set(null);
    this.saveSuccess.set('Session links saved successfully!');
    setTimeout(() => this.saveSuccess.set(''), 3000);
  }

  getStatus(session: CourseSession): SessionStatus {
    return this.sessionService.getSessionStatus(session);
  }
}
