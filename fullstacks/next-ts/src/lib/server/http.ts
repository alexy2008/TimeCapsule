import { NextResponse } from 'next/server'

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
