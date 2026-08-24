import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-prototype',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="min-h-screen bg-[#FBF8F1] text-xs text-on-surface">
      <section class="py-20 md:py-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-gutter items-center">
          <div class="space-y-8">
            <h1 class="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface max-w-xl font-bold">
              Learn. Create. Inspire.
            </h1>
            <p class="font-body-lg text-body-lg text-on-surface-variant max-w-md">
              Master the art of handcrafted creation with our premium courses. From Lippan Art to Resin, discover your creative potential in our modern craft studio.
            </p>
            <div class="flex flex-wrap gap-4 pt-4">
              <a routerLink="/courses" class="bg-primary text-on-primary font-label-md text-label-md px-8 py-4 rounded-lg hover:opacity-90 transition-opacity hover-lift font-semibold inline-block">
                Explore Courses
              </a>
              <a routerLink="/gallery" class="border border-outline text-on-surface font-label-md text-label-md px-8 py-4 rounded-lg hover:bg-surface-variant transition-colors font-semibold inline-block">
                View Gallery
              </a>
            </div>
          </div>
          <div class="relative h-[400px] lg:h-[600px] rounded-xl overflow-hidden organic-shadow">
            <img alt="Craft Workshop" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyT1MCdKmqH4qQz6XAx6MXb0Axi-FOW5lNIXj_TkLWqr4MYn34W7WnUJv7Kvk2zbyUTytkZbia4wvloS3te02-s_nTY9_mi4dntLpB3ja5l66bjGAUICeB412Hu1i2jCmP8PFP9KFivVeXJ8QkIFamjZ01ylH4hhAJ9Rf5IJE8nyo9PmB7-Jan4omGDc7uBw8_0NUVCUUlbO39hOryEeOPuyj9Gs05zjhhZTYjHDl_TFDXVVQnceuH" />
          </div>
        </div>
      </section>

      <section class="py-20 bg-surface-container-low px-margin-mobile md:px-margin-desktop">
        <div class="max-w-container-max mx-auto">
          <h2 class="font-headline-md text-headline-md text-on-surface mb-12 text-center font-bold">Master a Craft</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <div [routerLink]="['/courses']" [queryParams]="{ category: 'crochet-fiber-arts' }" class="group relative h-80 rounded-xl overflow-hidden cursor-pointer">
              <img alt="Crochet" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPiWCQJI93PXDk9BOTIapmtikie4-YaxmLh1RRYduOa_TDE4AQZkdf8DEkTVGR5nS9OSCOgXvKuV_YYJl7XOPbMsOJ2NapTo5sBgHWGuqHmqZjabmFElFjDdYfpq8LsUXrV3nz9yX7Abr5E1fWw9PM_lVq-u8188AjgPz0txpaTpIy1QYYWuyXi3IwoSn_vw542oHbUWJhQ2iOxYf0kpLG7nJ1g6ftWcf9R78bsl9rLf2ndCoywsoF" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <h3 class="font-headline-sm text-headline-sm text-white font-bold group-hover:text-primary-fixed transition-colors">Crochet</h3>
              </div>
            </div>
            <div [routerLink]="['/courses']" [queryParams]="{ category: 'mosaic-art' }" class="group relative h-80 rounded-xl overflow-hidden cursor-pointer">
              <img alt="Mosaic Art" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXiQLIEpsHtGrZbryHVG2dOarl_iT9qvnszntbv8Io-HDvulcLxdeW-m1Y1LvLsZVTdyll6k3sqZuLN0jnUa8PmjFtQMe1mAq8CIzvCN0yaT2ObdUfIPU2XuH0CbkJ-ZzjHMPf30gtRgX14D6XM6dRo4nkeus9cqsp61icBWZjJAhChFKP93gBX9kTPkDU0dKVth2hhMx3C1QEtY_8tkNWkbpTpJ4ASJfAgMhyr-lLHkbEwd9CJP6X" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <h3 class="font-headline-sm text-headline-sm text-white font-bold group-hover:text-primary-fixed transition-colors">Mosaic Art</h3>
              </div>
            </div>
            <div [routerLink]="['/courses']" [queryParams]="{ category: 'candle-making' }" class="group relative h-80 rounded-xl overflow-hidden cursor-pointer">
              <img alt="Candle Making" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdWftkk77PEWsXT0X8Idf_5qfShUey9va1f3wum-E0_wQoJNhH8DlzGO1jy22TTPACpLEnQy1abVm1vhUtDsMA62pD83tLRBO8N6-irLAYagp8jz-xagrBPejAcQrBrwZzDiv9yycKXiyMImwz2fXE8Ti75v-LV1oM7TZC1DEpm5zIscCEoA4rnAVGfQcAfxeIOZaJ1Y7It8VGiYZDtwrBh2OS8uEZ9TL5ABRz7RQ6Rwxmr6C65H3E" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <h3 class="font-headline-sm text-headline-sm text-white font-bold group-hover:text-primary-fixed transition-colors">Candle Making</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  `
})
export class PrototypeComponent {}
