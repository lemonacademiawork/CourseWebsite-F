import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

interface ParsedStudent {
  name: string;
  email: string;
  phone: string;
  course: string;
  status: 'Paid' | 'Pending';
}

@Component({
  selector: 'app-admin-import',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="flex-1 p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full text-xs text-on-surface">
      <div class="max-w-4xl space-y-6">
        <div>
          <h1 class="text-xl font-bold">Import Students</h1>
          <p class="text-xs text-on-surface-variant mt-1">Batch import student profiles into Lemon Academia via Excel (.xlsx, .xls) or CSV.</p>
        </div>

        @if (feedbackMessage()) {
          <div 
            class="p-3 rounded-xl flex items-center justify-between gap-3 border shadow-xs"
            [class]="isError() ? 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300' : 'bg-green-500/10 border-green-500/30 text-green-800 dark:text-green-300'">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-base">{{ isError() ? 'error' : 'check_circle' }}</span>
              <span class="font-medium text-xs">{{ feedbackMessage() }}</span>
            </div>
            <button 
              type="button" 
              (click)="feedbackMessage.set(null)" 
              class="hover:opacity-70 cursor-pointer p-1">
              <span class="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        }

        <div class="bg-surface-container-lowest rounded-xl p-6 md:p-8 border border-outline-variant/30 shadow-sm space-y-6">
          <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <h3 class="font-bold text-sm">Step 1: Download Template or Upload File</h3>
              <p class="text-[11px] text-on-surface-variant">Use the pre-formatted template with all required student API fields.</p>
            </div>
            <button 
              type="button"
              (click)="downloadTemplate()"
              class="flex items-center gap-2 px-3 py-1.5 border border-outline rounded-lg hover:bg-surface-container-high transition-colors font-semibold cursor-pointer w-fit shadow-2xs">
              <span class="material-symbols-outlined text-sm text-primary">download</span>
              Download Excel Template
            </button>
          </div>

          <!-- Hidden File Input -->
          <input 
            #fileInput 
            type="file" 
            accept=".xlsx, .xls, .csv" 
            class="hidden" 
            (change)="onFileSelected($event)" 
          />

          <!-- Drag and Drop Dropzone -->
          <div 
            (dragover)="onDragOver($event)"
            (dragleave)="onDragLeave($event)"
            (drop)="onFileDrop($event)"
            (click)="fileInput.click()"
            [class.border-primary]="isDragging()"
            [class.bg-surface-container-low]="isDragging()"
            class="border-2 border-dashed border-outline-variant/50 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-surface-container-low/60 transition-all cursor-pointer">
            <div class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary">
              <span class="material-symbols-outlined text-3xl">upload_file</span>
            </div>
            <h4 class="font-bold text-sm mb-1">Drag and drop your Excel file here</h4>
            <p class="text-on-surface-variant text-[11px] mb-4">Supported formats: .xlsx, .xls, .csv (Max 10MB)</p>
            <button 
              type="button"
              class="px-4 py-2 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90 cursor-pointer shadow-xs pointer-events-none">
              Browse Files
            </button>
          </div>

          <!-- File details & Preview -->
          @if (parsedStudents().length > 0) {
            <div class="space-y-4 pt-4 border-t border-outline-variant/20">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-bold text-sm">Step 2: Preview Students ({{ parsedStudents().length }} detected)</h4>
                  <p class="text-[11px] text-on-surface-variant">Review rows before final submission.</p>
                </div>
                <div class="flex items-center gap-2">
                  <button 
                    type="button"
                    (click)="clearPreview()"
                    class="px-3 py-1.5 border border-outline rounded-lg hover:bg-surface-container-high text-xs font-semibold cursor-pointer">
                    Clear
                  </button>
                  <button 
                    type="button"
                    (click)="confirmImport()"
                    class="px-4 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:opacity-90 cursor-pointer shadow-sm flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-sm">check</span>
                    Confirm Import
                  </button>
                </div>
              </div>

              <div class="overflow-x-auto border border-outline-variant/30 rounded-lg">
                <table class="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr class="bg-surface-container-low text-on-surface-variant font-semibold border-b border-outline-variant/30">
                      <th class="py-2.5 px-3">#</th>
                      <th class="py-2.5 px-3">Student Name</th>
                      <th class="py-2.5 px-3">Email Address</th>
                      <th class="py-2.5 px-3">Phone</th>
                      <th class="py-2.5 px-3">Registered Course</th>
                      <th class="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-outline-variant/15">
                    @for (st of parsedStudents(); track $index) {
                      <tr class="hover:bg-surface-container-low/40">
                        <td class="py-2 px-3 text-on-surface-variant font-mono text-[11px]">{{ $index + 1 }}</td>
                        <td class="py-2 px-3 font-semibold">{{ st.name }}</td>
                        <td class="py-2 px-3 text-on-surface-variant">{{ st.email }}</td>
                        <td class="py-2 px-3 text-on-surface-variant">{{ st.phone }}</td>
                        <td class="py-2 px-3">
                          @if (st.course) {
                            <span class="bg-surface-container-high px-2 py-0.5 rounded text-[11px] font-medium border border-outline-variant/30">
                              {{ st.course }}
                            </span>
                          } @else {
                            <span class="text-on-surface-variant/50 italic">-</span>
                          }
                        </td>
                        <td class="py-2 px-3">
                          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                                [class]="st.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'">
                            {{ st.status }}
                          </span>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }
        </div>
      </div>
    </main>
  `
})
export class AdminImportComponent {
  private router = inject(Router);

  isDragging = signal<boolean>(false);
  parsedStudents = signal<ParsedStudent[]>([]);
  feedbackMessage = signal<string | null>(null);
  isError = signal<boolean>(false);

  downloadTemplate(): void {
    const templateData = [
      {
        'Student Name': 'Aarav Sharma',
        'Email Address': 'aarav.sharma@example.com',
        'Phone Number': '+919876543210',
        'Registered Course': 'Lippan Mirror Art Masterclass',
        'Status': 'Paid'
      },
      {
        'Student Name': 'Priya Patel',
        'Email Address': 'priya.patel@example.com',
        'Phone Number': '+919812345678',
        'Registered Course': 'Hand-Poured Botanical Candle Making',
        'Status': 'Paid'
      },
      {
        'Student Name': 'Rohan Verma',
        'Email Address': 'rohan.v@example.com',
        'Phone Number': '+919922334455',
        'Registered Course': 'Ocean Resin Art & Liquid Glass',
        'Status': 'Pending'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    worksheet['!cols'] = [
      { wch: 22 },
      { wch: 30 },
      { wch: 18 },
      { wch: 38 },
      { wch: 12 }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    XLSX.writeFile(workbook, 'Lemon_Academia_Student_Import_Template.xlsx');
  }

  onDragOver(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.isDragging.set(false);
  }

  onFileDrop(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.isDragging.set(false);

    if (e.dataTransfer && e.dataTransfer.files.length > 0) {
      this.processFile(e.dataTransfer.files[0]);
    }
  }

  onFileSelected(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
      input.value = '';
    }
  }

  private processFile(file: File): void {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const buffer = e.target.result;
        const workbook = XLSX.read(buffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];

        if (!firstSheetName) {
          this.feedbackMessage.set('The uploaded Excel file contains no worksheets.');
          this.isError.set(true);
          return;
        }

        const worksheet = workbook.Sheets[firstSheetName];
        const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawRows || rawRows.length === 0) {
          this.feedbackMessage.set('The uploaded worksheet is empty.');
          this.isError.set(true);
          return;
        }

        const students: ParsedStudent[] = [];

        rawRows.forEach((row) => {
          const normalized: Record<string, any> = {};
          Object.keys(row).forEach(key => {
            const cleanKey = key.trim().toLowerCase().replace(/[\s_-]+/g, '');
            normalized[cleanKey] = row[key];
          });

          const studentName = String(
            normalized['studentname'] ||
            normalized['name'] ||
            normalized['fullname'] ||
            normalized['student'] ||
            ''
          ).trim();

          if (!studentName) return;

          const email = String(
            normalized['emailaddress'] ||
            normalized['email'] ||
            normalized['emailid'] ||
            normalized['mail'] ||
            ''
          ).trim();

          const phone = String(
            normalized['phonenumber'] ||
            normalized['phone'] ||
            normalized['contact'] ||
            normalized['mobile'] ||
            normalized['mobilenumber'] ||
            'N/A'
          ).trim();

          const course = String(
            normalized['registeredcourse'] ||
            normalized['course'] ||
            normalized['coursename'] ||
            normalized['coursetitle'] ||
            normalized['enrolledcourse'] ||
            ''
          ).trim();

          const rawStatus = String(
            normalized['status'] ||
            normalized['paymentstatus'] ||
            'Paid'
          ).trim().toLowerCase();

          const status: 'Paid' | 'Pending' = rawStatus === 'pending' ? 'Pending' : 'Paid';

          students.push({
            name: studentName,
            email: email || `${studentName.toLowerCase().replace(/\s+/g, '')}@student.lemonhousecraft.in`,
            phone: phone,
            course: course,
            status: status
          });
        });

        if (students.length === 0) {
          this.feedbackMessage.set('No valid student rows found. Please ensure column names match the template.');
          this.isError.set(true);
        } else {
          this.parsedStudents.set(students);
          this.feedbackMessage.set(`Loaded ${students.length} student rows from "${file.name}". Please review and confirm import.`);
          this.isError.set(false);
        }
      } catch (err: any) {
        this.feedbackMessage.set(`Failed to parse file: ${err?.message || 'Invalid format'}`);
        this.isError.set(true);
      }
    };

    reader.onerror = () => {
      this.feedbackMessage.set('Failed to read the file.');
      this.isError.set(true);
    };

    reader.readAsArrayBuffer(file);
  }

  clearPreview(): void {
    this.parsedStudents.set([]);
    this.feedbackMessage.set(null);
  }

  confirmImport(): void {
    const list = this.parsedStudents();
    if (list.length === 0) return;

    // Navigate to /admin/students with state or notify
    this.feedbackMessage.set(`Successfully imported ${list.length} student profiles! Redirecting to student list...`);
    this.isError.set(false);

    setTimeout(() => {
      this.router.navigate(['/admin/students']);
    }, 1200);
  }
}
