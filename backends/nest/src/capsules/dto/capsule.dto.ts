/**
 * 胶囊响应 DTO 定义
 *
 * - CapsuleCreatedDto: 创建成功时返回（不含 content 和 opened）
 * - CapsuleDetailDto: 查询详情时返回（含 content 和 opened）
 * - CapsulePageDto: 管理员列表分页响应
 *
 * 注意：详情和列表共用 CapsuleDetailDto，
 * 但内容可见性由 Service 层的 toDetailResponse 控制，
 * 不是由 DTO 结构决定。
 */
export interface CapsuleCreatedDto {
  code: string;
  title: string;
  creator: string;
  openAt: string;
  createdAt: string;
}

export interface CapsuleDetailDto extends CapsuleCreatedDto {
  content: string | null;
  opened: boolean;
}

export interface CapsulePageDto {
  content: CapsuleDetailDto[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
