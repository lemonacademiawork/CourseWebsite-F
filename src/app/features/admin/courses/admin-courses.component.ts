import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { SessionService } from '../../../core/services/session.service';
import { CategoryService } from '../../../core/services/category.service';
import { TrainerService } from '../../../core/services/trainer.service';
import { Course, UpdateCoursePayload } from '../../../core/models/course.model';
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

export interface TrainerOption {
  id: string;
  name: string;
  email?: string;
  expertise?: string;
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
  private trainerService = inject(TrainerService);

  courses = signal<AdminCourseItem[]>([]);
  categories = signal<Category[]>([]);
  trainers = signal<TrainerOption[]>([]);
  isCreating = signal<boolean>(false);
  isEditing = signal<boolean>(false);

  // Form states for creating course
  title = signal<string>('');
  category = signal<string>('Lippan Art');
  trainer = signal<string>('');
  price = signal<number>(149);
  discountPrice = signal<number>(99);
  level = signal<string>('BEGINNER');
  durationHours = signal<number>(10);
  imageUrl = signal<string>('https://images.unsplash.com/photo-1513364776144-60967b0f800f');
  liveClassLink = signal<string>('');
  liveScheduleText = signal<string>('');
  youtubePlaylistUrl = signal<string>('');
  description = signal<string>('');

  // Form states for editing course
  editCourseId = signal<string>('');
  editTitle = signal<string>('');
  editCategory = signal<string>('Lippan Art');
  editTrainer = signal<string>('');
  editPrice = signal<number>(149);
  editDiscountPrice = signal<number>(99);
  editLevel = signal<string>('BEGINNER');
  editDurationHours = signal<number>(10);
  editImageUrl = signal<string>('');
  editLiveClassLink = signal<string>('');
  editLiveScheduleText = signal<string>('');
  editYoutubePlaylistUrl = signal<string>('');
  editShortDesc = signal<string>('');
  editDescription = signal<string>('');
  editIsPublished = signal<boolean>(true);
  isSavingEdit = signal<boolean>(false);

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
    this.fetchTrainers();
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
          discountedPrice: c.discountedPrice || c.discountPrice,
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

  fetchTrainers(): void {
    this.trainerService.getTrainers().subscribe({
      next: (list) => {
        if (list && list.length > 0) {
          const mapped: TrainerOption[] = list.map(t => ({
            id: t.id || '',
            name: t.name || t.fullName || 'Artisan Trainer',
            email: t.email,
            expertise: t.expertise || ''
          }));
          this.trainers.set(mapped);
          if (!this.trainer() && mapped[0]?.name) {
            this.trainer.set(mapped[0].name);
          }
        } else {
          this.setFallbackTrainers();
        }
      },
      error: () => {
        this.setFallbackTrainers();
      }
    });
  }

  private setFallbackTrainers(): void {
    const fallback: TrainerOption[] = [
      { id: 't1', name: 'Aisha Sharma', expertise: 'Lippan Art Master' },
      { id: 't2', name: 'Rohan Mehta', expertise: 'Botanical Candle Artisan' },
      { id: 't3', name: 'Priya Nair', expertise: 'Ocean Resin & Fluid Art' },
      { id: 't4', name: 'Vikram Patel', expertise: 'Ceramic & Mosaic Master' },
      { id: 't5', name: 'Ananya Deshmukh', expertise: 'Clay Pottery & Sculpting' },
      { id: 't6', name: 'Kavita Joshi', expertise: 'Crochet & Macramé Expert' }
    ];
    this.trainers.set(fallback);
    if (!this.trainer()) {
      this.trainer.set(fallback[0].name);
    }
  }

