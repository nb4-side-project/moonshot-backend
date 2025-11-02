import { z } from 'zod';

export const createProjectSchema = z.object({
    name: z
        .string()
        .min(1, '프로젝트이름은 최소 1자 이상이어야 합니다.')
        .max(10, '프로젝트이름은 최대 10자까지 가능합니다.'),
    description: z
        .string()
        .min(1, '프로젝트설명은 최소 1자 이상이어야 합니다.')
        .max(40, '프로젝트설명은 최대 40자까지 가능합니다.'),
});
// /** 프로젝트 생성 DTO */
export type CreateProjectDto = z.infer<typeof createProjectSchema>;

// /** 회원가입 스키마 */
// export const registerUserSchema = z.object({
//     email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
//     password: z
//         .string()
//         .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
//         .max(20, '비밀번호는 최대 20자까지 가능합니다.'),
//     name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다.'),
// });

// /** 회원가입 DTO */
// export type RegisterUserDto = z.infer<typeof registerUserSchema>;
