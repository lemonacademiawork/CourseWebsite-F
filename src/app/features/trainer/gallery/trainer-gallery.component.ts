import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trainer-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="p-6 max-w-container-max mx-auto text-xs text-on-surface">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-xl font-bold text-on-surface">Student Creations Review</h1>
          <p class="text-xs text-on-surface-variant mt-0.5">Submissions awaiting trainer feedback.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-xl overflow-hidden shadow-sm">
          <div class="h-44 bg-surface-container-low">
            <img class="w-full h-full object-cover" src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119" alt="Student artwork" />
          </div>
          <div class="p-4 space-y-2">
            <h4 class="font-bold text-xs">Mandala Mud Mirror Work</h4>
            <p class="text-[11px] text-on-surface-variant">Submitted by Sejal Agarwal</p>
            <button class="w-full py-2 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90 mt-2 cursor-pointer">
              Send Feedback
            </button>
          </div>
        </div>
      </div>
    </main>
  `
})
export class TrainerGalleryComponent {}
