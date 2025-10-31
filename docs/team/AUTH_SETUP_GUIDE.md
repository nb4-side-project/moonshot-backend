# 인증/인가 설정 가이드 (Authentication & Authorization Setup)

> 팀 프로젝트 분배 전 필독 문서
>
> 작성일: 2025-10-30

---

## 목차

1. [개요](#개요)
2. [타입 정의 이해하기](#타입-정의-이해하기)
3. [인증 미들웨어 구현 가이드](#인증-미들웨어-구현-가이드)
4. [컨트롤러 작성 패턴](#컨트롤러-작성-패턴)
5. [라우트 설정 패턴](#라우트-설정-패턴)
6. [권한 검증 미들웨어](#권한-검증-미들웨어)
7. [실전 예제](#실전-예제)
8. [자주 하는 실수](#자주-하는-실수)

---

## 개요

### 왜 이 문서를 읽어야 하나요?

팀원들이 각자 다른 방식으로 인증을 처리하면:

- ❌ `req.user`가 undefined일 수 있는데 체크하지 않아 런타임 에러 발생
- ❌ 타입 안전성 상실로 버그 발생 가능성 증가
- ❌ 코드 리뷰 시 혼란
- ❌ 유지보수 어려움

이 문서는 **모든 팀원이 동일한 방식으로 인증을 처리**하도록 통일된 패턴을 제공합니다.

### 핵심 원칙

1. **타입 안전성**: `req.user`를 사용할 때 undefined 체크 없이 안전하게 접근
2. **명확한 구분**: 인증 필요/불필요한 엔드포인트를 타입 레벨에서 구분
3. **일관된 패턴**: 모든 팀원이 동일한 방식으로 컨트롤러 작성

---

## 타입 정의 이해하기

### AuthUser 인터페이스

**위치**: `src/types/auth-user.ts`

```typescript
export interface AuthUser {
    id: number; // 사용자 ID (DB Primary Key)
    email: string; // 사용자 이메일
}
```

**용도**:

- JWT 토큰 페이로드에서 추출된 사용자 정보
- 최소한의 정보만 포함 (성능 최적화)
- 추가 정보 필요 시 DB 조회

### Express 타입 확장

**위치**: `src/types/express.ts`

#### 1. 전역 타입 확장

```typescript
declare global {
    namespace Express {
        interface Request {
            user?: AuthUser; // 인증 미들웨어가 설정하는 속성
        }
    }
}
```

**의미**:

- 모든 Express `Request` 객체에 `user` 속성 추가
- `?` 옵셔널이므로 undefined 가능 (인증 안된 요청)

#### 2. AsyncRequestHandler (공개 엔드포인트용)

```typescript
export type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;
```

**사용 시기**:

- 회원가입 (`POST /auth/signup`)
- 로그인 (`POST /auth/login`)
- 공개 API

**특징**:

- `req.user`는 `AuthUser | undefined` 타입
- 사용 전 undefined 체크 필요

#### 3. AuthRequest + AsyncAuthRequestHandler (인증 필요 엔드포인트용)

```typescript
export interface AuthRequest extends Request {
    user: AuthUser; // ✅ 옵셔널이 아님 (항상 존재 보장)
}

export type AsyncAuthRequestHandler = (req: AuthRequest, res: Response, next: NextFunction) => Promise<void> | void;
```

**사용 시기**:

- 로그아웃 (`POST /auth/logout`)
- 내 정보 조회 (`GET /users/me`)
- 프로젝트 CRUD (모든 프로젝트 API)
- 할 일 CRUD (모든 할 일 API)

**특징**:

- `req.user`는 `AuthUser` 타입 (undefined 불가능)
- 타입스크립트가 자동으로 타입 체크
- undefined 체크 불필요 (미들웨어에서 보장)

---

## 인증 미들웨어 구현 가이드

### 인증 미들웨어 기본 구조

**위치**: `src/shared/middlewares/auth.middleware.ts` (구현 필요)

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/custom-error.js';
import { AuthUser } from '../../types/auth-user.js';
import { ACCESS_TOKEN_SECRET } from '../constants/constants.js';

/**
 * JWT 인증 미들웨어
 *
 * Authorization 헤더의 Bearer 토큰을 검증하고 req.user를 설정합니다.
 *
 * @throws {UnauthorizedError} 토큰이 없거나 유효하지 않은 경우
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
    try {
        // 1. Authorization 헤더에서 Bearer 토큰 추출
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError('로그인이 필요합니다.');
        }

        const accessToken = authHeader.split(' ')[1];

        if (!accessToken) {
            throw new UnauthorizedError('로그인이 필요합니다.');
        }

        // 2. JWT 검증 및 디코딩
        const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as AuthUser;

        // 3. req.user에 사용자 정보 설정
        req.user = {
            id: decoded.id,
            email: decoded.email,
        };

        // 4. 다음 미들웨어로 전달
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            next(new UnauthorizedError('유효하지 않은 토큰입니다.'));
        } else if (error instanceof jwt.TokenExpiredError) {
            next(new UnauthorizedError('토큰이 만료되었습니다.'));
        } else {
            next(error);
        }
    }
}
```

### 인증 미들웨어 핵심 포인트

1. **Authorization 헤더에서 토큰 추출**: Bearer 스킴 사용 (`Authorization: Bearer <token>`)
2. **프론트엔드 토큰 관리**: httpOnly 쿠키에 저장 → Axios 인터셉터에서 자동으로 헤더 추가
3. **JWT 검증**: `jwt.verify()`로 서명 확인 및 만료 체크
4. **req.user 설정**: 검증 성공 시 사용자 정보 저장
5. **에러 처리**: 실패 시 `UnauthorizedError` 발생

> **참고**: 프론트엔드(Next.js)가 httpOnly 쿠키로 토큰을 저장하고, Axios 인터셉터가 자동으로 Authorization 헤더를 추가합니다. 백엔드는 헤더에서만 토큰을 추출합니다.

### JWT 유틸리티 함수 (선택 사항)

**위치**: `src/shared/utils/jwt.util.ts`

```typescript
import jwt from 'jsonwebtoken';
import { AuthUser } from '../../types/auth-user.js';
import {
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN,
} from '../constants/constants.js';

/**
 * Access Token 생성
 */
export function generateAccessToken(user: AuthUser): string {
    return jwt.sign(user, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN, // "15m"
    });
}

/**
 * Refresh Token 생성
 */
export function generateRefreshToken(userId: number): string {
    return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN, // "7d"
    });
}

/**
 * Access Token 검증 및 디코딩
 */
export function verifyAccessToken(token: string): AuthUser {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as AuthUser;
}

/**
 * Refresh Token 검증 및 디코딩
 */
export function verifyRefreshToken(token: string): { userId: number } {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as { userId: number };
}
```

### Refresh Token 관리 (DB 저장 방식)

이 프로젝트는 **Stateful Refresh Token** 방식을 사용합니다.

**왜 DB에 저장하나요?**

- ✅ **토큰 무효화 가능**: 로그아웃 시 즉시 토큰 삭제
- ✅ **강제 로그아웃**: 관리자가 특정 사용자 로그아웃 가능
- ✅ **보안 강화**: 토큰 탈취 시 해당 토큰만 삭제하여 피해 최소화
- ✅ **여러 기기 지원**: 사용자가 여러 기기에서 동시 로그인 가능

#### 로그인 시 Refresh Token 저장

```typescript
// src/modules/auth/auth.service.ts
import prisma from '@/configs/prisma.js';

export async function login(email: string, password: string) {
    // 1. 사용자 인증
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await verifyPassword(password, user.password))) {
        throw new UnauthorizedError('이메일 또는 비밀번호가 일치하지 않습니다.');
    }

    // 2. Access Token 생성
    const accessToken = generateAccessToken({ id: user.id, email: user.email });

    // 3. Refresh Token 생성
    const refreshToken = generateRefreshToken(user.id);

    // 4. Refresh Token을 DB에 저장
    await prisma.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일 후
        },
    });

    // 5. 클라이언트에 토큰 반환
    return { accessToken, refreshToken };
}
```

#### 토큰 갱신 시 검증 및 회전

```typescript
// src/modules/auth/auth.controller.ts
export const refresh: AsyncAuthRequestHandler = async (req, res) => {
    // 1. Authorization 헤더에서 Refresh Token 추출
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('Refresh Token이 필요합니다.');
    }

    const refreshToken = authHeader.split(' ')[1];

    // 2. JWT 검증
    let decoded: { userId: number };
    try {
        decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
        throw new UnauthorizedError('유효하지 않은 토큰입니다.');
    }

    // 3. DB에서 Refresh Token 존재 여부 확인 (중요!)
    const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
    });

    if (!storedToken) {
        throw new UnauthorizedError('유효하지 않은 토큰입니다.');
    }

    // 4. 만료 여부 확인
    if (storedToken.expiresAt < new Date()) {
        await prisma.refreshToken.delete({ where: { id: storedToken.id } });
        throw new UnauthorizedError('토큰이 만료되었습니다.');
    }

    // 5. 새로운 토큰 발급
    const newAccessToken = generateAccessToken({
        id: storedToken.user.id,
        email: storedToken.user.email,
    });
    const newRefreshToken = generateRefreshToken(storedToken.user.id);

    // 6. Refresh Token 회전 (Rotation): 기존 삭제 후 새 토큰 저장
    await prisma.$transaction([
        prisma.refreshToken.delete({ where: { id: storedToken.id } }),
        prisma.refreshToken.create({
            data: {
                token: newRefreshToken,
                userId: storedToken.user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        }),
    ]);

    // 7. 새 토큰 반환
    res.json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    });
};
```

#### 로그아웃 시 Refresh Token 삭제

```typescript
// 현재 기기만 로그아웃
export const logout: AsyncAuthRequestHandler = async (req, res) => {
    const authHeader = req.headers.authorization;
    const refreshToken = authHeader?.split(' ')[1];

    if (refreshToken) {
        await prisma.refreshToken.delete({
            where: { token: refreshToken },
        });
    }

    res.json({ message: '로그아웃되었습니다.' });
};

