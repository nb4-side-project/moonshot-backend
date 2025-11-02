import { Router } from 'express';

import validate from '@/shared/middlewares/validate.js';
import asyncHandler from '@/shared/utils/async-handler.js';

import projectController from './projects.controller.js';
import { createProjectSchema } from './projects.schema.js';

const router = Router();

/** 프로젝트 생성 */
router.post('/', validate(createProjectSchema, 'body'), asyncHandler(projectController.create));

// /** 프로젝트 목록 조회 */
// router.get(
//   '/',
//   validate(listProjectsQuerySchema, 'query'),
//   asyncHandler(projectController.getAll),
// );

// /** 프로젝트 상세 조회 */
// router.get(
//   '/:projectId',
//   validate(projectIdParamsSchema, 'params'),
//   asyncHandler(projectController.getById),
// );

// /** 프로젝트 수정 */
// router.patch(
//   '/:projectId',
//   validate(projectIdParamsSchema, 'params'),
//   validate(updateProjectSchema, 'body'),
//   asyncHandler(projectController.update),
// );

// /** 프로젝트 삭제 */
// router.delete(
//   '/:projectId',
//   validate(projectIdParamsSchema, 'params'),
//   asyncHandler(projectController.delete),
// );

export default router;
