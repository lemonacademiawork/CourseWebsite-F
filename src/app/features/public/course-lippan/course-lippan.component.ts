import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { CourseService } from '../../../core/services/course.service';

@Component({
  selector: 'app-course-lippan',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="flex-grow flex flex-col lg:flex-row gap-gutter max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 relative w-full text-xs">
      <div class="flex-1 space-y-12 w-full lg:max-w-[70%]">
        <section class="space-y-6">
          <div class="inline-block px-3 py-1 bg-tertiary-container text-on-tertiary-container rounded-full font-label-md text-label-md">Craft &amp; Art</div>
          <h1 class="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg font-bold text-on-surface">The Art of Lippan: Traditional Mud &amp; Mirror Work</h1>
          <p class="font-body-lg text-body-lg text-on-surface-variant">Master the ancient Gujarati art form of Lippan Kaam. Create stunning, intricate murals using modern materials while preserving traditional techniques.</p>
          <div class="w-full aspect-video rounded-xl overflow-hidden relative group">
            <div class="bg-cover bg-center w-full h-full" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuB0ThDuVb2OniJ7WjvUCvt2WCyo2E3mdyuwdOomyt_EsUYfXZROwlmMElUUCZg7R2hCQS8EPksrOUA8DNa6IYGDrwTsBKgVIifhm9uzNYZ50hmVZcxTZvuDMEbphB0-A_DhmJPMIYSDxQ4Y51zbqnup0HmEThNgiSSyKIXS_FB_-LG-JXEAF-RaJHkXysyatKC9c5EzMw_7PckGAr67Bkegu0RZX7LdOhVzPkR0SRxBYxr2iG43fPoO')"></div>
            <div class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center cursor-pointer">
              <button class="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-primary organic-lift shadow-lg">
                <span class="material-symbols-outlined text-3xl ml-1 filled text-primary">play_arrow</span>
              </button>
            </div>
          </div>
        </section>

        <section class="bg-surface-container-lowest rounded-xl p-8 organic-shadow space-y-6">
          <h2 class="font-headline-md text-headline-md border-b border-surface-container-high pb-4 font-bold text-on-surface">Course Overview</h2>
          <div class="prose font-body-md text-body-md text-on-surface-variant max-w-none">
            <p>Lippan Kaam is a traditional mural craft of Kutch, Gujarat. Originally used to decorate the interior and exterior walls of homes, this beautiful art form combines mud, clay, and mirrors to create dazzling, textured patterns.</p>
            <p class="mt-4">In this comprehensive course, we bring this traditional art into the modern studio. You will learn to adapt the techniques using contemporary, durable materials to create artworks suitable for modern homes and galleries.</p>
          </div>
        </section>

        <section class="space-y-6">
          <h2 class="font-headline-md text-headline-md pl-2 font-bold text-on-surface">What You'll Learn</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-surface-container-low p-6 rounded-xl flex gap-4 items-start border border-surface-variant">
              <span class="material-symbols-outlined text-primary mt-1 filled">check_circle</span>
              <div>
                <h3 class="font-label-md text-label-md text-on-surface font-semibold">Material Mastery</h3>
                <p class="text-sm mt-1 text-on-surface-variant">Understand modern clay alternatives and mirror selection.</p>
              </div>
            </div>
            <div class="bg-surface-container-low p-6 rounded-xl flex gap-4 items-start border border-surface-variant">
              <span class="material-symbols-outlined text-primary mt-1 filled">check_circle</span>
              <div>
                <h3 class="font-label-md text-label-md text-on-surface font-semibold">Pattern Design</h3>
                <p class="text-sm mt-1 text-on-surface-variant">Create traditional and contemporary geometric grids.</p>
              </div>
            </div>
            <div class="bg-surface-container-low p-6 rounded-xl flex gap-4 items-start border border-surface-variant">
              <span class="material-symbols-outlined text-primary mt-1 filled">check_circle</span>
              <div>
                <h3 class="font-label-md text-label-md text-on-surface font-semibold">Sculpting Techniques</h3>
                <p class="text-sm mt-1 text-on-surface-variant">Learn the delicate art of rolling and applying clay threads.</p>
              </div>
            </div>
            <div class="bg-surface-container-low p-6 rounded-xl flex gap-4 items-start border border-surface-variant">
              <span class="material-symbols-outlined text-primary mt-1 filled">check_circle</span>
              <div>
                <h3 class="font-label-md text-label-md text-on-surface font-semibold">Finishing &amp; Sealing</h3>
                <p class="text-sm mt-1 text-on-surface-variant">Protect your artwork for longevity and brilliant display.</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div class="w-full lg:w-80 lg:shrink-0 relative">
        <div class="sticky top-24 bg-surface-container-lowest rounded-xl p-6 organic-shadow border border-surface-container-high space-y-6">
          <div class="text-center pb-4 border-b border-surface-container-high">
            <div class="font-display-lg-mobile text-display-lg-mobile text-2xl font-bold text-on-surface">Rs. 149</div>
            <div class="text-on-surface-variant text-sm mt-1">Full Lifetime Access</div>
          </div>
          <button 
            (click)="handleEnroll()"
            class="w-full bg-primary text-on-primary font-semibold py-4 rounded-full hover:opacity-90 transition-opacity shadow-sm text-xs cursor-pointer">
            {{ enrolled() ? 'Go to My Courses' : 'Enroll Now' }}
          </button>
          <button class="w-full border border-outline text-on-surface font-semibold py-3 rounded-full hover:bg-surface-container-low transition-colors duration-200 text-xs">
            Gift this Course
          </button>
          <div class="pt-4 space-y-3">
            <div class="flex items-center gap-3 text-sm text-on-surface-variant">
              <span class="material-symbols-outlined text-outline" style="font-size: 20px;">all_inclusive</span>
              Full lifetime access
            </div>
            <div class="flex items-center gap-3 text-sm text-on-surface-variant">
              <span class="material-symbols-outlined text-outline" style="font-size: 20px;">ondemand_video</span>
              12 hours of video
            </div>
            <div class="flex items-center gap-3 text-sm text-on-surface-variant">
              <span class="material-symbols-outlined text-outline" style="font-size: 20px;">workspace_premium</span>
              Certificate of completion
            </div>
          </div>
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
