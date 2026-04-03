export interface ApiResponseDto<T> {
  success: boolean;
  data: T | null;
  message: string | null;
  errorCode: string | null;
}

export function ok<T>(data: T, message: string | null = null): ApiResponseDto<T> {
  return {
    success: true,
    data,
    message,
    errorCode: null,
  };
}

export function error(message: string, errorCode: string): ApiResponseDto<null> {
  return {
    success: false,
    data: null,
    message,
    errorCode,
  };
}
