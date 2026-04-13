// 管理员登录请求 DTO — 只需密码字段
import { IsNotEmpty } from 'class-validator';

export class AdminLoginDto {
  @IsNotEmpty({ message: '密码不能为空' })
  password!: string;
}
