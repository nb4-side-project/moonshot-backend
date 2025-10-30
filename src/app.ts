import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { CORS_ORIGINS, NODE_ENV } from '@/shared/constants/constants.js';
import { errorHandler } from '@/shared/middlewares/error-handler.js';
import { notFoundHandler } from '@/shared/middlewares/not-found-handler.js';

const app = express();

// 보안 미들웨어
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
            },
        },
        crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
);

// Rate Limiting (DDoS, Brute-force 방지)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15분
    max: 100, // IP당 최대 100 요청
    message: '너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요.',
});
app.use('/api/', limiter); // /api 경로에만 적용

// 로깅 미들웨어
if (NODE_ENV === 'development') {
    app.use(morgan('dev')); // 개발: 상세 로그
} else {
    app.use(morgan('combined')); // 프로덕션: 표준 Apache 로그
}

// CORS (프론트엔드 요청 허용)
app.use(
    cors({
        origin: CORS_ORIGINS, // 환경 변수에서 허용 도메인 로드
        credentials: true, // httpOnly 쿠키 허용
    }),
);

// 바디 파싱
app.use(express.json({ limit: '10mb' })); // JSON 요청 파싱 (파일 업로드 대비)
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // URL-encoded 요청 파싱
app.use(cookieParser()); // 쿠키 파싱

// 성능 최적화
app.use(compression()); // gzip 압축

// 헬스 체크
app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// 정적 파일 제공 (개발 환경에서만)
if (NODE_ENV === 'development') {
    app.use('/uploads', express.static('uploads'));
    console.log('📁 Static file serving enabled at /uploads');
}

// 라우트 등록 (추후 추가)
// app.use('/auth', authRoutes);
// app.use('/users', usersRoutes);
// app.use('/projects', projectsRoutes);

// 404 핸들러 (정의되지 않은 라우트)
app.use(notFoundHandler);

// 에러 핸들러 (마지막)
app.use(errorHandler);

export default app;
