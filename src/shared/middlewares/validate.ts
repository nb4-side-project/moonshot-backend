import type { Request, Response, NextFunction } from 'express';
import type { ZodObject, ZodRawShape } from 'zod';

/**
 * Zod 스키마를 사용하여 요청 데이터를 검증하는 미들웨어
 *
 * @param schema - Zod 스키마 객체
 * @param part - 검증할 요청 부분 ('body' | 'query' | 'params')
 *
 * @example
 * router.post('/users', validate(createUserSchema, 'body'), userController.create);
 */
const validate = <T extends ZodRawShape>(schema: ZodObject<T>, part: 'body' | 'query' | 'params') => {
    return (req: Request, _res: Response, next: NextFunction) => {
        try {
            const validatedData = schema.parse(req[part]);

            // query와 params는 읽기 전용이므로 defineProperty 사용
            if (part === 'query' || part === 'params') {
                Object.defineProperty(req, part, {
                    value: validatedData,
                    writable: true,
                    enumerable: true,
                    configurable: true,
                });
            } else {
                // body는 직접 할당 가능
                req[part] = validatedData;
            }

            next();
        } catch (error) {
            // ZodError는 error-handler.ts에서 처리됨
            next(error);
        }
    };
};

export default validate;
