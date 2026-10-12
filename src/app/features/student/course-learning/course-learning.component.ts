import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../../core/services/student.service';
import { AuthService } from '../../../core/services/auth.service';
import { ClassProgressService } from '../../../core/services/class-progress.service';

interface LearningModule {
  id: number;
  title: string;
  description: string;
}

@Component({
  selector: 'app-course-learning',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="min-h-screen bg-[#FBF8F1]">
      <!-- Video Player Section -->
      <section class="bg-inverse-surface">
        <div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
          <div class="aspect-video bg-surface-container-highest rounded-2xl overflow-hidden relative group cursor-pointer max-h-[500px] w-full">
            <img
              alt="Course Video Thumbnail"
              class="w-full h-full object-cover opacity-80"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8uUDwblCiOL-t_fXfhZIM8UQ-foGxJSn6hGpxc88wb2sRpHx1JziZTsyIyMRioyV9CjADQuW5gBqRqKDFu6eOTIYQf2HAOyCsjZjcyhbhsL8CFb64eHVwLqYBSkrGGTLumaD4JJDFWo8ty9SvJg4Xy_3q8B4kmpWkmjS0EPSmjFh7CZkEqu1cQUuArkgb_bWTKvi96Wzub4kSFI0wPer8_Y_UsI2v7eTfCEFrxNeDXBiSuuu0eVyXDF5xn_3Ruz6D8w"
            />
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-20 h-20 bg-primary text-on-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg cursor-pointer">
                <span class="material-symbols-outlined text-4xl">play_arrow</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Course Content -->
      <section class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10 text-xs">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-6">
            <div>
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-[11px] mb-2.5">
                <span class="material-symbols-outlined text-xs">verified</span>
                Verified Workshop Curriculum
              </div>
              <h1 class="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-3 font-bold">
                The Art of Lippan - Learning Studio
              </h1>
              <p class="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                Master the traditional mud and mirror work of Kutch. This module covers foundational
                techniques, materials preparation, and cultural significance of Lippan Kaam.
              </p>
            </div>

            <!-- Lemon House Craft Raw Materials & DIY Kits Link Banner -->
            <div class="bg-gradient-to-r from-[#FBF8F1] via-[#F5EFE0] to-[#EFE9DC] border border-[#E7E1D3] rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div class="flex items-start gap-3.5">
                <div class="w-10 h-10 rounded-xl bg-[#6E5410] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <span class="material-symbols-outlined text-xl">shopping_bag</span>
                </div>
                <div>
                  <h4 class="font-bold text-xs text-[#1C1A17]">Need Art Raw Materials or Complete Kits?</h4>
                  <p class="text-[11px] text-[#5B5650] mt-0.5">Order laser-cut MDF bases, precision mirrors, and clay from our official store.</p>
                </div>
              </div>
              <a 
                href="https://lemonhousecraft.in" 
                target="_blank" 
                rel="noopener noreferrer"
                class="px-4 py-2 bg-[#6E5410] hover:bg-[#5c4610] text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5 whitespace-nowrap cursor-pointer">
                <span>Visit lemonhousecraft.in</span>
                <span class="material-symbols-outlined text-xs">open_in_new</span>
              </a>
            </div>

            <!-- Read-only Info Banner for Students -->
            <div class="bg-surface-container-low border border-outline-variant/30 rounded-xl p-3.5 flex items-center gap-3 text-on-surface-variant">
              <span class="material-symbols-outlined text-primary text-lg shrink-0">info</span>
              <p class="text-[11px] leading-tight">
                Class completion is verified and updated authoritatively by your certified Trainer upon session completion. Students cannot manually alter progress.
              </p>
            </div>

            <!-- Module List with Read-Only Status Indicators -->
            <div class="space-y-3">
              @for (module of modulesList; track module.id) {
                <div 
                  class="rounded-xl p-4 flex items-center justify-between gap-4 transition-all"
                  [ngClass]="isModuleDone(module.id) 
                    ? 'bg-primary-container/15 border border-primary/20' 
                    : 'bg-surface-container-lowest border border-outline-variant/20'">
                  <div class="flex items-center gap-3.5">
                    <div 
                      class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
                      [ngClass]="isModuleDone(module.id) ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface'">
                      {{ module.id }}
                    </div>
                    <div>
                      <h3 class="font-bold text-xs text-on-surface">{{ module.title }}</h3>
                      <p class="text-[11px] text-on-surface-variant">{{ module.description }}</p>
                    </div>
                  </div>

                  <!-- Read-only status indicator badge -->
                  <div>
                    @if (isModuleDone(module.id)) {
                      <span class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <span class="material-symbols-outlined text-xs">check_circle</span>
                        Completed
                      </span>
                    } @else if (module.id === nextPendingModuleId()) {
                      <span class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        <span class="material-symbols-outlined text-xs">pending</span>
                        Pending
                      </span>
                    } @else {
                      <span class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-surface-container-high text-on-surface-variant border border-outline-variant/30">
                        <span class="material-symbols-outlined text-xs">schedule</span>
                        Upcoming
                      </span>
                    }
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Sidebar with Dynamic Progress -->
          <div class="space-y-6">
            <div class="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20 shadow-xs space-y-4">
              <h3 class="font-bold text-sm text-on-surface flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-base">trending_up</span>
                Authoritative Course Progress
              </h3>

              <div class="w-full bg-surface-container-high rounded-full h-3 overflow-hidden">
                <div class="bg-primary h-3 rounded-full transition-all duration-500" [style.width.%]="progressPercent()"></div>
              </div>

              <div class="flex justify-between items-center text-xs font-medium text-on-surface-variant">
                <span>{{ completedModules().size }} of {{ modulesList.length }} classes completed</span>
                <span class="font-bold text-primary">{{ progressPercent() }}%</span>
              </div>

              @if (progressPercent() === 100) {
                <div class="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold border border-emerald-200 flex items-center gap-2">
                  <span class="material-symbols-outlined text-emerald-600 text-base">verified</span>
                  <span>100% Completed! Your certificate is unlocked and ready on My Courses.</span>
                </div>
              } @else {
                <div class="p-3 bg-amber-50 text-amber-800 rounded-xl text-xs font-medium border border-amber-200 flex items-center gap-2">
                  <span class="material-symbols-outlined text-amber-600 text-base">lock</span>
                  <span>Complete all {{ modulesList.length }} classes with your trainer to unlock your certificate.</span>
                </div>
              }
            </div>

            <div class="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20 shadow-xs">
              <h3 class="font-bold text-sm text-on-surface mb-3">Assigned Master Trainer</h3>
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center font-bold text-sm">AS</div>
                <div>
                  <p class="font-bold text-xs text-on-surface">Aisha Sharma</p>
                  <p class="text-[11px] text-on-surface-variant">Certified Master Artisan • Lemon Academia</p>
                  <p class="text-[10px] text-primary mt-0.5">Authorizes Class Completion &amp; Attendance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  `
})
export class CourseLearningComponent implements OnInit, OnDestroy {
  private studentService = inject(StudentService);
  public authService = inject(AuthService);
  private classProgressService = inject(ClassProgressService);

  readonly modulesList: LearningModule[] = [
    { id: 1, title: 'Introduction & Materials Guide', description: 'History, workspace setup & MDF base selection' },
    { id: 2, title: 'Clay Dough & Base Preparation', description: 'Creating the perfect smooth clay mixture' },
    { id: 3, title: 'Mirror Placement & Geometric Patterns', description: 'Patterns, spacing, symmetry & adhesion' },
    { id: 4, title: 'Curing, Acrylic Painting & Sealing', description: 'Varnish, moisture resistance & wall mounting' }
  ];

  completedModules = signal<Set<number>>(new Set([1]));

  progressPercent = computed(() => {
    return this.classProgressService.calculateProgress(this.modulesList.length, this.completedModules().size);
  });

  nextPendingModuleId = computed<number | null>(() => {
    const done = this.completedModules();
    for (const m of this.modulesList) {
      if (!done.has(m.id)) return m.id;
    }
    return null;
  });

  private syncListener = () => this.loadAuthoritativeProgress();

  ngOnInit(): void {
    this.loadAuthoritativeProgress();
    if (typeof window !== 'undefined') {
      window.addEventListener('class_completion_updated', this.syncListener);
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('class_completion_updated', this.syncListener);
    }
  }

  private loadAuthoritativeProgress(): void {
    // Check both general lippan course and standard completions in classProgressService
    const courseKeys = ['lippan', 'course-lippan', '660000000000000000000001'];
    const completedSet = new Set<number>();

    for (const key of courseKeys) {
      const classIds = this.classProgressService.getCompletedClassIds(key);
      for (const id of classIds) {
        const num = parseInt(id.replace(/\D/g, ''), 10);
        if (!isNaN(num) && num >= 1 && num <= this.modulesList.length) {
          completedSet.add(num);
        }
      }
    }

    // Default to at least module 1 completed if none found, or load authoritative set
    if (completedSet.size > 0) {
      this.completedModules.set(completedSet);
    }
  }

  isModuleDone(num: number): boolean {
    return this.completedModules().has(num);
  }
}
