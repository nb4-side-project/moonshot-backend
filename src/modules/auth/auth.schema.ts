import { z } from 'zod';

// 회원가입 요청 Body DTO
export const registerInputSchema = z.object({
    email: z.string().email('유효한 이메일 형식이 아닙니다.'),
    password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다.'),
    name: z.string().min(1, '이름은 최소 1자 이상이어야 합니다.'),
    profileImage: z.string().url('프로필 이미지는 유효한 URL이어야 합니다.').optional(),
});

export type RegisterInputDto = z.infer<typeof registerInputSchema>;

// Service 계층이 Repository에 전달할 데이터 구조
export type CreateUserDto = Omit<RegisterInputDto, 'password'> & {
    hashedPassword: string;
};
