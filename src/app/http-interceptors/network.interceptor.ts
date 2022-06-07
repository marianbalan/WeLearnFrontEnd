import { SessionServiceService } from './../services/session/session-service.service';
import { LoadingService } from './../services/loading/loading.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError, delay } from 'rxjs';
import { finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class NetworkInterceptor implements HttpInterceptor {

  constructor(
    private sessionService: SessionServiceService,
    private loader: LoadingService,
    private snackBar: MatSnackBar,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.loader.show();

    let sessionRequest = request;
    const token = this.sessionService.getToken();
    if (token != null) {
      sessionRequest = request.clone({headers: request.headers.set('Authorization', 'Bearer ' + token)});
    }

    return next.handle(sessionRequest).pipe(
      finalize(() => {
        this.loader.hide();
      }),
      catchError((error: HttpErrorResponse) => {
        const errorDetail = error.error.detail ? error.error.detail : error.error;

        this.snackBar.open(errorDetail, '', {
          duration: 3000,
          panelClass: ['error-snackbar']
        })
        return throwError(error);
      })
    );
  }
}
