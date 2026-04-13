/**
 * 创建胶囊请求 DTO — 使用 class-validator 做声明式校验
 *
 * 校验规则完全匹配 OpenAPI 契约：
 * - title: 非空，最多 100 字符
 * - content: 非空（无长度上限，与其他后端一致）
 * - creator: 非空，最多 30 字符
 * - openAt: 非空，ISO 8601 格式
 *
 * NestJS 的 ValidationPipe 自动执行这些校验，
 * 类似 Spring Boot 的 @Valid + Bean Validation，类似 FastAPI 的 Pydantic。
 */
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
