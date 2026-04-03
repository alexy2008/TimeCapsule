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
