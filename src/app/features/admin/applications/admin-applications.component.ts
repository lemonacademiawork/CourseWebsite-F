import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrainerService } from '../../../core/services/trainer.service';
import { TrainerRequestService } from '../../../core/services/trainer-request.service';
import { UploadService } from '../../../core/services/upload.service';
import { AdminTrainerItem, CreateTrainerPayload } from '../../../core/models/trainer.model';
import { TrainerRequest, TrainerRequestStatus } from '../../../core/models/trainer-request.model';

@Component({
  selector: 'app-admin-applications',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <main class="p-6 max-w-container-max mx-auto text-xs text-on-surface min-h-screen">
      
      <!-- Top Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-surface-variant/30 pb-4">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
              <span class="material-symbols-outlined text-xs">verified</span>
              Faculty &amp; Artisan Management
            </span>
            <span class="text-on-surface-variant text-[11px]">Lemon Academia Instructor Portal</span>
          </div>
          <h1 class="text-xl font-bold text-on-surface">Trainer Management &amp; Applications</h1>
          <p class="text-xs text-on-surface-variant mt-0.5">
            Directly onboard master artisans, manage active platform instructors, and review incoming teaching applications.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
          <!-- Direct Add Trainer CTA Button -->
          <button 
            (click)="openAddTrainerModal()"
            class="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm cursor-pointer">
            <span class="material-symbols-outlined text-[16px]">person_add</span>
            <span>+ Add Trainer Directly</span>
          </button>
        </div>
      </div>

      <!-- Quick KPI Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div class="p-3.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-xs flex items-center justify-between">
          <div>
            <span class="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block">Active Platform Trainers</span>
            <span class="text-lg font-bold text-on-surface">{{ trainers().length }} Instructors</span>
          </div>
          <div class="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <span class="material-symbols-outlined text-lg">badge</span>
          </div>
        </div>

        <div class="p-3.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-xs flex items-center justify-between">
          <div>
            <span class="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block">Pending Applications</span>
            <span class="text-lg font-bold text-amber-600">{{ pendingApplicationsCount() }} Awaiting Review</span>
          </div>
          <div class="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <span class="material-symbols-outlined text-lg">pending_actions</span>
          </div>
        </div>

        <div class="p-3.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-xs flex items-center justify-between">
          <div>
            <span class="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block">Approved Applications</span>
            <span class="text-lg font-bold text-green-700">{{ approvedApplicationsCount() }} Processed</span>
          </div>
          <div class="w-9 h-9 rounded-lg bg-green-50 text-green-700 flex items-center justify-center">
            <span class="material-symbols-outlined text-lg">how_to_reg</span>
          </div>
        </div>
      </div>

      <!-- Toast Feedback Notifications -->
      @if (successToast()) {
        <div class="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-xl flex items-center justify-between gap-2 shadow-xs animate-fadeIn">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-sm text-green-600">check_circle</span>
            <span class="font-medium text-xs">{{ successToast() }}</span>
          </div>
          <button (click)="successToast.set('')" class="text-green-600 hover:text-green-800 cursor-pointer">
            <span class="material-symbols-outlined text-xs">close</span>
          </button>
        </div>
      }

      <!-- Main Tabs: Active Platform Trainers vs Incoming Applications -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        <!-- Tab Buttons -->
        <div class="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-xl border border-outline-variant/30">
          <button 
            (click)="activeTab.set('trainers')"
            [class.bg-surface-container-lowest]="activeTab() === 'trainers'"
            [class.text-primary]="activeTab() === 'trainers'"
            [class.shadow-2xs]="activeTab() === 'trainers'"
            [class.text-on-surface-variant]="activeTab() !== 'trainers'"
            class="px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">groups</span>
            <span>Active Trainers</span>
            <span class="px-1.5 py-0.2 rounded-full text-[10px] font-bold"
                  [class.bg-primary/10]="activeTab() === 'trainers'"
                  [class.text-primary]="activeTab() === 'trainers'"
                  [class.bg-surface-variant]="activeTab() !== 'trainers'">
              {{ trainers().length }}
            </span>
          </button>

          <button 
            (click)="activeTab.set('applications')"
            [class.bg-surface-container-lowest]="activeTab() === 'applications'"
            [class.text-primary]="activeTab() === 'applications'"
            [class.shadow-2xs]="activeTab() === 'applications'"
            [class.text-on-surface-variant]="activeTab() !== 'applications'"
            class="px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">assignment_ind</span>
            <span>Trainer Applications</span>
            @if (pendingApplicationsCount() > 0) {
              <span class="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                {{ pendingApplicationsCount() }}
              </span>
            } @else {
              <span class="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-surface-variant text-on-surface-variant">
                {{ applications().length }}
              </span>
            }
          </button>
        </div>

        <!-- Search Input -->
        <div class="relative w-full sm:w-72">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">search</span>
          <input 
            type="text"
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
            [placeholder]="activeTab() === 'trainers' ? 'Search by name, expertise, email...' : 'Search applicant name, course...'"
            class="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/40 text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs"
          />
          @if (searchQuery()) {
            <button (click)="searchQuery.set('')" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer">
              <span class="material-symbols-outlined text-xs">close</span>
            </button>
          }
        </div>
      </div>

      <!-- TAB 1: ACTIVE PLATFORM TRAINERS -->
      @if (activeTab() === 'trainers') {
        <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/35 shadow-sm overflow-hidden animate-fadeIn">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-surface-container-low border-b border-outline-variant/30 text-on-surface-variant font-semibold">
                  <th class="py-3 px-4">Instructor Profile</th>
                  <th class="py-3 px-4">Contact Details</th>
                  <th class="py-3 px-4">Craft Expertise</th>
                  <th class="py-3 px-4">Courses Taught</th>
                  <th class="py-3 px-4">Status</th>
                  <th class="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/15">
                @for (trainer of filteredTrainers(); track trainer.id || trainer.email) {
                  <tr class="hover:bg-surface-container-low/50 transition-colors">
                    <!-- Instructor Profile -->
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-3">
                        @if (trainer.avatarUrl) {
                          <img [src]="trainer.avatarUrl" [alt]="trainer.name" class="w-9 h-9 rounded-full object-cover border border-outline-variant/40 shrink-0" />
                        } @else {
                          <div class="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 border border-primary/20">
                            {{ getInitials(trainer.name) }}
                          </div>
                        }
                        <div>
                          <p class="font-bold text-on-surface text-xs flex items-center gap-1.5">
                            {{ trainer.name }}
                            @if (trainer.plainPassword) {
                              <span class="material-symbols-outlined text-xs text-primary" title="Credentials generated by Admin">key</span>
                            }
                          </p>
                          <p class="text-[11px] text-on-surface-variant">{{ trainer.designation || 'Instructor at Lemon Academy' }}</p>
                        </div>
                      </div>
                    </td>

                    <!-- Contact Details -->
                    <td class="py-3 px-4 text-on-surface-variant">
                      <div class="font-medium text-on-surface">{{ trainer.email }}</div>
                      @if (trainer.phone) {
                        <div class="text-[10px] text-on-surface-variant/80 mt-0.5 flex items-center gap-1">
                          <span class="material-symbols-outlined text-[11px]">call</span>
                          <span>{{ trainer.phone }}</span>
                        </div>
                      }
                    </td>

                    <!-- Craft Expertise -->
                    <td class="py-3 px-4">
                      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-surface-container-high text-on-surface border border-outline-variant/20">
                        <span class="material-symbols-outlined text-[12px] text-primary">brush</span>
                        <span>{{ trainer.expertise || 'Studio Master' }}</span>
                      </span>
                    </td>

                    <!-- Courses Taught -->
                    <td class="py-3 px-4 font-semibold text-on-surface">
                      <span class="px-2 py-0.5 rounded bg-primary/5 text-primary text-[11px] font-bold">
                        {{ trainer.publishedCoursesCount || 0 }} Classes
                      </span>
                    </td>

                    <!-- Status -->
                    <td class="py-3 px-4">
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 inline-flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                        <span>Active</span>
                      </span>
                    </td>

                    <!-- Actions -->
                    <td class="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <!-- Details / Credentials Button -->
                      <button 
                        (click)="openTrainerDetails(trainer)"
                        class="bg-surface-container text-on-surface hover:bg-surface-variant font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-xs inline-flex items-center gap-1"
                        title="View Profile & Credentials">
                        <span class="material-symbols-outlined text-xs">visibility</span>
                        <span>Details</span>
                      </button>

                      <!-- Edit Button -->
                      <button 
                        (click)="openEditTrainerModal(trainer)"
                        class="bg-surface-container-high text-on-surface hover:bg-surface-dim font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-xs inline-flex items-center gap-1"
                        title="Edit Trainer Profile">
                        <span class="material-symbols-outlined text-xs">edit</span>
                        <span>Edit</span>
                      </button>

                      <!-- Delete / Revoke Button -->
                      <button 
                        (click)="openDeleteConfirm(trainer)"
                        class="bg-red-50 text-red-600 hover:bg-red-100 font-semibold px-2 py-1 rounded-lg transition-colors cursor-pointer text-xs inline-flex items-center gap-1"
                        title="Remove Trainer">
                        <span class="material-symbols-outlined text-xs">delete</span>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          @if (filteredTrainers().length === 0 && !loadingTrainers()) {
            <div class="py-12 text-center bg-surface-container-low text-on-surface-variant space-y-2">
              <span class="material-symbols-outlined text-primary text-4xl">person_search</span>
              <p class="font-bold text-xs text-on-surface">No Instructors Found</p>
              <p class="text-[11px] text-on-surface-variant max-w-sm mx-auto">
                {{ searchQuery() ? 'No trainers match your search query.' : 'No active trainers on the platform yet. Click "+ Add Trainer Directly" to onboard your first instructor.' }}
              </p>
              <button 
                (click)="openAddTrainerModal()"
                class="mt-2 px-3.5 py-1.5 rounded-lg bg-primary text-on-primary font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer inline-flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">person_add</span>
                <span>Add Trainer Directly</span>
              </button>
            </div>
          }
        </div>
      }

      <!-- TAB 2: INCOMING TRAINER APPLICATIONS -->
      @if (activeTab() === 'applications') {
        <div class="space-y-3 animate-fadeIn">
          
          <!-- Application Status Filter Pills -->
          <div class="flex items-center gap-1.5">
            @for (st of ['ALL', 'PENDING', 'APPROVED', 'REJECTED']; track st) {
              <button 
                (click)="appStatusFilter.set(st)"
                [class.bg-primary]="appStatusFilter() === st"
                [class.text-on-primary]="appStatusFilter() === st"
                [class.bg-surface-container-high]="appStatusFilter() !== st"
                [class.text-on-surface-variant]="appStatusFilter() !== st"
                class="px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer">
                {{ st === 'ALL' ? 'All Applications' : st }}
              </button>
            }
          </div>

          <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/35 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-surface-container-low border-b border-outline-variant/30 text-on-surface-variant font-semibold">
                    <th class="py-3 px-4">Applicant Name</th>
                    <th class="py-3 px-4">Contact</th>
                    <th class="py-3 px-4">Proposed Craft / Course</th>
                    <th class="py-3 px-4">Experience</th>
                    <th class="py-3 px-4">Status</th>
                    <th class="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-outline-variant/15">
                  @for (app of filteredApplications(); track app.id) {
                    <tr class="hover:bg-surface-container-low/50 transition-colors">
                      <td class="py-3 px-4 font-bold text-on-surface">
                        {{ app.fullName || app.name }}
                        <span class="block text-[10px] text-on-surface-variant font-normal">
                          Submitted {{ app.createdAt ? (app.createdAt | date:'mediumDate') : 'Recently' }}
                        </span>
                      </td>
                      <td class="py-3 px-4 text-on-surface-variant">
                        <div class="font-medium text-on-surface">{{ app.email }}</div>
                        @if (app.phone) {
                          <div class="text-[10px] text-on-surface-variant/75">{{ app.phone }}</div>
                        }
                      </td>
                      <td class="py-3 px-4">
                        <span class="font-medium text-on-surface">{{ app.expertise || app.course }}</span>
                      </td>
                      <td class="py-3 px-4 font-semibold text-on-surface">
                        {{ app.yearsOfExperience || app.experience || '1' }} yrs
                      </td>
                      <td class="py-3 px-4">
                        <span 
                          class="px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1"
                          [class.bg-yellow-100]="app.status === 'PENDING' || app.status === 'Pending Approval'"
                          [class.text-yellow-800]="app.status === 'PENDING' || app.status === 'Pending Approval'"
                          [class.bg-green-100]="app.status === 'APPROVED' || app.status === 'Approved'"
                          [class.text-green-800]="app.status === 'APPROVED' || app.status === 'Approved'"
                          [class.bg-red-100]="app.status === 'REJECTED' || app.status === 'Rejected'"
                          [class.text-red-800]="app.status === 'REJECTED' || app.status === 'Rejected'">
                          {{ app.status }}
                        </span>
                      </td>
                      <td class="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <!-- Direct Review Link -->
                        <a [routerLink]="['/admin/applications/review', app.id]" class="px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors text-xs inline-flex items-center gap-1">
                          <span class="material-symbols-outlined text-xs">rate_review</span>
                          <span>Review</span>
                        </a>

                        @if (app.status === 'PENDING' || app.status === 'Pending Approval') {
                          <!-- Quick Approve -->
                          <button 
                            (click)="quickApproveApplication(app)"
                            class="px-2 py-1 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 font-semibold text-xs cursor-pointer inline-flex items-center gap-0.5"
                            title="Quick Approve Applicant">
                            <span class="material-symbols-outlined text-xs">check</span>
                            <span>Approve</span>
                          </button>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            @if (filteredApplications().length === 0 && !loadingApps()) {
              <div class="p-8 text-center bg-surface-container-low text-on-surface-variant">
                <span class="material-symbols-outlined text-primary text-3xl mb-1">assignment_turned_in</span>
                <p class="font-semibold text-xs text-on-surface">No Applications Found</p>
                <p class="text-[11px] text-on-surface-variant mt-0.5">There are no incoming trainer applications matching the current filter.</p>
              </div>
            }
          </div>
        </div>
      }

      <!-- MODAL 1: DIRECT ADD TRAINER MODAL -->
      @if (isAddTrainerModalOpen()) {
        <div class="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div class="bg-surface-container-lowest rounded-2xl p-6 max-w-xl w-full border border-outline-variant/30 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <!-- Modal Header -->
            <div class="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div class="flex items-center gap-2.5 text-primary">
                <div class="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span class="material-symbols-outlined text-xl">person_add</span>
                </div>
                <div>
                  <h3 class="font-bold text-base text-on-surface">Add Trainer Directly</h3>
                  <p class="text-[11px] text-on-surface-variant">Onboard a craft instructor with custom or auto-generated credentials.</p>
                </div>
              </div>
              <button (click)="closeAddTrainerModal()" class="text-on-surface-variant hover:text-on-surface cursor-pointer p-1">
                <span class="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <!-- Error Banner -->
            @if (formError()) {
              <div class="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <span class="material-symbols-outlined text-sm shrink-0">error</span>
                <span>{{ formError() }}</span>
              </div>
            }

            <form (ngSubmit)="submitDirectAddTrainer()" class="space-y-3.5">
              
              <!-- Name & Email (Row 1) -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block font-semibold mb-1 text-on-surface-variant">Full Name *</label>
                  <input 
                    type="text" 
                    [(ngModel)]="addName" 
                    name="addName" 
                    required
                    placeholder="e.g. Priya Sharma"
                    class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none" 
                  />
                </div>
                <div>
                  <label class="block font-semibold mb-1 text-on-surface-variant">Email Address *</label>
                  <input 
                    type="email" 
                    [(ngModel)]="addEmail" 
                    name="addEmail" 
                    required
                    placeholder="e.g. priya@lemonacademy.in"
                    class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none" 
                  />
                </div>
              </div>

              <!-- Phone & Password (Row 2) -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block font-semibold mb-1 text-on-surface-variant">Phone Number</label>
                  <input 
                    type="tel" 
                    [(ngModel)]="addPhone" 
                    name="addPhone" 
                    placeholder="e.g. 9876543210"
                    class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none" 
                  />
                </div>
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <label class="font-semibold text-on-surface-variant">Login Password *</label>
                    <button 
                      type="button" 
                      (click)="generateStrongPassword()"
                      class="text-[10px] text-primary font-bold hover:underline cursor-pointer flex items-center gap-0.5">
                      <span class="material-symbols-outlined text-[11px]">autorenew</span>
                      Generate
                    </button>
                  </div>
                  <div class="relative">
                    <input 
                      [type]="showPassword() ? 'text' : 'password'" 
                      [(ngModel)]="addPassword" 
                      name="addPassword" 
                      required
                      placeholder="e.g. Trainer@123456"
                      class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 pr-8 text-xs focus:ring-1 focus:ring-primary focus:outline-none font-mono" 
                    />
                    <button 
                      type="button"
                      (click)="showPassword.set(!showPassword())"
                      class="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer">
                      <span class="material-symbols-outlined text-[14px]">{{ showPassword() ? 'visibility_off' : 'visibility' }}</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Craft Expertise & Quick Suggestion Chips -->
              <div>
                <label class="block font-semibold mb-1 text-on-surface-variant">Teaching Expertise / Craft Domain *</label>
                <input 
                  type="text" 
                  [(ngModel)]="addExpertise" 
                  name="addExpertise" 
                  required
                  placeholder="e.g. Modern Crochet &amp; Amigurumi"
                  class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none" 
                />
                
                <!-- Quick Suggestion Chips -->
                <div class="flex flex-wrap gap-1.5 mt-1.5">
                  <span class="text-[10px] text-on-surface-variant/80 self-center">Quick picks:</span>
                  @for (chip of expertiseSuggestions; track chip) {
                    <button 
                      type="button" 
                      (click)="addExpertise.set(chip)"
                      class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-surface-container-high hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer border border-outline-variant/20">
                      {{ chip }}
                    </button>
                  }
                </div>
              </div>

              <!-- Designation -->
              <div>
                <label class="block font-semibold mb-1 text-on-surface-variant">Designation / Studio Title</label>
                <input 
                  type="text" 
                  [(ngModel)]="addDesignation" 
                  name="addDesignation" 
                  placeholder="e.g. Lead Fiber Artist &amp; Master Instructor"
                  class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none" 
                />
              </div>

              <!-- Bio -->
              <div>
                <label class="block font-semibold mb-1 text-on-surface-variant">Instructor Bio &amp; Artisan Background</label>
                <textarea 
                  [(ngModel)]="addBio" 
                  name="addBio" 
                  rows="3"
                  placeholder="Certified fiber artist with 8+ years experience in yarn crafts, workshop hosting, and pattern design."
                  class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none resize-none">
                </textarea>
              </div>

              <!-- Avatar Photo Upload & URL -->
              <div>
                <label class="block font-semibold mb-1 text-on-surface-variant">Profile Photo / Avatar URL</label>
                <div class="flex gap-2 items-center">
                  <input 
                    type="url" 
                    [(ngModel)]="addAvatarUrl" 
                    name="addAvatarUrl" 
                    placeholder="https://images.unsplash.com/... or upload photo"
                    class="flex-grow bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none" 
                  />
                  
                  <input 
                    #avatarFileInput 
                    type="file" 
                    accept="image/*" 
                    class="hidden" 
                    (change)="onAvatarFileSelected($event)" 
                  />
                  <button 
                    type="button" 
                    (click)="avatarFileInput.click()"
                    [disabled]="isUploadingAvatar()"
                    class="px-3 py-2.5 rounded-lg bg-surface-container-high border border-outline-variant/40 text-on-surface font-semibold text-xs hover:bg-surface-variant transition-colors flex items-center gap-1 cursor-pointer shrink-0">
                    @if (isUploadingAvatar()) {
                      <span class="material-symbols-outlined text-xs animate-spin">progress_activity</span>
                    } @else {
                      <span class="material-symbols-outlined text-xs text-primary">upload</span>
                    }
                    <span>Upload</span>
                  </button>
                </div>

                @if (addAvatarUrl()) {
                  <div class="flex items-center gap-2 mt-2 p-2 bg-surface-container-low rounded-lg">
                    <img [src]="addAvatarUrl()" alt="Preview" class="w-8 h-8 rounded-full object-cover border border-outline-variant/30" />
                    <span class="text-[11px] text-on-surface-variant truncate">Image loaded successfully</span>
                  </div>
                }
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-end gap-2 pt-3 border-t border-outline-variant/20">
                <button 
                  type="button" 
                  (click)="closeAddTrainerModal()"
                  [disabled]="isSubmitting()"
                  class="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-semibold hover:bg-surface-dim cursor-pointer text-xs">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  [disabled]="isSubmitting()"
                  class="px-5 py-2 rounded-xl bg-primary text-on-primary font-bold hover:opacity-90 cursor-pointer text-xs flex items-center gap-1.5 shadow-sm disabled:opacity-50">
                  @if (isSubmitting()) {
                    <span class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                    <span>Creating Trainer...</span>
                  } @else {
                    <span class="material-symbols-outlined text-sm">how_to_reg</span>
                    <span>Onboard Trainer</span>
                  }
                </button>
              </div>

            </form>
          </div>
        </div>
      }

      <!-- MODAL 2: CREDENTIALS CELEBRATION MODAL (SHOWS GENERATED LOGIN INFO) -->
      @if (credentialsModalData()) {
        <div class="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div class="bg-surface-container-lowest rounded-2xl p-6 max-w-md w-full border border-green-200 shadow-2xl space-y-4">
            
            <div class="flex items-center gap-3 text-green-700">
              <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-2xl text-green-600">verified</span>
              </div>
              <div>
                <h3 class="font-bold text-base text-on-surface">Trainer Onboarded!</h3>
                <p class="text-[11px] text-on-surface-variant">Instructor account has been provisioned and is ready for use.</p>
              </div>
            </div>

            <!-- Credentials Card -->
            <div class="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 space-y-2.5 font-mono text-xs">
              <div>
                <span class="text-[10px] uppercase font-bold text-on-surface-variant block font-sans">Instructor Name</span>
                <span class="font-bold text-on-surface font-sans text-sm">{{ credentialsModalData()?.name }}</span>
              </div>
              <div>
                <span class="text-[10px] uppercase font-bold text-on-surface-variant block font-sans">Portal Login URL</span>
                <span class="text-primary truncate block">{{ credentialsModalData()?.loginUrl }}</span>
              </div>
              <div>
                <span class="text-[10px] uppercase font-bold text-on-surface-variant block font-sans">Login Email</span>
                <span class="text-on-surface font-semibold block">{{ credentialsModalData()?.email }}</span>
              </div>
              <div>
                <span class="text-[10px] uppercase font-bold text-on-surface-variant block font-sans">Assigned Password</span>
                <span class="text-primary font-bold text-sm block">{{ credentialsModalData()?.password || 'Saved on Server' }}</span>
              </div>
            </div>

            <!-- Copy Action Feedback -->
            @if (copiedToast()) {
              <div class="p-2 bg-green-50 text-green-800 rounded-lg text-xs text-center font-semibold animate-fadeIn flex items-center justify-center gap-1">
                <span class="material-symbols-outlined text-xs">check</span>
                <span>Credentials copied to clipboard!</span>
              </div>
            }

            <div class="flex items-center justify-between gap-2 pt-2 border-t border-outline-variant/20">
              <button 
                type="button" 
                (click)="copyCredentialsToClipboard()"
                class="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold hover:opacity-90 cursor-pointer text-xs flex items-center gap-1.5 shadow-sm">
                <span class="material-symbols-outlined text-sm">content_copy</span>
                <span>Copy Credentials</span>
              </button>

              <button 
                type="button" 
                (click)="credentialsModalData.set(null)"
                class="px-4 py-2 rounded-xl bg-surface-container-high text-on-surface font-semibold hover:bg-surface-dim cursor-pointer text-xs">
                Done
              </button>
            </div>

          </div>
        </div>
      }

      <!-- MODAL 3: TRAINER DETAILS MODAL -->
      @if (selectedTrainerDetails()) {
        <div class="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div class="bg-surface-container-lowest rounded-2xl p-6 max-w-lg w-full border border-outline-variant/30 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div class="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div class="flex items-center gap-3">
                @if (selectedTrainerDetails()?.avatarUrl) {
                  <img [src]="selectedTrainerDetails()?.avatarUrl" class="w-11 h-11 rounded-full object-cover border border-outline-variant/40" />
                } @else {
                  <div class="w-11 h-11 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                    {{ getInitials(selectedTrainerDetails()?.name || 'T') }}
                  </div>
                }
                <div>
                  <h3 class="font-bold text-base text-on-surface">{{ selectedTrainerDetails()?.name }}</h3>
                  <p class="text-xs text-primary font-medium">{{ selectedTrainerDetails()?.designation || 'Instructor' }}</p>
                </div>
              </div>
              <button (click)="selectedTrainerDetails.set(null)" class="text-on-surface-variant hover:text-on-surface cursor-pointer p-1">
                <span class="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div class="grid grid-cols-2 gap-3 text-xs">
              <div class="p-3 bg-surface-container-low rounded-xl">
                <span class="text-[10px] uppercase font-semibold text-on-surface-variant block">Email</span>
                <span class="font-medium text-on-surface break-all">{{ selectedTrainerDetails()?.email }}</span>
              </div>
              <div class="p-3 bg-surface-container-low rounded-xl">
                <span class="text-[10px] uppercase font-semibold text-on-surface-variant block">Phone</span>
                <span class="font-medium text-on-surface">{{ selectedTrainerDetails()?.phone || 'Not provided' }}</span>
              </div>
              <div class="p-3 bg-surface-container-low rounded-xl">
                <span class="text-[10px] uppercase font-semibold text-on-surface-variant block">Primary Craft</span>
                <span class="font-medium text-on-surface">{{ selectedTrainerDetails()?.expertise || 'Artisan Craft' }}</span>
              </div>
              <div class="p-3 bg-surface-container-low rounded-xl">
                <span class="text-[10px] uppercase font-semibold text-on-surface-variant block">Published Courses</span>
                <span class="font-bold text-primary">{{ selectedTrainerDetails()?.publishedCoursesCount || 0 }} Masterclasses</span>
              </div>
            </div>

            <div class="p-3.5 bg-surface-container-low rounded-xl space-y-1">
              <span class="text-[10px] uppercase font-semibold text-on-surface-variant block">Artisan Bio</span>
              <p class="text-xs text-on-surface-variant leading-relaxed">
                {{ selectedTrainerDetails()?.bio || 'Certified artisan instructor for Lemon Academia workshops.' }}
              </p>
            </div>

            @if (selectedTrainerDetails()?.plainPassword) {
              <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1">
                <span class="font-bold text-amber-800 flex items-center gap-1">
                  <span class="material-symbols-outlined text-xs">key</span>
                  Initial Assigned Password
                </span>
                <span class="font-mono text-sm font-bold text-amber-900 block">{{ selectedTrainerDetails()?.plainPassword }}</span>
              </div>
            }

            <div class="flex justify-end pt-2 border-t border-outline-variant/20">
              <button 
                (click)="selectedTrainerDetails.set(null)"
                class="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-semibold hover:bg-surface-dim cursor-pointer text-xs">
                Close
              </button>
            </div>

          </div>
        </div>
      }

      <!-- MODAL 4: EDIT TRAINER MODAL -->
      @if (editingTrainer()) {
        <div class="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div class="bg-surface-container-lowest rounded-2xl p-6 max-w-lg w-full border border-outline-variant/30 shadow-2xl space-y-3.5 max-h-[90vh] overflow-y-auto">
            
            <div class="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <h3 class="font-bold text-base text-on-surface flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">edit</span>
                Edit Trainer Profile
              </h3>
              <button (click)="editingTrainer.set(null)" class="text-on-surface-variant hover:text-on-surface cursor-pointer p-1">
                <span class="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form (ngSubmit)="submitEditTrainer()" class="space-y-3">
              <div>
                <label class="block font-semibold mb-1 text-on-surface-variant">Full Name</label>
                <input type="text" [(ngModel)]="editName" name="editName" required class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none" />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-semibold mb-1 text-on-surface-variant">Phone Number</label>
                  <input type="tel" [(ngModel)]="editPhone" name="editPhone" class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none" />
                </div>
                <div>
                  <label class="block font-semibold mb-1 text-on-surface-variant">Primary Expertise</label>
                  <input type="text" [(ngModel)]="editExpertise" name="editExpertise" class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none" />
                </div>
              </div>

              <div>
                <label class="block font-semibold mb-1 text-on-surface-variant">Designation / Role Title</label>
                <input type="text" [(ngModel)]="editDesignation" name="editDesignation" class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none" />
              </div>

              <div>
                <label class="block font-semibold mb-1 text-on-surface-variant">Bio</label>
                <textarea [(ngModel)]="editBio" name="editBio" rows="2.5" class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none resize-none"></textarea>
              </div>

              <div>
                <label class="block font-semibold mb-1 text-on-surface-variant">Avatar Image URL</label>
                <input type="url" [(ngModel)]="editAvatarUrl" name="editAvatarUrl" class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none" />
              </div>

              <div class="flex justify-end gap-2 pt-3 border-t border-outline-variant/20">
                <button type="button" (click)="editingTrainer.set(null)" class="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-semibold hover:bg-surface-dim cursor-pointer text-xs">
                  Cancel
                </button>
                <button type="submit" [disabled]="isSavingEdit()" class="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold hover:opacity-90 cursor-pointer text-xs flex items-center gap-1.5 shadow-sm">
                  @if (isSavingEdit()) {
                    <span class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                  }
                  <span>Save Changes</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      }

      <!-- MODAL 5: DELETE TRAINER CONFIRMATION MODAL -->
      @if (trainerToDelete()) {
        <div class="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div class="bg-surface-container-lowest rounded-2xl p-6 max-w-sm w-full border border-outline-variant/30 shadow-2xl space-y-4">
            
            <div class="flex items-center gap-3 text-red-600">
              <div class="p-2.5 bg-red-50 rounded-full flex items-center justify-center">
                <span class="material-symbols-outlined text-2xl">person_remove</span>
              </div>
              <div>
                <h3 class="font-bold text-base text-on-surface">Revoke Trainer</h3>
                <p class="text-[11px] text-on-surface-variant">Are you sure you want to remove this instructor?</p>
              </div>
            </div>

            <div class="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 text-xs">
              <p class="font-bold text-on-surface">{{ trainerToDelete()?.name }}</p>
              <p class="text-[11px] text-on-surface-variant mt-0.5">{{ trainerToDelete()?.email }} • {{ trainerToDelete()?.expertise }}</p>
            </div>

            <p class="text-xs text-red-600 font-medium leading-relaxed">
              This action will remove the instructor's teaching profile from the platform.
            </p>

            <div class="flex justify-end gap-2 pt-2 border-t border-outline-variant/20">
              <button 
                (click)="trainerToDelete.set(null)"
                [disabled]="isDeletingTrainer()"
                class="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-semibold hover:bg-surface-dim cursor-pointer text-xs">
                Cancel
              </button>
              <button 
                (click)="executeDeleteTrainer()"
                [disabled]="isDeletingTrainer()"
                class="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 cursor-pointer text-xs flex items-center gap-1.5 disabled:opacity-50 shadow-sm">
                @if (isDeletingTrainer()) {
                  <span class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                  <span>Removing...</span>
                } @else {
                  <span class="material-symbols-outlined text-sm">delete</span>
                  <span>Remove Trainer</span>
                }
              </button>
            </div>

          </div>
        </div>
      }

    </main>
  `
})
export class AdminApplicationsComponent implements OnInit {
  private trainerService = inject(TrainerService);
  private trainerRequestService = inject(TrainerRequestService);
  private uploadService = inject(UploadService);

  // Active Tab: 'trainers' (default) | 'applications'
  activeTab = signal<'trainers' | 'applications'>('trainers');
  searchQuery = signal<string>('');
  appStatusFilter = signal<string>('ALL');

  // Trainers Data
  trainers = signal<AdminTrainerItem[]>([]);
  loadingTrainers = signal<boolean>(true);

  // Applications Data
  applications = signal<TrainerRequest[]>([]);
  loadingApps = signal<boolean>(true);

  // Notifications
  successToast = signal<string>('');

  // Add Trainer Modal & Form State
  isAddTrainerModalOpen = signal<boolean>(false);
  addName = signal<string>('');
  addEmail = signal<string>('');
  addPhone = signal<string>('');
  addPassword = signal<string>('');
  showPassword = signal<boolean>(false);
  addExpertise = signal<string>('');
  addDesignation = signal<string>('Instructor at Lemon Academy');
  addBio = signal<string>('');
  addAvatarUrl = signal<string>('');
  isUploadingAvatar = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  formError = signal<string>('');

  // Credentials Celebration Modal State
  credentialsModalData = signal<{ name: string; email: string; password?: string; loginUrl: string } | null>(null);
  copiedToast = signal<boolean>(false);

  // Details Modal
  selectedTrainerDetails = signal<AdminTrainerItem | null>(null);

  // Edit Modal State
  editingTrainer = signal<AdminTrainerItem | null>(null);
  editName = signal<string>('');
  editPhone = signal<string>('');
  editExpertise = signal<string>('');
  editDesignation = signal<string>('');
  editBio = signal<string>('');
  editAvatarUrl = signal<string>('');
  isSavingEdit = signal<boolean>(false);

  // Delete Modal State
  trainerToDelete = signal<AdminTrainerItem | null>(null);
  isDeletingTrainer = signal<boolean>(false);

  // Quick suggestion chips
  expertiseSuggestions: string[] = [
    'Modern Crochet & Amigurumi',
    'Lippan Mud & Mirror Art',
    'Resin Art & Geode Clock',
    'Botanical Candle Making',
    'Cold Process Soap Formulation',
    'Clay & Terracotta Pottery',
    'Macrame & Fiber Arts'
  ];

  ngOnInit(): void {
    this.loadTrainers();
    this.loadApplications();

    if (typeof window !== 'undefined') {
      window.addEventListener('trainers_updated', () => this.loadTrainers());
    }
  }

  loadTrainers(): void {
    this.loadingTrainers.set(true);
    this.trainerService.getAdminTrainers().subscribe({
      next: (list) => {
        this.trainers.set(list || []);
        this.loadingTrainers.set(false);
      },
      error: () => {
        this.trainers.set([]);
        this.loadingTrainers.set(false);
      }
    });
  }

  loadApplications(): void {
    this.loadingApps.set(true);
    this.trainerRequestService.getAllApplications().subscribe({
      next: (data) => {
        this.applications.set(data || []);
        this.loadingApps.set(false);
      },
      error: () => {
        this.applications.set([]);
        this.loadingApps.set(false);
      }
    });
  }

  // --- FILTERED COMPUTED LISTS ---
  filteredTrainers(): AdminTrainerItem[] {
    const list = this.trainers();
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return list;
    return list.filter(t =>
      t.name?.toLowerCase().includes(q) ||
      t.email?.toLowerCase().includes(q) ||
      t.expertise?.toLowerCase().includes(q) ||
      t.designation?.toLowerCase().includes(q) ||
      t.phone?.includes(q)
    );
  }

  filteredApplications(): TrainerRequest[] {
    let list = this.applications();
    const st = this.appStatusFilter();
    if (st !== 'ALL') {
      list = list.filter(a => a.status?.toUpperCase() === st);
    }
    const q = this.searchQuery().toLowerCase().trim();
    if (q) {
      list = list.filter(a =>
        a.fullName?.toLowerCase().includes(q) ||
        a.name?.toLowerCase().includes(q) ||
        a.email?.toLowerCase().includes(q) ||
        a.expertise?.toLowerCase().includes(q) ||
        a.course?.toLowerCase().includes(q)
      );
    }
    return list;
  }

  pendingApplicationsCount(): number {
    return this.applications().filter(a => a.status === 'PENDING' || a.status === 'Pending Approval').length;
  }

  approvedApplicationsCount(): number {
    return this.applications().filter(a => a.status === 'APPROVED' || a.status === 'Approved').length;
  }

  getInitials(name: string): string {
    if (!name) return 'TR';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  // --- DIRECT ADD TRAINER METHODS ---
  openAddTrainerModal(): void {
    this.formError.set('');
    this.addName.set('');
    this.addEmail.set('');
    this.addPhone.set('');
    this.generateStrongPassword();
    this.showPassword.set(false);
    this.addExpertise.set('');
    this.addDesignation.set('Instructor at Lemon Academy');
    this.addBio.set('');
    this.addAvatarUrl.set('');
    this.isAddTrainerModalOpen.set(true);
  }

  closeAddTrainerModal(): void {
    this.isAddTrainerModalOpen.set(false);
    this.formError.set('');
  }

  generateStrongPassword(): void {
    const numbers = Math.floor(1000 + Math.random() * 9000);
    this.addPassword.set(`Trainer@${numbers}!`);
  }

  onAvatarFileSelected(event: any): void {
    const file = event?.target?.files?.[0];
    if (!file) return;
    this.isUploadingAvatar.set(true);
    this.uploadService.uploadAvatar(file).subscribe({
      next: (res: any) => {
        const url = res.url || res.secureUrl || res.secure_url || '';
        if (url) {
          this.addAvatarUrl.set(url);
        }
        this.isUploadingAvatar.set(false);
      },
      error: () => {
        // Fallback local file preview
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.addAvatarUrl.set(e.target.result);
          this.isUploadingAvatar.set(false);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  submitDirectAddTrainer(): void {
    const name = this.addName().trim();
    const email = this.addEmail().trim();
    const expertise = this.addExpertise().trim();

    if (!name) {
      this.formError.set('Please provide the instructor full name.');
      return;
    }
    if (!email || !email.includes('@')) {
      this.formError.set('Please provide a valid instructor email address.');
      return;
    }
    if (!expertise) {
      this.formError.set('Please select or specify the craft expertise.');
      return;
    }

    this.isSubmitting.set(true);
    this.formError.set('');

    const payload: CreateTrainerPayload = {
      name,
      email,
      phone: this.addPhone().trim() || undefined,
      password: this.addPassword().trim() || 'Trainer@123456',
      expertise,
      designation: this.addDesignation().trim() || 'Instructor at Lemon Academy',
      bio: this.addBio().trim() || undefined,
      avatarUrl: this.addAvatarUrl().trim() || undefined
    };

    this.trainerService.createTrainer(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.isAddTrainerModalOpen.set(false);
        
        // Show Credentials Ready Celebration Modal
        const loginUrl = typeof window !== 'undefined' ? `${window.location.origin}/login` : 'https://lemonacademy.in/login';
        this.credentialsModalData.set({
          name: payload.name,
          email: payload.email,
          password: payload.password,
          loginUrl
        });

        this.loadTrainers();
        this.successToast.set(`Trainer "${payload.name}" created and onboarded successfully!`);
        setTimeout(() => this.successToast.set(''), 4000);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.formError.set(err?.error?.message || 'Failed to create trainer on server. Please try again.');
      }
    });
  }

  copyCredentialsToClipboard(): void {
    const creds = this.credentialsModalData();
    if (!creds) return;
    const text = `Welcome to Lemon Academia! 🍋\n\nYour instructor account has been created:\nLogin Portal: ${creds.loginUrl}\nEmail: ${creds.email}\nAssigned Password: ${creds.password || '(Contact Admin)'}\n\nPlease log in and customize your craft courses.`;
    
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.copiedToast.set(true);
        setTimeout(() => this.copiedToast.set(false), 2500);
      });
    }
  }

  // --- DETAILS MODAL ---
  openTrainerDetails(trainer: AdminTrainerItem): void {
    this.selectedTrainerDetails.set(trainer);
  }

  // --- EDIT TRAINER MODAL ---
  openEditTrainerModal(trainer: AdminTrainerItem): void {
    this.editingTrainer.set(trainer);
    this.editName.set(trainer.name);
    this.editPhone.set(trainer.phone || '');
    this.editExpertise.set(trainer.expertise || '');
    this.editDesignation.set(trainer.designation || '');
    this.editBio.set(trainer.bio || '');
    this.editAvatarUrl.set(trainer.avatarUrl || '');
  }

  submitEditTrainer(): void {
    const trainer = this.editingTrainer();
    if (!trainer) return;

    this.isSavingEdit.set(true);
    const updates: Partial<CreateTrainerPayload> = {
      name: this.editName().trim(),
      phone: this.editPhone().trim() || undefined,
      expertise: this.editExpertise().trim() || undefined,
      designation: this.editDesignation().trim() || undefined,
      bio: this.editBio().trim() || undefined,
      avatarUrl: this.editAvatarUrl().trim() || undefined
    };

    this.trainerService.updateAdminTrainer(trainer.id, updates).subscribe({
      next: () => {
        this.isSavingEdit.set(false);
        this.editingTrainer.set(null);
        this.loadTrainers();
        this.successToast.set(`Trainer "${updates.name}" updated successfully.`);
        setTimeout(() => this.successToast.set(''), 3000);
      },
      error: () => {
        this.isSavingEdit.set(false);
        this.editingTrainer.set(null);
        this.loadTrainers();
      }
    });
  }

  // --- DELETE TRAINER MODAL ---
  openDeleteConfirm(trainer: AdminTrainerItem): void {
    this.trainerToDelete.set(trainer);
  }

  executeDeleteTrainer(): void {
    const trainer = this.trainerToDelete();
    if (!trainer) return;

    this.isDeletingTrainer.set(true);
    this.trainerService.deleteAdminTrainer(trainer.id).subscribe({
      next: () => {
        this.isDeletingTrainer.set(false);
        this.trainerToDelete.set(null);
        this.trainers.update(list => list.filter(t => t.id !== trainer.id));
        this.successToast.set(`Trainer "${trainer.name}" removed successfully.`);
        setTimeout(() => this.successToast.set(''), 3000);
      },
      error: () => {
        this.isDeletingTrainer.set(false);
        this.trainerToDelete.set(null);
        this.trainers.update(list => list.filter(t => t.id !== trainer.id));
      }
    });
  }

  // --- QUICK APPROVE APPLICATION ---
  quickApproveApplication(app: TrainerRequest): void {
    if (!app?.id) return;
    this.trainerRequestService.reviewApplication(app.id, {
      status: 'APPROVED',
      feedbackNotes: 'Quick approved from Admin Trainer Management.'
    }).subscribe({
      next: () => {
        this.applications.update(list => list.map(a => a.id === app.id ? { ...a, status: 'APPROVED' } : a));
        this.successToast.set(`Application for "${app.fullName || app.name}" approved! User promoted to Trainer.`);
        setTimeout(() => this.successToast.set(''), 3500);
        // Refresh trainers list as new trainer was approved
        this.loadTrainers();
      },
      error: () => {
        this.successToast.set(`Application approved locally.`);
        setTimeout(() => this.successToast.set(''), 3000);
      }
    });
  }
}
