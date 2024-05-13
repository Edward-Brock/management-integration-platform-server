import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { getReqMainInfo } from '../../utils/getReqMainInfo';
import * as chalk from 'chalk';

/**
 * 全局响应拦截器
 * 用于记录每个请求的响应，并对响应进行统一处理
 */
@Injectable()
export class UnifyResponseInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  /**
   * 拦截器主要方法，用于拦截每个传入的请求，并处理相应的响应
   * @param context ExecutionContext实例，提供了对当前请求上下文的访问
   * @param next CallHandler实例，用于继续处理传入的请求
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();

    return next.handle().pipe(
      map((data) => {
        // 记录日志
        this.logResponse(data, req);
        // 统一格式化响应
        return {
          code: 0,
          data,
          msg: 'SUCCESS',
        };
      }),
    );
  }

  /**
   * 记录响应日志的辅助方法
   * @param responseData 响应数据
   * @param req 当前请求对象
   */
  private logResponse(responseData: any, req: Request): void {
    this.logger.info(chalk.green('→ ENTER GLOBAL RESPONSE INTERCEPTOR'), {
      responseData,
      req: getReqMainInfo(req),
      context: 'ResponseInterceptor',
    });
  }
}
