/**
 * 기본 애플리케이션 에러 클래스
 * 모든 커스텀 에러는 이 클래스를 상속받습니다.
 */
export class AppError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public details?: unknown, // 추가 에러 상세 정보 (Zod validation 등)
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * 400 Bad Request
 * 잘못된 요청 형식, 유효성 검증 실패
 */
export class BadRequestError extends AppError {
    constructor(message: string = '잘못된 요청입니다', details?: unknown) {
        super(400, message, details);
    }
}

/**
 * 401 Unauthorized
 * 인증 실패 (로그인 필요, 토큰 만료)
 */
export class UnauthorizedError extends AppError {
    constructor(message: string = '로그인이 필요합니다') {
        super(401, message);
    }
}

/**
 * 403 Forbidden
 * 권한 부족 (인증은 됐지만 해당 리소스에 접근 불가)
 */
export class ForbiddenError extends AppError {
    constructor(message: string = '권한이 없습니다') {
        super(403, message);
    }
}

/**
 * 404 Not Found
 * 리소스를 찾을 수 없음
 */
export class NotFoundError extends AppError {
    constructor(message: string = '리소스를 찾을 수 없습니다') {
        super(404, message);
    }
}

/**
 * 409 Conflict
 * 중복된 리소스 (이메일 중복, unique constraint 위반)
 */
export class ConflictError extends AppError {
    constructor(message: string = '이미 존재하는 리소스입니다') {
        super(409, message);
    }
}

/**
 * 500 Internal Server Error
 * 서버 내부 오류 (예상하지 못한 에러)
 */
export class InternalServerError extends AppError {
    constructor(message: string = '서버 내부 오류가 발생했습니다') {
        super(500, message);
    }
}
