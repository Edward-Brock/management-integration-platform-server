import {
  utilities as nestWinstonModuleUtilities,
  WinstonModuleOptions,
} from 'nest-winston';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as chalk from 'chalk';

const winstonConfig: WinstonModuleOptions = {
  // Winston 配置选项
  transports: [
    // 打印到控制台，生产可注释关闭该功能
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.cli(), // 控制台友好的日志格式
        winston.format.splat(), // 格式化日志信息
        winston.format.timestamp({
          format: 'YYYY/MM/DD HH:mm:ss', // 添加时间戳
        }),
        winston.format.ms(), // 添加毫秒信息
        nestWinstonModuleUtilities.format.nestLike('MyApp', {
          colors: true,
          prettyPrint: true,
        }), // Nest.js 风格的日志格式
        winston.format.printf(({ context, level, message, timestamp, ms }) => {
          const levelColor =
            level === 'error' ? chalk.red(level) : chalk.green(level); // 根据日志级别设置颜色
          const contextStr = context ? chalk.yellow(`[${context}]`) : ''; // 如果有上下文信息，设置上下文颜色
          return `${chalk.blue(timestamp)} ${levelColor}: ${contextStr} ${message} ${chalk.yellow(ms)}`; // 格式化日志信息
        }),
      ),
    }),
    // 保存到文件
    new DailyRotateFile({
      dirname: `logs`, // 日志保存的根目录
      filename: '%DATE%.log', // 日志文件名称，占位符 %DATE% 表示日期，%LEVEL% 表示日志级别
      datePattern: 'YYYY-MM-DD', // 日志文件轮换的日期格式，此处表示每天轮换
      zippedArchive: true, // 是否通过压缩的方式归档被轮换的日志文件
      maxSize: '20m', // 设置日志文件的最大大小，m 表示 mb
      maxFiles: '14d', // 保留日志文件的最大天数，此处表示自动删除超过 14 天的日志文件
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }), // 添加时间戳
        winston.format.ms(), // 添加毫秒信息
        // 自定义日志格式，包含时间戳、日志级别、消息内容和处理时间
        winston.format.printf(({ level, message, timestamp, ms }) => {
          return `${timestamp} [${level.toUpperCase()}]: ${message} (${ms})`;
        }),
      ),
      handleExceptions: true, // 是否处理异常
    }),
  ],
};

export default winstonConfig;
