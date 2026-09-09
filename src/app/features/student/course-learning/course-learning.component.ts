import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../../core/services/student.service';
import { AuthService } from '../../../core/services/auth.service';

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

            <!-- Module List -->
            <div class="space-y-3">
              <div class="bg-primary-container/20 border border-primary/20 rounded-xl p-4 flex items-center justify-between gap-4">
                <div class="flex items-center gap-3.5">
                  <div class="w-9 h-9 bg-primary text-on-primary rounded-full flex items-center justify-center font-bold text-xs shrink-0">1</div>
                  <div>
                    <h3 class="font-bold text-xs text-on-surface">Introduction &amp; Materials Guide</h3>
                    <p class="text-[11px] text-on-surface-variant">History, workspace setup &amp; MDF base selection</p>
                  </div>
                </div>
                <button 
                  (click)="toggleModuleCompletion(1)"
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  [class]="isModuleDone(1) ? 'bg-green-100 text-green-800' : 'bg-primary text-on-primary'">
                  {{ isModuleDone(1) ? '✓ Completed' : 'Mark Complete' }}
                </button>
              </div>

              <div class="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 flex items-center justify-between gap-4">
                <div class="flex items-center gap-3.5">
                  <div class="w-9 h-9 bg-surface-container-high text-on-surface rounded-full flex items-center justify-center font-bold text-xs shrink-0">2</div>
                  <div>
                    <h3 class="font-bold text-xs text-on-surface">Clay Dough &amp; Base Preparation</h3>
                    <p class="text-[11px] text-on-surface-variant">Creating the perfect smooth clay mixture</p>
                  </div>
                </div>
                <button 
                  (click)="toggleModuleCompletion(2)"
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  [class]="isModuleDone(2) ? 'bg-green-100 text-green-800' : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'">
                  {{ isModuleDone(2) ? '✓ Completed' : 'Mark Complete' }}
                </button>
              </div>

              <div class="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 flex items-center justify-between gap-4">
                <div class="flex items-center gap-3.5">
                  <div class="w-9 h-9 bg-surface-container-high text-on-surface rounded-full flex items-center justify-center font-bold text-xs shrink-0">3</div>
                  <div>
                    <h3 class="font-bold text-xs text-on-surface">Mirror Placement &amp; Geometric Patterns</h3>
                    <p class="text-[11px] text-on-surface-variant">Patterns, spacing, symmetry &amp; adhesion</p>
                  </div>
                </div>
                <button 
                  (click)="toggleModuleCompletion(3)"
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  [class]="isModuleDone(3) ? 'bg-green-100 text-green-800' : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'">
                  {{ isModuleDone(3) ? '✓ Completed' : 'Mark Complete' }}
                </button>
              </div>

              <div class="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 flex items-center justify-between gap-4">
                <div class="flex items-center gap-3.5">
                  <div class="w-9 h-9 bg-surface-container-high text-on-surface rounded-full flex items-center justify-center font-bold text-xs shrink-0">4</div>
                  <div>
                    <h3 class="font-bold text-xs text-on-surface">Curing, Acrylic Painting &amp; Sealing</h3>
                    <p class="text-[11px] text-on-surface-variant">Varnish, moisture resistance &amp; wall mounting</p>
                  </div>
                </div>
                <button 
                  (click)="toggleModuleCompletion(4)"
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  [class]="isModuleDone(4) ? 'bg-green-100 text-green-800' : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'">
                  {{ isModuleDone(4) ? '✓ Completed' : 'Mark Complete' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Sidebar with Dynamic Progress -->
          <div class="space-y-6">
            <div class="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20 shadow-xs space-y-3">
              <h3 class="font-bold text-sm text-on-surface flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-base">trending_up</span>
                Dynamic Course Progress
              </h3>
              <div class="w-full bg-surface-container-high rounded-full h-3 overflow-hidden">
                <div class="bg-primary h-3 rounded-full transition-all duration-500" [style.width.%]="progressPercent()"></div>
              </div>
              <div class="flex justify-between items-center text-xs font-medium text-on-surface-variant">
                <span>{{ completedModules().size }} of 4 modules done</span>
                <span class="font-bold text-primary">{{ progressPercent() }}%</span>
              </div>
              @if (progressPercent() === 100) {
                <div class="p-2.5 bg-green-50 text-green-800 rounded-xl text-center text-xs font-bold border border-green-200">
                  🎉 Course Completed! Claim your certificate on My Courses.
                </div>
              }
            </div>

            <div class="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20 shadow-xs">
              <h3 class="font-bold text-sm text-on-surface mb-3">Master Instructor</h3>
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center font-bold text-sm">AS</div>
                <div>
                  <p class="font-bold text-xs text-on-surface">Aisha Sharma</p>
                  <p class="text-[11px] text-on-surface-variant">Master Artisan • Lemon Academia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  `
})
export class CourseLearningComponent implements OnInit {
  private studentService = inject(StudentService);
  public authService = inject(AuthService);

  completedModules = signal<Set<number>>(new Set([1]));

  progressPercent = computed(() => {
    return Math.round((this.completedModules().size / 4) * 100);
  });

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lippan_learning_progress');
      if (saved) {
        try {
          const list = JSON.parse(saved);
          if (Array.isArray(list)) this.completedModules.set(new Set(list));
        } catch (e) {}
      }
    }
  }

  isModuleDone(num: number): boolean {
    return this.completedModules().has(num);
  }

  toggleModuleCompletion(num: number): void {
    this.completedModules.update(set => {
      const next = new Set(set);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      if (typeof window !== 'undefined') {
        localStorage.setItem('lippan_learning_progress', JSON.stringify(Array.from(next)));
      }
      return next;
    });
  }
}
