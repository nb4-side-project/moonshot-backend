import { z } from 'zod';

const envSchema = z.object({
    ACCESS_TOKEN_SECRET: z.string().min(1, 'ACCESS_TOKEN_SECRET must be set'),
    REFRESH_TOKEN_SECRET: z.string().min(1, 'REFRESH_TOKEN_SECRET must be set'),

    // JWT Expirations (기본값 제공)
    ACCESS_TOKEN_EXPIRES_IN: z.string().default('15m'),
    REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
});

// process.env를 스키마로 검증
const envParsed = envSchema.safeParse(process.env);

// 검증 실패 시 앱 시작 방지
if (!envParsed.success) {
    console.error('❌ Invalid environment variables:', envParsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables. Check .env file.');
}

// 검증된 환경 변수 객체를 내보냅니다.
export const envConfig = envParsed.data;
