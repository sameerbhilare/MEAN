import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * For every outgoing HTTP request, this interceptor will be called.
 * And if we get any error, we can handle in the catchError() below.
 */
export class ErrorInterceptor implements HttpInterceptor {
  // insert 'Authorization' header in each http request
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        alert(error.error.message);
        // throw this error because the error should be handled by the caller (somewhere in servie or component)
        return throwError(error);
      })
    );
  }
}
