import { SessionServiceService } from './../services/session/session-service.service';
import { CanActivate, Router } from "@angular/router";
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate {

    constructor(
        private sessionService: SessionServiceService,
        private router: Router
    ) {}

    canActivate(): boolean {
        if (!this.sessionService.activeSession()) {
            return true;
        }

        this.router.navigate(['/']);
        return false;
    }
}