import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="min-h-screen bg-background text-on-background">
      <!-- Editorial Hero Section -->
      <section class="pt-10 pb-20 md:pt-16 md:pb-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
          <div class="lg:col-span-6 space-y-8">
            <span class="font-label-md text-primary uppercase tracking-widest text-sm font-bold">
              Our Philosophy
            </span>
            <h1 class="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface leading-tight font-bold">
              Where Traditional Craft Meets Modern Mastery
            </h1>
            <p class="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              At Lemon Academia, we believe creativity is a journey best taken with intent, patience, and expert guidance. We are a digital sanctuary designed to connect passionate learners with master artisans of the craft world.
            </p>
            <div class="flex gap-4">
              <a routerLink="/courses" class="bg-primary text-on-primary font-label-md text-label-md px-8 py-4 rounded-lg hover:opacity-90 transition-opacity hover-lift inline-block text-center font-semibold">
                Explore Our Atelier
              </a>
            </div>
          </div>
          <div class="lg:col-span-6 relative h-[350px] md:h-[500px] rounded-2xl overflow-hidden organic-shadow">
            <img
              alt="Artisan hands crafting pottery"
              class="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdWftkk77PEWsXT0X8Idf_5qfShUey9va1f3wum-E0_wQoJNhH8DlzGO1jy22TTPACpLEnQy1abVm1vhUtDsMA62pD83tLRBO8N6-irLAYagp8jz-xagrBPejAcQrBrwZzDiv9yycKXiyMImwz2fXE8Ti75v-LV1oM7TZC1DEpm5zIscCEoA4rnAVGfQcAfxeIOZaJ1Y7It8VGiYZDtwrBh2OS8uEZ9TL5ABRz7RQ6Rwxmr6C65H3E"
            />
          </div>
        </div>
      </section>

      <!-- Impact/Stats Bento Grid -->
      <section class="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-gutter items-stretch">
          <div class="bg-primary text-on-primary p-8 rounded-2xl flex flex-col justify-between space-y-8">
            <div class="space-y-4">
              <h3 class="font-display-lg text-3xl leading-snug font-bold">Empowering Creators Worldwide</h3>
              <p class="font-body-md text-on-primary/80 text-sm">
                Creating a structured path for students, hobbyists, and professional creators to master handcrafted arts.
              </p>
            </div>
            <div class="font-display-lg text-6xl font-bold">
              12k+
              <span class="block font-label-md text-xs uppercase tracking-wider text-on-primary/70 mt-2 font-normal">Active Students</span>
            </div>
          </div>

          <div class="bg-surface-container p-8 rounded-2xl flex flex-col justify-between hover-lift">
            <div class="space-y-4">
              <span class="material-symbols-outlined text-secondary text-4xl">photo_library</span>
              <h3 class="font-display-lg text-3xl leading-snug font-bold text-on-surface">Join the Community Gallery</h3>
              <p class="font-body-md text-on-surface-variant text-sm">
                We celebrate every piece of art created by our students. Share your works and gain appreciation from peers and trainers.
              </p>
            </div>
            <div class="pt-6">
              <a routerLink="/gallery" class="border border-outline text-on-surface font-label-md text-sm px-6 py-3 rounded-lg hover:bg-surface-variant transition-colors text-center inline-block w-full font-semibold">
                Explore Student Gallery
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  `
})
export class AboutComponent {}
