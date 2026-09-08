import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'lemon-academy-angular';
  private authService = inject(AuthService);

  ngOnInit(): void {
    if (typeof window === 'undefined') return;

    // Check if query params or fragment have OAuth token on root load
    const urlParams = new URLSearchParams(window.location.search);
    let token = urlParams.get('token') || urlParams.get('accessToken') || urlParams.get('jwt') || urlParams.get('id_token');
    
    if (!token && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      token = hashParams.get('token') || hashParams.get('accessToken') || hashParams.get('access_token') || hashParams.get('id_token');
    }

    if (token) {
      const refreshToken = urlParams.get('refreshToken') || urlParams.get('refresh_token') || undefined;
      const role = urlParams.get('role') || undefined;
      const name = urlParams.get('name') || urlParams.get('userName') || undefined;
      const email = urlParams.get('email') || undefined;
      const returnUrl = urlParams.get('returnUrl') || undefined;

      this.authService.handleOAuthSuccess(token, refreshToken, role, name, email);
      this.authService.navigateAfterAuth(returnUrl);
    }
  }
}

