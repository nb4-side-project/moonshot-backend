import bcrypt from 'bcrypt';

import { ConflictError } from '@/shared/errors/custom-error.js';

import userRepository from './users.repository.js';

import type { RegisterUserDto } from './users.schema.js';
import type { UpdateUserInput, UserResponse, UserListResponse } from './users.types.js';

const userService = {
    /**
     * 유저 생성
     * @param userData
     */
    async createUser(userData: RegisterUserDto): Promise<UserResponse> {
        // 1. 이메일 중복 확인
        const existingUser = await userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new ConflictError('이미 존재하는 이메일입니다.');
        }

        // 2. 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        // 3. 유저 생성
        const newUser = await userRepository.create({
            ...userData,
            password: hashedPassword,
        });

        // 4. 비밀번호 제외 후 반환
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userResponse } = newUser;
        return userResponse;
    },

    /**
     * 유저 목록 조회
     * @param _page
     * @param _limit
     * @param _search
     */
    async getUsers(_page: number, _limit: number, _search?: string): Promise<UserListResponse> {
        // TODO: 구현 필요
        // 1. repository에서 유저 목록 조회
        // 2. 비밀번호 제외 처리
        // 3. total, page, limit과 함께 반환
        throw new Error('Not implemented');
    },

    /**
     * 유저 상세 조회
     * @param _id
     */
    async getUserById(_id: number): Promise<UserResponse> {
        // TODO: 구현 필요
        // 1. repository에서 유저 조회
        // 2. 유저가 없으면 NotFoundError
        // 3. 비밀번호 제외 후 반환
        throw new Error('Not implemented');
    },

    /**
     * 유저 수정
     * @param _id
     * @param _userData
     */
    async updateUser(_id: number, _userData: UpdateUserInput): Promise<UserResponse> {
        // TODO: 구현 필요
        // 1. 유저 존재 확인
        // 2. repository에서 업데이트
        // 3. 비밀번호 제외 후 반환
        throw new Error('Not implemented');
    },

    /**
     * 유저 삭제
     * @param _id
     */
    async deleteUser(_id: number): Promise<void> {
        // TODO: 구현 필요
        // 1. 유저 존재 확인
        // 2. repository에서 삭제
        throw new Error('Not implemented');
    },
};

export default userService;
