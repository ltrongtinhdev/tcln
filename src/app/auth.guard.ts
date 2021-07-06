import { TokenStorageService } from './token-storage.service';
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {AuthServices} from './auth.service'
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private router:Router,
    private authService:AuthServices,
    private tokenStorageService:TokenStorageService
    ){}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      return this.checkLogin();
  }


checkLogin(): Promise<boolean> {
    return new Promise((resolve, reject) => {
        this.authService.isLoggedIn().then(() => {
            resolve(true);
        }).catch(() => {
            this.router.navigate(['/']);
            reject(false);
        });
    });
}
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }

}
