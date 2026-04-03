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
