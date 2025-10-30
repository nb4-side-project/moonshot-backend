import type { Request, Response, NextFunction } from 'express';

/**
 * 404 Not Found 핸들러
 *
 * 정의되지 않은 라우트에 대한 요청을 처리합니다.
 * 이 미들웨어는 모든 라우트 정의 후, errorHandler 전에 등록되어야 합니다.
 */
export function notFoundHandler(req: Request, res: Response, _next: NextFunction) {
    res.status(404).json({
        message: '요청한 리소스를 찾을 수 없습니다.',
        path: req.originalUrl,
        method: req.method,
    });
}
