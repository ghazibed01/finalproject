import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, CanActivateChild} from '@angular/router';

import { AuthService } from '../service/auth.service';
import { StorageService } from '@core/service/storage.service';

@Injectable({
  providedIn: 'root',
})



export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private storageService: StorageService, // Utilisation du bon nom ici
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkAccess(route);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkAccess(childRoute);
  }

 private checkAccess(route: ActivatedRouteSnapshot): boolean {
  const currentUser = this.authService.currentUserValue;

  if (!currentUser || !currentUser.username) {
    this.router.navigate(['/authentication/signin']);
    return false;
  }

  const storedUser = this.storageService.getUser();
  const userRoles = Array.isArray(storedUser?.roles) ? storedUser.roles : [];

  // if (route.data['role'] && !route.data['role'].some((r: string) => userRoles.includes(r))) {
  //   this.router.navigate(['/authentication/page404']);
  //   return false;
  // }

  return true;
}

  
}
