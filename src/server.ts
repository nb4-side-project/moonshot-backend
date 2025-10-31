import prisma from '@/configs/prisma.js';
import { PORT, NODE_ENV } from '@/shared/constants/constants.js';

import app from './app.js';

const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode`);
});

// Graceful shutdown 중복 실행 방지
let isShuttingDown = false;

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log(`\n${signal} received, shutting down gracefully...`);

    // 강제 종료 타임아웃 (10초)
    const forceExitTimer = setTimeout(() => {
        console.error('❌ Forced shutdown after timeout');
        process.exit(1);
    }, 10000);

    try {
        // Prisma 연결 종료
        await prisma.$disconnect();
        console.log('✅ Database connection closed');

        // HTTP 서버 종료
        server.close(() => {
            console.log('✅ HTTP server closed');
            clearTimeout(forceExitTimer);
            process.exit(0);
        });
    } catch (error) {
        console.error('❌ Error during shutdown:', error);
        clearTimeout(forceExitTimer);
        process.exit(1);
    }
};

// 시그널 핸들러
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Unhandled Promise Rejection 핸들러
process.on('unhandledRejection', (reason: Error | unknown) => {
    console.error('❌ Unhandled Promise Rejection:', reason);
    if (reason instanceof Error) {
        console.error('Stack:', reason.stack);
    }

    // Production 환경에서는 서버 종료
    if (NODE_ENV === 'production') {
        gracefulShutdown('UNHANDLED_REJECTION');
    }
});

// Uncaught Exception 핸들러
process.on('uncaughtException', (error: Error) => {
    console.error('❌ Uncaught Exception:', error);
    console.error('Stack:', error.stack);

    // 치명적 에러이므로 항상 서버 종료
    gracefulShutdown('UNCAUGHT_EXCEPTION');
});

export default server;
