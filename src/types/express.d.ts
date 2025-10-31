import type { AuthUser } from './auth-user.js';
import type { Request, Response, NextFunction } from 'express';

// Express Request 타입 전역 확장
declare global {
    namespace Express {
        interface Request {
            /** 인증된 사용자 정보 (authenticate 미들웨어에서 설정) */
            user?: AuthUser;
        }
    }
}

/**
 * 비동기 요청 핸들러 타입 (일반)
 *
 * async/await를 사용하는 컨트롤러 함수의 타입입니다.
 * 공개 엔드포인트(회원가입, 로그인 등)에서 사용합니다.
 *
 * @example
 * export const signup: AsyncRequestHandler = async (req, res, next) => {
 *   const { email, password } = req.body;
 *   // req.user는 undefined 가능
 * };
 */
export type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

/**
 * 인증된 사용자 정보를 포함하는 Request 타입
 *
 * authenticate 미들웨어를 거친 후 사용합니다.
 * req.user가 항상 존재함을 타입으로 보장합니다.
 */
export interface AuthRequest extends Request {
    user: AuthUser;
}

/**
 * 비동기 요청 핸들러 타입 (인증 필요)
 *
 * 인증이 필요한 엔드포인트에서 사용합니다.
 * req.user가 타입 레벨에서 보장됩니다.
 *
 * @example
 * export const getMe: AsyncAuthRequestHandler = async (req, res, next) => {
 *   const userId = req.user.id;  // ✅ 타입 안전
 * };
 */
export type AsyncAuthRequestHandler = (req: AuthRequest, res: Response, next: NextFunction) => Promise<void> | void;
