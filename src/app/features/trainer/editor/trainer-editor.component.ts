import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-trainer-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="p-6 max-w-4xl mx-auto text-xs text-on-surface">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-xl font-bold text-on-surface">Curriculum Editor</h1>
          <p class="text-xs text-on-surface-variant mt-0.5">Author workshop steps, notes, and learning milestones.</p>
        </div>
        <button 
          (click)="handleSave()"
          class="bg-primary text-on-primary font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm cursor-pointer">
          <span class="material-symbols-outlined text-sm">save</span>
          Save Curriculum
        </button>
      </div>

      @if (saved()) {
        <div class="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-xs mb-4">
          Curriculum saved successfully!
        </div>
      }

      <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
        <div>
          <label class="block font-semibold mb-1">Module Title</label>
          <input 
            type="text" 
            [ngModel]="moduleTitle()"
            (ngModelChange)="moduleTitle.set($event)"
            class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs font-semibold focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>

        <div>
          <label class="block font-semibold mb-1">Lesson Detailed Notes &amp; Instructions</label>
          <textarea 
            rows="8"
            [ngModel]="content()"
            (ngModelChange)="content.set($event)"
            class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-3 text-xs leading-relaxed font-mono focus:ring-1 focus:ring-primary focus:outline-none"
          ></textarea>
        </div>
      </div>
    </main>
  `
})
export class TrainerEditorComponent {
  moduleTitle = signal<string>('Module 1: Foundations of Mud & Mirror Work');
  content = signal<string>('1. Mix equal parts of Shilpkar resin and hardener until a uniform white color is achieved.\n2. Roll thin threads of clay on a smooth marble or plastic sheet.\n3. Apply craft glue along pencil sketch guidelines on MDF board.\n4. Gently press clay lines and place diamond mirrors at 1.5cm equidistant intervals.');
  saved = signal<boolean>(false);

  handleSave(): void {
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 2000);
  }
}
