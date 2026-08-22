import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-import',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="flex-1 p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full text-xs text-on-surface">
      <div class="max-w-3xl space-y-6">
        <div>
          <h1 class="text-xl font-bold">Import Students</h1>
          <p class="text-xs text-on-surface-variant mt-1">Batch import student profiles into the academy platform via Excel or CSV.</p>
        </div>

        <div class="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/30 shadow-sm space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="font-bold text-sm">Step 1: Upload Data</h3>
            <button class="flex items-center gap-2 px-3 py-1.5 border border-outline rounded-lg hover:bg-surface-variant/30 transition-colors font-semibold cursor-pointer">
              <span class="material-symbols-outlined text-sm">download</span>
              Download Excel Template
            </button>
          </div>

          <div class="border-2 border-dashed border-outline-variant/50 rounded-xl p-12 flex flex-col items-center justify-center text-center hover:bg-surface-container-low transition-colors cursor-pointer">
            <div class="w-14 h-14 rounded-full bg-primary-container/20 flex items-center justify-center mb-4 text-primary">
              <span class="material-symbols-outlined text-3xl">upload_file</span>
            </div>
            <h4 class="font-bold text-sm mb-1">Drag and drop your Excel file here</h4>
            <p class="text-on-surface-variant text-[11px] mb-4">Supported formats: .xlsx, .xls, .csv (Max 10MB)</p>
            <button class="px-5 py-2.5 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90 cursor-pointer">
              Browse Files
            </button>
          </div>
        </div>
      </div>
    </main>
  `
})
export class AdminImportComponent {}
