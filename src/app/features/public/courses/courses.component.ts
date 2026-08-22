import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { Course } from '../../../core/models/course.model';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './courses.component.html'
})
export class CoursesComponent implements OnInit {
  private courseService = inject(CourseService);

  courses = signal<Course[]>([]);
  loading = signal<boolean>(true);
  selectedCategories = signal<string[]>([]);
  categories = [
    { name: 'Lippan Art', slug: 'lippan-art' },
    { name: 'Mosaic Art', slug: 'mosaic-art' },
    { name: 'Crochet & Fiber Arts', slug: 'crochet-fiber-arts' },
    { name: 'Resin Art', slug: 'resin-art' },
    { name: 'Pottery', slug: 'pottery' }
  ];

  ngOnInit(): void {
    this.fetchCourses();
  }

  fetchCourses(): void {
    this.loading.set(true);
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.courses.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.courses.set(this.courseService.getMockCourses());
        this.loading.set(false);
      }
    });
  }

  handleCategoryToggle(slug: string): void {
    this.selectedCategories.update(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  }

  get filteredCourses(): Course[] {
    const cats = this.selectedCategories();
    if (cats.length === 0) return this.courses();

    return this.courses().filter(course => {
      return cats.includes(course.categorySlug || '') ||
        cats.some(cat => course.category.toLowerCase().includes(cat.toLowerCase()));
    });
  }

  getInitials(name: string): string {
    return (name || 'Guest').split(' ').map(n => n[0]).join('');
  }
}