// 모든 기기에서 로그아웃
export const logoutAll: AsyncAuthRequestHandler = async (req, res) => {
    const userId = req.user.id;

    await prisma.refreshToken.deleteMany({
        where: { userId },
    });

    res.json({ message: '모든 기기에서 로그아웃되었습니다.' });
};
```

#### 만료된 토큰 정리 (선택 사항)

```typescript
// src/shared/utils/token-cleanup.ts
export async function cleanupExpiredTokens() {
    const result = await prisma.refreshToken.deleteMany({
        where: {
            expiresAt: {
                lt: new Date(), // less than 현재 시간
            },
        },
    });

    console.log(`✅ Cleaned up ${result.count} expired refresh tokens`);
    return result.count;
}

// Cron Job으로 주기적 실행 (선택)
import cron from 'node-cron';

cron.schedule('0 0 * * *', async () => {
    console.log('🔄 Running token cleanup job...');
    await cleanupExpiredTokens();
});
```

---

## 컨트롤러 작성 패턴

### 패턴 1: 공개 엔드포인트 (인증 불필요)

```typescript
import type { AsyncRequestHandler } from '../../types/express.js';

/**
 * 회원가입
 *
 * @route POST /auth/signup
 * @access Public
 */
export const signup: AsyncRequestHandler = async (req, res) => {
    const { email, password, name } = req.body;

    // req.user는 undefined 가능 (인증 안된 요청)
    // req.user를 사용하지 않음

    const user = await authService.signup({ email, password, name });

    res.status(201).json({
        message: '회원가입 성공',
        data: { user },
    });
};
```

**핵심**:

- `AsyncRequestHandler` 타입 사용
- `req.user` 접근 안 함 (undefined일 수 있음)

### 패턴 2: 인증 필요 엔드포인트

```typescript
import type { AsyncAuthRequestHandler } from '../../types/express.js';

