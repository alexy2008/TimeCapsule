import { IsNotEmpty } from 'class-validator';

export class AdminLoginDto {
  @IsNotEmpty({ message: '密码不能为空' })
  password!: string;
}
