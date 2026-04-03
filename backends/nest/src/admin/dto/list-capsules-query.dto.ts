import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class ListCapsulesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page 必须是整数' })
  @Min(0, { message: 'page 不能小于 0' })
  page = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'size 必须是整数' })
  @Min(1, { message: 'size 最少为 1' })
  @Max(100, { message: 'size 最多为 100' })
  size = 20;
}