/**
 * 내 정보 조회
 *
 * @route GET /users/me
 * @access Private
 */
export const getMe: AsyncAuthRequestHandler = async (req, res) => {
    // ✅ req.user는 항상 존재 (타입스크립트가 보장)
    const userId = req.user.id; // ✅ 타입 안전
    const email = req.user.email; // ✅ 타입 안전

    const user = await userService.findById(userId);

    res.json({
        message: '내 정보 조회 성공',
        data: { user },
    });
};
```

**핵심**:

- `AsyncAuthRequestHandler` 타입 사용
- `req.user` 바로 접근 가능 (undefined 체크 불필요)
- 타입스크립트가 자동으로 타입 체크

### 패턴 3: 프로젝트 소유자 확인

```typescript
import type { AsyncAuthRequestHandler } from '../../types/express.js';
import { ForbiddenError, NotFoundError } from '../../shared/errors/custom-error.js';

/**
 * 프로젝트 삭제
 *
 * @route DELETE /projects/:projectId
 * @access Private (프로젝트 소유자만 가능)
 */
export const deleteProject: AsyncAuthRequestHandler = async (req, res) => {
    const projectId = parseInt(req.params.projectId!);
    const userId = req.user.id; // ✅ 타입 안전

    // 1. 프로젝트 존재 여부 확인
    const project = await projectService.findById(projectId);
    if (!project) {
        throw new NotFoundError('프로젝트를 찾을 수 없습니다.');
    }

    // 2. 소유자 확인
    if (project.ownerId !== userId) {
        throw new ForbiddenError('프로젝트를 삭제할 권한이 없습니다.');
    }

    // 3. 삭제 실행
    await projectService.delete(projectId);

    res.status(204).send();
};
```

**핵심**:

- 권한 확인 로직을 컨트롤러 내부에 작성
- 또는 별도의 권한 검증 미들웨어 사용 (다음 섹션)

---

## 라우트 설정 패턴

### 공개 + 인증 라우트 혼합 예제

**위치**: `src/modules/auth/auth.routes.ts`

```typescript
import { Router } from 'express';
import { authenticate } from '../../shared/middlewares/auth.middleware.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';
import * as authController from './auth.controller.js';

