import { IsISO8601, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCapsuleDto {
  @IsNotEmpty({ message: '标题不能为空' })
  @MaxLength(100, { message: '标题最多 100 个字符' })
  title!: string;

  @IsNotEmpty({ message: '内容不能为空' })
  content!: string;

  @IsNotEmpty({ message: '发布者不能为空' })
  @MaxLength(30, { message: '发布者名称最多 30 个字符' })
  creator!: string;

  @IsNotEmpty({ message: '开启时间不能为空' })
  @IsISO8601({}, { message: '开启时间必须是 ISO 8601 格式' })
  openAt!: string;
}
