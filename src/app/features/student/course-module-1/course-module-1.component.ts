import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-course-module-1',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="flex-1 p-margin-mobile md:p-margin-desktop bg-background max-w-container-max mx-auto w-full text-xs">
      <div class="mb-8 flex flex-col gap-4">
        <div class="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md">
          <a routerLink="/my-courses" class="hover:text-primary">My Courses</a>
          <span class="material-symbols-outlined text-[16px]">chevron_right</span>
          <span class="text-primary">The Art of Lippan</span>
        </div>
        <h2 class="font-headline-md text-headline-md text-on-surface font-bold">Module 1: Introduction &amp; Materials</h2>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-12 gap-gutter">
        <div class="xl:col-span-8 flex flex-col gap-gutter">
          <div class="overflow-hidden group relative aspect-video bg-black rounded-xl max-h-[450px]">
            <img alt="Video Thumbnail" class="w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdKofiBLNpKFZkvvH76KOIA3B6gfbWKovaioEEEBfPF0_-S1HKbtm2OScyWceRBydRmE0Nb2x53gV6Aicd2kRgOCFsN_viQP6XQnZUXBnlAIa2jtefanu37KEBNE14Gb2t8w4kcE2dBetsdjGHCgKWyJ7rd6jFKousWYLRPRW5iXmvqSMm9Cv0YObn8GyGFDAxm9fOBmbhvJm61CEDGn4wKhWp-3ume87JsdlDVBXu97qvgossZBtd" />
            <div class="absolute inset-0 flex items-center justify-center">
              <button class="w-16 h-16 bg-primary text-on-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg cursor-pointer">
                <span class="material-symbols-outlined text-3xl filled">play_arrow</span>
              </button>
            </div>
            <div class="absolute bottom-0 left-0 w-full h-1.5 bg-surface-variant/50">
              <div class="h-full bg-primary w-[65%]"></div>
            </div>
          </div>

          <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 space-y-4">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold">Lesson 1.1: Foundations of Mud &amp; Clay Mixing</h3>
            </div>
            <p class="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              In this video lesson, master artisan Aisha Sharma demonstrates the precise ratio of epoxy clay components, how to prevent rapid drying, and preparing clean substrate boards.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-outline-variant/20">
              <div class="flex items-center gap-4 p-4 rounded-lg bg-surface-container-low border border-outline-variant/20">
                <img alt="Instructor Avatar" class="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4Zn8IBd_uewYuaa7KW5LA3oJ5FzkqIoNsWIaiCI8M64CL_4jY0A3oDKlsHu-7vWZ1Tb_EoV15yCHUcgqtcDpuYlXwXNpWihxEBzv0bCiuOpB_VwsQFAz_Kdr2rjaYj-pkSApH12uGjFIHMfre6ZoJLDwvB17Rftrkj2NPtZy4MZRWUJzdK89TpWUp3lFy92mfDVOhO0Tb_2o9SYhy_qCwwq-2T7y9Y8fTO7hwEzEvTsx0v12YoYFe" />
                <div>
                  <p class="font-label-md text-label-md text-on-surface font-bold">Aisha Sharma</p>
                  <p class="font-body-md text-[13px] text-on-surface-variant">Master Artisan of Kutch</p>
                </div>
              </div>

              <div class="flex flex-col gap-2 p-4 rounded-lg bg-surface-container-low border border-outline-variant/20 justify-center">
                <p class="font-label-md text-label-md text-on-surface font-bold">Lesson Blueprint</p>
                <a class="flex items-center justify-between text-secondary hover:underline font-body-md text-xs font-semibold" href="#">
                  <span class="flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">picture_as_pdf</span> Clay_Formulas_Guide.pdf</span>
                  <span class="material-symbols-outlined text-[18px]">download</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="xl:col-span-4 flex flex-col gap-6">
          <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6">
            <h3 class="font-headline-sm text-base font-bold text-on-surface mb-4">Course Progress</h3>
            <div class="flex justify-between items-end mb-2">
              <span class="font-body-md text-on-surface-variant">65% Completed</span>
              <span class="font-label-md text-primary font-bold">13/20 Lessons</span>
            </div>
            <div class="w-full h-2.5 bg-outline-variant/30 rounded-full overflow-hidden">
              <div class="h-full bg-primary rounded-full w-[65%]"></div>
            </div>
          </div>

          <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden">
            <div class="p-4 border-b border-outline-variant/20 bg-surface-container-low font-bold text-on-surface">
              Curriculum Lessons
            </div>
            <div class="divide-y divide-outline-variant/15 text-xs">
              <div class="p-3 flex items-center justify-between bg-primary-container/10 border-l-4 border-primary">
                <span class="font-bold text-primary">1.1 Foundations of Clay Mixing</span>
                <span class="text-primary font-semibold">12:05</span>
              </div>
              <div class="p-3 flex items-center justify-between hover:bg-surface-container-low cursor-pointer">
                <span>1.2 Rolling Fine Clay Lines</span>
                <span class="text-on-surface-variant">08:30</span>
              </div>
              <div class="p-3 flex items-center justify-between hover:bg-surface-container-low cursor-pointer">
                <span>1.3 Border Grid Construction</span>
                <span class="text-on-surface-variant">15:45</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  `
})
export class CourseModule1Component {}
