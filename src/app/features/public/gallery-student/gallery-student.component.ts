import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-gallery-student',
  standalone: true,
  imports: [],
  template: `
    <main class="flex-1 p-margin-mobile md:p-margin-desktop bg-surface max-w-container-max mx-auto w-full">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 class="font-display-lg text-display-lg-mobile md:text-display-lg text-on-background mb-2 font-bold">Student Gallery</h1>
          <p class="text-on-surface-variant text-body-lg font-body-lg max-w-2xl">A curated showcase of creative brilliance from the Lemon Academia community. Be inspired by your peers.</p>
        </div>
        <button class="flex items-center gap-2 bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-full shadow-sm hover:shadow-md hover:bg-primary/90 transition-all font-semibold cursor-pointer">
          <span class="material-symbols-outlined">upload</span>
          Upload Artwork
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
        <div class="gallery-item group relative rounded-xl overflow-hidden bg-surface-container-lowest shadow-sm col-span-1 md:col-span-2 row-span-2">
          <img alt="Artwork" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfmBf1HSwY5uR-LAAxu6GpESBkYs22BffeVjJ_nVZyFSdWuRswGeUhxlqCnGAx97UnLPW0ecOB9DC2c3CqgC1b6d2M_GdBM48vhdzppVxuNwgxhXHhGw0c-ojwwa2Pfk3ZwyPO_GtPzr_xDy1OlUWSEpWvopOof-IO7oxPtO6QRlD2lKIw7bN3dZ_UGWSPjzXjEcJv8RBQ2c6QJcPObAIVE9rCB8hsUYBaa_iSyBUMAt5OzWEUgwp9" />
          <div class="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div class="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <span class="inline-block px-3 py-1 bg-tertiary-container text-on-tertiary-container font-label-md text-label-md rounded-full mb-2">Digital Illustration</span>
            <h3 class="font-headline-md text-headline-md text-on-primary mb-1 font-bold">Morning Serenity</h3>
            <p class="text-surface-variant text-body-md">By Sarah Jenkins • Concept Art 101</p>
          </div>
        </div>

        <div class="gallery-item group relative rounded-xl overflow-hidden bg-surface-container-lowest shadow-sm col-span-1 row-span-1">
          <img alt="Artwork" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAq71zD4kY7nTDde58ZxISgQJ05XWSf-2SsAABr66KdXAYd9wiMfjnx3ROCjH_FoWA7htsaNcXu2PonSBGBgx7Lto46F7ZfZojRz8QcgB6e_UC3EuCIlJ3eAHyGkexhkghUaF9DqElFpN91MA6GyMQi7ufXk1vOwZJBVyTR1DvsspweWMSxBVRCRsvjZsvuCDSfn1m-t0eTPHpvdXvuoG28Uc3b_ErkJrgpY-jcAnhSDnpdsvIhcvvs" />
          <div class="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div class="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <span class="inline-block px-2 py-1 bg-primary-container text-on-primary-container font-label-md text-label-md rounded-full mb-2 text-xs">Graphic Design</span>
            <h3 class="font-headline-sm text-headline-sm text-on-primary mb-1 font-bold">Urban Geometry</h3>
            <p class="text-surface-variant text-sm">By Alex Rivera • Visual Identity</p>
          </div>
        </div>

        <div class="gallery-item group relative rounded-xl overflow-hidden bg-surface-container-lowest shadow-sm col-span-1 row-span-1">
          <img alt="Artwork" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDt9yOGawqhaqbmuB9P7UgFvZgVCD7j0KURoVlO1CbGC02jeRs-IKWCj3_6lV9fycKoll-uWQZYmbtrnVVvGbgqz0-xknjGsaAe-J4Y0XWtigHaTLy4M6GBwr4Ghg4d6mnf2w9Etr6jUiM4o3d85D2S-y8B5Zp4H-uh3r7uL-pEC2uBucjDsIX0Vf-9AZYcOJ0KEEHHyVurOBDOfwsKw0CvOZZBsTS64rB0oFgNvkAPo3x4tb2hPptE" />
          <div class="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div class="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <span class="inline-block px-2 py-1 bg-secondary-container text-on-secondary-container font-label-md text-label-md rounded-full mb-2 text-xs">3D Modeling</span>
            <h3 class="font-headline-sm text-headline-sm text-on-primary mb-1 font-bold">Cozy Corner</h3>
            <p class="text-surface-variant text-sm">By Emma Lin • Intro to Blender</p>
          </div>
        </div>

        <div class="gallery-item group relative rounded-xl overflow-hidden bg-surface-container-lowest shadow-sm col-span-1 md:col-span-3 row-span-1 flex items-center justify-center bg-surface-container-high border border-outline-variant/30 border-dashed">
          <div class="text-center p-8">
            <span class="material-symbols-outlined text-4xl text-outline mb-2">add_photo_alternate</span>
            <h3 class="font-headline-sm text-headline-sm text-on-surface mb-2 font-bold">Your Artwork Here</h3>
            <p class="text-on-surface-variant text-body-md mb-4">Join the showcase and inspire others.</p>
            <button class="text-primary font-label-md text-label-md hover:underline font-semibold cursor-pointer">Upload Now</button>
          </div>
        </div>
      </div>
    </main>
  `
})
export class GalleryStudentComponent {}
