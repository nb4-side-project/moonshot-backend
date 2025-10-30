import type { Request, Response, NextFunction } from 'express';
import type { AsyncRequestHandler } from '@/types/express.js';

/**
 * async 함수를 Express 미들웨어로 변환하는 헬퍼
 *
 * 에러가 발생하면 자동으로 error-handler로 전달합니다.
 *
 * @example
 * // 컨트롤러 파일
 * export const getUser = async (req, res) => {
 *   const user = await prisma.user.findUnique({ ... });
 *   res.json(user);
 * };
 *
 * // 라우터 파일
 * router.get('/:id', asyncHandler(getUser));
 */
export default function asyncHandler(handler: AsyncRequestHandler) {
    return function (req: Request, res: Response, next: NextFunction) {
        Promise.resolve(handler(req, res, next)).catch(next);
    };
}
