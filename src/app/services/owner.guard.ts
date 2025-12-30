
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from './user.service';

export const ownerGuard: CanActivateFn = () => {
  const us = inject(UserService);
  const router = inject(Router);
  if (us.isOwner()) return true;
  router.navigateByUrl('/login');
  return false;
};
