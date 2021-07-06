import { Injectable }       from '@angular/core';
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Route
}                           from '@angular/router';
import { AuthServices } from './auth.service';

@Injectable()
export class AnonymousGuard implements CanActivate {

    constructor(private authService: AuthServices, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.checkLogin();
    }

    checkLogin(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.authService.isLoggedIn().then(() => {
                this.router.navigate(['/login']);
                reject(false);
            }).catch(() => {
                resolve(true);
            });
        });
    }
}
