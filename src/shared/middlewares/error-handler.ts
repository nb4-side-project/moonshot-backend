import type { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { NODE_ENV } from '@/shared/constants/constants.js';
import { AppError, BadRequestError } from '@/shared/errors/custom-error.js';

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
    // 에러 로깅 (개발/프로덕션 환경별)
    console.error('[ERROR] Global Error Handler');
    console.error('[ERROR] Name:', err.name);
    console.error('[ERROR] Message:', err.message);
    console.error('[ERROR] Request:', {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('user-agent'),
    });

    if (NODE_ENV === 'development') {
        console.error('[ERROR] Stack:', err.stack);
    }

    // 1️⃣ Zod 유효성 검증 에러
    if (err instanceof ZodError) {
        const errorDetails = err.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
        }));

        const validationError = new BadRequestError('유효성 검증에 실패했습니다.', errorDetails);

        return res.status(validationError.statusCode).json({
            message: validationError.message,
            details: validationError.details,
        });
    }

    // 2️⃣ Prisma 유효성 검증 에러
    if (err instanceof Prisma.PrismaClientValidationError) {
        return res.status(400).json({
            message: '데이터베이스 쿼리가 유효하지 않습니다.',
        });
    }

    // 3️⃣ Prisma Known Request 에러 (P2002, P2025 등)
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        console.error('[ERROR] Prisma error code:', err.code);
        console.error('[ERROR] Prisma meta:', err.meta);

        switch (err.code) {
            case 'P2002': {
                // Unique constraint 위반
                const target = err.meta?.['target'];
                const field = Array.isArray(target) ? target[0] : '데이터';
                return res.status(409).json({
                    message: `${field} 값이 이미 존재합니다.`,
                });
            }
            case 'P2025':
                // Record not found
                return res.status(404).json({
                    message: '요청한 데이터를 찾을 수 없습니다.',
                });
            case 'P2003':
                // Foreign key constraint 위반
                return res.status(400).json({
                    message: '연결된 데이터를 찾을 수 없습니다.',
                });
            default:
                return res.status(500).json({
                    message: '데이터베이스 오류가 발생했습니다.',
                });
        }
    }

    // 4️⃣ 비즈니스 로직 에러 (AppError 및 하위 클래스)
    if (err instanceof AppError) {
        const appErrorResponse: { message: string; details?: unknown } = {
            message: err.message,
        };

        if (err.details) {
            appErrorResponse.details = err.details;
        }

        return res.status(err.statusCode).json(appErrorResponse);
    }

    // 5️⃣ 예상하지 못한 에러 (500 Internal Server Error)
    console.error('[ERROR] Unhandled error:', err);

    const responseBody: { message: string; error?: string; stack?: string | undefined } = {
        message: '서버 내부 오류가 발생했습니다.',
    };

    if (NODE_ENV === 'development') {
        responseBody.error = err.message;
        responseBody.stack = err.stack;
    }

    return res.status(500).json(responseBody);
}
