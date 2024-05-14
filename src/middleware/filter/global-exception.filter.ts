import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { requestUtils } from '../../utils/requestUtils';

/**
 * 全局异常捕获过滤器
 * 捕获应用程序中发生的所有异常，并将它们统一处理
 */
@Catch()
export default class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  /**
   * 异常捕获处理方法
   * @param exception 捕获到的异常对象
   * @param host 上下文参数对象
   */
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // 使用 requestUtils 获取请求信息
    const requestInfo = requestUtils(request);

    // 构建日志记录的对象
    const logObject = {
      // 请求信息
      request: {
        method: requestInfo.method,
        url: requestInfo.url,
        headers: request.headers,
        // 可以根据需要添加其他请求相关信息
      },
      // 异常信息
      exception: {
        message: exception.message,
        stack: exception.stack,
        // 可以根据需要添加其他异常相关信息
      },
      // 时间戳
      timestamp: new Date().toISOString(),
    };

    // 记录异常信息和请求信息到日志
    this.logger.error(`[${requestInfo.method}] ${requestInfo.url}`, logObject);

    // 默认错误响应
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    // 记录错误响应到日志
    const responseObject = {
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: requestInfo.url, // 使用请求信息中的 URL
    };
    this.logger.error(
      `[${requestInfo.method}] ${requestInfo.url} Error Response`,
      responseObject,
    );

    // 返回错误响应
    response.status(status).json(responseObject);
  }
}
