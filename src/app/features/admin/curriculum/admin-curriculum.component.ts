import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { ModuleService } from '../../../core/services/module.service';
import { LessonService } from '../../../core/services/lesson.service';
import { UploadService } from '../../../core/services/upload.service';
import { Course } from '../../../core/models/course.model';
import { CourseModule, CreateModulePayload, UpdateModulePayload } from '../../../core/models/module.model';
import { Lesson, CreateLessonPayload, UpdateLessonPayload } from '../../../core/models/lesson.model';

@Component({
  selector: 'app-admin-curriculum',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-curriculum.component.html'
})
export class AdminCurriculumComponent implements OnInit, OnDestroy {
  private courseService = inject(CourseService);
  private moduleService = inject(ModuleService);
  private lessonService = inject(LessonService);
  private uploadService = inject(UploadService);
  private route = inject(ActivatedRoute);

  courses = signal<Course[]>([]);
  selectedCourse = signal<Course | null>(null);
  modules = signal<CourseModule[]>([]);
  selectedModule = signal<CourseModule | null>(null);
  lessonsMap = signal<Record<string, Lesson[]>>({}); // moduleId -> lessons
  isLoadingCourses = signal<boolean>(true);
  isLoadingModules = signal<boolean>(false);
  isLoadingLessons = signal<boolean>(false);
  saveSuccess = signal<string>('');
  errorMessage = signal<string>('');

  // Module Modal States
  isModuleModalOpen = signal<boolean>(false);
  isEditingModule = signal<boolean>(false);
  editingModuleId = signal<string>('');
  modTitle = signal<string>('');
  modDescription = signal<string>('');
  modOrderIndex = signal<number>(1);
  modIsPublished = signal<boolean>(true);
  isSavingModule = signal<boolean>(false);

  // Lesson Modal States
  isLessonModalOpen = signal<boolean>(false);
  isEditingLesson = signal<boolean>(false);
  targetModuleForLesson = signal<CourseModule | null>(null);
  editingLessonId = signal<string>('');
  lesTitle = signal<string>('');
  lesDescription = signal<string>('');
  lesVideoProvider = signal<string>('CLOUDINARY');
  lesVideoId = signal<string>('');
  lesVideoUrl = signal<string>('');
  lesThumbnailUrl = signal<string>('');
  lesDurationMinutes = signal<number>(10);
  lesOrderIndex = signal<number>(1);
  lesIsPreview = signal<boolean>(false);
  lesIsPublished = signal<boolean>(true);
  isUploadingLessonThumbnail = signal<boolean>(false);
  isSavingLesson = signal<boolean>(false);

  // Video Preview State
  previewingLesson = signal<Lesson | null>(null);

  private refreshHandler = () => {
    if (this.selectedCourse()) {
      this.loadModules(this.selectedCourse()!.id);
    }
  };

  ngOnInit(): void {
    this.loadCourses();

    if (typeof window !== 'undefined') {
      window.addEventListener('modules_updated', this.refreshHandler);
      window.addEventListener('lessons_updated', this.refreshHandler);
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('modules_updated', this.refreshHandler);
      window.removeEventListener('lessons_updated', this.refreshHandler);
    }
  }

  loadCourses(): void {
    this.isLoadingCourses.set(true);
    this.courseService.getCourses().subscribe({
      next: (list) => {
        this.courses.set(list || []);
        this.isLoadingCourses.set(false);

        // Check if courseId provided in query params
        this.route.queryParams.subscribe(params => {
          const cId = params['courseId'];
          if (cId && list.some(c => c.id === cId)) {
            const found = list.find(c => c.id === cId);
            if (found) this.selectCourse(found);
          } else if (list.length > 0 && !this.selectedCourse()) {
            this.selectCourse(list[0]);
          }
        });
      },
      error: () => {
        this.courses.set([]);
        this.isLoadingCourses.set(false);
      }
    });
  }

