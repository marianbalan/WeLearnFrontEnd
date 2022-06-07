import { SessionServiceService } from './../services/session/session-service.service';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoleAuthGuard implements CanActivate {
    
    constructor(
        private router: Router,
        private sessionService: SessionServiceService
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.sessionService.activeSession()) {
            for (const role of this.sessionService.getLoggedUserRoles()) {
                if (route.data['roles'] && route.data['roles'].indexOf(role) !== -1) {
                    return true;
                }
            }
        }

        this.router.navigate(['/']);
        return false;
    }
}