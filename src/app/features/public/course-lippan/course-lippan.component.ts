import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { CourseService } from '../../../core/services/course.service';

@Component({
  selector: 'app-course-lippan',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="min-h-screen bg-surface py-8 md:py-12 text-xs text-on-surface">
      <div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop space-y-7">
        
        <!-- Clean, Balanced Top Header -->
        <header class="space-y-4">
          <!-- Top Utility Row: Left Back Link & Right Metadata -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-outline-variant/15">
            <!-- Left: Back Navigation -->
            <a routerLink="/courses" class="inline-flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-primary font-semibold transition-colors">
              <span class="material-symbols-outlined text-[16px]">arrow_back</span>
              Back to Courses
            </a>

            <!-- Right: Shifted Category & Reviews Metadata -->
            <div class="flex flex-wrap items-center gap-2.5 text-xs">
              <span class="bg-tertiary-fixed text-on-tertiary-fixed font-semibold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider">
                Lippan Art
              </span>
              <span class="text-outline-variant/60">•</span>
              <span class="inline-flex items-center gap-1 text-[11px] text-on-surface font-semibold">
                <span class="material-symbols-outlined text-[14px] text-amber-500 filled">star</span>
                4.9 <span class="text-on-surface-variant font-normal">(124 reviews)</span>
              </span>
              <span class="text-outline-variant/60">•</span>
              <span class="text-[11px] text-on-surface-variant font-medium">1,200+ Students</span>
            </div>
          </div>

          <!-- Course Title & Description -->
          <div class="space-y-2 max-w-4xl">
            <h1 class="text-2xl sm:text-3xl font-bold text-on-surface leading-tight">
              The Art of Lippan: Traditional Mud &amp; Mirror Work
            </h1>

            <p class="text-xs sm:text-[13px] text-on-surface-variant leading-relaxed font-normal max-w-3xl">
              Master the ancient Gujarati craft of Lippan Kaam. Create intricate geometric relief murals with modern durable clay and genuine shisha mirrors.
            </p>
          </div>
        </header>

        <!-- Two-Column Cohesive Layout with Bounded Sticky Sidebar -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          <!-- Main Content Column (Left 8 cols) -->
          <div class="lg:col-span-8 space-y-8">
            
            <!-- Video Stage Card -->
            <div class="w-full aspect-video rounded-2xl overflow-hidden relative group shadow-sm border border-outline-variant/30 bg-surface-container">
              <div 
                class="bg-cover bg-center w-full h-full transition-transform duration-700 group-hover:scale-105" 
                style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuB0ThDuVb2OniJ7WjvUCvt2WCyo2E3mdyuwdOomyt_EsUYfXZROwlmMElUUCZg7R2hCQS8EPksrOUA8DNa6IYGDrwTsBKgVIifhm9uzNYZ50hmVZcxTZvuDMEbphB0-A_DhmJPMIYSDxQ4Y51zbqnup0HmEThNgiSSyKIXS_FB_-LG-JXEAF-RaJHkXysyatKC9c5EzMw_7PckGAr67Bkegu0RZX7LdOhVzPkR0SRxBYxr2iG43fPoO')">
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-between p-6">
                <div class="flex justify-between items-center">
                  <span class="bg-black/40 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20">
                    Workshop Preview
                  </span>
                  <span class="bg-black/40 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                    HD • 1080p
                  </span>
                </div>
                <div class="flex items-center justify-center">
                  <button class="w-16 h-16 bg-white/95 rounded-full flex items-center justify-center text-primary shadow-xl hover:scale-110 transition-transform cursor-pointer">
                    <span class="material-symbols-outlined text-3xl ml-1 filled text-primary">play_arrow</span>
                  </button>
                </div>
                <div class="text-white text-[11px] font-medium drop-shadow-sm flex items-center gap-2">
                  <span class="material-symbols-outlined text-sm">ondemand_video</span>
                  Click to watch 4-minute introductory craft breakdown
                </div>
              </div>
            </div>

            <!-- What You'll Learn Grid -->
            <section class="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm space-y-5">
              <h2 class="text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-xl">verified</span>
                What You Will Master in this Course
              </h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex gap-3.5 items-start">
                  <span class="material-symbols-outlined text-primary text-lg mt-0.5 filled">check_circle</span>
                  <div>
                    <h3 class="font-bold text-xs text-on-surface">Material &amp; Clay Prep</h3>
                    <p class="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                      Learn formulas for epoxy &amp; air-dry clays to eliminate drying cracks on MDF bases.
                    </p>
                  </div>
                </div>

                <div class="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex gap-3.5 items-start">
                  <span class="material-symbols-outlined text-primary text-lg mt-0.5 filled">check_circle</span>
                  <div>
                    <h3 class="font-bold text-xs text-on-surface">Geometric Grid Patterns</h3>
                    <p class="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                      Draft traditional Kutchi mandalas, floral borders, and diamond shisha layouts.
                    </p>
                  </div>
                </div>

                <div class="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex gap-3.5 items-start">
                  <span class="material-symbols-outlined text-primary text-lg mt-0.5 filled">check_circle</span>
                  <div>
                    <h3 class="font-bold text-xs text-on-surface">Clay Thread Rolling (Carre)</h3>
                    <p class="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                      Master smooth cylinder rolling techniques without tools using talcum technique.
                    </p>
                  </div>
                </div>

                <div class="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex gap-3.5 items-start">
                  <span class="material-symbols-outlined text-primary text-lg mt-0.5 filled">check_circle</span>
                  <div>
                    <h3 class="font-bold text-xs text-on-surface">Finishing, Sealing &amp; Mount</h3>
                    <p class="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                      Paint monochrome textures and seal mirrors with long-lasting acrylic varnishes.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Course Curriculum Section -->
            <section class="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm space-y-5">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/20 pb-4">
                <div>
                  <h2 class="text-base sm:text-lg font-bold text-on-surface">Course Curriculum</h2>
                  <p class="text-[11px] text-on-surface-variant mt-0.5">3 Modules • 20 Detailed Video Lessons • 12 Total Hours</p>
                </div>
                <span class="text-primary font-bold text-xs">Self-Paced Lifetime Access</span>
              </div>

              <div class="space-y-3">
                <div class="border border-outline-variant/30 rounded-xl overflow-hidden bg-surface-container-low">
                  <div class="p-3.5 bg-surface-container font-bold text-xs text-on-surface flex justify-between items-center">
                    <span>Module 1: Historical Roots &amp; Substrate Preparation</span>
                    <span class="text-[10px] text-on-surface-variant font-normal">4 Lessons • 2h 15m</span>
                  </div>
                  <div class="p-3 space-y-2 text-[11px] text-on-surface-variant divide-y divide-outline-variant/15">
                    <div class="flex items-center justify-between pt-1">
                      <span class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary text-sm">play_circle</span>
                        1. Introduction to Gujarati Lippan Kaam
                      </span>
                      <span>15:00</span>
                    </div>
                    <div class="flex items-center justify-between pt-2">
                      <span class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary text-sm">play_circle</span>
                        2. Selecting MDF, Plywood &amp; Gesso Priming
                      </span>
                      <span>35:00</span>
                    </div>
                  </div>
                </div>

                <div class="border border-outline-variant/30 rounded-xl overflow-hidden bg-surface-container-low">
                  <div class="p-3.5 bg-surface-container font-bold text-xs text-on-surface flex justify-between items-center">
                    <span>Module 2: Rolling Clay &amp; Setting Geometric Mirrors</span>
                    <span class="text-[10px] text-on-surface-variant font-normal">8 Lessons • 5h 30m</span>
                  </div>
                </div>

                <div class="border border-outline-variant/30 rounded-xl overflow-hidden bg-surface-container-low">
                  <div class="p-3.5 bg-surface-container font-bold text-xs text-on-surface flex justify-between items-center">
                    <span>Module 3: Monochrome Painting, Mirror Polishing &amp; Sealing</span>
                    <span class="text-[10px] text-on-surface-variant font-normal">8 Lessons • 4h 15m</span>
                  </div>
                </div>
              </div>
            </section>

            <!-- Detailed Overview Narrative -->
            <section class="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm space-y-4">
              <h2 class="text-base sm:text-lg font-bold text-on-surface">About This Masterclass</h2>
              <div class="prose text-xs text-on-surface-variant leading-relaxed space-y-3">
                <p>
                  Lippan Kaam (mud-relief mirror work) is one of the most distinctive decorative traditions originating from the nomadic Rabari and Mutwa communities of Kutch. Traditionally rendered on the cylindrical walls of clay huts (bhungas), this craft has evolved into a beloved modern architectural feature.
                </p>
                <p>
                  In this course, master artisan <strong>Aisha Sharma</strong> breaks down the ancient techniques into approachable, step-by-step studio practices tailored for hobbyists, interior decorators, and professional artisans alike.
                </p>
              </div>
            </section>

          </div>

          <!-- Sticky Sidebar Column (Right 4 cols) -->
          <aside class="lg:col-span-4 w-full">
            <div class="lg:sticky lg:top-24 space-y-5">
              
              <!-- Purchase / Enrollment Card -->
              <div class="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/35 shadow-sm space-y-5">
                <div class="flex items-center justify-between border-b border-outline-variant/20 pb-4">
                  <div class="space-y-0.5">
                    <span class="text-[10px] font-bold text-primary uppercase tracking-widest">Course Enrollment</span>
                    <div class="flex items-baseline gap-2">
                      <span class="text-2xl font-bold text-primary">Rs. 149</span>
                      <span class="text-xs text-outline line-through">Rs. 499</span>
                      <span class="text-[10px] font-semibold text-secondary bg-secondary-fixed/50 px-1.5 py-0.5 rounded">70% OFF</span>
                    </div>
                  </div>
                  <span class="text-[10px] font-semibold text-tertiary bg-tertiary-fixed/60 px-2.5 py-1 rounded-full border border-tertiary/20">
                    Lifetime Access
                  </span>
                </div>

                <div class="space-y-2.5">
                  <button 
                    (click)="handleEnroll()"
                    class="w-full bg-primary text-on-primary font-semibold py-3.5 rounded-xl hover:opacity-95 transition-opacity shadow-sm text-xs cursor-pointer flex items-center justify-center gap-2">
                    <span class="material-symbols-outlined text-sm">{{ enrolled() ? 'arrow_forward' : 'lock_open' }}</span>
                    {{ enrolled() ? 'Go to My Courses' : 'Enroll Now' }}
                  </button>
                  <button class="w-full border border-outline-variant/60 text-on-surface font-semibold py-3 rounded-xl hover:bg-surface-container-low transition-colors text-xs cursor-pointer">
                    Gift this Course
                  </button>
                </div>

                <div class="pt-4 border-t border-outline-variant/20 space-y-2.5 text-[11px] text-on-surface-variant">
                  <div class="flex items-center gap-2.5">
                    <span class="material-symbols-outlined text-primary text-base">all_inclusive</span>
                    <span>Full lifetime access with future lesson updates</span>
                  </div>
                  <div class="flex items-center gap-2.5">
                    <span class="material-symbols-outlined text-primary text-base">ondemand_video</span>
                    <span>12 hours of on-demand high-definition video</span>
                  </div>
                  <div class="flex items-center gap-2.5">
                    <span class="material-symbols-outlined text-primary text-base">devices</span>
                    <span>Access on mobile, tablet, and desktop</span>
                  </div>
                  <div class="flex items-center gap-2.5">
                    <span class="material-symbols-outlined text-primary text-base">workspace_premium</span>
                    <span>Verified certificate of completion</span>
                  </div>
                </div>
              </div>

              <!-- Instructor Bio Card -->
              <div class="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/35 shadow-sm space-y-4">
                <div class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Instructor Profile</div>
                
                <div class="flex items-center gap-3.5">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200" 
                    alt="Aisha Sharma" 
                    class="w-14 h-14 rounded-full object-cover border-2 border-primary/25 shadow-sm shrink-0"
                  />
                  <div>
                    <h4 class="text-sm font-bold text-on-surface">Aisha Sharma</h4>
                    <p class="text-[11px] text-primary font-semibold">Master Lippan Artisan</p>
                    <div class="flex items-center gap-1 text-[10px] text-on-surface-variant mt-0.5">
                      <span class="material-symbols-outlined text-[12px] text-amber-500 filled">star</span>
                      <span class="font-bold text-on-surface">4.9</span>
                      <span>(124 reviews)</span>
                    </div>
                  </div>
                </div>

                <div class="pt-3 border-t border-outline-variant/20 space-y-2 text-[11px] text-on-surface-variant">
                  <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary text-sm">workspace_premium</span>
                    <span><strong>8+ Years</strong> of Craft Teaching Experience</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary text-sm">groups</span>
                    <span><strong>1,200+</strong> Students Mentored</span>
                  </div>
                </div>

                <p class="text-[11px] text-on-surface-variant leading-relaxed pt-2.5 border-t border-outline-variant/20 italic">
                  "Preserving centuries-old Kutchi mud & mirror techniques through accessible, modern workshop learning."
                </p>
              </div>

            </div>
          </aside>

        </div>

      </div>
    </main>
  `
})
export class CourseLippanComponent implements OnInit {
  private authService = inject(AuthService);
  private courseService = inject(CourseService);
  private router = inject(Router);

  enrolled = signal<boolean>(false);

  ngOnInit(): void {
    const purchased = this.courseService.getPurchasedCourses();
    this.enrolled.set(purchased.some(c => c.id === 'lippan-art'));
  }

  handleEnroll(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/courses/lippan-art' } });
      return;
    }

    this.courseService.enrollCourse({
      id: 'lippan-art',
      title: "The Art of Lippan: Traditional Mud & Mirror Work",
      category: "Lippan Art",
      instructor: "Aisha Sharma",
      progress: 65,
      lessonsCompleted: 13,
      totalLessons: 20,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAaoX0RGxpW-j4nvC1oT1ER7ghQq3LTyffaeKwMP7NUMAKKHqHQmjktmUbyLPagZx6VG0o3H4U157TFiWJGVWKEFwAc3hVXQzqSdHoFy7hC98aHC2EyKFdILSTsnS-EXmaDGklBokg2X7ZOMMcfjaSFDKUhNg6zQecW1g1g1W-aIDWhErsUjb9KT097mpys8RjeuJAbVJ2rMZ7tS10zRVyyf0czkAW4IWUW6sgkOQOPwRiE2EbJHQdA",
      price: 149,
      description: "Master the ancient Gujarati art form of Lippan Kaam."
    });

    this.enrolled.set(true);
    this.router.navigate(['/my-courses']);
  }
}