  selectCourse(course: Course): void {
    this.selectedCourse.set(course);
    this.selectedModule.set(null);
    this.loadModules(course.id);
  }

  loadModules(courseId: string, preferredModuleId?: string): void {
    this.isLoadingModules.set(true);
    this.moduleService.getModules(courseId).subscribe({
      next: (mods) => {
        this.modules.set(mods || []);
        this.isLoadingModules.set(false);

        if (mods && mods.length > 0) {
          const target = preferredModuleId
            ? mods.find(m => m.id === preferredModuleId) || mods[0]
            : (this.selectedModule() && mods.find(m => m.id === this.selectedModule()!.id)) || mods[0];
          this.selectedModule.set(target);

          // Preload lessons for all modules
          mods.forEach(m => this.loadLessonsForModule(m.id));
        } else {
          this.selectedModule.set(null);
        }
      },
      error: () => {
        this.modules.set([]);
        this.isLoadingModules.set(false);
      }
    });
  }

  selectModule(mod: CourseModule): void {
    this.selectedModule.set(mod);
    this.loadLessonsForModule(mod.id);
  }

  loadLessonsForModule(moduleId: string): void {
    if (!moduleId) return;
    this.lessonService.getLessons(moduleId).subscribe({
      next: (lessons) => {
        this.lessonsMap.update(prev => ({
          ...prev,
          [moduleId]: lessons || []
        }));
      }
    });
  }

  getLessonsCount(moduleId: string): number {
    return (this.lessonsMap()[moduleId] || []).length;
  }

  // --- MODULE ACTIONS ---
  openCreateModuleModal(): void {
    if (!this.selectedCourse()) {
      alert('Please select a course first.');
      return;
    }
    this.isEditingModule.set(false);
    this.editingModuleId.set('');
    this.modTitle.set(`Module ${this.modules().length + 1}: `);
    this.modDescription.set('');
    this.modOrderIndex.set(this.modules().length + 1);
    this.modIsPublished.set(true);
    this.isModuleModalOpen.set(true);
  }

  openEditModuleModal(mod: CourseModule, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.isEditingModule.set(true);
    this.editingModuleId.set(mod.id);
    this.modTitle.set(mod.title || '');
    this.modDescription.set(mod.description || '');
    this.modOrderIndex.set(mod.orderIndex || 1);
    this.modIsPublished.set(mod.isPublished !== false);
    this.isModuleModalOpen.set(true);
  }

  closeModuleModal(): void {
    this.isModuleModalOpen.set(false);
    this.editingModuleId.set('');
  }

  handleSaveModule(): void {
    const course = this.selectedCourse();
    if (!course || !this.modTitle().trim()) return;

    this.isSavingModule.set(true);

    if (this.isEditingModule() && this.editingModuleId()) {
      const payload: UpdateModulePayload = {
        title: this.modTitle().trim(),
        description: this.modDescription().trim(),
        orderIndex: Number(this.modOrderIndex()) || 1,
        isPublished: this.modIsPublished()
      };

      this.moduleService.updateModule(course.id, this.editingModuleId(), payload).subscribe({
        next: () => {
          this.isSavingModule.set(false);
          this.isModuleModalOpen.set(false);
          this.saveSuccess.set(`Module "${payload.title}" updated successfully!`);
          this.loadModules(course.id, this.editingModuleId());
          setTimeout(() => this.saveSuccess.set(''), 3500);
        },
        error: () => {
          this.isSavingModule.set(false);
          this.isModuleModalOpen.set(false);
          this.loadModules(course.id);
        }
      });
    } else {
      const payload: CreateModulePayload = {
        title: this.modTitle().trim(),
        description: this.modDescription().trim(),
        orderIndex: Number(this.modOrderIndex()) || (this.modules().length + 1),
        isPublished: this.modIsPublished()
      };

      this.moduleService.createModule(course.id, payload).subscribe({
        next: (created) => {
          this.isSavingModule.set(false);
          this.isModuleModalOpen.set(false);
          this.saveSuccess.set(`Module "${payload.title}" created successfully!`);
          this.loadModules(course.id, created?.id || created?.data?.id);
          setTimeout(() => this.saveSuccess.set(''), 3500);
        },
        error: () => {
          this.isSavingModule.set(false);
          this.isModuleModalOpen.set(false);
          this.loadModules(course.id);
        }
      });
    }
  }

