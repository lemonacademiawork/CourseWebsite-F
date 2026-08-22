import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface StudentItem {
  id: number;
  name: string;
  studentId: string;
  email: string;
  phone: string;
  coursesCount: number;
  joinDate: string;
  status: 'Paid' | 'Pending';
}

@Component({
  selector: 'app-admin-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="flex-grow w-full px-margin-mobile md:px-margin-desktop py-6 max-w-[1440px] mx-auto min-h-screen text-xs text-on-surface">
      <header class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h2 class="text-xl font-bold text-on-surface">Students</h2>
          <p class="text-xs text-on-surface-variant mt-1">Manage student enrollments, progress, and account details.</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button 
            (click)="isAdding.set(!isAdding())"
            class="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-semibold text-xs hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm cursor-pointer">
            <span class="material-symbols-outlined text-[16px]">add</span>
            Add Student
          </button>
        </div>
      </header>

      @if (isAdding()) {
        <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-xl p-4 mb-6 shadow-sm">
          <h3 class="font-bold text-sm mb-3">Add New Student</h3>
          <form (ngSubmit)="handleAddStudent()" class="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input 
              type="text" 
              placeholder="Student Name"
              [ngModel]="name()"
              (ngModelChange)="name.set($event)"
              name="name"
              required
              class="bg-surface-container-low border border-outline-variant/40 rounded-lg p-2 text-xs"
            />
            <input 
              type="email" 
              placeholder="Email Address"
              [ngModel]="email()"
              (ngModelChange)="email.set($event)"
              name="email"
              class="bg-surface-container-low border border-outline-variant/40 rounded-lg p-2 text-xs"
            />
            <input 
              type="text" 
              placeholder="Phone"
              [ngModel]="phone()"
              (ngModelChange)="phone.set($event)"
              name="phone"
              class="bg-surface-container-low border border-outline-variant/40 rounded-lg p-2 text-xs"
            />
            <button type="submit" class="bg-primary text-on-primary font-semibold rounded-lg py-2 hover:opacity-90 cursor-pointer">
              Save Student
            </button>
          </form>
        </div>
      }

      <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/35 shadow-sm overflow-hidden">
        <div class="w-full overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-surface-container-low border-b border-outline-variant text-on-surface-variant font-semibold">
                <th class="py-3 px-4">Student</th>
                <th class="py-3 px-4">Student ID</th>
                <th class="py-3 px-4">Contact</th>
                <th class="py-3 px-4">Enrolled Courses</th>
                <th class="py-3 px-4">Joined Date</th>
                <th class="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/15">
              @for (st of students(); track st.id) {
                <tr class="hover:bg-surface-container-low/50">
                  <td class="py-3 px-4 font-semibold">{{ st.name }}</td>
                  <td class="py-3 px-4 text-on-surface-variant">{{ st.studentId }}</td>
                  <td class="py-3 px-4">{{ st.email }}</td>
                  <td class="py-3 px-4">{{ st.coursesCount }}</td>
                  <td class="py-3 px-4 text-on-surface-variant">{{ st.joinDate }}</td>
                  <td class="py-3 px-4">
                    <span 
                      class="px-2 py-0.5 rounded text-[10px] font-bold"
                      [class.bg-green-100]="st.status === 'Paid'"
                      [class.text-green-800]="st.status === 'Paid'"
                      [class.bg-yellow-100]="st.status === 'Pending'"
                      [class.text-yellow-800]="st.status === 'Pending'">
                      {{ st.status }}
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </main>
  `
})
export class AdminStudentsComponent {
  students = signal<StudentItem[]>([
    {
      id: 1,
      name: "Sejal Agarwal",
      studentId: "#LA-4821",
      email: "sejal.agarwal@gmail.com",
      phone: "+91 98201 44520",
      coursesCount: 1,
      joinDate: "Aug 16, 2026",
      status: "Paid"
    },
    {
      id: 2,
      name: "Priya Sharma",
      studentId: "#LA-1092",
      email: "priya.sharma@example.com",
      phone: "+91 94120 89201",
      coursesCount: 2,
      joinDate: "Aug 17, 2026",
      status: "Paid"
    }
  ]);

  isAdding = signal<boolean>(false);
  name = signal<string>('');
  email = signal<string>('');
  phone = signal<string>('');
  status = signal<'Paid' | 'Pending'>('Paid');

  handleAddStudent(): void {
    if (!this.name().trim()) return;

    const newStudent: StudentItem = {
      id: Date.now(),
      name: this.name().trim(),
      studentId: `#LA-${Math.floor(1000 + Math.random() * 9000)}`,
      email: this.email().trim() || 'student@example.com',
      phone: this.phone().trim() || 'N/A',
      coursesCount: 0,
      joinDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: this.status()
    };

    this.students.update(list => [newStudent, ...list]);
    this.name.set('');
    this.email.set('');
    this.phone.set('');
    this.isAdding.set(false);
  }
}
