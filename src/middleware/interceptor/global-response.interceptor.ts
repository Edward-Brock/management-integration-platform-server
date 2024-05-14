import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { requestUtils } from '../../utils/requestUtils';

/**
 * 全局响应拦截器
 * 用于记录每个请求的响应，并对响应进行统一处理
 */
@Injectable()
export class GlobalResponseInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  /**
   * 拦截器主要方法，用于拦截每个传入的请求，并处理相应的响应
   * @param context ExecutionContext实例，提供了对当前请求上下文的访问
   * @param next CallHandler实例，用于继续处理传入的请求
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const requestInfo = requestUtils(request); // 使用请求工具函数获取请求主要信息

    this.logger.info(`INCOMING REQUEST: ${JSON.stringify(requestInfo)}`, {
      context: 'GlobalResponseInterceptor',
    });

    return next.handle().pipe(
      tap(() =>
        this.logger.info(`OUTGOING RESPONSE: ${JSON.stringify(requestInfo)}`, {
          context: 'GlobalResponseInterceptor',
        }),
      ),
    );
  }
}
