import { Routes } from '@angular/router';
import { adminGuard, trainerGuard } from './core/guards/auth.guard';

// Layouts
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { TrainerLayoutComponent } from './layouts/trainer-layout/trainer-layout.component';

// Public & Student Features
import { HomeComponent } from './features/public/home/home.component';
import { AboutComponent } from './features/public/about/about.component';
import { BlogsComponent } from './features/public/blogs/blogs.component';
import { BlogDetailComponent } from './features/public/blog-detail/blog-detail.component';
import { CoursesComponent } from './features/public/courses/courses.component';
import { CourseLippanComponent } from './features/public/course-lippan/course-lippan.component';
import { GalleryComponent } from './features/public/gallery/gallery.component';
import { GalleryStudentComponent } from './features/public/gallery-student/gallery-student.component';
import { LoginComponent } from './features/public/login/login.component';
import { SignupComponent } from './features/public/signup/signup.component';
import { ProfileComponent } from './features/student/profile/profile.component';
import { MyCoursesComponent } from './features/student/my-courses/my-courses.component';
import { MyCourseDetailComponent } from './features/student/my-course-detail/my-course-detail.component';
import { CourseLearningComponent } from './features/student/course-learning/course-learning.component';
import { CourseModule1Component } from './features/student/course-module-1/course-module-1.component';
import { ReferAndEarnComponent } from './features/student/refer-and-earn/refer-and-earn.component';
import { BecomeTrainerComponent } from './features/public/become-trainer/become-trainer.component';
import { PrototypeComponent } from './features/public/prototype/prototype.component';
import { SupportComponent } from './features/public/support/support.component';
import { PrivacyComponent } from './features/public/privacy/privacy.component';
import { TermsComponent } from './features/public/terms/terms.component';
import { ForbiddenComponent } from './features/public/forbidden/forbidden.component';
import { NotFoundComponent } from './features/public/not-found/not-found.component';

// Admin Features
import { AdminDashboardComponent } from './features/admin/dashboard/admin-dashboard.component';
import { AdminCoursesComponent } from './features/admin/courses/admin-courses.component';
import { AdminStudentsComponent } from './features/admin/students/admin-students.component';
import { AdminContentComponent } from './features/admin/content/admin-content.component';
import { AdminContentUploadComponent } from './features/admin/content-upload/admin-content-upload.component';
import { AdminApplicationsComponent } from './features/admin/applications/admin-applications.component';
import { AdminApplicationsReviewComponent } from './features/admin/applications-review/admin-applications-review.component';
import { AdminCouponsComponent } from './features/admin/coupons/admin-coupons.component';
import { AdminCouponsCreateComponent } from './features/admin/coupons-create/admin-coupons-create.component';
import { AdminBlogsComponent } from './features/admin/blogs/admin-blogs.component';
import { AdminCarouselComponent } from './features/admin/carousel/admin-carousel.component';
import { AdminImportComponent } from './features/admin/import/admin-import.component';

// Trainer Features
import { TrainerDashboardComponent } from './features/trainer/dashboard/trainer-dashboard.component';
import { TrainerCoursesComponent } from './features/trainer/courses/trainer-courses.component';
import { TrainerStudentsComponent } from './features/trainer/students/trainer-students.component';
import { TrainerClassesComponent } from './features/trainer/classes/trainer-classes.component';
import { TrainerResourcesComponent } from './features/trainer/resources/trainer-resources.component';
import { TrainerBlogsComponent } from './features/trainer/blogs/trainer-blogs.component';
import { TrainerGalleryComponent } from './features/trainer/gallery/trainer-gallery.component';
import { TrainerProfileComponent } from './features/trainer/profile/trainer-profile.component';
import { TrainerEditorComponent } from './features/trainer/editor/trainer-editor.component';
import { TrainerApplicationComponent } from './features/trainer/application/trainer-application.component';

export const routes: Routes = [
  // Public & Student Layout
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'blogs', component: BlogsComponent },
      { path: 'blogs/:id', component: BlogDetailComponent },
      { path: 'courses', component: CoursesComponent },
      { path: 'courses/lippan-art', component: CourseLippanComponent },
      { path: 'courses/lippan-art/learning', component: CourseLearningComponent },
      { path: 'courses/lippan-art/module-1', component: CourseModule1Component },
      { path: 'courses/:id', component: CourseLippanComponent },
      { path: 'gallery', component: GalleryComponent },
      { path: 'gallery/student-creations', component: GalleryStudentComponent },
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'my-courses', component: MyCoursesComponent },
      { path: 'my-courses/:courseId', component: MyCourseDetailComponent },
      { path: 'refer-and-earn', component: ReferAndEarnComponent },
      { path: 'become-a-trainer', component: BecomeTrainerComponent },
      { path: 'become-trainer', redirectTo: 'become-a-trainer', pathMatch: 'full' },
      { path: 'prototype', component: PrototypeComponent },
      { path: 'support', component: SupportComponent },
      { path: 'privacy', component: PrivacyComponent },
      { path: 'terms', component: TermsComponent },
      { path: '403', component: ForbiddenComponent }
    ]
  },

  // Admin Portal
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'courses', component: AdminCoursesComponent },
      { path: 'students', component: AdminStudentsComponent },
      { path: 'content', component: AdminContentComponent },
      { path: 'content/upload', component: AdminContentUploadComponent },
      { path: 'applications', component: AdminApplicationsComponent },
      { path: 'applications/review', component: AdminApplicationsReviewComponent },
      { path: 'coupons', component: AdminCouponsComponent },
      { path: 'coupons/create', component: AdminCouponsCreateComponent },
      { path: 'blogs', component: AdminBlogsComponent },
      { path: 'carousel', component: AdminCarouselComponent },
      { path: 'import', component: AdminImportComponent }
    ]
  },

  // Trainer Portal
  {
    path: 'trainer',
    component: TrainerLayoutComponent,
    canActivate: [trainerGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: TrainerDashboardComponent },
      { path: 'courses', component: TrainerCoursesComponent },
      { path: 'students', component: TrainerStudentsComponent },
      { path: 'classes', component: TrainerClassesComponent },
      { path: 'resources', component: TrainerResourcesComponent },
      { path: 'blogs', component: TrainerBlogsComponent },
      { path: 'gallery', component: TrainerGalleryComponent },
      { path: 'profile', component: TrainerProfileComponent },
      { path: 'editor', component: TrainerEditorComponent },
      { path: 'application', component: TrainerApplicationComponent }
    ]
  },

  // 404 Wildcard
  {
    path: '**',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: NotFoundComponent }
    ]
  }
];
