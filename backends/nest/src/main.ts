/**
 * HelloTime NestJS 后端入口文件
 * 
 * 职责：
 * - 配置 NestJS 应用实例，包括 CORS、全局前缀、验证管道和异常过滤器
 * - 启动 HTTP 服务器监听指定端口
 * 
 * 对应其他技术栈：
 * - 类似 Spring Boot 的 main 方法或 Application 类
 * - 类似 Gin 的 main.go 中的路由和中间件配置
 * - 类似 FastAPI 的 app 创建和中间件配置
 */
import 'reflect-metadata';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApiExceptionFilter } from './common/filters/api-exception.filter';
import { appConfig } from './config/app.config';

/**
 * 启动 NestJS 应用
 * 
 * 配置要点：
 * - CORS 允许本地开发环境的所有端口访问，生产环境应配置具体域名
 * - 全局前缀 'api/v1' 统一 API 路径，但技术栈展示图片路径除外
 * - ValidationPipe 自动验证请求数据，whitelist 过滤未声明的字段
 * - ApiExceptionFilter 统一处理业务异常，返回标准响应格式
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: /^http:\/\/localhost(:\d+)?$/,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
    },
  });

  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: 'tech-logos/:file', method: RequestMethod.GET }],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );
  app.useGlobalFilters(new ApiExceptionFilter());

  await app.listen(appConfig.port, '127.0.0.1');
}

void bootstrap();
