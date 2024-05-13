import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { getReqMainInfo } from '../../utils/getReqMainInfo';
import { HttpAdapterHost } from '@nestjs/core';
import * as chalk from 'chalk';

/**
 * 全局异常捕获过滤器
 * 捕获应用程序中发生的所有异常，并将它们统一处理
 */
@Catch()
export default class UnifyExceptionFilter implements ExceptionFilter {
  /**
   * 构造函数，注入日志服务相关依赖
   * @param logger Winston日志记录器实例
   * @param httpAdapterHost HTTP适配器主机实例
   */
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  /**
   * 异常捕获处理方法
   * @param exception 捕获到的异常对象
   * @param host 上下文参数对象
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp(); // 获取当前执行上下文
    const res = ctx.getResponse<Response>(); // 获取响应对象
    const req = ctx.getRequest<Request>(); // 获取请求对象

    // 根据异常类型获取 HTTP 状态码
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 获取异常消息
    const message =
      exception['response']?.['message'] ||
      exception['response']?.['error'] ||
      exception['message']?.['message'] ||
      exception['message']?.['error'] ||
      exception['message'] ||
      null;

    // 构造响应体
    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      data: message,
    };

    // 记录日志（错误消息，错误码，请求信息等）
    this.logger.error(
      chalk.red('GLOBAL EXCEPTION FILTER HAS CAUGHT THE EXCEPTION: ') + message,
      {
        httpStatus,
        req: getReqMainInfo(req),
        stack: exception['stack'],
        context: 'ExceptionFilter',
      },
    );

    // 返回响应
    res
      .status(httpStatus >= 500 ? httpStatus : 200)
      .json({ code: 1, responseBody, msg: 'ERROR' });
  }
}