const router = Router();

// 공개 엔드포인트 (인증 불필요)
router.post('/signup', asyncHandler(authController.signup));
router.post('/login', asyncHandler(authController.login));

// 인증 필요 엔드포인트
router.post('/logout', authenticate, asyncHandler(authController.logout));
router.post('/refresh', authenticate, asyncHandler(authController.refresh));

export default router;
```

**핵심**:

- 인증 필요한 라우트에만 `authenticate` 미들웨어 추가
- `authenticate` → `asyncHandler` → `controller` 순서

### 전체 라우터에 인증 적용 예제

**위치**: `src/modules/projects/projects.routes.ts`

```typescript
import { Router } from 'express';
import { authenticate } from '../../shared/middlewares/auth.middleware.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';
import * as projectsController from './projects.controller.js';

const router = Router();

// 모든 라우트에 인증 미들웨어 적용
router.use(authenticate);

// 이제 모든 컨트롤러는 AsyncAuthRequestHandler 타입 사용 가능
router.get('/', asyncHandler(projectsController.getProjects));
router.post('/', asyncHandler(projectsController.createProject));
router.get('/:projectId', asyncHandler(projectsController.getProjectById));
router.patch('/:projectId', asyncHandler(projectsController.updateProject));
router.delete('/:projectId', asyncHandler(projectsController.deleteProject));

