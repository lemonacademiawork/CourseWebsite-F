import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReferralService } from '../../../core/services/referral.service';
import { ReferralCommission } from '../../../core/models/referral.model';

@Component({
  selector: 'app-admin-commissions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-commissions.component.html'
})
export class AdminCommissionsComponent implements OnInit {
  commissions = signal<ReferralCommission[]>([]);
  isLoading = signal<boolean>(true);
  statusFilter = signal<string>('');
  searchQuery = signal<string>('');
  selectedCommission = signal<ReferralCommission | null>(null);
  showUpdateModal = signal<boolean>(false);
  updateStatus = signal<'pending' | 'approved' | 'paid' | 'rejected'>('approved');
  transactionRef = signal<string>('');
  notes = signal<string>('');
  isUpdating = signal<boolean>(false);

  constructor(private referralService: ReferralService) {}

  ngOnInit(): void {
    this.loadCommissions();
  }

  loadCommissions(): void {
    this.isLoading.set(true);
    const filter = this.statusFilter() ? { status: this.statusFilter() } : undefined;
    this.referralService.getAdminCommissions(filter).subscribe({
      next: (res) => {
        this.commissions.set(res.commissions);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  get filteredCommissions(): ReferralCommission[] {
    const q = this.searchQuery().toLowerCase().trim();
    return this.commissions().filter(c => {
      const matchSearch = !q ||
        (c.referrerName?.toLowerCase().includes(q)) ||
        (c.referrerEmail?.toLowerCase().includes(q)) ||
        (c.studentName?.toLowerCase().includes(q)) ||
        (c.courseTitle?.toLowerCase().includes(q)) ||
        (c.courseName?.toLowerCase().includes(q)) ||
        (c.transactionRef?.toLowerCase().includes(q));
      return matchSearch;
    });
  }

  openUpdateModal(commission: ReferralCommission): void {
    this.selectedCommission.set(commission);
    this.updateStatus.set((commission.status as any) || 'approved');
    this.transactionRef.set(commission.transactionRef || '');
    this.notes.set(commission.notes || '');
    this.showUpdateModal.set(true);
  }

  closeUpdateModal(): void {
    this.showUpdateModal.set(false);
    this.selectedCommission.set(null);
  }

  saveCommissionUpdate(): void {
    const comm = this.selectedCommission();
    if (!comm) return;

    this.isUpdating.set(true);
    this.referralService.updateAdminCommission(comm.id, {
      status: this.updateStatus(),
      transactionReference: this.transactionRef(),
      notes: this.notes()
    }).subscribe({
      next: () => {
        this.isUpdating.set(false);
        this.closeUpdateModal();
        this.loadCommissions();
      },
      error: (err) => {
        this.isUpdating.set(false);
        alert(err?.error?.message || 'Failed to update commission status');
      }
    });
  }
}
