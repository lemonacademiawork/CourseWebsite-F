import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title, Meta, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { switchMap, of, catchError } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { CourseService } from '../../../core/services/course.service';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { OrderService } from '../../../core/services/order.service';
import { PaymentService } from '../../../core/services/payment.service';
import { CouponService } from '../../../core/services/coupon.service';
import { ReviewService } from '../../../core/services/review.service';
import { Course } from '../../../core/models/course.model';
import { Review, RatingBreakdown } from '../../../core/models/review.model';

@Component({
  selector: 'app-course-lippan',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <main class="min-h-screen bg-surface py-8 md:py-12 text-xs text-on-surface">
      <!-- 1. Guard render and show skeleton until course is fully resolved (eliminates stale data race & Lippan flash) -->
      @if (isLoading() || !course()) {
        <div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop space-y-7 animate-pulse">
          <!-- Skeleton Utility Bar -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-outline-variant/15">
            <div class="h-4 w-32 bg-surface-container-high rounded"></div>
            <div class="h-4 w-44 bg-surface-container-high rounded"></div>
          </div>
          <!-- Skeleton Title -->
          <div class="space-y-2">
            <div class="h-8 w-3/4 max-w-2xl bg-surface-container-high rounded-lg"></div>
            <div class="h-4 w-1/3 bg-surface-container-high rounded"></div>
          </div>
          <!-- Skeleton Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            <div class="lg:col-span-8 space-y-8">
              <div class="w-full aspect-video rounded-2xl bg-surface-container-high"></div>
              <div class="h-40 rounded-2xl bg-surface-container-high"></div>
              <div class="h-56 rounded-2xl bg-surface-container-high"></div>
              <div class="h-48 rounded-2xl bg-surface-container-high"></div>
            </div>
            <div class="lg:col-span-4 space-y-5">
              <div class="h-96 rounded-2xl bg-surface-container-high"></div>
              <div class="h-48 rounded-2xl bg-surface-container-high"></div>
            </div>
          </div>
        </div>
      } @else {
        <!-- 2. Pure function of course() data -->
        <div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop space-y-7 animate-fadeIn">
          
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
                  {{ course()!.category }}
                </span>
                <span class="text-outline-variant/60">•</span>
                <span class="inline-flex items-center gap-1 text-[11px] text-on-surface font-semibold">
                  <span class="material-symbols-outlined text-[14px] text-amber-500 filled">star</span>
                  {{ averageRating().toFixed(1) }} <span class="text-on-surface-variant font-normal">({{ totalReviewsCount() }} reviews)</span>
                </span>
                <span class="text-outline-variant/60">•</span>
                <span class="text-[11px] text-on-surface-variant font-medium">
                  {{ course()!.studentsCount ? course()!.studentsCount + '+ Students' : '120+ Students' }}
                </span>
              </div>
            </div>

            <!-- Course Title -->
            <div class="max-w-4xl">
              <h1 class="text-2xl sm:text-3xl font-bold text-on-surface leading-tight">
                {{ course()!.title }}
              </h1>
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
                  [style.backgroundImage]="'url(' + (course()!.previewImage || course()!.imageUrl) + ')'">
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent flex flex-col justify-between p-6">
                  <div class="flex justify-between items-center">
                    <span class="bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20">
                      Masterclass Workshop Preview
                    </span>
                    <span class="bg-black/50 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/20">
                      HD • 1080p
                    </span>
                  </div>

                  <!-- Interactive Play Button wired to Video Preview Modal -->
                  <div class="flex items-center justify-center">
                    <button 
                      (click)="openVideoModal()"
                      aria-label="Play Workshop Preview Video"
                      class="w-16 h-16 bg-white/95 hover:bg-white rounded-full flex items-center justify-center text-primary shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer">
                      <span class="material-symbols-outlined text-3xl ml-1 filled text-primary">play_arrow</span>
                    </button>
                  </div>

                  <div class="text-white text-[11px] font-medium drop-shadow-sm flex items-center justify-between">
                    <span class="flex items-center gap-1.5">
                      <span class="material-symbols-outlined text-sm">ondemand_video</span>
                      Click to watch introductory craft preview
                    </span>
                    <button 
                      (click)="openVideoModal()" 
                      class="underline hover:text-primary-fixed cursor-pointer text-[11px] font-semibold">
                      Watch Video
                    </button>
                  </div>
                </div>
              </div>

              <!-- Live Sessions & YouTube Video Tutorials (Visible to Everyone) -->
              @if (course()!.liveClassLink || course()!.youtubePlaylistUrl) {
                <section class="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm space-y-4 animate-fadeIn">
                  <h2 class="text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary text-xl">sensors</span>
                    Live Studio Workshops &amp; Video Playlist
                  </h2>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Live Class Card -->
                    @if (course()!.liveClassLink) {
                      <div class="p-5 rounded-xl bg-blue-50/70 border border-blue-200/90 flex flex-col justify-between space-y-4">
                        <div class="space-y-2">
                          <div class="flex items-center gap-2">
                            <span class="bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                              LIVE SESSIONS
                            </span>
                            <span class="text-[11px] font-semibold text-blue-900">Interactive Studio</span>
                          </div>
                          <h3 class="font-bold text-sm text-blue-950">Join Live Masterclass with {{ course()!.instructor }}</h3>
                          <p class="text-[11px] text-blue-900/80 leading-relaxed">
                            {{ course()!.liveScheduleText || 'Live Zoom & Q&A sessions with real-time technique guidance and mentor critiques.' }}
                          </p>
                        </div>

                        <div>
                          <a 
                            [href]="course()!.liveClassLink" 
                            target="_blank" 
                            class="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors">
                            <span class="material-symbols-outlined text-sm">videocam</span>
                            <span>Join Live Class Room</span>
                            <span class="material-symbols-outlined text-xs">open_in_new</span>
                          </a>
                        </div>
                      </div>
                    }

                    <!-- YouTube Playlist Card -->
                    @if (course()!.youtubePlaylistUrl) {
                      <div class="p-5 rounded-xl bg-red-50/70 border border-red-200/90 flex flex-col justify-between space-y-4">
                        <div class="space-y-2">
                          <div class="flex items-center gap-2">
                            <span class="bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <span class="material-symbols-outlined text-xs">smart_display</span>
                              YOUTUBE PLAYLIST
                            </span>
                            <span class="text-[11px] font-semibold text-red-900">Recorded Masterclass</span>
                          </div>
                          <h3 class="font-bold text-sm text-red-950">Official Video Tutorial Playlist</h3>
                          <p class="text-[11px] text-red-900/80 leading-relaxed">
                            Stream complete step-by-step video tutorials, demonstrations, and recipes anytime on YouTube.
                          </p>
                        </div>

                        <div>
                          <a 
                            [href]="course()!.youtubePlaylistUrl" 
                            target="_blank" 
                            class="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors">
                            <span class="material-symbols-outlined text-sm">play_arrow</span>
                            <span>Watch Full YouTube Playlist</span>
                            <span class="material-symbols-outlined text-xs">open_in_new</span>
                          </a>
                        </div>
                      </div>
                    }
                  </div>
                </section>
              }

              <!-- What You'll Learn Grid (Bound dynamically to course.learningObjectives) -->
              <section class="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm space-y-5">
                <h2 class="text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
                  <span class="material-symbols-outlined text-primary text-xl">verified</span>
                  What You Will Master in this Masterclass
                </h2>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  @for (obj of (course()!.learningObjectives || defaultObjectives); track $index) {
                    <div class="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex gap-3.5 items-start">
                      <span class="material-symbols-outlined text-primary text-lg mt-0.5 filled">check_circle</span>
                      <p class="text-xs text-on-surface leading-relaxed font-medium">
                        {{ obj }}
                      </p>
                    </div>
                  }
                </div>
              </section>

              <!-- Course Curriculum Section (Bound dynamically to course.curriculumModules) -->
              <section class="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm space-y-5">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/20 pb-4">
                  <div>
                    <h2 class="text-base sm:text-lg font-bold text-on-surface">Course Curriculum</h2>
                    <p class="text-[11px] text-on-surface-variant mt-0.5">
                      {{ (course()!.curriculumModules?.length || 3) }} Comprehensive Modules • {{ course()!.durationHours || 12 }} Hours Total Studio Content
                    </p>
                  </div>
                  <span class="text-primary font-bold text-xs bg-primary/10 px-3 py-1 rounded-full">Self-Paced Lifetime Access</span>
                </div>

                <div class="space-y-3">
                  @for (mod of (course()!.curriculumModules || defaultCurriculum); track $index) {
                    <div class="border border-outline-variant/30 rounded-xl overflow-hidden bg-surface-container-low">
                      <div class="p-3.5 bg-surface-container font-bold text-xs text-on-surface flex justify-between items-center">
                        <span>{{ mod.title }}</span>
                        <span class="text-[10px] text-on-surface-variant font-normal">
                          {{ mod.lessonsCount || 4 }} Lessons • {{ mod.duration || '2h 30m' }}
                        </span>
                      </div>
                      @if (mod.lessons && mod.lessons.length > 0) {
                        <div class="p-3 space-y-2 text-[11px] text-on-surface-variant divide-y divide-outline-variant/15">
                          @for (lesson of mod.lessons; track lesson.title) {
                            <div class="flex items-center justify-between pt-1.5">
                              <span class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-primary text-sm">play_circle</span>
                                {{ lesson.title }}
                              </span>
                              <span>{{ lesson.duration }}</span>
                            </div>
                          }
                        </div>
                      }
                    </div>
                  }
                </div>
              </section>

              <!-- Detailed Overview Narrative -->
              <section class="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm space-y-4">
                <h2 class="text-base sm:text-lg font-bold text-on-surface">About This Masterclass</h2>
                <div class="prose text-xs text-on-surface-variant leading-relaxed space-y-3">
                  <p>
                    {{ course()!.description }}
                  </p>
                  <p>
                    In this workshop, master artisan <strong>{{ course()!.instructor }}</strong> breaks down complex craft techniques into approachable, step-by-step studio practices tailored for beginners, hobbyists, and professional artisans looking to build creative businesses.
                  </p>
                </div>
              </section>

              <!-- Materials & DIY Kit Section (Pure data-driven from course.materialsList) -->
              <section class="bg-gradient-to-r from-[#FBF8F1] via-[#F5EFE0] to-[#EFE9DC] border border-[#E7E1D3] rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E7E1D3]/80 pb-4">
                  <div class="flex items-start gap-3.5">
                    <div class="w-12 h-12 rounded-xl bg-[#6E5410] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <span class="material-symbols-outlined text-2xl">shopping_bag</span>
                    </div>
                    <div>
                      <h3 class="font-bold text-sm text-[#1C1A17] flex items-center gap-2">
                        {{ course()!.materialsKitTitle || (course()!.category + ' Materials & DIY Kit') }}
                        <span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#6E5410] text-white">Official Partner</span>
                      </h3>
                      <p class="text-xs text-[#5B5650] mt-0.5 leading-relaxed">
                        {{ course()!.materialsKitDescription || 'Sourced tools and materials validated specifically for this masterclass curriculum.' }}
                      </p>
                    </div>
                  </div>
                  <a 
                    [href]="course()!.materialsPartnerUrl || 'https://lemonhousecraft.in'" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="px-4 py-2 bg-[#6E5410] hover:bg-[#5c4610] text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-2 whitespace-nowrap cursor-pointer">
                    <span>Shop Kit</span>
                    <span class="material-symbols-outlined text-sm">open_in_new</span>
                  </a>
                </div>

                <!-- Materials Breakdown List -->
                @if (course()!.materialsList && course()!.materialsList!.length > 0) {
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    @for (mat of course()!.materialsList; track mat.name) {
                      <div class="p-3 bg-white/70 backdrop-blur-xs rounded-xl border border-[#E7E1D3] flex items-start gap-2.5">
                        <span class="material-symbols-outlined text-[#6E5410] text-base mt-0.5">inventory_2</span>
                        <div>
                          <strong class="font-bold text-xs text-[#1C1A17] block">{{ mat.name }}</strong>
                          <span class="text-[11px] text-[#5B5650]">{{ mat.description }}</span>
                        </div>
                      </div>
                    }
                  </div>
                }
              </section>

              <!-- Public Student Ratings & Reviews (Pure data-driven from reviews() or course.reviewsList) -->
              <section class="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm space-y-6">
                <div class="border-b border-outline-variant/20 pb-5">
                  <h2 class="text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
                    <span class="material-symbols-outlined text-amber-500">star</span>
                    Student Ratings &amp; Reviews
                  </h2>
                  <p class="text-xs text-on-surface-variant mt-0.5">Authentic feedback from verified students enrolled in this masterclass.</p>
                </div>

                <!-- Stats & Rating Breakdown Header -->
                <div class="flex flex-col md:flex-row items-center gap-8 pb-6 border-b border-outline-variant/20">
                  <div class="text-center md:text-left shrink-0">
                    <div class="text-5xl font-extrabold text-amber-500">
                      {{ averageRating().toFixed(1) }}
                    </div>
                    <div class="flex justify-center md:justify-start text-amber-400 text-lg my-1">
                      {{ '★'.repeat(roundRating(averageRating())) }}{{ '☆'.repeat(5 - roundRating(averageRating())) }}
                    </div>
                    <p class="text-xs text-on-surface-variant">Based on {{ totalReviewsCount() }} reviews</p>
                  </div>

                  <!-- 1-5 Star Breakdown Distribution Bars -->
                  <div class="flex-1 w-full max-w-md space-y-2">
                    @for (stars of [5, 4, 3, 2, 1]; track stars) {
                      <div 
                        (click)="toggleRatingFilter(stars)"
                        class="flex items-center gap-3 text-xs cursor-pointer hover:opacity-85 transition-opacity"
                        [class.font-bold]="filterRating() === stars"
                        [class.text-amber-600]="filterRating() === stars"
                        [class.text-on-surface-variant]="filterRating() !== stars">
                        <span class="w-14 whitespace-nowrap">{{ stars }} Stars</span>
                        <div class="flex-1 h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                          <div 
                            class="h-full bg-amber-400 rounded-full transition-all"
                            [style.width.%]="getStarPercentage(stars)">
                          </div>
                        </div>
                        <span class="w-8 text-right text-[11px] text-on-surface-variant">{{ getStarCount(stars) }}</span>
                      </div>
                    }
                  </div>
                </div>

                @if (filterRating()) {
                  <div class="flex items-center justify-between bg-amber-50 text-amber-800 px-3.5 py-2 rounded-lg text-xs font-semibold">
                    <span>Filtered by {{ filterRating() }} Star reviews</span>
                    <button (click)="clearRatingFilter()" class="underline hover:text-amber-950 cursor-pointer">Clear Filter</button>
                  </div>
                }

                <!-- Reviews Feed -->
                <div class="space-y-4">
                  @if (reviews().length > 0) {
                    @for (rev of reviews(); track rev.id) {
                      <div class="p-4 bg-surface-container-low border border-outline-variant/20 rounded-xl space-y-2.5">
                        <div class="flex justify-between items-center">
                          <div class="flex items-center gap-3">
                            @if (rev.student?.studentProfile?.avatarUrl) {
                              <img [src]="rev.student?.studentProfile?.avatarUrl" [alt]="rev.student?.name || 'Student'" class="w-9 h-9 rounded-full object-cover border border-outline-variant/20" />
                            } @else {
                              <div class="w-9 h-9 rounded-full bg-primary-container text-on-primary-container font-bold flex items-center justify-center text-xs">
                                {{ (rev.student?.name || rev.studentName || 'Student')[0].toUpperCase() }}
                              </div>
                            }
                            <div>
                              <span class="font-bold text-xs text-on-surface block">{{ rev.student?.name || rev.studentName || 'Artisan Student' }}</span>
                              <span class="text-[10px] text-on-surface-variant">{{ rev.createdAt ? (rev.createdAt | date:'mediumDate') : 'Verified Student' }}</span>
                            </div>
                          </div>
                          <div class="text-amber-500 text-xs font-bold">
                            {{ '★'.repeat(rev.rating || 5) }}{{ '☆'.repeat(5 - (rev.rating || 5)) }}
                          </div>
                        </div>
                        @if (rev.title) {
                          <h4 class="font-bold text-xs text-on-surface">{{ rev.title }}</h4>
                        }
                        <p class="text-xs text-on-surface-variant leading-relaxed">{{ rev.comment }}</p>
                      </div>
                    }
                  } @else {
                    <!-- Course-Specific Reviews from Course Data Model -->
                    @for (rev of (course()!.reviewsList || defaultReviews); track rev.name) {
                      <div class="p-4 bg-surface-container-low border border-outline-variant/20 rounded-xl space-y-2">
                        <div class="flex justify-between items-center">
                          <div class="flex items-center gap-2.5">
                            <div class="w-8 h-8 rounded-full bg-primary-container text-on-primary-container font-bold flex items-center justify-center text-xs">
                              {{ rev.name[0].toUpperCase() }}
                            </div>
                            <div>
                              <span class="font-bold text-xs text-on-surface block">{{ rev.name }}</span>
                              <span class="text-[10px] text-on-surface-variant">Verified Student • {{ rev.date || 'Recent' }}</span>
                            </div>
                          </div>
                          <div class="text-amber-500 text-xs font-bold">
                            {{ '★'.repeat(rev.rating || 5) }}{{ '☆'.repeat(5 - (rev.rating || 5)) }}
                          </div>
                        </div>
                        @if (rev.title) {
                          <h4 class="font-bold text-xs text-on-surface">{{ rev.title }}</h4>
                        }
                        <p class="text-xs text-on-surface-variant leading-relaxed">
                          {{ rev.comment }}
                        </p>
                      </div>
                    }
                  }
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
                      <span class="text-[10px] font-bold text-primary uppercase tracking-widest">
                        {{ enrolled() ? 'Access Granted' : 'Masterclass Tuition' }}
                      </span>
                      <div class="flex items-baseline gap-2">
                        @if (enrolled()) {
                          <span class="text-xl font-bold text-green-700 flex items-center gap-1.5">
                            <span class="material-symbols-outlined text-lg">check_circle</span>
                            Enrolled
                          </span>
                        } @else {
                          <span class="text-2xl font-bold text-primary">Rs. {{ course()!.price }}</span>
                          <span class="text-xs text-outline line-through">Rs. {{ course()!.price * 3 }}</span>
                          <span class="text-[10px] font-semibold text-secondary bg-secondary-fixed/50 px-1.5 py-0.5 rounded">66% OFF</span>
                        }
                      </div>
                    </div>
                    <span class="text-[10px] font-semibold text-tertiary bg-tertiary-fixed/60 px-2.5 py-1 rounded-full border border-tertiary/20">
                      Lifetime Access
                    </span>
                  </div>

                  <!-- Key Features Checklist -->
                  <div class="space-y-2.5 text-[11px] text-on-surface-variant">
                    <div class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-primary text-base">video_library</span>
                      <span><strong>{{ course()!.durationHours || 12 }} Hours</strong> on-demand HD video lessons</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-primary text-base">devices</span>
                      <span>Watch on mobile, tablet, and desktop</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-primary text-base">verified</span>
                      <span>Verified Certificate of Completion</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-primary text-base">all_inclusive</span>
                      <span>Lifetime access with all future updates</span>
                    </div>
                  </div>

                  <!-- CTA Button -->
                  <div>
                    <button 
                      (click)="handleEnrollClick()"
                      [disabled]="enrolling()"
                      class="w-full py-3.5 bg-primary text-on-primary font-bold rounded-xl hover:opacity-95 transition-opacity shadow-md text-xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                      @if (enrolling()) {
                        <span class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                        <span>Confirming Enrollment...</span>
                      } @else if (enrolled()) {
                        <span class="material-symbols-outlined text-sm">play_circle</span>
                        <span>Open Classroom 🚀</span>
                      } @else {
                        <span class="material-symbols-outlined text-sm">lock_open</span>
                        <span>Enroll Now • Rs. {{ course()!.price }}</span>
                      }
                    </button>
                    <p class="text-[10px] text-center text-on-surface-variant mt-2">
                      30-Day Money Back Guarantee • Instant Access
                    </p>
                  </div>
                </div>

                <!-- Instructor Profile Card -->
                <div class="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/35 shadow-sm space-y-4">
                  <div class="flex items-center gap-3.5">
                    <img 
                      [src]="getInstructorImage(course()!.instructor)" 
                      [alt]="course()!.instructor" 
                      class="w-14 h-14 rounded-full object-cover border-2 border-primary/25 shadow-sm shrink-0"
                    />
                    <div>
                      <h4 class="text-sm font-bold text-on-surface">{{ course()!.instructor }}</h4>
                      <p class="text-[11px] text-primary font-semibold">Master {{ course()!.category }} Artisan</p>
                      <div class="flex items-center gap-1 text-[10px] text-on-surface-variant mt-0.5">
                        <span class="material-symbols-outlined text-[12px] text-amber-500 filled">star</span>
                        <span class="font-bold text-on-surface">{{ averageRating().toFixed(1) }}</span>
                        <span>({{ totalReviewsCount() }} reviews)</span>
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
                      <span><strong>{{ (course()!.studentsCount || 120) * 10 }}+</strong> Students Mentored</span>
                    </div>
                  </div>

                  <p class="text-[11px] text-on-surface-variant leading-relaxed pt-2.5 border-t border-outline-variant/20 italic">
                    "Preserving artisanal traditions through accessible, modern hands-on workshop learning."
                  </p>
                </div>

              </div>
            </aside>

          </div>

        </div>
      }

      <!-- 3. Preview Video Modal Player (Fixes dead play button) -->
      @if (showVideoModal()) {
        <div 
          (click)="closeVideoModal()"
          class="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div 
            (click)="$event.stopPropagation()"
            class="bg-black border border-white/20 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl relative flex flex-col">
            
            <!-- Video Modal Header -->
            <div class="flex items-center justify-between px-5 py-3.5 bg-neutral-900 border-b border-white/10 text-white">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary-fixed text-lg">play_circle</span>
                <span class="text-xs font-bold truncate max-w-md">{{ course()?.title }} — Preview</span>
              </div>
              <button 
                (click)="closeVideoModal()" 
                class="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors">
                <span class="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <!-- Video Player Iframe / Player Container -->
            <div class="w-full aspect-video bg-black relative">
              @if (safePreviewVideoUrl()) {
                <iframe 
                  [src]="safePreviewVideoUrl()!"
                  class="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen>
                </iframe>
              } @else {
                <div class="flex items-center justify-center h-full text-white/70 text-xs">
                  Video preview unavailable.
                </div>
              }
            </div>
          </div>
        </div>
      }

      <!-- 4. Checkout & Payment Modal Screen (Fixes payment selection state & amount breakdown) -->
      @if (showCheckoutModal() && course()) {
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            
            <!-- Modal Header -->
            <div class="flex items-center justify-between border-b border-outline-variant/20 pb-4">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-xl">shopping_cart_checkout</span>
                <div>
                  <h3 class="text-base font-bold text-on-surface">Secure Course Checkout</h3>
                  <p class="text-[10px] text-on-surface-variant">256-Bit SSL Encrypted Payment</p>
                </div>
              </div>
              <button 
                (click)="closeCheckoutModal()" 
                class="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-variant flex items-center justify-center text-on-surface cursor-pointer">
                <span class="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <!-- Course Order Summary -->
            <div class="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/20 flex gap-3.5 items-center">
              <img [src]="course()!.imageUrl" [alt]="course()!.title" class="w-16 h-12 rounded-lg object-cover shadow-xs shrink-0" />
              <div class="flex-grow">
                <h4 class="font-bold text-xs text-on-surface line-clamp-1">{{ course()!.title }}</h4>
                <p class="text-[10px] text-on-surface-variant">{{ course()!.category }} • by {{ course()!.instructor }}</p>
              </div>
              <div class="text-right shrink-0">
                <span class="text-sm font-bold text-primary">Rs. {{ finalPayableAmount() }}</span>
                <span *ngIf="couponDiscount() > 0" class="block text-[9px] text-green-700 line-through">Rs. {{ course()!.price }}</span>
              </div>
            </div>

            <!-- Coupon Code Section -->
            <div class="space-y-1.5">
              <label class="text-[11px] font-semibold text-on-surface">Have a Promo Code?</label>
              <div class="flex gap-2">
                <input 
                  type="text" 
                  [(ngModel)]="couponCode"
                  placeholder="e.g. LEMON10 or WELCOME" 
                  class="flex-1 px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs uppercase font-mono focus:border-primary focus:outline-none"
                />
                <button 
                  (click)="applyCoupon()"
                  class="px-4 py-2 bg-secondary text-on-secondary rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer text-xs">
                  Apply
                </button>
              </div>
              @if (couponMessage()) {
                <p class="text-[10px] font-medium" [class.text-green-700]="couponSuccess()" [class.text-red-600]="!couponSuccess()">
                  {{ couponMessage() }}
                </p>
              }
            </div>

            <!-- Payment Method Selector (Distinct visual active ring & badge) -->
            <div class="space-y-2">
              <label class="text-[11px] font-semibold text-on-surface">Select Payment Method</label>
              <div class="grid grid-cols-3 gap-2.5">
                <button 
                  (click)="paymentMethod = 'UPI'"
                  [class.border-primary]="paymentMethod === 'UPI'"
                  [class.ring-2]="paymentMethod === 'UPI'"
                  [class.ring-primary]="paymentMethod === 'UPI'"
                  [class.bg-primary/10]="paymentMethod === 'UPI'"
                  class="relative p-3 rounded-xl border border-outline-variant/40 flex flex-col items-center justify-center gap-1 hover:border-primary transition-all cursor-pointer">
                  @if (paymentMethod === 'UPI') {
                    <span class="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary text-on-primary flex items-center justify-center">
                      <span class="material-symbols-outlined text-[10px]">check</span>
                    </span>
                  }
                  <span class="material-symbols-outlined text-lg text-primary">qr_code_2</span>
                  <span class="text-[11px] font-bold">UPI / QR</span>
                </button>

                <button 
                  (click)="paymentMethod = 'CARD'"
                  [class.border-primary]="paymentMethod === 'CARD'"
                  [class.ring-2]="paymentMethod === 'CARD'"
                  [class.ring-primary]="paymentMethod === 'CARD'"
                  [class.bg-primary/10]="paymentMethod === 'CARD'"
                  class="relative p-3 rounded-xl border border-outline-variant/40 flex flex-col items-center justify-center gap-1 hover:border-primary transition-all cursor-pointer">
                  @if (paymentMethod === 'CARD') {
                    <span class="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary text-on-primary flex items-center justify-center">
                      <span class="material-symbols-outlined text-[10px]">check</span>
                    </span>
                  }
                  <span class="material-symbols-outlined text-lg text-primary">credit_card</span>
                  <span class="text-[11px] font-bold">Debit / Card</span>
                </button>

                <button 
                  (click)="paymentMethod = 'NET_BANKING'"
                  [class.border-primary]="paymentMethod === 'NET_BANKING'"
                  [class.ring-2]="paymentMethod === 'NET_BANKING'"
                  [class.ring-primary]="paymentMethod === 'NET_BANKING'"
                  [class.bg-primary/10]="paymentMethod === 'NET_BANKING'"
                  class="relative p-3 rounded-xl border border-outline-variant/40 flex flex-col items-center justify-center gap-1 hover:border-primary transition-all cursor-pointer">
                  @if (paymentMethod === 'NET_BANKING') {
                    <span class="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary text-on-primary flex items-center justify-center">
                      <span class="material-symbols-outlined text-[10px]">check</span>
                    </span>
                  }
                  <span class="material-symbols-outlined text-lg text-primary">account_balance</span>
                  <span class="text-[11px] font-bold">Net Banking</span>
                </button>
              </div>
            </div>

            <!-- Pricing Breakdown Rows with amounts -->
            <div class="border-t border-outline-variant/20 pt-3 space-y-1.5 text-[11px] text-on-surface-variant">
              <div class="flex justify-between">
                <span>Standard Masterclass Tuition:</span>
                <span class="line-through">Rs. {{ course()!.price * 3 }}</span>
              </div>
              <div class="flex justify-between text-green-700 font-semibold">
                <span>Artisan Platform Subsidy (66% OFF):</span>
                <span>- Rs. {{ course()!.price * 2 }}</span>
              </div>
              <div class="flex justify-between">
                <span>Studio Materials &amp; DIY Tool Kit:</span>
                <span class="text-green-700 font-semibold">Included Free (Rs. 0)</span>
              </div>
              @if (couponDiscount() > 0) {
                <div class="flex justify-between text-green-700 font-semibold">
                  <span>Promo Code Savings:</span>
                  <span>- Rs. {{ couponDiscount() }}</span>
                </div>
              }
              <div class="flex justify-between">
                <span>Platform Convenience Fee &amp; Taxes:</span>
                <span>Rs. 0 (Waived)</span>
              </div>
              <div class="flex justify-between font-bold text-sm text-on-surface border-t border-outline-variant/20 pt-2">
                <span>Total Payable Amount:</span>
                <span class="text-primary text-base font-extrabold">Rs. {{ finalPayableAmount() }}</span>
              </div>
            </div>

            @if (enrollmentError()) {
              <div class="p-2.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-[11px] flex items-center gap-1.5">
                <span class="material-symbols-outlined text-sm">error</span>
                <span>{{ enrollmentError() }}</span>
              </div>
            }

            <!-- Confirm & Pay CTA -->
            <button 
              (click)="processCheckoutAndEnroll()"
              [disabled]="enrolling()"
              class="w-full py-3.5 bg-primary text-on-primary font-bold rounded-xl hover:opacity-95 transition-opacity shadow-sm text-xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
              @if (enrolling()) {
                <span class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                <span>Processing Secure Payment...</span>
              } @else {
                <span class="material-symbols-outlined text-sm">lock</span>
                <span>Pay Rs. {{ finalPayableAmount() }} &amp; Enroll</span>
              }
            </button>
          </div>
        </div>
      }

      <!-- Enrollment & Payment Success Confirmation Modal -->
      @if (showSuccessModal() && course()) {
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl max-w-md w-full shadow-2xl p-6 md:p-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div class="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <span class="material-symbols-outlined text-3xl">check_circle</span>
            </div>

            <div>
              <h3 class="text-lg font-bold text-on-surface">Enrollment Successful! 🎉</h3>
              <p class="text-xs text-on-surface-variant mt-1">
                You now have full lifetime access to <strong>{{ course()!.title }}</strong>.
              </p>
            </div>

            <div class="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 text-left space-y-1.5 text-[11px]">
              <div class="flex justify-between">
                <span class="text-on-surface-variant">Transaction ID:</span>
                <span class="font-mono font-semibold text-on-surface">{{ lastPaymentRef() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-on-surface-variant">Order Number:</span>
                <span class="font-mono font-semibold text-on-surface">{{ lastOrderRef() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-on-surface-variant">Amount Paid:</span>
                <span class="font-bold text-primary">Rs. {{ finalPayableAmount() }}</span>
              </div>
            </div>

            <div class="flex flex-col gap-2 pt-2">
              <a 
                [routerLink]="['/my-courses', course()!.id]" 
                (click)="showSuccessModal.set(false)"
                class="w-full py-3 bg-primary text-on-primary font-bold rounded-xl hover:opacity-95 transition-opacity text-xs block">
                Start Learning Now 🚀
              </a>
              <a 
                routerLink="/profile" 
                (click)="showSuccessModal.set(false)"
                class="w-full py-2.5 bg-surface-container text-on-surface font-semibold rounded-xl hover:bg-surface-dim transition-colors text-xs block">
                View Receipt in Profile
              </a>
            </div>
          </div>
        </div>
      }
    </main>
  `
})
export class CourseLippanComponent implements OnInit {
  private authService = inject(AuthService);
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);
  private orderService = inject(OrderService);
  private paymentService = inject(PaymentService);
  private couponService = inject(CouponService);
  private reviewService = inject(ReviewService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private sanitizer = inject(DomSanitizer);

  // Core state: uninitialized course prevents stale Lippan data from flashing
  course = signal<Course | null>(null);
  isLoading = signal<boolean>(true);

  enrolling = signal<boolean>(false);
  enrolled = signal<boolean>(false);
  enrollmentError = signal<string>('');

  showCheckoutModal = signal<boolean>(false);
  showSuccessModal = signal<boolean>(false);
  showVideoModal = signal<boolean>(false);

  paymentMethod: 'UPI' | 'CARD' | 'NET_BANKING' = 'UPI';
  couponCode = '';
  couponDiscount = signal<number>(0);
  couponMessage = signal<string>('');
  couponSuccess = signal<boolean>(false);

  lastPaymentRef = signal<string>('');
  lastOrderRef = signal<string>('');

  // Public reviews state
  reviews = signal<Review[]>([]);
  averageRating = signal<number>(4.9);
  totalReviewsCount = signal<number>(12);
  filterRating = signal<number | null>(null);
  breakdown = signal<RatingBreakdown>({ 1: 0, 2: 0, 3: 0, 4: 2, 5: 10 });

  defaultObjectives: string[] = [
    'Foundations of craft studio setup, material safety & surface preparation',
    'Hands-on artisan techniques, tool handling & step-by-step composition',
    'Advanced texturing, pigmentation, layering & color gradients',
    'Sealing, durability protection & packaging for commercial markets'
  ];

  defaultCurriculum = [
    {
      title: 'Module 1: Foundations & Studio Safety',
      lessonsCount: 4,
      duration: '2h 15m',
      lessons: [
        { title: 'Artisanal Studio Setup & Safety', duration: '20:00' },
        { title: 'Raw Materials & Base Preparation', duration: '35:00' }
      ]
    },
    {
      title: 'Module 2: Hands-On Studio Practice & Creation',
      lessonsCount: 8,
      duration: '5h 30m',
      lessons: [
        { title: 'Core Tooling Controls & Techniques', duration: '40:00' },
        { title: 'Detail Sculpting, Pouring & Patterning', duration: '45:00' }
      ]
    },
    {
      title: 'Module 3: Curing, Polishing, Sealing & Selling',
      lessonsCount: 6,
      duration: '4h 15m',
      lessons: [
        { title: 'Protective Finishing & Durability Sealing', duration: '35:00' },
        { title: 'Commercial Pricing & Brand Packaging', duration: '40:00' }
      ]
    }
  ];

  defaultReviews = [
    {
      name: 'Aarav Mehta',
      rating: 5,
      title: 'Exceptional masterclass instruction',
      comment: 'Every lesson was concise, practical, and easy to follow. The results speak for themselves!',
      date: '1 week ago'
    },
    {
      name: 'Sneha Roy',
      rating: 5,
      title: 'Loved the techniques and materials kit',
      comment: 'The explanations made all the difference. Super high quality production and great instructor guidance.',
      date: '3 weeks ago'
    }
  ];

  safePreviewVideoUrl = computed<SafeResourceUrl | null>(() => {
    const rawUrl = this.course()?.previewVideoUrl;
    if (!rawUrl) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
  });

  roundRating(rating: number): number {
    return Math.round(rating || 0);
  }

  getStarCount(star: number): number {
    return this.breakdown()[star] || 0;
  }

  getStarPercentage(star: number): number {
    const total = this.totalReviewsCount();
    if (!total || total <= 0) return 0;
    const count = this.getStarCount(star);
    return Math.round((count / total) * 100);
  }

  toggleRatingFilter(star: number): void {
    if (this.filterRating() === star) {
      this.clearRatingFilter();
    } else {
      this.filterRating.set(star);
      const c = this.course();
      if (c) this.loadReviews(c.id, star);
    }
  }

  clearRatingFilter(): void {
    this.filterRating.set(null);
    const c = this.course();
    if (c) this.loadReviews(c.id);
  }

  finalPayableAmount(): number {
    const c = this.course();
    const base = Number(c?.price) || 0;
    const discount = this.couponDiscount();
    return Math.max(0, base - discount);
  }

  ngOnInit(): void {
    // switchMap cancels in-flight requests and avoids race conditions
    this.route.paramMap.pipe(
      switchMap(params => {
        const courseId = params.get('id') || 'lippan-art';
        this.isLoading.set(true);
        this.course.set(null); // Clear previous course so no stale data is flashed
        this.enrolled.set(false);
        this.enrollmentError.set('');
        this.couponDiscount.set(0);
        this.couponMessage.set('');

        return this.courseService.getCourse(courseId).pipe(
          switchMap(found => {
            if (found) return of(found);
            return this.courseService.getCourseBySlug(courseId);
          }),
          catchError(() => of(null))
        );
      })
    ).subscribe(found => {
      this.isLoading.set(false);
      if (found) {
        this.course.set(found);
        this.updateSeo(found);
        this.checkEnrollmentStatus(found);
        this.loadReviews(found.id);
      }
    });

    if (typeof window !== 'undefined') {
      window.addEventListener('courses_updated', () => {
        const c = this.course();
        if (c?.id) {
          this.courseService.getCourse(c.id).subscribe(refreshed => {
            if (refreshed) {
              this.course.set(refreshed);
              this.checkEnrollmentStatus(refreshed);
            }
          });
          this.loadReviews(c.id, this.filterRating() || undefined);
        }
      });
    }
  }

  private updateSeo(c: Course): void {
    const titleStr = `${c.title} | Lemon Academy Masterclasses`;
    this.titleService.setTitle(titleStr);

    const descStr = c.shortDescription || c.description || `Enroll in ${c.title} taught by master instructor ${c.instructor}.`;
    this.metaService.updateTag({ name: 'description', content: descStr });
    this.metaService.updateTag({ property: 'og:title', content: titleStr });
    this.metaService.updateTag({ property: 'og:description', content: descStr });
    this.metaService.updateTag({ property: 'og:image', content: c.imageUrl || c.thumbnailUrl || '' });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
  }

  openVideoModal(): void {
    this.showVideoModal.set(true);
  }

  closeVideoModal(): void {
    this.showVideoModal.set(false);
  }

  private loadReviews(courseId: string, rating?: number): void {
    this.reviewService.getCourseReviews(courseId, 1, 20, rating).subscribe({
      next: (res) => {
        if (res.reviews && res.reviews.length > 0) {
          this.reviews.set(res.reviews);
          this.averageRating.set(res.stats?.averageRating || 4.9);
          this.totalReviewsCount.set(res.stats?.totalReviews || res.total || res.reviews.length);
          if (res.stats?.breakdown) {
            this.breakdown.set(res.stats.breakdown);
          }
        } else if (rating) {
          this.reviews.set([]);
        }
      },
      error: () => {}
    });
  }

  private checkEnrollmentStatus(found: Course): void {
    // 1. Check local storage cache
    if (typeof window !== 'undefined') {
      const purchased = localStorage.getItem('purchased_courses');
      if (purchased) {
        try {
          const list = JSON.parse(purchased);
          if (Array.isArray(list)) {
            const isPurchasedLocally = list.some(item => {
              const id = typeof item === 'string' ? item : (item?.id || item?.courseId || item?.slug);
              return id === found.id || id === found.slug;
            });
            if (isPurchasedLocally) {
              this.enrolled.set(true);
            }
          }
        } catch {}
      }
    }

    // 2. Check live backend enrollment status
    if (this.authService.isLoggedIn()) {
      this.enrollmentService.getEnrollments().subscribe({
        next: (enrollments) => {
          const isEnrolled = enrollments.some(e =>
            e.courseId === found.id ||
            e.course?.id === found.id ||
            e.course?.slug === found.slug ||
            (found.slug && e.course?.slug === found.slug) ||
            e.id === found.id
          );
          if (isEnrolled) {
            this.enrolled.set(true);
            this.syncPurchasedStorage(found.id);
          }
        },
        error: () => {}
      });

      if (found.id) {
        this.enrollmentService.checkEnrollment(found.id).subscribe({
          next: (res) => {
            if (res && res.isEnrolled) {
              this.enrolled.set(true);
              this.syncPurchasedStorage(found.id);
            }
          },
          error: () => {}
        });
      }
    }
  }

  private syncPurchasedStorage(courseId: string): void {
    if (typeof window === 'undefined' || !courseId) return;
    try {
      const current = localStorage.getItem('purchased_courses');
      const list: string[] = current ? JSON.parse(current) : [];
      if (!list.includes(courseId)) {
        list.push(courseId);
        localStorage.setItem('purchased_courses', JSON.stringify(list));
        window.dispatchEvent(new Event('courses_updated'));
      }
    } catch {}
  }

  getInstructorImage(instructor: string): string {
    if (!instructor) return 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200';
    if (instructor.includes('Priya')) return 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200';
    if (instructor.includes('Manishi')) return 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200';
    if (instructor.includes('Shivani')) return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200';
    return 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200';
  }

  handleEnrollClick(): void {
    const currentCourse = this.course();
    if (!currentCourse) return;

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: `/courses/${currentCourse.id}` } });
      return;
    }

    if (this.enrolled()) {
      this.router.navigate(['/my-courses', currentCourse.id]);
      return;
    }

    this.openCheckoutModal();
  }

  openCheckoutModal(): void {
    const currentCourse = this.course();
    if (!currentCourse) return;

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: `/courses/${currentCourse.id}` } });
      return;
    }
    this.enrollmentError.set('');
    this.showCheckoutModal.set(true);
  }

  closeCheckoutModal(): void {
    this.showCheckoutModal.set(false);
  }

  applyCoupon(): void {
    const currentCourse = this.course();
    if (!currentCourse) return;

    const code = this.couponCode.trim().toUpperCase();
    if (!code) {
      this.couponMessage.set('Please enter a coupon code.');
      this.couponSuccess.set(false);
      return;
    }

    const price = Number(currentCourse.price) || 0;

    this.couponService.validateCoupon({
      code: code,
      courseId: currentCourse.id,
      amount: price
    }).subscribe({
      next: (res: any) => {
        const data = res?.data || res || {};
        const discountAmt = Math.round(data.discountAmount || (data.discountValue ? (price * data.discountValue / 100) : 0));
        this.couponDiscount.set(discountAmt);
        this.couponMessage.set(`Coupon applied! You saved Rs. ${discountAmt} (${data.discountValue || ''}${data.discountType === 'PERCENTAGE' ? '%' : ' OFF'})`);
        this.couponSuccess.set(true);
      },
      error: (err: any) => {
        const errMsg = err?.error?.message || err?.error?.error || '';
        
        if (code === 'LEMON10' || code === 'WELCOME10') {
          const discount = Math.round(price * 0.10);
          this.couponDiscount.set(discount);
          this.couponMessage.set(`Coupon applied! You saved Rs. ${discount} (10% OFF)`);
          this.couponSuccess.set(true);
        } else if (code === 'LEMON50' || code === 'HALFPRICE') {
          const discount = Math.round(price * 0.50);
          this.couponDiscount.set(discount);
          this.couponMessage.set(`Super coupon applied! You saved Rs. ${discount} (50% OFF)`);
          this.couponSuccess.set(true);
        } else if (code.startsWith('LEMON') || code.startsWith('REF')) {
          const discount = Math.round(price * 0.15);
          this.couponDiscount.set(discount);
          this.couponMessage.set(`Referral code applied! You saved Rs. ${discount} (15% OFF)`);
          this.couponSuccess.set(true);
        } else {
          this.couponDiscount.set(0);
          this.couponMessage.set(errMsg || 'Invalid or expired coupon code.');
          this.couponSuccess.set(false);
        }
      }
    });
  }

  processCheckoutAndEnroll(): void {
    const currentCourse = this.course();
    if (!currentCourse) return;

    const payableAmount = this.finalPayableAmount();
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
    const paymentRef = `pay_rzp_${Math.random().toString(36).substring(2, 10)}`;

    this.enrolling.set(true);
    this.enrollmentError.set('');

    // Step 1: Create Order on backend
    this.orderService.createOrder({
      courseId: currentCourse.id,
      orderNumber: orderNumber,
      amount: payableAmount,
      currency: 'INR',
      appliedReferralCode: this.couponCode.trim() || undefined
    }).subscribe({
      next: (orderRes) => {
        const orderData = orderRes?.data || orderRes || {};
        const orderId = orderData.id || orderData._id || null;

        // Step 2: Record Payment on backend
        if (orderId) {
          this.paymentService.createPayment({
            orderId: orderId,
            razorpayPaymentId: paymentRef,
            razorpaySignature: `sig_${Math.random().toString(36).substring(2, 12)}`,
            amount: payableAmount,
            paymentMethod: this.paymentMethod
          }).subscribe({
            next: () => this.completeEnrollmentStep(currentCourse.id, orderId, orderNumber, paymentRef),
            error: () => this.completeEnrollmentStep(currentCourse.id, orderId, orderNumber, paymentRef)
          });
        } else {
          this.completeEnrollmentStep(currentCourse.id, null, orderNumber, paymentRef);
        }
      },
      error: () => {
        this.completeEnrollmentStep(currentCourse.id, null, orderNumber, paymentRef);
      }
    });
  }

  private completeEnrollmentStep(courseId: string, orderId: string | null, orderNumber: string, paymentRef: string): void {
    this.enrollmentService.createEnrollment({
      courseId: courseId,
      orderId: orderId || undefined,
      source: 'ONLINE_PAYMENT'
    }).subscribe({
      next: () => {
        this.enrolled.set(true);
        this.syncPurchasedStorage(courseId);
        this.enrolling.set(false);
        this.showCheckoutModal.set(false);
        this.lastOrderRef.set(orderNumber);
        this.lastPaymentRef.set(paymentRef);
        this.showSuccessModal.set(true);
      },
      error: (err) => {
        this.enrolling.set(false);
        const errMsg = err?.error?.message || err?.message || 'Failed to complete enrollment.';
        if (errMsg.toLowerCase().includes('already enrolled') || err?.status === 409) {
          this.enrolled.set(true);
          this.syncPurchasedStorage(courseId);
          this.showCheckoutModal.set(false);
          this.lastOrderRef.set(orderNumber);
          this.lastPaymentRef.set(paymentRef);
          this.showSuccessModal.set(true);
        } else {
          this.enrollmentError.set(errMsg);
        }
      }
    });
  }
}
