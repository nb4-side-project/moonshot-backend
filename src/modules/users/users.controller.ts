import userService from './users.service.js';

import type { RegisterUserDto } from './users.schema.js';
import type { Request, Response } from 'express';

const userController = {
    /**
     * 회원가입
     * @param req
     * @param res
     */
    async register(req: Request, res: Response): Promise<void> {
        const userData = req.body as RegisterUserDto;

        const newUser = await userService.createUser(userData);

        res.status(201).json({
            message: '회원가입이 완료되었습니다.',
            data: { userId: newUser.id },
        });
    },

    /**
     * 유저 목록 조회
     * @param _req
     * @param _res
     */
    async getAll(_req: Request, _res: Response): Promise<void> {
        // TODO: 구현 필요
        // 1. query에서 page, limit, search 가져오기
        // 2. service 호출
        // 3. 200 OK 응답
        throw new Error('Not implemented');
    },

    /**
     * 유저 상세 조회
     * @param _req
     * @param _res
     */
    async getById(_req: Request, _res: Response): Promise<void> {
        // TODO: 구현 필요
        // 1. params에서 id 가져오기
        // 2. service 호출
        // 3. 200 OK 응답
        throw new Error('Not implemented');
    },

    /**
     * 유저 수정
     * @param _req
     * @param _res
     */
    async update(_req: Request, _res: Response): Promise<void> {
        // TODO: 구현 필요
        // 1. params에서 id, body에서 수정 데이터 가져오기
        // 2. service 호출
        // 3. 200 OK 응답
        throw new Error('Not implemented');
    },

    /**
     * 유저 삭제
     * @param _req
     * @param _res
     */
    async delete(_req: Request, _res: Response): Promise<void> {
        // TODO: 구현 필요
        // 1. params에서 id 가져오기
        // 2. service 호출
        // 3. 204 No Content 응답
        throw new Error('Not implemented');
    },
};

export default userController;