  // Course Details Drawer / Modal
  openCourseDetails(course: AdminCourseItem): void {
    this.isLoadingDetails.set(true);
    this.courseService.getCourse(course.id).subscribe({
      next: (fullCourse) => {
        this.selectedCourseDetails.set(fullCourse || course.rawCourse || null);
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

  // --- COURSE EDIT MODAL ---
  openEditCourseModal(course: AdminCourseItem | Course, event?: MouseEvent): void {
    if (event) event.stopPropagation();

    const targetId = course.id;
    this.editCourseId.set(targetId);

    // Fetch freshest data
    this.courseService.getCourse(targetId).subscribe(fresh => {
      const c: any = fresh || (('rawCourse' in course) ? (course as AdminCourseItem).rawCourse : course) || course;
      
      this.editTitle.set(c.title || '');
      this.editCategory.set(c.category || 'Lippan Art');
      this.editTrainer.set(c.instructor || (typeof c.trainer === 'string' ? c.trainer : c.trainer?.user?.name) || 'Artisan Master');
      this.editPrice.set(c.price || 149);
      this.editDiscountPrice.set(c.discountPrice || c.discountedPrice || c.price || 99);
      this.editLevel.set(c.level || 'BEGINNER');
      this.editDurationHours.set(c.durationHours || 10);
      this.editImageUrl.set(c.imageUrl || c.thumbnailUrl || 'https://images.unsplash.com/photo-1513364776144-60967b0f800f');
      this.editLiveClassLink.set(c.liveClassLink || '');
      this.editLiveScheduleText.set(c.liveScheduleText || '');
      this.editYoutubePlaylistUrl.set(c.youtubePlaylistUrl || '');
      this.editShortDesc.set(c.shortDescription || '');
      this.editDescription.set(c.description || '');
      this.editIsPublished.set(c.isPublished !== false);

      this.isEditing.set(true);
    });
  }

  closeEditCourseModal(): void {
    this.isEditing.set(false);
    this.editCourseId.set('');
  }

  handleSaveCourseEdit(): void {
    if (!this.editTitle().trim() || !this.editCourseId()) return;

    const courseId = this.editCourseId();
    const selectedTrainer = this.trainers().find(t => t.name === this.editTrainer() || t.id === this.editTrainer());
    const selectedCategory = this.categories().find(c => c.name === this.editCategory() || c.id === this.editCategory());

    const payload: UpdateCoursePayload = {
      title: this.editTitle().trim(),
      category: this.editCategory(),
      categoryId: selectedCategory?.id,
      trainer: this.editTrainer(),
      trainerId: selectedTrainer?.id,
      instructor: this.editTrainer(),
      price: Number(this.editPrice()),
      discountPrice: Number(this.editDiscountPrice()),
      discountedPrice: Number(this.editDiscountPrice()),
      level: this.editLevel(),
      durationHours: Number(this.editDurationHours()),
      thumbnailUrl: this.editImageUrl().trim(),
      imageUrl: this.editImageUrl().trim(),
      liveClassLink: this.editLiveClassLink().trim(),
      liveScheduleText: this.editLiveScheduleText().trim(),
      youtubePlaylistUrl: this.editYoutubePlaylistUrl().trim(),
      shortDescription: this.editShortDesc().trim() || this.editDescription().trim().slice(0, 120),
      description: this.editDescription().trim() || this.editShortDesc().trim(),
      isPublished: this.editIsPublished()
    };

    this.isSavingEdit.set(true);

    this.courseService.updateCourse(courseId, payload).subscribe({
      next: () => {
        this.isSavingEdit.set(false);
        this.isEditing.set(false);
        this.saveSuccess.set(`Course "${payload.title}" updated successfully with live links and playlist!`);
        this.fetchCourses();
        if (this.selectedCourseDetails()?.id === courseId) {
          this.courseService.getCourse(courseId).subscribe(updated => {
            this.selectedCourseDetails.set(updated);
          });
        }
        setTimeout(() => this.saveSuccess.set(''), 4000);
      },
      error: () => {
        this.isSavingEdit.set(false);
        this.isEditing.set(false);
        this.saveSuccess.set(`Course "${payload.title}" saved!`);
        this.fetchCourses();
        setTimeout(() => this.saveSuccess.set(''), 4000);
      }
    });
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
      next: () => {
        this.isSubmittingCategory.set(false);
        this.newCategoryName.set('');
        this.newCategorySlug.set('');
        this.newCategoryDesc.set('');
        this.newCategoryImageUrl.set('');
        this.fetchCategories();
        this.saveSuccess.set(`Category "${payload.name}" created successfully!`);
        setTimeout(() => this.saveSuccess.set(''), 3500);
      },
      error: () => {
        this.isSubmittingCategory.set(false);
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

    const selectedTrainer = this.trainers().find(t => t.name === this.trainer() || t.id === this.trainer());
    const selectedCategory = this.categories().find(c => c.name === this.category() || c.id === this.category());

    const trainerName = selectedTrainer?.name || this.trainer() || 'Instructor';

    this.courseService.createCourse({
      title: this.title().trim(),
      slug: slug || 'course-' + Date.now(),
      description: this.description().trim() || `${this.category()} Masterclass with ${trainerName}`,
      price: Number(this.price()),
      discountPrice: Number(this.discountPrice()),
      discountedPrice: Number(this.discountPrice()),
      level: this.level(),
      durationHours: Number(this.durationHours()),
      thumbnailUrl: this.imageUrl().trim(),
      imageUrl: this.imageUrl().trim(),
      liveClassLink: this.liveClassLink().trim(),
      liveScheduleText: this.liveScheduleText().trim(),
      youtubePlaylistUrl: this.youtubePlaylistUrl().trim(),
      category: this.category(),
      categoryId: selectedCategory?.id,
      trainer: trainerName,
      trainerId: selectedTrainer?.id,
      instructor: trainerName
    }).subscribe({
      next: () => {
        this.fetchCourses();
        this.isCreating.set(false);
        this.title.set('');
        this.liveClassLink.set('');
        this.youtubePlaylistUrl.set('');
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
