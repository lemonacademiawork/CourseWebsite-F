import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { AdminSetting } from '../../../core/models/admin.model';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-settings.component.html'
})
export class AdminSettingsComponent implements OnInit {
  settings = signal<AdminSetting[]>([]);
  isLoading = signal<boolean>(true);
  isSaving = signal<boolean>(false);
  saveSuccess = signal<boolean>(false);
  errorMessage = signal<string>('');

  // Default editable fields
  siteName = signal<string>('Lemon Academia');
  supportEmail = signal<string>('support@lemonacademia.com');
  supportPhone = signal<string>('+91 98765 43210');
  referralCommissionPercent = signal<number>(10);
  maintenanceMode = signal<boolean>(false);
  certificatePrefix = signal<string>('CERT-LA-');
  razorpayKeyId = signal<string>('');

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.isLoading.set(true);
    this.adminService.getSettings().subscribe({
      next: (list) => {
        this.settings.set(list);
        this.isLoading.set(false);

        // Populate fields from list
        list.forEach(item => {
          if (item.settingKey === 'site_name') this.siteName.set(item.settingValue);
          if (item.settingKey === 'support_email') this.supportEmail.set(item.settingValue);
          if (item.settingKey === 'support_phone') this.supportPhone.set(item.settingValue);
          if (item.settingKey === 'referral_commission_percent') this.referralCommissionPercent.set(Number(item.settingValue) || 10);
          if (item.settingKey === 'maintenance_mode') this.maintenanceMode.set(item.settingValue === 'true');
          if (item.settingKey === 'certificate_prefix') this.certificatePrefix.set(item.settingValue);
          if (item.settingKey === 'razorpay_key_id') this.razorpayKeyId.set(item.settingValue);
        });
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  saveAll(): void {
    this.isSaving.set(true);
    this.errorMessage.set('');
    this.saveSuccess.set(false);

    const payloads = [
      { settingKey: 'site_name', settingValue: this.siteName() },
      { settingKey: 'support_email', settingValue: this.supportEmail() },
      { settingKey: 'support_phone', settingValue: this.supportPhone() },
      { settingKey: 'referral_commission_percent', settingValue: String(this.referralCommissionPercent()) },
      { settingKey: 'maintenance_mode', settingValue: String(this.maintenanceMode()) },
      { settingKey: 'certificate_prefix', settingValue: this.certificatePrefix() },
      { settingKey: 'razorpay_key_id', settingValue: this.razorpayKeyId() }
    ];

    let completed = 0;
    payloads.forEach(p => {
      this.adminService.updateSetting(p).subscribe({
        next: () => {
          completed++;
          if (completed === payloads.length) {
            this.isSaving.set(false);
            this.saveSuccess.set(true);
            setTimeout(() => this.saveSuccess.set(false), 4000);
          }
        },
        error: (err) => {
          this.isSaving.set(false);
          this.errorMessage.set(err?.error?.message || 'Failed to save some system settings');
        }
      });
    });
  }
}
