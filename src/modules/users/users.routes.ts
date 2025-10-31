import { Router } from 'express';

import validate from '@/shared/middlewares/validate.js';
import asyncHandler from '@/shared/utils/async-handler.js';

import userController from './users.controller.js';
import { registerUserSchema, updateUserSchema, userIdParamsSchema, listUsersQuerySchema } from './users.schema.js';

const router = Router();

/** 회원가입 */
router.post('/register', validate(registerUserSchema, 'body'), asyncHandler(userController.register));

/** 유저 목록 조회 (관리자) */
router.get('/', validate(listUsersQuerySchema, 'query'), asyncHandler(userController.getAll));

/** 유저 상세 조회 */
router.get('/:id', validate(userIdParamsSchema, 'params'), asyncHandler(userController.getById));

/** 유저 수정 */
router.patch(
    '/:id',
    validate(userIdParamsSchema, 'params'),
    validate(updateUserSchema, 'body'),
    asyncHandler(userController.update),
);

/** 유저 삭제 */
router.delete('/:id', validate(userIdParamsSchema, 'params'), asyncHandler(userController.delete));

export default router;