export default router;
```

**핵심**:

- `router.use(authenticate)`로 모든 라우트에 인증 적용
- 이후 모든 컨트롤러는 `AsyncAuthRequestHandler` 사용

---

## 권한 검증 미들웨어

### 프로젝트 소유자 확인 미들웨어

**위치**: `src/shared/middlewares/authorization.middleware.ts`

```typescript
import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../../types/express.js';
import { ForbiddenError, NotFoundError } from '../errors/custom-error.js';
import prisma from '../../configs/prisma.js';

/**
 * 프로젝트 소유자 확인 미들웨어
 *
 * req.params.projectId가 존재해야 합니다.
 * authenticate 미들웨어 이후에 사용해야 합니다.
 *
 * @throws {NotFoundError} 프로젝트가 존재하지 않는 경우
 * @throws {ForbiddenError} 프로젝트 소유자가 아닌 경우
 */
export async function isProjectOwner(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const projectId = parseInt(req.params.projectId!);
        const userId = req.user.id;

        const project = await prisma.project.findUnique({
            where: { id: projectId },
            select: { ownerId: true },
        });

        if (!project) {
            throw new NotFoundError('프로젝트를 찾을 수 없습니다.');
        }

        if (project.ownerId !== userId) {
            throw new ForbiddenError('권한이 없습니다.');
        }

        next();
    } catch (error) {
        next(error);
    }
}

/**
 * 프로젝트 멤버 확인 미들웨어
 *
 * 프로젝트 소유자 또는 멤버인지 확인합니다.
 */
export async function isProjectMember(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const projectId = parseInt(req.params.projectId!);
        const userId = req.user.id;

        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
                OR: [{ ownerId: userId }, { members: { some: { userId } } }],
            },
        });

        if (!project) {
            throw new ForbiddenError('프로젝트 접근 권한이 없습니다.');
        }

        next();
    } catch (error) {
        next(error);
    }
}
```

### 권한 미들웨어 사용 예제

```typescript
import { Router } from 'express';
import { authenticate } from '../../shared/middlewares/auth.middleware.js';
import { isProjectOwner, isProjectMember } from '../../shared/middlewares/authorization.middleware.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';
import * as projectsController from './projects.controller.js';

const router = Router();

// 기본 인증만 필요
router.get('/', authenticate, asyncHandler(projectsController.getProjects));
router.post('/', authenticate, asyncHandler(projectsController.createProject));

// 프로젝트 멤버 확인 필요
router.get('/:projectId', authenticate, isProjectMember, asyncHandler(projectsController.getProjectById));

// 프로젝트 소유자 확인 필요
router.delete('/:projectId', authenticate, isProjectOwner, asyncHandler(projectsController.deleteProject));

export default router;
```

**미들웨어 체인 순서**:

1. `authenticate`: 인증 확인 (req.user 설정)
2. `isProjectOwner` or `isProjectMember`: 권한 확인
3. `asyncHandler`: 에러 처리
4. `controller`: 비즈니스 로직

---

## 실전 예제

### 예제 1: 할 일 생성 (Tasks API)

```typescript
import type { AsyncAuthRequestHandler } from '../../types/express.js';
import { ForbiddenError } from '../../shared/errors/custom-error.js';
import prisma from '../../configs/prisma.js';

/**
 * 할 일 생성
 *
 * @route POST /projects/:projectId/tasks
 * @access Private (프로젝트 멤버만 가능)
 */
