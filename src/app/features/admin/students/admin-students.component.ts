import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import * as XLSX from 'xlsx';
import { AdminService } from '../../../core/services/admin.service';
import { CourseService } from '../../../core/services/course.service';
import { AdminUser, AdminEnrollment } from '../../../core/models/admin.model';
import { Course } from '../../../core/models/course.model';

interface StudentItem {
  id: number | string;
  name: string;
  studentId: string;
  email: string;
  phone: string;
  courseName?: string | null;
  coursesList: string[];
  coursesCount: number;
  joinDate: string;
  status: 'Paid' | 'Pending';
}

@Component({
  selector: 'app-admin-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="flex-grow w-full px-margin-mobile md:px-margin-desktop py-6 max-w-[1440px] mx-auto min-h-screen text-xs text-on-surface">
      <header class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h2 class="text-xl font-bold text-on-surface">Students</h2>
          <p class="text-xs text-on-surface-variant mt-1">Manage student enrollments, registered courses, progress, and account details.</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <!-- Hidden file input for Excel upload -->
          <input 
            #excelFileInput 
            type="file" 
            accept=".xlsx, .xls, .csv" 
            class="hidden" 
            (change)="onExcelFileSelected($event)" 
          />

          <!-- Download Excel Template -->
          <button 
            type="button"
            (click)="downloadExcelTemplate()"
            title="Download Excel template with required student columns"
            class="px-3 py-1.5 rounded-lg border border-outline text-on-surface font-semibold text-xs hover:bg-surface-container-high transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer">
            <span class="material-symbols-outlined text-[16px] text-primary">download</span>
            Excel Template
          </button>

          <!-- Import Students Excel -->
          <button 
            type="button"
            (click)="excelFileInput.click()"
            title="Upload and import students from Excel or CSV"
            class="px-3 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant text-on-surface font-semibold text-xs hover:bg-surface-variant transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer">
            <span class="material-symbols-outlined text-[16px] text-primary">upload_file</span>
            Import Excel
          </button>

          <!-- Add Student Manual Toggle -->
          <button 
            (click)="isAdding.set(!isAdding())"
            class="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-semibold text-xs hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm cursor-pointer">
            <span class="material-symbols-outlined text-[16px]">{{ isAdding() ? 'close' : 'add' }}</span>
            {{ isAdding() ? 'Cancel' : 'Add Student' }}
          </button>
        </div>
      </header>

      <!-- Import Success / Error Feedback Alert -->
      @if (importMessage()) {
        <div 
          class="mb-4 p-3 rounded-xl flex items-center justify-between gap-3 border shadow-xs"
          [class]="isImportError() ? 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300' : 'bg-green-500/10 border-green-500/30 text-green-800 dark:text-green-300'">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-base">{{ isImportError() ? 'error' : 'check_circle' }}</span>
            <span class="font-medium text-xs">{{ importMessage() }}</span>
          </div>
          <button 
            type="button" 
            (click)="importMessage.set(null)" 
            class="hover:opacity-70 cursor-pointer p-1">
            <span class="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      }

      @if (isAdding()) {
        <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-xl p-4 mb-6 shadow-sm">
          <h3 class="font-bold text-sm mb-3 text-on-surface">Add New Student</h3>
          <form (ngSubmit)="handleAddStudent()" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            <input 
              type="text" 
              placeholder="Student Name"
              [ngModel]="name()"
              (ngModelChange)="name.set($event)"
              name="name"
              required
              class="bg-surface-container-low border border-outline-variant/40 rounded-lg p-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
            />
            <input 
              type="email" 
              placeholder="Email Address"
              [ngModel]="email()"
              (ngModelChange)="email.set($event)"
              name="email"
              class="bg-surface-container-low border border-outline-variant/40 rounded-lg p-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
            />
            <input 
              type="text" 
              placeholder="Phone"
              [ngModel]="phone()"
              (ngModelChange)="phone.set($event)"
              name="phone"
              class="bg-surface-container-low border border-outline-variant/40 rounded-lg p-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
            />
            <select 
              [ngModel]="selectedCourse()"
              (ngModelChange)="selectedCourse.set($event)"
              name="selectedCourse"
              class="bg-surface-container-low border border-outline-variant/40 rounded-lg p-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none">
              <option value="">-- Select Registered Course --</option>
              @for (c of availableCourses(); track c.id) {
                <option [value]="c.title">{{ c.title }}</option>
              }
              <option value="Lippan Mirror Art">Lippan Mirror Art Masterclass</option>
              <option value="Botanical Candle Making">Hand-Poured Botanical Candle Making</option>
              <option value="Ocean Resin Art">Ocean Resin Art &amp; Liquid Glass</option>
              <option value="Mosaic &amp; Glass Art">Modern Mosaic &amp; Glass Art</option>
              <option value="Pottery Masterclass">Wheel &amp; Hand Pottery Masterclass</option>
              <option value="Crochet &amp; Fiber Arts">Artisan Crochet &amp; Fiber Arts</option>
            </select>
            <button type="submit" class="bg-primary text-on-primary font-semibold rounded-lg py-2 hover:opacity-90 cursor-pointer shadow-xs">
              Save Student
            </button>
          </form>
        </div>
      }

      <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/35 shadow-sm overflow-hidden">
        <div class="w-full overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-surface-container-low border-b border-outline-variant text-on-surface-variant font-semibold">
                <th class="py-3.5 px-4">Student</th>
                <th class="py-3.5 px-4">Student ID</th>
                <th class="py-3.5 px-4">Contact</th>
                <th class="py-3.5 px-4">Registered Course</th>
                <th class="py-3.5 px-4 text-center">Enrolled Count</th>
                <th class="py-3.5 px-4">Joined Date</th>
                <th class="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/15">
              @for (st of students(); track st.id) {
                <tr class="hover:bg-surface-container-low/50 transition-colors">
                  <td class="py-3.5 px-4 font-semibold text-on-surface">{{ st.name }}</td>
                  <td class="py-3.5 px-4 text-on-surface-variant font-mono text-[11px]">{{ st.studentId }}</td>
                  <td class="py-3.5 px-4 text-on-surface-variant">
                    <div>{{ st.email }}</div>
                    @if (st.phone && st.phone !== 'N/A') {
                      <div class="text-[10px] text-on-surface-variant/70">{{ st.phone }}</div>
                    }
                  </td>
                  <td class="py-3 px-4">
                  @if (st.courseName) {
                    <span class="font-medium text-on-surface bg-surface-container-high px-2 py-0.5 rounded text-[11px] border border-outline-variant/30">
                      {{ st.courseName }}
                    </span>
                  } @else {
                    <span class="text-on-surface-variant/60 italic font-mono">-</span>
                  }
                </td>
                <td class="py-3 px-4 text-center font-bold text-primary">{{ st.coursesCount }}</td>
                <td class="py-3 px-4 text-on-surface-variant">{{ st.joinDate }}</td>
                <td class="py-3 px-4">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                        [class]="st.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'">
                    {{ st.status }}
                  </span>
                </td>
                </tr>
              }

              @if (students().length === 0 && !isLoading()) {
                <tr>
                  <td colspan="7" class="text-center py-10 text-on-surface-variant">
                    No students registered yet. Click <strong>Import Excel</strong> or <strong>Add Student</strong> above.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </main>
  `
})
export class AdminStudentsComponent implements OnInit {
  private adminService = inject(AdminService);
  private courseService = inject(CourseService);

  students = signal<StudentItem[]>([]);
  availableCourses = signal<Course[]>([]);
  isLoading = signal<boolean>(true);

  isAdding = signal<boolean>(false);
  name = signal<string>('');
  email = signal<string>('');
  phone = signal<string>('');
  selectedCourse = signal<string>('');
  status = signal<'Paid' | 'Pending'>('Paid');

  importMessage = signal<string | null>(null);
  isImportError = signal<boolean>(false);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);

    forkJoin({
      users: this.adminService.getUsers({ role: 'STUDENT' }),
      enrollments: this.adminService.getEnrollments(),
      courses: this.courseService.getCourses()
    }).subscribe({
      next: ({ users, enrollments, courses }) => {
        this.availableCourses.set(courses || []);

        const courseTitleMap = new Map<string, string>();
        courses.forEach(c => courseTitleMap.set(c.id, c.title));

        const studentCoursesMap = new Map<string, string[]>();

        enrollments.forEach(e => {
          const title = e.course?.title || courseTitleMap.get(e.courseId) || '';
          if (!title) return;
          
          if (e.studentId) {
            const list = studentCoursesMap.get(e.studentId) || [];
            if (!list.includes(title)) list.push(title);
            studentCoursesMap.set(e.studentId, list);
          }
          if (e.student?.email) {
            const list = studentCoursesMap.get(e.student.email.toLowerCase()) || [];
            if (!list.includes(title)) list.push(title);
            studentCoursesMap.set(e.student.email.toLowerCase(), list);
          }
        });

        if (users && users.length > 0) {
          const mapped: StudentItem[] = users.map((u: any, i: number) => {
            const registered = studentCoursesMap.get(u.id) 
              || (u.email ? studentCoursesMap.get(u.email.toLowerCase()) : null)
              || (u.enrolledCourses ? (Array.isArray(u.enrolledCourses) ? u.enrolledCourses.map((c: any) => c.title || c) : [u.enrolledCourses]) : null)
              || (u.courseName ? [u.courseName] : null)
              || (u.courses ? (Array.isArray(u.courses) ? u.courses.map((c: any) => c.title || c) : [u.courses]) : null)
              || [];

            const courseName = registered.length > 0 ? registered.join(', ') : null;

            return {
              id: u.id || i + 1,
              name: u.name || 'Student',
              studentId: `#LA-${u.id ? u.id.substring(0, 4).toUpperCase() : (1000 + i)}`,
              email: u.email,
              phone: u.phone || 'N/A',
              courseName: courseName,
              coursesList: registered,
              coursesCount: registered.length || u.coursesCount || u.enrollmentsCount || 0,
              joinDate: u.createdAt
                ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
                : 'Sep 08, 2026',
              status: u.isActive !== false ? 'Paid' : 'Pending'
            };
          });
          this.students.set(mapped);
        } else {
          this.students.set([]);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.students.set([]);
        this.isLoading.set(false);
      }
    });
  }

  handleAddStudent(): void {
    if (!this.name().trim()) return;

    const chosenCourse = this.selectedCourse().trim() || null;

    const newStudent: StudentItem = {
      id: Date.now(),
      name: this.name().trim(),
      studentId: `#LA-${Math.floor(1000 + Math.random() * 9000)}`,
      email: this.email().trim() || 'student@example.com',
      phone: this.phone().trim() || 'N/A',
      courseName: chosenCourse,
      coursesList: chosenCourse ? [chosenCourse] : [],
      coursesCount: chosenCourse ? 1 : 0,
      joinDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: this.status()
    };

    this.students.update(list => [newStudent, ...list]);
    this.name.set('');
    this.email.set('');
    this.phone.set('');
    this.selectedCourse.set('');
    this.isAdding.set(false);
    this.importMessage.set(`Added student "${newStudent.name}" successfully.`);
    this.isImportError.set(false);
  }

  /** Generates and triggers download of Excel template matching the add student API schema */
  downloadExcelTemplate(): void {
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

    // Set column widths for readability
    worksheet['!cols'] = [
      { wch: 22 }, // Student Name
      { wch: 30 }, // Email Address
      { wch: 18 }, // Phone Number
      { wch: 38 }, // Registered Course
      { wch: 12 }  // Status
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    XLSX.writeFile(workbook, 'Lemon_Academia_Student_Import_Template.xlsx');
  }

  /** Handles Excel / CSV file selection and parsing into student records */
  onExcelFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const buffer = e.target.result;
        const workbook = XLSX.read(buffer, { type: 'array' });

        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) {
          this.importMessage.set('The uploaded Excel file contains no worksheets.');
          this.isImportError.set(true);
          return;
        }

        const worksheet = workbook.Sheets[firstSheetName];
        const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawRows || rawRows.length === 0) {
          this.importMessage.set('The uploaded Excel worksheet is empty.');
          this.isImportError.set(true);
          return;
        }

        const newStudents: StudentItem[] = [];
        const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

        rawRows.forEach((row, index) => {
          // Normalize row keys for flexible parsing
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

          if (!studentName) return; // Skip empty rows

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
          ).trim() || null;

          const rawStatus = String(
            normalized['status'] ||
            normalized['paymentstatus'] ||
            'Paid'
          ).trim().toLowerCase();

          const status: 'Paid' | 'Pending' = rawStatus === 'pending' ? 'Pending' : 'Paid';

          newStudents.push({
            id: Date.now() + index + Math.floor(Math.random() * 1000),
            name: studentName,
            studentId: `#LA-${Math.floor(1000 + Math.random() * 9000)}`,
            email: email || `${studentName.toLowerCase().replace(/\s+/g, '')}@student.lemonhousecraft.in`,
            phone: phone,
            courseName: course,
            coursesList: course ? [course] : [],
            coursesCount: course ? 1 : 0,
            joinDate: todayStr,
            status: status
          });
        });

        if (newStudents.length === 0) {
          this.importMessage.set('No valid student rows found. Please check column headers (e.g., Student Name, Email Address, Phone Number, Registered Course, Status).');
          this.isImportError.set(true);
        } else {
          this.students.update(list => [...newStudents, ...list]);
          this.importMessage.set(`Successfully imported ${newStudents.length} student${newStudents.length > 1 ? 's' : ''} from "${file.name}".`);
          this.isImportError.set(false);
        }
      } catch (err: any) {
        this.importMessage.set(`Error parsing Excel file: ${err?.message || 'Invalid format'}`);
        this.isImportError.set(true);
      } finally {
        input.value = ''; // Reset input so same file can be re-selected if updated
      }
    };

    reader.onerror = () => {
      this.importMessage.set('Failed to read the selected file.');
      this.isImportError.set(true);
      input.value = '';
    };

    reader.readAsArrayBuffer(file);
  }

  deleteStudent(id: any): void {
    this.students.update(list => list.filter(s => s.id !== id));
  }
}
