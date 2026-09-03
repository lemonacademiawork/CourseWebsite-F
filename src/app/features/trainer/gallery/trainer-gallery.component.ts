import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrainerService } from '../../../core/services/trainer.service';
import { TrainerGallerySubmission } from '../../../core/models/trainer.model';

@Component({
  selector: 'app-trainer-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="p-6 max-w-container-max mx-auto text-xs text-on-surface">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-xl font-bold text-on-surface">Student Creations Review</h1>
          <p class="text-xs text-on-surface-variant mt-0.5">Submissions awaiting trainer feedback and mentoring.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        @for (item of submissions(); track item.id) {
          <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
            <div>
              <div class="h-44 bg-surface-container-low overflow-hidden">
                <img class="w-full h-full object-cover" [src]="item.imageUrl" [alt]="item.title" />
              </div>
              <div class="p-4 space-y-2">
                <div class="flex justify-between items-start">
                  <h4 class="font-bold text-xs">{{ item.title }}</h4>
                  <span class="px-2 py-0.5 rounded text-[9px] font-bold"
                        [class.bg-yellow-100]="item.status === 'PENDING'"
                        [class.text-yellow-800]="item.status === 'PENDING'"
                        [class.bg-green-100]="item.status === 'APPROVED'"
                        [class.text-green-800]="item.status === 'APPROVED'">
                    {{ item.status }}
                  </span>
                </div>
                <p class="text-[11px] text-on-surface-variant">Submitted by {{ item.studentName || 'Student' }}</p>
                @if (item.feedback) {
                  <div class="p-2 bg-primary-container/20 rounded-lg text-[10px] text-primary mt-2">
                    <strong>Your Feedback:</strong> {{ item.feedback }}
                  </div>
                }
              </div>
            </div>
            <div class="p-4 pt-0">
              <button 
                (click)="handleFeedback(item)"
                class="w-full py-2 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90 mt-2 cursor-pointer">
                {{ item.feedback ? 'Update Feedback' : 'Send Feedback' }}
              </button>
            </div>
          </div>
        }
      </div>
    </main>
  `
})
export class TrainerGalleryComponent implements OnInit {
  private trainerService = inject(TrainerService);

  submissions = signal<TrainerGallerySubmission[]>([
    {
      id: '1',
      title: 'Mandala Mud Mirror Work',
      imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119',
      studentName: 'Sejal Agarwal',
      courseTitle: 'The Art of Lippan',
      status: 'PENDING',
      createdAt: 'Aug 20, 2026'
    }
  ]);

  ngOnInit(): void {
    this.trainerService.getTrainerGallerySubmissions().subscribe({
      next: (items) => {
        if (items && items.length > 0) {
          this.submissions.set(items);
        }
      },
      error: () => {}
    });
  }

  handleFeedback(item: TrainerGallerySubmission): void {
    const feedback = prompt(`Enter feedback for ${item.studentName}'s creation:`, item.feedback || '');
    if (feedback !== null && feedback.trim()) {
      this.trainerService.giveGalleryFeedback(item.id, feedback.trim()).subscribe({
        next: () => {
          this.submissions.update(list => list.map(i => i.id === item.id ? { ...i, feedback: feedback.trim() } : i));
        },
        error: () => {
          this.submissions.update(list => list.map(i => i.id === item.id ? { ...i, feedback: feedback.trim() } : i));
        }
      });
    }
  }
}

