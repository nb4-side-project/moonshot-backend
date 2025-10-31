import prisma from '@/configs/prisma.js';

import type { RegisterUserDto } from './users.schema.js';
import type { UpdateUserInput } from './users.types.js';

const userRepository = {
    /**
     * 이메일로 유저 조회
     * @param email
     */
    async findByEmail(email: string) {
        return await prisma.user.findUnique({
            where: { email },
        });
    },

    /**
     * 유저 생성
     * @param userData
     */
    async create(userData: RegisterUserDto & { provider?: string }) {
        return await prisma.user.create({
            data: {
                email: userData.email,
                password: userData.password,
                name: userData.name,
                provider: userData.provider ?? 'local',
            },
        });
    },

    /**
     * ID로 유저 조회
     * @param id
     */
    async findById(id: number) {
        return await prisma.user.findUnique({
            where: { id },
        });
    },

    /**
     * 유저 목록 조회 (페이지네이션)
     * @param _page
     * @param _limit
     * @param _search
     */
    async findAll(_page: number, _limit: number, _search?: string) {
        // TODO: 구현 필요
        // 1. search 파라미터가 있으면 name 또는 email로 검색
        // 2. 페이지네이션 적용
        // 3. total count와 함께 반환
        throw new Error('Not implemented');
    },

    /**
     * 유저 수정
     * @param _id
     * @param _userData
     */
    async update(_id: number, _userData: UpdateUserInput) {
        // TODO: 구현 필요
        // Prisma update 사용
        throw new Error('Not implemented');
    },

    /**
     * 유저 삭제
     * @param _id
     */
    async delete(_id: number) {
        // TODO: 구현 필요
        // Prisma delete 사용
        throw new Error('Not implemented');
    },

    /**
     * 총 유저 수 조회
     * @param _search
     */
    async count(_search?: string) {
        // TODO: 구현 필요
        // search 파라미터 있으면 검색 조건 적용
        throw new Error('Not implemented');
    },
};

export default userRepository;
