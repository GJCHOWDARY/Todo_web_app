import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material";
import { Observable, throwError } from 'rxjs';
import { ErrorComponent } from "./error/error.component";
import { ErrorService } from "./error/error.service";
import { TodosService } from "./todo/todo.service";
import { AuthService } from "./auth/auth.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private dialog: MatDialog,
              public userService: TodosService,
              public authService: AuthService,
              private errorService: ErrorService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
     return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
        }
        return event;
    }),
      catchError((error: HttpErrorResponse) => {
        console.log(error,"----")
        let errorMessage = "An Unknown Error Occurred!";
        let errortitle = "Error";
        if (error.error.status=='Failed') {
          errorMessage = error.error.error.error;          
        } else if (error.error.message) {
          errorMessage = error.error.message;
        }
        if(error.status==401){
          this.authService.logout();
        }
        this.dialog.open(ErrorComponent, {data: {message: errorMessage,title:errortitle}});
        return throwError(error);
      })
    );
  }
}
