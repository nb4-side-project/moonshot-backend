import { z } from 'zod';

/** 회원가입 스키마 */
export const registerUserSchema = z.object({
    email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
    password: z
        .string()
        .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
        .max(20, '비밀번호는 최대 20자까지 가능합니다.'),
    name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다.'),
});

/** 회원가입 DTO */
export type RegisterUserDto = z.infer<typeof registerUserSchema>;

/** 유저 수정 스키마 */
export const updateUserSchema = z.object({
    name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다.').optional(),
    profileImage: z.string().url('유효한 URL을 입력해주세요.').optional(),
});

/** 유저 수정 DTO */
export type UpdateUserDto = z.infer<typeof updateUserSchema>;

/** 유저 ID Params 스키마 */
export const userIdParamsSchema = z.object({
    id: z.coerce.number().int('ID는 정수여야 합니다.').positive('ID는 양수여야 합니다.'),
});

/** 유저 ID Params DTO */
export type UserIdParamsDto = z.infer<typeof userIdParamsSchema>;

/** 유저 목록 Query 스키마 */
export const listUsersQuerySchema = z.object({
    page: z.coerce.number().int('페이지는 정수여야 합니다.').positive('페이지는 양수여야 합니다.').default(1),
    limit: z.coerce
        .number()
        .int('리미트는 정수여야 합니다.')
        .positive('리미트는 양수여야 합니다.')
        .max(100, '리미트는 최대 100까지 가능합니다.')
        .default(10),
    search: z.string().optional(),
});

/** 유저 목록 Query DTO */
export type ListUsersQueryDto = z.infer<typeof listUsersQuerySchema>;
