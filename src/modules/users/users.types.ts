import type { RegisterUserDto } from './users.schema.js';
import type { User } from '@prisma/client';

/** 로그인 요청 */
export interface LoginInput {
    email: string;
    password: string;
}

/** 유저 수정 요청 */
export interface UpdateUserInput {
    name?: string;
    profileImage?: string;
}

/** 유저 응답 (비밀번호 제외) */
export type UserResponse = Omit<User, 'password'>;

/** 유저 목록 응답 */
export interface UserListResponse {
    users: UserResponse[];
    total: number;
    page: number;
    limit: number;
}

/** 인증 응답 */
export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: UserResponse;
}

/** 유저 생성 데이터 */
export interface CreateUserData extends RegisterUserDto {
    provider?: string;
    providerId?: string;
}