export const createTask: AsyncAuthRequestHandler = async (req, res) => {
    const projectId = parseInt(req.params.projectId!);
    const userId = req.user.id; // ✅ 타입 안전
    const { title, description, status, priority, dueDate } = req.body;

    // 1. 프로젝트 멤버 확인 (미들웨어에서 처리 권장)
    const isMember = await prisma.project.findFirst({
        where: {
            id: projectId,
            OR: [{ ownerId: userId }, { members: { some: { userId } } }],
        },
    });

    if (!isMember) {
        throw new ForbiddenError('프로젝트 멤버만 할 일을 생성할 수 있습니다.');
    }

    // 2. 할 일 생성
    const task = await prisma.task.create({
        data: {
            title,
            description,
            status,
            priority,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            projectId,
            assigneeId: userId, // 생성자를 담당자로 설정
        },
    });

    res.status(201).json({
        message: '할 일 생성 성공',
        data: { task },
    });
};
```

### 예제 2: 프로젝트 멤버 초대 (Invitations API)

```typescript
import type { AsyncAuthRequestHandler } from '../../types/express.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../shared/errors/custom-error.js';
import prisma from '../../configs/prisma.js';

/**
 * 프로젝트 멤버 초대
 *
 * @route POST /projects/:projectId/invitations
 * @access Private (프로젝트 소유자만 가능)
 */
export const inviteMember: AsyncAuthRequestHandler = async (req, res) => {
    const projectId = parseInt(req.params.projectId!);
    const inviterId = req.user.id; // ✅ 타입 안전
    const { inviteeEmail } = req.body;

    // 1. 프로젝트 확인 및 소유자 검증
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { members: true },
    });

    if (!project) {
        throw new NotFoundError('프로젝트를 찾을 수 없습니다.');
    }

    if (project.ownerId !== inviterId) {
        throw new ForbiddenError('프로젝트 소유자만 멤버를 초대할 수 있습니다.');
    }

    // 2. 초대할 사용자 확인
    const invitee = await prisma.user.findUnique({
        where: { email: inviteeEmail },
    });

    if (!invitee) {
        throw new NotFoundError('초대할 사용자를 찾을 수 없습니다.');
    }

    // 3. 이미 멤버인지 확인
    const isAlreadyMember = project.members.some((m) => m.userId === invitee.id);
    if (isAlreadyMember) {
        throw new BadRequestError('이미 프로젝트 멤버입니다.');
    }

    // 4. 초대 생성
    const invitation = await prisma.invitation.create({
        data: {
            projectId,
            inviterId,
            inviteeId: invitee.id,
        },
    });

    res.status(201).json({
        message: '초대 성공',
        data: { invitation },
    });
};
```

---

## 자주 하는 실수

### ❌ 실수 1: 타입을 잘못 사용

```typescript
// ❌ 나쁜 예: 인증 필요한 엔드포인트인데 AsyncRequestHandler 사용
export const getMe: AsyncRequestHandler = async (req, res) => {
    const userId = req.user.id; // ❌ 타입 에러: req.user가 undefined일 수 있음
    // ...
};
```

```typescript
// ✅ 좋은 예: AsyncAuthRequestHandler 사용
export const getMe: AsyncAuthRequestHandler = async (req, res) => {
    const userId = req.user.id; // ✅ 타입 안전
    // ...
};
```

### ❌ 실수 2: 미들웨어 순서 잘못 설정

```typescript
// ❌ 나쁜 예: authenticate 이전에 권한 체크
router.delete(
    '/:projectId',
    isProjectOwner, // ❌ req.user가 undefined
    authenticate,
    asyncHandler(projectsController.deleteProject),
);
```

```typescript
// ✅ 좋은 예: authenticate 이후에 권한 체크
router.delete(
    '/:projectId',
    authenticate, // ✅ req.user 설정
    isProjectOwner, // ✅ req.user 사용 가능
    asyncHandler(projectsController.deleteProject),
);
```

### ❌ 실수 3: 전체 라우터에 인증 적용 후 공개 라우트 추가

```typescript
// ❌ 나쁜 예
router.use(authenticate); // 모든 라우트에 인증 적용

router.post('/signup', asyncHandler(authController.signup)); // ❌ 인증 필요하게 됨
router.post('/login', asyncHandler(authController.login)); // ❌ 인증 필요하게 됨
```

```typescript
// ✅ 좋은 예: 공개 라우트를 먼저 정의
router.post('/signup', asyncHandler(authController.signup));
router.post('/login', asyncHandler(authController.login));

