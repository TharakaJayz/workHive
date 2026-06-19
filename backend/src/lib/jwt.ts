import "dotenv/config";
import jwt from 'jsonwebtoken'
import { AppError } from './AppError'


const SECRET = process.env.JWT_SECRET!;

export interface JwtPayload {
  userId: number
  role: string
}

export const signToken = (payload: JwtPayload): string =>
  jwt.sign(payload, SECRET, { expiresIn: '7d' })


export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, SECRET) as JwtPayload
  } catch {
    throw new AppError(401, 'INVALID_TOKEN', 'Token is invalid or expired')
  }
}