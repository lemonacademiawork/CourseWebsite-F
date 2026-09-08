import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TrainerRequestService } from '../../../core/services/trainer-request.service';
import { TrainerRequest } from '../../../core/models/trainer-request.model';

@Component({
  selector: 'app-admin-applications',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="p-6 max-w-container-max mx-auto text-xs text-on-surface">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-xl font-bold text-on-surface">Trainer Applications</h1>
          <p class="text-xs text-on-surface-variant mt-0.5">Review submissions from artisan instructors.</p>
        </div>
      </div>

      <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/35 shadow-sm overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant text-on-surface-variant font-semibold">
              <th class="py-3 px-4">Instructor Name</th>
              <th class="py-3 px-4">Email / Phone</th>
              <th class="py-3 px-4">Expertise / Course</th>
              <th class="py-3 px-4">Experience</th>
              <th class="py-3 px-4">Status</th>
              <th class="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/15">
            @for (app of applications(); track app.id) {
              <tr class="hover:bg-surface-container-low/50">
                <td class="py-3 px-4 font-semibold">{{ app.fullName || app.name }}</td>
                <td class="py-3 px-4 text-on-surface-variant">
                  <div>{{ app.email }}</div>
                  @if (app.phone) {
                    <div class="text-[10px] text-on-surface-variant/75">{{ app.phone }}</div>
                  }
                </td>
                <td class="py-3 px-4 font-medium">{{ app.expertise || app.course }}</td>
                <td class="py-3 px-4">{{ app.yearsOfExperience || app.experience }} yrs</td>
                <td class="py-3 px-4">
                  <span 
                    class="px-2 py-0.5 rounded text-[10px] font-bold"
                    [class.bg-yellow-100]="app.status === 'PENDING' || app.status === 'Pending Approval'"
                    [class.text-yellow-800]="app.status === 'PENDING' || app.status === 'Pending Approval'"
                    [class.bg-green-100]="app.status === 'APPROVED' || app.status === 'Approved'"
                    [class.text-green-800]="app.status === 'APPROVED' || app.status === 'Approved'"
                    [class.bg-red-100]="app.status === 'REJECTED' || app.status === 'Rejected'"
                    [class.text-red-800]="app.status === 'REJECTED' || app.status === 'Rejected'">
                    {{ app.status }}
                  </span>
                </td>
                <td class="py-3 px-4 text-right">
                  <a [routerLink]="['/admin/applications/review', app.id]" class="text-primary font-semibold hover:underline">
                    Review Application
                  </a>
                </td>
              </tr>
            }
          </tbody>
        </table>

        @if (applications().length === 0 && !loading()) {
          <div class="p-8 text-center bg-surface-container-low text-on-surface-variant">
            <span class="material-symbols-outlined text-primary text-3xl mb-1">assignment_ind</span>
            <p class="font-semibold text-xs text-on-surface">No Pending Trainer Applications</p>
            <p class="text-[11px] text-on-surface-variant mt-0.5">When prospective instructors apply to teach masterclasses, their submissions will be listed here.</p>
          </div>
        }
      </div>
    </main>
  `
})
export class AdminApplicationsComponent implements OnInit {
  private trainerRequestService = inject(TrainerRequestService);

  applications = signal<TrainerRequest[]>([]);
  loading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.loading.set(true);
    this.trainerRequestService.getAllApplications().subscribe({
      next: (data) => {
        this.applications.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