  toggleModulePublish(mod: CourseModule, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    const course = this.selectedCourse();
    if (!course || !mod.id) return;

    this.moduleService.togglePublishModule(course.id, mod.id).subscribe({
      next: () => {
        mod.isPublished = !mod.isPublished;
        this.saveSuccess.set(`Module "${mod.title}" status toggled.`);
        setTimeout(() => this.saveSuccess.set(''), 2500);
      },
      error: () => {
        mod.isPublished = !mod.isPublished;
      }
    });
  }

  handleDeleteModule(mod: CourseModule, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    const course = this.selectedCourse();
    if (!course || !mod.id) return;

    if (confirm(`Are you sure you want to delete module "${mod.title}" and its lessons?`)) {
      this.moduleService.deleteModule(course.id, mod.id).subscribe({
        next: () => {
          this.saveSuccess.set(`Module "${mod.title}" deleted.`);
          this.loadModules(course.id);
          setTimeout(() => this.saveSuccess.set(''), 3000);
        },
        error: () => {
          this.loadModules(course.id);
        }
      });
    }
  }

  // --- LESSON ACTIONS ---
  openCreateLessonModal(mod: CourseModule): void {
    this.targetModuleForLesson.set(mod);
    this.isEditingLesson.set(false);
    this.editingLessonId.set('');
    this.lesTitle.set('');
    this.lesDescription.set('');
    this.lesVideoProvider.set('CLOUDINARY');
    this.lesVideoId.set(`v_${Date.now()}`);
    this.lesVideoUrl.set('');
    this.lesThumbnailUrl.set('');
    this.lesDurationMinutes.set(10);
    this.lesOrderIndex.set(this.getLessonsCount(mod.id) + 1);
    this.lesIsPreview.set(false);
    this.lesIsPublished.set(true);
    this.isLessonModalOpen.set(true);
  }

  openEditLessonModal(lesson: Lesson, mod: CourseModule): void {
    this.targetModuleForLesson.set(mod);
    this.isEditingLesson.set(true);
    this.editingLessonId.set(lesson.id);
    this.lesTitle.set(lesson.title || '');
    this.lesDescription.set(lesson.description || '');
    this.lesVideoProvider.set(lesson.videoProvider || 'CLOUDINARY');
    this.lesVideoId.set(lesson.videoId || '');
    this.lesVideoUrl.set(lesson.videoUrl || '');
    this.lesThumbnailUrl.set(lesson.thumbnailUrl || '');
    this.lesDurationMinutes.set(Math.max(1, Math.round((lesson.durationSeconds || 600) / 60)));
    this.lesOrderIndex.set(lesson.orderIndex || 1);
    this.lesIsPreview.set(!!lesson.isPreview);
    this.lesIsPublished.set(lesson.isPublished !== false);
    this.isLessonModalOpen.set(true);
  }

  closeLessonModal(): void {
    this.isLessonModalOpen.set(false);
    this.targetModuleForLesson.set(null);
    this.editingLessonId.set('');
  }

