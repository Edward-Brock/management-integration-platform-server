import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        code: 200,
        message: 'Success',
        timestamp: new Date(),
        data,
      })),
      catchError((error) => this.handleError(error)),
    );
  }

  private handleError(error: any): Observable<any> {
    let code = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Internal server error';

    if (error instanceof HttpException) {
      code = error.getStatus();
      message = error.getResponse();
    } else {
      console.error('Interceptor error:', error);
    }

    return throwError(new HttpException(message, code));
  }
}
