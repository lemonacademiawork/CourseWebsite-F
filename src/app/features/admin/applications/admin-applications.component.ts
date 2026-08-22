import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface TrainerApp {
  id: number;
  name: string;
  email: string;
  course: string;
  experience: string;
  status: 'Pending Approval' | 'Approved' | 'Rejected';
  date: string;
}

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
              <th class="py-3 px-4">Email</th>
              <th class="py-3 px-4">Proposed Course</th>
              <th class="py-3 px-4">Experience</th>
              <th class="py-3 px-4">Status</th>
              <th class="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/15">
            @for (app of applications(); track app.id) {
              <tr class="hover:bg-surface-container-low/50">
                <td class="py-3 px-4 font-semibold">{{ app.name }}</td>
                <td class="py-3 px-4 text-on-surface-variant">{{ app.email }}</td>
                <td class="py-3 px-4 font-medium">{{ app.course }}</td>
                <td class="py-3 px-4">{{ app.experience }}</td>
                <td class="py-3 px-4">
                  <span 
                    class="px-2 py-0.5 rounded text-[10px] font-bold"
                    [class.bg-yellow-100]="app.status === 'Pending Approval'"
                    [class.text-yellow-800]="app.status === 'Pending Approval'"
                    [class.bg-green-100]="app.status === 'Approved'"
                    [class.text-green-800]="app.status === 'Approved'">
                    {{ app.status }}
                  </span>
                </td>
                <td class="py-3 px-4 text-right">
                  <a routerLink="/admin/applications/review" class="text-primary font-semibold hover:underline">
                    Review Application
                  </a>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </main>
  `
})
export class AdminApplicationsComponent {
  applications = signal<TrainerApp[]>([
    {
      id: 1,
      name: "Rohit Verma",
      email: "rohit.verma@example.com",
      course: "Ceramic Pottery Basics",
      experience: "6 Years",
      status: "Pending Approval",
      date: "Aug 18, 2026"
    },
    {
      id: 2,
      name: "Meera Nair",
      email: "meera.nair@example.com",
      course: "Natural Botanical Inks",
      experience: "4 Years",
      status: "Pending Approval",
      date: "Aug 19, 2026"
    }
  ]);
}
