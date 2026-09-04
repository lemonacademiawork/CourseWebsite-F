import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  authService.loadAuthState();

  if (authService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  authService.loadAuthState();

  const role = (authService.userRole() || '').toLowerCase();
  if (authService.isLoggedIn() && role === 'admin') {
    return true;
  }

  if (!authService.isLoggedIn()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  } else {
    router.navigate(['/403']);
  }
  return false;
};

export const trainerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  authService.loadAuthState();

  const role = (authService.userRole() || '').toLowerCase();
  if (authService.isLoggedIn() && role === 'trainer') {
    return true;
  }

  if (!authService.isLoggedIn()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  } else {
    router.navigate(['/403']);
  }
  return false;
};

