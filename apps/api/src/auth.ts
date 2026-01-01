import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { AuthContext, UserRole } from '@citizen-services/shared';
import { query } from './database';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-prototype';

export interface AuthenticatedRequest extends Request {
  auth?: AuthContext;
}

export function generateToken(userID: string, role: UserRole): string {
  return jwt.sign({ userID, role }, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): AuthContext {
  const decoded = jwt.verify(token, JWT_SECRET) as any;
  return {
    userID: decoded.userID,
    role: decoded.role,
  };
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.substring(7);
  
  try {
    const auth = verifyToken(token);
    req.auth = auth;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export async function loginUser(email: string, password: string) {
  const result = await query(
    'SELECT id, role, name, password_hash FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error('User not found');
  }

  const user = result.rows[0];
  const passwordValid = await comparePassword(password, user.password_hash);

  if (!passwordValid) {
    throw new Error('Invalid password');
  }

  const token = generateToken(user.id, user.role);

  return {
    token,
    user: {
      id: user.id,
      role: user.role,
      name: user.name,
    },
  };
}