  handleSaveLesson(): void {
    const mod = this.targetModuleForLesson();
    if (!mod || !this.lesTitle().trim()) {
      alert('Please provide a lesson title.');
      return;
    }

    const durationSec = Math.max(1, Math.round(Number(this.lesDurationMinutes()) * 60));
    const payload: CreateLessonPayload = {
      title: this.lesTitle().trim(),
      description: this.lesDescription().trim(),
      videoProvider: this.lesVideoProvider().trim() || 'CLOUDINARY',
      videoId: this.lesVideoId().trim() || `v_${Date.now()}`,
      videoUrl: this.lesVideoUrl().trim(),
      thumbnailUrl: this.lesThumbnailUrl().trim(),
      durationSeconds: durationSec,
      fileSizeBytes: 52428800,
      orderIndex: Number(this.lesOrderIndex()) || 1,
      isPreview: this.lesIsPreview(),
      isPublished: this.lesIsPublished()
    };

    this.isSavingLesson.set(true);

    if (this.isEditingLesson() && this.editingLessonId()) {
      this.lessonService.updateLesson(mod.id, this.editingLessonId(), payload).subscribe({
        next: () => {
          this.isSavingLesson.set(false);
          this.isLessonModalOpen.set(false);
          this.saveSuccess.set(`Lesson "${payload.title}" updated successfully!`);
          this.loadLessonsForModule(mod.id);
          setTimeout(() => this.saveSuccess.set(''), 3500);
        },
        error: () => {
          this.isSavingLesson.set(false);
          this.isLessonModalOpen.set(false);
          this.loadLessonsForModule(mod.id);
        }
      });
    } else {
      this.lessonService.createLesson(mod.id, payload).subscribe({
        next: () => {
          this.isSavingLesson.set(false);
          this.isLessonModalOpen.set(false);
          this.saveSuccess.set(`Lesson "${payload.title}" added to ${mod.title}!`);
          this.loadLessonsForModule(mod.id);
          setTimeout(() => this.saveSuccess.set(''), 3500);
        },
        error: () => {
          this.isSavingLesson.set(false);
          this.isLessonModalOpen.set(false);
          this.loadLessonsForModule(mod.id);
        }
      });
    }
  }

  toggleLessonPublish(lesson: Lesson, moduleId: string): void {
    if (!lesson.id || !moduleId) return;

    this.lessonService.togglePublishLesson(moduleId, lesson.id).subscribe({
      next: () => {
        lesson.isPublished = !lesson.isPublished;
        this.saveSuccess.set(`Lesson "${lesson.title}" status toggled.`);
        setTimeout(() => this.saveSuccess.set(''), 2500);
      },
      error: () => {
        lesson.isPublished = !lesson.isPublished;
      }
    });
  }

  handleDeleteLesson(lesson: Lesson, moduleId: string): void {
    if (!lesson.id || !moduleId) return;

    if (confirm(`Are you sure you want to delete lesson "${lesson.title}"?`)) {
      this.lessonService.deleteLesson(moduleId, lesson.id).subscribe({
        next: () => {
          this.saveSuccess.set(`Lesson "${lesson.title}" deleted.`);
          this.loadLessonsForModule(moduleId);
          setTimeout(() => this.saveSuccess.set(''), 3000);
        },
        error: () => {
          this.loadLessonsForModule(moduleId);
        }
      });
    }
  }

  onLessonThumbnailSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.isUploadingLessonThumbnail.set(true);
      this.uploadService.uploadImage(file, 'lessons').subscribe({
        next: (res: any) => {
          this.isUploadingLessonThumbnail.set(false);
          const url = res.url || res.secure_url || res.data?.url;
          if (url) this.lesThumbnailUrl.set(url);
          input.value = '';
        },
        error: () => {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.isUploadingLessonThumbnail.set(false);
            if (e.target?.result) this.lesThumbnailUrl.set(e.target.result as string);
            input.value = '';
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  openVideoPreview(lesson: Lesson): void {
    this.previewingLesson.set(lesson);
  }

  closeVideoPreview(): void {
    this.previewingLesson.set(null);
  }

  formatDuration(seconds?: number): string {
    if (!seconds || seconds <= 0) return '0 min';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (secs === 0) return `${mins} min`;
    return `${mins}m ${secs}s`;
  }
}
