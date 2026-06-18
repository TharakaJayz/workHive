import { Request, Response, NextFunction } from 'express'
import { z, type ZodType } from 'zod'
import { AppError } from '../lib/AppError'

export const dataValidator =
  (schema: ZodType) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      const errors = z.flattenError(result.error).fieldErrors
      console.warn("[validate.middleware ❌] error",errors)
      return next(
        new AppError(400, 'VALIDATION_ERROR', JSON.stringify(errors))
      )
    }

    req.body = result.data
    next()
  }