router.use(authenticate); // 이후 라우트만 인증 적용

router.post('/logout', asyncHandler(authController.logout));
```

### ❌ 실수 4: req.user를 수정하려고 시도

```typescript
// ❌ 나쁜 예: req.user는 읽기 전용으로 사용해야 함
export const someController: AsyncAuthRequestHandler = async (req, res) => {
    req.user.id = 999; // ❌ 수정하지 말 것
    // ...
};
```

```typescript
// ✅ 좋은 예: req.user는 읽기만
export const someController: AsyncAuthRequestHandler = async (req, res) => {
    const userId = req.user.id; // ✅ 읽기만
    // ...
};
```

### ❌ 실수 5: 인증 미들웨어에서 에러를 던지지 않고 res.status() 사용

```typescript
// ❌ 나쁜 예: 미들웨어에서 직접 응답 전송
export function authenticate(req: Request, res: Response, next: NextFunction): void {
    const token = req.cookies['accessToken'];

    if (!token) {
        res.status(401).json({ message: '로그인이 필요합니다.' }); // ❌
        return;
    }
    // ...
}
```

```typescript
// ✅ 좋은 예: 에러를 던지고 전역 에러 핸들러에서 처리
export function authenticate(req: Request, res: Response, next: NextFunction): void {
    try {
        const token = req.cookies['accessToken'];

        if (!token) {
            throw new UnauthorizedError('로그인이 필요합니다.'); // ✅
        }
        // ...
        next();
    } catch (error) {
        next(error); // ✅ 전역 에러 핸들러로 전달
    }
}
```

---

## 체크리스트

### 프로젝트 시작 전 확인 사항

- [ ] `src/shared/middlewares/auth.middleware.ts` 구현 완료
- [ ] `src/shared/utils/jwt.util.ts` 구현 완료 (선택)
- [ ] `src/shared/middlewares/authorization.middleware.ts` 구현 완료 (필요 시)
- [ ] 환경 변수 설정 완료 (`.env` 파일)
    - [ ] `ACCESS_TOKEN_SECRET`
    - [ ] `REFRESH_TOKEN_SECRET`
    - [ ] `ACCESS_TOKEN_EXPIRES_IN`
    - [ ] `REFRESH_TOKEN_EXPIRES_IN`

### 컨트롤러 작성 시 체크리스트

- [ ] 인증 필요 여부 확인
    - 인증 필요: `AsyncAuthRequestHandler` 사용
    - 인증 불필요: `AsyncRequestHandler` 사용
- [ ] 권한 확인 필요 여부 판단
    - 프로젝트 소유자만: `isProjectOwner` 미들웨어 사용
    - 프로젝트 멤버: `isProjectMember` 미들웨어 사용
- [ ] 라우트에 미들웨어 올바른 순서로 적용
    - `authenticate` → 권한 미들웨어 → `asyncHandler` → 컨트롤러

### 코드 리뷰 시 체크리스트

- [ ] `req.user` 사용 시 적절한 타입 사용 (`AuthRequest` vs `Request`)
- [ ] 인증 미들웨어가 라우트에 적용되어 있는가
- [ ] 권한 검증이 필요한 경우 적절히 처리되어 있는가
- [ ] 미들웨어 체인 순서가 올바른가

---

## 참고 자료

- **타입 정의**: `src/types/auth-user.ts`, `src/types/express.ts`
- **개발 가이드**: `docs/guides/DEVELOPMENT_GUIDE.md`
- **API 명세**: `docs/guides/API_SPECIFICATION.md`
- **에러 처리**: `src/shared/errors/custom-error.ts`

---

## 질문/피드백

이 가이드에 대한 질문이나 개선 사항이 있으면 팀 채널에 공유해주세요!

**Happy Coding! 🚀**
