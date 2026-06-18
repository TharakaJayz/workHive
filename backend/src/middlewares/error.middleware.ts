import { Request, Response, NextFunction } from 'express'
import { AppError } from '../lib/AppError'

 
export const errorHandler = (
  err:  Error,
  _req: Request,
  res:  Response,
  _next: NextFunction 
): void => {
  
  if (err instanceof AppError) {
    console.warn('[error.middleware ❌]  error', err.message)
    res.status(err.statusCode).json({
      success: false,
      error: {
        code:    err.code,
        message: err.message,
      },
    })
    return
  }

 
  console.warn('[error.middleware ❌] unknown error', err)

  res.status(500).json({
    success: false,
    error: {
      code:    'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong. Please try again later.',
    },
  })
}