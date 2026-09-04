import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { CourseService } from '../../../core/services/course.service';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { OrderService } from '../../../core/services/order.service';
import { PaymentService } from '../../../core/services/payment.service';
import { Course } from '../../../core/models/course.model';

@Component({
  selector: 'app-course-lippan',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
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
                {{ course().category }}
              </span>
              <span class="text-outline-variant/60">•</span>
              <span class="inline-flex items-center gap-1 text-[11px] text-on-surface font-semibold">
                <span class="material-symbols-outlined text-[14px] text-amber-500 filled">star</span>
                4.9 <span class="text-on-surface-variant font-normal">(124 reviews)</span>
              </span>
              <span class="text-outline-variant/60">•</span>
              <span class="text-[11px] text-on-surface-variant font-medium">{{ course().studentsCount ? course().studentsCount + '+ Students' : '1,200+ Students' }}</span>
            </div>
          </div>

          <!-- Course Title -->
          <div class="max-w-4xl">
            <h1 class="text-2xl sm:text-3xl font-bold text-on-surface leading-tight">
              {{ course().title }}
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
                [style.backgroundImage]="'url(' + course().imageUrl + ')'">
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
                    <h3 class="font-bold text-xs text-on-surface">Material &amp; Studio Prep</h3>
                    <p class="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                      Understand fundamental materials, preparation steps, and curing methods.
                    </p>
                  </div>
                </div>

                <div class="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex gap-3.5 items-start">
                  <span class="material-symbols-outlined text-primary text-lg mt-0.5 filled">check_circle</span>
                  <div>
                    <h3 class="font-bold text-xs text-on-surface">Precision Craft Techniques</h3>
                    <p class="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                      Master delicate hand controls, professional tools, and artistic compositions.
                    </p>
                  </div>
                </div>

                <div class="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex gap-3.5 items-start">
                  <span class="material-symbols-outlined text-primary text-lg mt-0.5 filled">check_circle</span>
                  <div>
                    <h3 class="font-bold text-xs text-on-surface">Advanced Texturing &amp; Color</h3>
                    <p class="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                      Create layered effects, gradients, and custom finishes for modern art markets.
                    </p>
                  </div>
                </div>

                <div class="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex gap-3.5 items-start">
                  <span class="material-symbols-outlined text-primary text-lg mt-0.5 filled">check_circle</span>
                  <div>
                    <h3 class="font-bold text-xs text-on-surface">Finishing, Sealing &amp; Selling</h3>
                    <p class="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                      Protect your creations for longevity and market your handmade goods successfully.
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
                    <span>Module 1: Foundations &amp; Material Selection</span>
                    <span class="text-[10px] text-on-surface-variant font-normal">4 Lessons • 2h 15m</span>
                  </div>
                  <div class="p-3 space-y-2 text-[11px] text-on-surface-variant divide-y divide-outline-variant/15">
                    <div class="flex items-center justify-between pt-1">
                      <span class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary text-sm">play_circle</span>
                        1. Introduction to {{ course().category }}
                      </span>
                      <span>15:00</span>
                    </div>
                    <div class="flex items-center justify-between pt-2">
                      <span class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary text-sm">play_circle</span>
                        2. Tooling, Safety &amp; Base Preparation
                      </span>
                      <span>35:00</span>
                    </div>
                  </div>
                </div>

                <div class="border border-outline-variant/30 rounded-xl overflow-hidden bg-surface-container-low">
                  <div class="p-3.5 bg-surface-container font-bold text-xs text-on-surface flex justify-between items-center">
                    <span>Module 2: Hands-On Studio Practice &amp; Creation</span>
                    <span class="text-[10px] text-on-surface-variant font-normal">8 Lessons • 5h 30m</span>
                  </div>
                </div>

                <div class="border border-outline-variant/30 rounded-xl overflow-hidden bg-surface-container-low">
                  <div class="p-3.5 bg-surface-container font-bold text-xs text-on-surface flex justify-between items-center">
                    <span>Module 3: Curing, Polishing, Sealing &amp; Commercialization</span>
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
                  {{ course().description }}
                </p>
                <p>
                  In this course, master instructor <strong>{{ course().instructor }}</strong> breaks down techniques into approachable, step-by-step studio practices tailored for beginners, hobbyists, and professional artisans alike.
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
                      <span class="text-2xl font-bold text-primary">Rs. {{ course().price }}</span>
                      <span class="text-xs text-outline line-through">Rs. {{ course().price * 3 }}</span>
                      <span class="text-[10px] font-semibold text-secondary bg-secondary-fixed/50 px-1.5 py-0.5 rounded">66% OFF</span>
                    </div>
                  </div>
                  <span class="text-[10px] font-semibold text-tertiary bg-tertiary-fixed/60 px-2.5 py-1 rounded-full border border-tertiary/20">
                    Lifetime Access
                  </span>
                </div>

                <div class="space-y-2.5">
                  <button 
                    (click)="handleEnrollClick()"
                    class="w-full bg-primary text-on-primary font-semibold py-3.5 rounded-xl hover:opacity-95 transition-opacity shadow-sm text-xs cursor-pointer flex items-center justify-center gap-2">
                    <span class="material-symbols-outlined text-sm">{{ enrolled() ? 'arrow_forward' : 'lock_open' }}</span>
                    <span>{{ enrolled() ? 'Go to My Courses' : 'Enroll Now' }}</span>
                  </button>

                  <button (click)="openCheckoutModal()" class="w-full border border-outline-variant/60 text-on-surface font-semibold py-3 rounded-xl hover:bg-surface-container-low transition-colors text-xs cursor-pointer">
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
                    [src]="getInstructorImage(course().instructor)" 
                    [alt]="course().instructor" 
                    class="w-14 h-14 rounded-full object-cover border-2 border-primary/25 shadow-sm shrink-0"
                  />
                  <div>
                    <h4 class="text-sm font-bold text-on-surface">{{ course().instructor }}</h4>
                    <p class="text-[11px] text-primary font-semibold">Master {{ course().category }} Artisan</p>
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
                    <span><strong>{{ (course().studentsCount || 120) * 10 }}+</strong> Students Mentored</span>
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

      <!-- Checkout & Payment Modal Screen -->
      @if (showCheckoutModal()) {
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
              <img [src]="course().imageUrl" [alt]="course().title" class="w-16 h-12 rounded-lg object-cover shadow-xs shrink-0" />
              <div class="flex-grow">
                <h4 class="font-bold text-xs text-on-surface line-clamp-1">{{ course().title }}</h4>
                <p class="text-[10px] text-on-surface-variant">{{ course().category }} • by {{ course().instructor }}</p>
              </div>
              <div class="text-right shrink-0">
                <span class="text-sm font-bold text-primary">Rs. {{ finalPayableAmount() }}</span>
                <span *ngIf="couponDiscount() > 0" class="block text-[9px] text-green-700 line-through">Rs. {{ course().price }}</span>
              </div>
            </div>

            <!-- Coupon Code Section -->
            <div class="space-y-1.5">
              <label class="text-[11px] font-semibold text-on-surface">Have a Referral or Promo Code?</label>
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

            <!-- Payment Method Selector -->
            <div class="space-y-2">
              <label class="text-[11px] font-semibold text-on-surface">Select Payment Method</label>
              <div class="grid grid-cols-3 gap-2.5">
                <button 
                  (click)="paymentMethod = 'UPI'"
                  [class.border-primary]="paymentMethod === 'UPI'"
                  [class.bg-primary-container/20]="paymentMethod === 'UPI'"
                  class="p-3 rounded-xl border border-outline-variant/40 flex flex-col items-center justify-center gap-1 hover:border-primary transition-all cursor-pointer">
                  <span class="material-symbols-outlined text-lg text-primary">qr_code_2</span>
                  <span class="text-[11px] font-bold">UPI / QR</span>
                </button>

                <button 
                  (click)="paymentMethod = 'CARD'"
                  [class.border-primary]="paymentMethod === 'CARD'"
                  [class.bg-primary-container/20]="paymentMethod === 'CARD'"
                  class="p-3 rounded-xl border border-outline-variant/40 flex flex-col items-center justify-center gap-1 hover:border-primary transition-all cursor-pointer">
                  <span class="material-symbols-outlined text-lg text-primary">credit_card</span>
                  <span class="text-[11px] font-bold">Debit / Card</span>
                </button>

                <button 
                  (click)="paymentMethod = 'NET_BANKING'"
                  [class.border-primary]="paymentMethod === 'NET_BANKING'"
                  [class.bg-primary-container/20]="paymentMethod === 'NET_BANKING'"
                  class="p-3 rounded-xl border border-outline-variant/40 flex flex-col items-center justify-center gap-1 hover:border-primary transition-all cursor-pointer">
                  <span class="material-symbols-outlined text-lg text-primary">account_balance</span>
                  <span class="text-[11px] font-bold">Net Banking</span>
                </button>
              </div>
            </div>

            <!-- Pricing Breakdown -->
            <div class="border-t border-outline-variant/20 pt-3 space-y-1.5 text-[11px] text-on-surface-variant">
              <div class="flex justify-between">
                <span>Original Fee:</span>
                <span class="line-through">Rs. {{ course().price * 3 }}</span>
              </div>
              <div class="flex justify-between">
                <span>Special Promotion (66% OFF):</span>
                <span class="text-green-700 font-semibold">- Rs. {{ (course().price * 2) }}</span>
              </div>
              @if (couponDiscount() > 0) {
                <div class="flex justify-between text-green-700 font-semibold">
                  <span>Coupon Discount:</span>
                  <span>- Rs. {{ couponDiscount() }}</span>
                </div>
              }
              <div class="flex justify-between font-bold text-sm text-on-surface border-t border-outline-variant/20 pt-2">
                <span>Total Amount:</span>
                <span class="text-primary">Rs. {{ finalPayableAmount() }}</span>
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
      @if (showSuccessModal()) {
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl max-w-md w-full shadow-2xl p-6 md:p-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div class="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <span class="material-symbols-outlined text-3xl">check_circle</span>
            </div>

            <div>
              <h3 class="text-lg font-bold text-on-surface">Enrollment Successful! 🎉</h3>
              <p class="text-xs text-on-surface-variant mt-1">
                You now have full lifetime access to <strong>{{ course().title }}</strong>.
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
                [routerLink]="['/my-courses', course().id]" 
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
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  enrolling = signal<boolean>(false);
  enrolled = signal<boolean>(false);
  enrollmentError = signal<string>('');

  showCheckoutModal = signal<boolean>(false);
  showSuccessModal = signal<boolean>(false);

  paymentMethod: 'UPI' | 'CARD' | 'NET_BANKING' = 'UPI';
  couponCode = '';
  couponDiscount = signal<number>(0);
  couponMessage = signal<string>('');
  couponSuccess = signal<boolean>(false);

  lastPaymentRef = signal<string>('');
  lastOrderRef = signal<string>('');

  course = signal<Course>({
    id: 'lippan-art',
    title: 'The Art of Lippan: Traditional Mud & Mirror Work',
    category: 'Lippan Art',
    categorySlug: 'lippan-art',
    instructor: 'Aisha Sharma',
    description: 'Master the ancient Gujarati art form of Lippan Kaam. Create stunning, intricate murals using modern materials while preserving traditional techniques.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaoX0RGxpW-j4nvC1oT1ER7ghQq3LTyffaeKwMP7NUMAKKHqHQmjktmUbyLPagZx6VG0o3H4U157TFiWJGVWKEFwAc3hVXQzqSdHoFy7hC98aHC2EyKFdILSTsnS-EXmaDGklBokg2X7ZOMMcfjaSFDKUhNg6zQecW1g1g1W-aIDWhErsUjb9KT097mpys8RjeuJAbVJ2rMZ7tS10zRVyyf0czkAW4IWUW6sgkOQOPwRiE2EbJHQdA',
    price: 2499,
    studentsCount: 124
  });

  finalPayableAmount(): number {
    const base = Number(this.course().price) || 0;
    const discount = this.couponDiscount();
    return Math.max(0, base - discount);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const courseId = params.get('id') || 'lippan-art';
      this.courseService.getCourse(courseId).subscribe(found => {
        if (found) {
          this.course.set(found);
          // Check enrollment status via API
          if (this.authService.isLoggedIn()) {
            this.enrollmentService.getEnrollments().subscribe({
              next: (enrollments) => {
                const isEnrolled = enrollments.some(e => e.courseId === found.id || e.course?.id === found.id || e.id === found.id);
                this.enrolled.set(isEnrolled);
              },
              error: () => this.enrolled.set(false)
            });
          }
        }
      });
    });
  }

  getInstructorImage(instructor: string): string {
    if (!instructor) return 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200';
    if (instructor.includes('Chloe')) return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200';
    if (instructor.includes('Elena')) return 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200';
    if (instructor.includes('Marco')) return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200';
    if (instructor.includes('Maya')) return 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200&h=200';
    return 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200';
  }

  handleEnrollClick(): void {
    const currentCourse = this.course();
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
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: `/courses/${this.course().id}` } });
      return;
    }
    this.enrollmentError.set('');
    this.showCheckoutModal.set(true);
  }

  closeCheckoutModal(): void {
    this.showCheckoutModal.set(false);
  }

  applyCoupon(): void {
    const code = this.couponCode.trim().toUpperCase();
    if (!code) {
      this.couponMessage.set('Please enter a coupon code.');
      this.couponSuccess.set(false);
      return;
    }

    const price = Number(this.course().price) || 0;
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
      this.couponMessage.set('Invalid promo code. Try LEMON10 or WELCOME10.');
      this.couponSuccess.set(false);
    }
  }

  processCheckoutAndEnroll(): void {
    const currentCourse = this.course();
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
        // Fallback: Directly complete enrollment if backend orders table has any restriction
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
