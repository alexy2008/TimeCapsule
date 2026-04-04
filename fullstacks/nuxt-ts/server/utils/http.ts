import { setResponseStatus, type H3Event } from 'h3'

export function success<T>(data: T, message?: string) {
  return {
    success: true,
    data,
    ...(message ? { message } : {}),
  }
}

export function failure(event: H3Event, status: number, message: string, errorCode = 'REQUEST_FAILED') {
  setResponseStatus(event, status)
  return {
    success: false,
    data: null,
    message,
    errorCode,
  }
}
