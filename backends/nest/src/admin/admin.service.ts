/**
 * 管理服务 — JWT 签发与验证
 *
 * login() 返回 null 而非抛异常，由 controller 决定错误处理方式，
 * 这种"服务层返回结果、控制器层决定 HTTP 响应"的分离模式
 * 在 Spring Boot、FastAPI、Gin 中也常见。
 */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { appConfig } from '../config/app.config';

@Injectable()
export class AdminService {
  constructor(private readonly jwtService: JwtService) {}

  login(password: string): string | null {
    if (password !== appConfig.adminPassword) {
      return null;
    }

    return this.jwtService.sign({
      sub: 'admin',
    });
  }

  validateToken(token: string): boolean {
    try {
      this.jwtService.verify(token);
      return true;
    } catch {
      return false;
    }
  }
}
