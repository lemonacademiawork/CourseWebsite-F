import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainerService } from '../../../core/services/trainer.service';
import { TrainerStudent } from '../../../core/models/trainer.model';

@Component({
  selector: 'app-trainer-students',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="p-6 max-w-container-max mx-auto text-xs text-on-surface">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-xl font-bold text-on-surface">Course Students</h1>
          <p class="text-xs text-on-surface-variant mt-0.5">Students enrolled in your workshops.</p>
        </div>
      </div>

      <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/35 shadow-sm overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant text-on-surface-variant font-semibold">
              <th class="py-3 px-4">Student Name</th>
              <th class="py-3 px-4">Email</th>
              <th class="py-3 px-4">Enrolled Course</th>
              <th class="py-3 px-4">Progress</th>
              <th class="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/15">
            @for (st of students(); track st.id) {
              <tr class="hover:bg-surface-container-low/50">
                <td class="py-3 px-4 font-semibold">{{ st.name }}</td>
                <td class="py-3 px-4 text-on-surface-variant">{{ st.email }}</td>
                <td class="py-3 px-4">{{ st.course || st.courseTitle || 'Art Workshop' }}</td>
                <td class="py-3 px-4 font-bold text-primary">{{ st.progress ?? st.progressPercentage ?? 65 }}%</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800">
                    {{ st.status || 'Active' }}
                  </span>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </main>
  `
})
export class TrainerStudentsComponent implements OnInit {
  private trainerService = inject(TrainerService);

  students = signal<TrainerStudent[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.trainerService.getTrainerStudents().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.students.set(data);
        } else {
          this.students.set([
            { id: '1', name: 'Sejal Agarwal', email: 'sejal.agarwal@gmail.com', course: 'The Art of Lippan', progress: 65, status: 'Active' },
            { id: '2', name: 'Priya Sharma', email: 'priya.sharma@example.com', course: 'The Art of Lippan', progress: 30, status: 'Active' },
            { id: '3', name: 'Ananya Roy', email: 'ananya.roy@example.com', course: 'The Art of Lippan', progress: 90, status: 'Active' }
          ]);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
}

