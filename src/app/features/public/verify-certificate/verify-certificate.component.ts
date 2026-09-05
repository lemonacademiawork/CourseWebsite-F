import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CertificateService } from '../../../core/services/certificate.service';
import { Certificate } from '../../../core/models/certificate.model';

@Component({
  selector: 'app-verify-certificate',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './verify-certificate.component.html'
})
export class VerifyCertificateComponent implements OnInit {
  verificationCode = signal<string>('');
  isLoading = signal<boolean>(false);
  hasSearched = signal<boolean>(false);
  isValid = signal<boolean>(false);
  errorMessage = signal<string>('');
  certificate = signal<Certificate | null>(null);

  constructor(
    private route: ActivatedRoute,
    private certService: CertificateService
  ) {}

  ngOnInit(): void {
    const codeParam = this.route.snapshot.paramMap.get('code') || this.route.snapshot.queryParamMap.get('code');
    if (codeParam) {
      this.verificationCode.set(codeParam.trim());
      this.verify();
    }
  }

  verify(): void {
    const code = this.verificationCode().trim();
    if (!code) {
      this.errorMessage.set('Please enter a certificate verification code.');
      return;
    }

    this.isLoading.set(true);
    this.hasSearched.set(true);
    this.errorMessage.set('');
    this.certificate.set(null);

    this.certService.verifyCertificate(code).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.valid && res.certificate) {
          this.isValid.set(true);
          this.certificate.set(res.certificate);
        } else {
          this.isValid.set(false);
          this.errorMessage.set(res.message || 'No active certificate found matching this verification code.');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.isValid.set(false);
        this.errorMessage.set(err?.error?.message || 'Verification failed. Please check the code and try again.');
      }
    });
  }

  printCertificate(): void {
    window.print();
  }
}
