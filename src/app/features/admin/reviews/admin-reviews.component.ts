import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../../core/services/review.service';
import { Review } from '../../../core/models/review.model';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-reviews.component.html'
})
export class AdminReviewsComponent implements OnInit {
  reviews = signal<Review[]>([]);
  isLoading = signal<boolean>(true);
  searchQuery = signal<string>('');
  statusFilter = signal<string>('');
  ratingFilter = signal<string>('');

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.isLoading.set(true);
    const filters: any = {};
    if (this.statusFilter() !== '') {
      filters.isPublished = this.statusFilter() === 'published';
    }
    if (this.ratingFilter() !== '') {
      filters.rating = Number(this.ratingFilter());
    }
    if (this.searchQuery().trim() !== '') {
      filters.search = this.searchQuery().trim();
    }

    this.reviewService.getAllReviews(filters).subscribe({
      next: (res) => {
        this.reviews.set(res.reviews);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  togglePublish(review: Review): void {
    const newStatus = !review.isPublished;
    this.reviewService.togglePublishReview(review.id, newStatus).subscribe({
      next: () => {
        review.isPublished = newStatus;
      },
      error: (err) => {
        alert(err?.error?.message || 'Failed to update review status');
      }
    });
  }

  deleteReview(review: Review): void {
    if (!confirm('Are you sure you want to permanently delete this review?')) return;

    this.reviewService.deleteReview(review.id).subscribe({
      next: () => {
        this.reviews.update(list => list.filter(r => r.id !== review.id));
      },
      error: (err) => {
        alert(err?.error?.message || 'Failed to delete review');
      }
    });
  }
}
