import { NextResponse } from 'next/server'

// 把 Route Handler 的返回格式收敛到同一对辅助函数，
// 可以让 Next 全栈实现和前后端分离实现共享同一种接口语义。
export function success<T>(data: T, message?: string, init?: ResponseInit) {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message ? { message } : {}),
    },
    init,
  )
}

export function failure(message: string, errorCode = 'REQUEST_FAILED', status = 400) {
  return NextResponse.json(
    {
      success: false,
      data: null,
      message,
      errorCode,
    },
    { status },
  )
}
