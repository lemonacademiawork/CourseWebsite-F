import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../../core/services/session.service';
import { CourseSession, SessionStatus } from '../../../core/models/session.model';

@Component({
  selector: 'app-trainer-classes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative min-h-screen pb-4 text-xs text-on-surface">
      <div class="max-w-container-max mx-auto px-margin-mobile md:px-6 py-4">
        <header class="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-variant/30 pb-3">
          <div>
            <h2 class="text-xl font-bold text-on-surface">Live Classes</h2>
            <p class="text-[11px] text-on-surface-variant mt-0.5">Schedule and launch interactive Zoom Q&amp;A sessions with students.</p>
          </div>
        </header>

        <div class="mt-6">
          @if (sessions().length === 0) {
            <div class="text-center py-8 text-on-surface-variant bg-surface-container-low rounded-xl border border-outline-variant/20">
              No live sessions configured.
            </div>
          } @else {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              @for (sess of sessions(); track sess.id) {
                <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 shadow-sm flex flex-col justify-between h-full relative overflow-hidden text-[11px]">
                  <div>
                    <div class="flex justify-between items-start mb-2">
                      <span class="text-[9px] font-bold text-secondary uppercase tracking-wider bg-secondary/15 px-2 py-0.5 rounded">
                        Interactive Q&amp;A
                      </span>
                      <span 
                        class="px-2 py-0.5 rounded text-[9px] font-bold"
                        [class.bg-green-100]="getStatus(sess) === 'LIVE'"
                        [class.text-green-800]="getStatus(sess) === 'LIVE'"
                        [class.bg-blue-100]="getStatus(sess) === 'UPCOMING'"
                        [class.text-blue-800]="getStatus(sess) === 'UPCOMING'"
                        [class.bg-gray-100]="getStatus(sess) === 'COMPLETED' || getStatus(sess) === 'RECORDING_AVAILABLE'"
                        [class.text-gray-800]="getStatus(sess) === 'COMPLETED' || getStatus(sess) === 'RECORDING_AVAILABLE'">
                        {{ getStatus(sess) }}
                      </span>
                    </div>
                    <h3 class="font-bold text-sm text-on-surface mt-1">{{ sess.title }}</h3>
                    <p class="text-[11px] text-on-surface-variant mt-1 leading-relaxed">{{ sess.description }}</p>
                    <div class="mt-3 pt-3 border-t border-outline-variant/20 text-on-surface-variant">
                      <p class="font-medium">Date: {{ sess.sessionDate }}</p>
                      <p>Time: {{ sess.startTime }} - {{ sess.endTime }}</p>
                    </div>
                  </div>

                  <div class="mt-4 pt-3 border-t border-outline-variant/20 flex gap-2">
                    @if (sess.zoomLink) {
                      <a [href]="sess.zoomLink" target="_blank" class="flex-1 text-center py-2 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90">
                        Launch Zoom Room
                      </a>
                    }
                    @if (sess.recordingLink) {
                      <a [href]="sess.recordingLink" target="_blank" class="flex-1 text-center py-2 border border-outline rounded-lg font-semibold hover:bg-surface-variant">
                        Recording
                      </a>
                    }
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class TrainerClassesComponent implements OnInit {
  private sessionService = inject(SessionService);
  sessions = signal<CourseSession[]>([]);

  ngOnInit(): void {
    const list = this.sessionService.getSessions('lippan-art');
    this.sessions.set(list);
  }

  getStatus(sess: CourseSession): SessionStatus {
    return this.sessionService.getSessionStatus(sess);
  }
}
