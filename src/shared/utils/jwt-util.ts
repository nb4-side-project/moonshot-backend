import jwt, { TokenExpiredError } from 'jsonwebtoken';

import { envConfig } from '../../configs/env.config.js'; // 검증된 환경 설정 import
import { AuthUser } from '../../types/auth-user.js'; // AuthUser 타입 import
import { UnauthorizedError } from '../errors/custom-error.js';

// DB 저장을 위한 만료 시간 계산에 사용되는 상수
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

// Access Token 생성 (단기 유효)
export function generateAccessToken(user: AuthUser): string {
    return jwt.sign(user, envConfig.ACCESS_TOKEN_SECRET, { expiresIn: envConfig.ACCESS_TOKEN_EXPIRES_IN });
}

// Refresh Token 생성 (장기 유효)
export function generateRefreshToken(userId: number): string {
    return jwt.sign({ userId }, envConfig.REFRESH_TOKEN_SECRET, { expiresIn: envConfig.REFRESH_TOKEN_EXPIRES_IN });
}

// Refresh Token의 만료 기간 (밀리초)를 계산하여 반환
export function getRefreshTokenExpirationMs(): number {
    return REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
}

//Access Token 검증
export function verifyAccessToken(token: string): AuthUser {
    try {
        const decoded = jwt.verify(token, envConfig.ACCESS_TOKEN_SECRET) as AuthUser;

        if (!decoded.id || !decoded.email) {
            throw new UnauthorizedError('유효하지 않은 토큰 형식입니다.');
        }
        return decoded;
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            throw new UnauthorizedError('액세스 토큰이 만료되었습니다.');
        }
        throw new UnauthorizedError('유효하지 않은 액세스 토큰입니다.');
    }
}

//Refresh Token 검증
export function verifyRefreshToken(token: string): { userId: number } {
    try {
        const decoded = jwt.verify(token, envConfig.REFRESH_TOKEN_SECRET) as { userId: number };
        if (!decoded.userId) {
            throw new UnauthorizedError('유효하지 않은 리프레시 토큰 형식입니다.');
        }
        return decoded;
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            throw new UnauthorizedError('리프레시 토큰이 만료되었습니다.');
        }
        throw new UnauthorizedError('유효하지 않은 리프레시 토큰입니다.');
    }
}
