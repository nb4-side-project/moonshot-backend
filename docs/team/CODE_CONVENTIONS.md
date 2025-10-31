# 코드 컨벤션 및 아키텍처 가이드

> **작성일**: 2025-10-31
> **목적**: 팀 프로젝트의 일관된 코드 작성을 위한 규칙 및 패턴 정의

---

## 📋 목차

1. [파일 및 폴더 네이밍 규칙](#1-파일-및-폴더-네이밍-규칙)
2. [코드 스타일 규칙](#2-코드-스타일-규칙)
3. [프로젝트 구조](#3-프로젝트-구조)
4. [3-Layer Architecture](#4-3-layer-architecture)
5. [Zod 유효성 검증 패턴](#5-zod-유효성-검증-패턴)
6. [타입 정의 규칙](#6-타입-정의-규칙)
7. [샘플 코드: 유저 등록](#7-샘플-코드-유저-등록)

---

## 1. 파일 및 폴더 네이밍 규칙

### 1.1 기본 원칙

| 위치               | 네이밍 규칙      | 예시                       |
| ------------------ | ---------------- | -------------------------- |
| `src/modules/*`    | **dot notation** | `users.controller.ts`      |
| 그 외 (shared, 등) | **kebab-case**   | `error-handler.ts`         |
| 폴더명             | **kebab-case**   | `shared/middlewares/`      |
| 상수/열거형        | **UPPER_SNAKE**  | `NODE_ENV`, `HTTP_STATUS`  |
| 클래스             | **PascalCase**   | `UserService`, `AppError`  |
| 함수/변수          | **camelCase**    | `getUserById`, `userData`  |
| Zod 스키마         | **camelCase**    | `registerUserSchema`       |
| DTO 타입           | **PascalCase**   | `RegisterUserDto`          |
| Router 변수        | **camelCase**    | `userRouter`, `authRouter` |

### 1.2 모듈별 파일 네이밍

```
src/modules/users/
├── users.routes.ts        # 라우터
├── users.controller.ts    # 컨트롤러
├── users.service.ts       # 비즈니스 로직
├── users.repository.ts    # DB 접근 레이어
├── users.schema.ts        # Zod 스키마
└── users.types.ts         # 도메인별 타입
```

**규칙:**

- 파일명은 `{도메인}.{역할}.ts` 형식
- 도메인명은 복수형 사용 (`user` ❌, `users` ✅)
- 각 파일은 단일 책임 원칙 준수

---

## 2. 코드 스타일 규칙

### 2.1 주석 스타일

**JSDoc 스타일 사용** (`/** */`)

```typescript
// ❌ 블록 주석 사용 금지
// ============================================
// 회원가입
// ============================================

// ✅ JSDoc 주석 사용
/** 회원가입 */
```

### 2.2 Export 패턴

**객체 패턴 사용** (default export)

```typescript
// ❌ Named exports 사용 금지
export const createUser = async () => { ... };
export const findUser = async () => { ... };

// ✅ 객체 패턴 사용
const userService = {
  async createUser() { ... },
  async findUser() { ... },
};

export default userService;
```

### 2.3 Import 패턴

**Default import 사용**

```typescript
// ❌ Named imports 사용 금지
import * as userService from './users.service.js';
import * as userController from './users.controller.js';

// ✅ Default import 사용
import userService from './users.service.js';
import userController from './users.controller.js';
```

**예외**: Zod 스키마는 named export 가능

```typescript
// ✅ 스키마는 named export 허용
export const registerUserSchema = z.object({ ... });
export type RegisterUserDto = z.infer<typeof registerUserSchema>;
```

### 2.4 Router 네이밍

**Router는 단수형 사용**

```typescript
// ✅ 권장
import userRouter from './users.routes.js';
app.use('/users', userRouter);

// ❌ 비권장
import userRoutes from './users.routes.js';
app.use('/users', userRoutes);
```

**이유**: `router`는 하나의 Router 인스턴스(객체)이므로 단수형이 정확

### 2.5 설정 파일 포맷팅

**JSON 파일도 Prettier 적용**

```
✅ Prettier 적용:
- tsconfig.json
- package.json
- .prettierrc
- .eslintrc.json

❌ Prettier 제외:
- package-lock.json (npm 관리)
- pnpm-lock.yaml (pnpm 관리)
- yarn.lock (yarn 관리)
- .vscode/settings.json (VSCode 관리)
```

**이유**:

- 일관된 들여쓰기와 포맷
- 팀원 간 diff 최소화
- 가독성 향상

---

## 3. 프로젝트 구조

### 3.1 전체 구조

```
src/
├── app.ts                      # Express 앱 설정
├── server.ts                   # 서버 실행
├── configs/                    # 설정 파일
│   └── prisma.ts              # Prisma 클라이언트
├── modules/                    # 도메인 모듈 (비즈니스 로직)
│   ├── users/
│   │   ├── users.routes.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.repository.ts
│   │   ├── users.schema.ts
│   │   └── users.types.ts
│   ├── auth/
│   ├── projects/
│   ├── tasks/
│   └── ...
├── shared/                     # 공통 모듈
│   ├── middlewares/           # 공통 미들웨어
│   │   ├── error-handler.ts
│   │   ├── not-found-handler.ts
│   │   ├── validate.ts        # Zod 유효성 검증 미들웨어
│   │   └── auth.ts            # 인증 미들웨어
│   ├── utils/                 # 유틸리티
│   │   └── async-handler.ts
│   ├── errors/                # 커스텀 에러 클래스
│   │   └── custom-error.ts
│   └── constants/             # 상수
│       └── constants.ts
└── types/                      # 전역 타입 정의
    ├── express.d.ts           # Express 타입 확장
    └── auth-user.ts           # AuthUser 타입
```

### 3.2 폴더 역할 정의

#### `src/modules/`

- **목적**: 도메인별 비즈니스 로직 구현
- **규칙**:
    - 각 도메인은 독립적인 폴더 생성
    - 3-Layer Architecture 준수
    - 도메인 간 직접 참조 지양 (shared 계층 활용)

#### `src/shared/`

- **목적**: 모든 모듈에서 공통으로 사용하는 코드
- **규칙**:
    - 비즈니스 로직 포함 금지
    - 재사용 가능한 유틸리티/미들웨어만 포함

#### `src/types/`

- **목적**: 프로젝트 전역 타입 정의
- **규칙**:
    - Express 확장, 공통 인터페이스만 포함
    - 도메인별 타입은 `modules/{domain}/{domain}.types.ts`에 작성

---

## 4. 3-Layer Architecture

### 4.1 계층 구조

```
┌─────────────────────────────────────────┐
│         Routes (라우터 계층)              │  ← 요청 받기, 유효성 검증
│  - 라우팅                                 │
│  - Zod validation middleware            │
│  - Auth middleware                       │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│      Controller (컨트롤러 계층)           │  ← 요청/응답 처리
│  - 요청 파싱                              │
│  - 서비스 호출                            │
│  - 응답 반환                              │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│       Service (비즈니스 로직 계층)         │  ← 비즈니스 로직
│  - 비즈니스 규칙 처리                      │
│  - 트랜잭션 관리                          │
│  - Repository 호출                       │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    Repository (데이터 접근 계층)          │  ← DB 접근
│  - Prisma 쿼리                           │
│  - 데이터 CRUD                           │
└─────────────────────────────────────────┘
```

### 4.2 각 계층의 책임

#### Routes (라우터)

```typescript
// users.routes.ts
import { Router } from 'express';
import validate from '@/shared/middlewares/validate.js';
import asyncHandler from '@/shared/utils/async-handler.js';
import userController from './users.controller.js';
import { registerUserSchema } from './users.schema.js';

const router = Router();

/** 회원가입 */
router.post(
    '/register',
    validate(registerUserSchema, 'body'), // 1. 유효성 검증
    asyncHandler(userController.register), // 2. 컨트롤러 호출
);

export default router;
```

**책임:**

- ✅ 라우팅 정의
- ✅ 미들웨어 적용 순서 관리
- ✅ 유효성 검증 스키마 적용
- ❌ 비즈니스 로직 포함 금지

#### Controller (컨트롤러)

```typescript
// users.controller.ts
import type { Request, Response } from 'express';
import userService from './users.service.js';
import type { RegisterUserDto } from './users.schema.js';

const userController = {
    /** 회원가입 */
    async register(req: Request, res: Response): Promise<void> {
        const userData = req.body as RegisterUserDto;

        const newUser = await userService.createUser(userData);

        res.status(201).json({
            message: '회원가입이 완료되었습니다.',
            data: { userId: newUser.id },
        });
    },
};

export default userController;
```

**책임:**

- ✅ 요청 데이터 파싱
- ✅ 서비스 계층 호출
- ✅ HTTP 응답 반환
- ❌ 비즈니스 로직 포함 금지
- ❌ DB 직접 접근 금지

#### Service (서비스)

```typescript
// users.service.ts
import bcrypt from 'bcrypt';
import userRepository from './users.repository.js';
import { ConflictError } from '@/shared/errors/custom-error.js';
import type { RegisterUserDto } from './users.schema.js';

const userService = {
    /** 유저 생성 */
    async createUser(userData: RegisterUserDto) {
        // 1. 중복 확인
        const existingUser = await userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new ConflictError('이미 존재하는 이메일입니다.');
        }

        // 2. 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        // 3. 유저 생성
        return await userRepository.create({
            ...userData,
            password: hashedPassword,
        });
    },
};

export default userService;
```

**책임:**

- ✅ 비즈니스 로직 구현
- ✅ 트랜잭션 관리
- ✅ 에러 처리 (커스텀 에러 throw)
- ✅ Repository 호출
- ❌ HTTP 요청/응답 처리 금지

#### Repository (리포지토리)

```typescript
// users.repository.ts
import prisma from '@/configs/prisma.js';
import type { RegisterUserDto } from './users.schema.js';

const userRepository = {
    /** 이메일로 유저 조회 */
    async findByEmail(email: string) {
        return await prisma.user.findUnique({
            where: { email },
        });
    },

    /** 유저 생성 */
    async create(userData: RegisterUserDto & { provider?: string }) {
        return await prisma.user.create({
            data: {
                email: userData.email,
                password: userData.password,
                name: userData.name,
                provider: userData.provider ?? 'local',
            },
        });
    },
};

export default userRepository;
```

**책임:**

- ✅ Prisma 쿼리 실행
- ✅ 데이터 CRUD
- ❌ 비즈니스 로직 포함 금지

---

## 5. Zod 유효성 검증 패턴

### 5.1 위치 및 목적

**파일 위치**: `src/shared/middlewares/validate.ts`

**목적**:

- 요청 데이터 (`body`, `query`, `params`) 유효성 검증
- Zod 스키마를 사용한 타입 안전성 보장

### 5.2 Validate 미들웨어 구현

```typescript
// src/shared/middlewares/validate.ts
import type { ZodObject, ZodRawShape } from 'zod';
import type { Request, Response, NextFunction } from 'express';

/**
 * Zod 스키마를 사용하여 요청 데이터를 검증하는 미들웨어
 *
 * @param schema - Zod 스키마 객체
 * @param part - 검증할 요청 부분 ('body' | 'query' | 'params')
 *
 * @example
 * router.post('/users', validate(registerUserSchema, 'body'), userController.register);
 */
export const validate = <T extends ZodRawShape>(schema: ZodObject<T>, part: 'body' | 'query' | 'params') => {
    return (req: Request, _res: Response, next: NextFunction) => {
        try {
            const validatedData = schema.parse(req[part]);

            // query와 params는 읽기 전용이므로 defineProperty 사용
            if (part === 'query' || part === 'params') {
                Object.defineProperty(req, part, {
                    value: validatedData,
                    writable: true,
                    enumerable: true,
                    configurable: true,
                });
            } else {
                // body는 직접 할당 가능
                req[part] = validatedData;
            }

            next();
        } catch (error) {
            // ZodError는 error-handler.ts에서 처리됨
            next(error);
        }
    };
};
```

### 5.3 개별 검증 vs 통합 검증

#### ✅ **개별 검증 (권장)**

**장점:**

- 명확한 의도 표현
- 타입 안전성 높음
- 디버깅 용이
- 테스트 작성 쉬움

**사용 예시:**

```typescript
// users.routes.ts
router.post(
    '/register',
    validate(registerUserSchema, 'body'), // body만 검증
    asyncHandler(userController.register),
);

router.get(
    '/:id',
    validate(userIdParamsSchema, 'params'), // params만 검증
    asyncHandler(userController.getById),
);

router.get(
    '/',
    validate(listUsersQuerySchema, 'query'), // query만 검증
    asyncHandler(userController.getAll),
);
```

#### ❌ **통합 검증 (비권장)**

**단점:**

- 복잡성 증가
- 타입 추론 어려움
- 불필요한 검증 가능성

**예시 (참고용):**

```typescript
// 이런 방식은 피하세요
export const validateAll = (schemas: { body?: ZodObject; query?: ZodObject; params?: ZodObject }) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (schemas.body) req.body = schemas.body.parse(req.body);
            if (schemas.query) {
                Object.defineProperty(req, 'query', {
                    value: schemas.query.parse(req.query),
                    writable: true,
                });
            }
            if (schemas.params) {
                Object.defineProperty(req, 'params', {
                    value: schemas.params.parse(req.params),
                    writable: true,
                });
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};
```

### 5.4 Zod 스키마 작성 가이드

```typescript
// users.schema.ts
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
```

**네이밍 규칙:**

- 스키마: `{action}{Entity}Schema` (camelCase)
- DTO: `{Action}{Entity}Dto` (PascalCase)
- 예시:
    - `registerUserSchema` / `RegisterUserDto` (회원가입)
    - `updateUserSchema` / `UpdateUserDto` (유저 수정)
    - `userIdParamsSchema` / `UserIdParamsDto` (ID params)

**중요**: Zod 스키마에서 infer한 DTO 타입을 우선 사용하고, 별도 인터페이스는 필요한 경우에만 작성합니다.

**작성 규칙:**

- 각 도메인의 스키마는 `{domain}.schema.ts`에 작성
- 명확한 에러 메시지 작성
- **숫자 변환**: `z.coerce.number()`를 사용하여 자동 타입 변환 (권장)
    - `z.coerce.number()`: 문자열 → 숫자 자동 변환
    - `.int()`: 정수 검증
    - `.positive()`: 양수 검증 (0 제외)
    - `.max(n)`: 최대값 제한 (DoS 방지)
- 스키마마다 대응하는 DTO 타입 생성

**타입 변환 예시:**

```typescript
// ❌ 구식 방법 (정규식 + transform)
z.string().regex(/^\d+$/).transform(Number);
// 문제: 0 허용, 양수 검증 없음

// ✅ 권장 방법 (z.coerce)
z.coerce.number().int().positive();
// 장점: 간결하고 명확한 의도, 양수만 허용

// ✅ 페이지네이션 예시
page: z.coerce.number().int().positive().default(1);
limit: z.coerce.number().int().positive().max(100).default(10);
```

---

## 6. 타입 정의 규칙

### 6.1 타입 분리 원칙

```
src/
├── types/                      # ✅ 전역 공통 타입만
│   ├── express.d.ts           # Express 타입 확장
│   └── auth-user.ts           # AuthUser 인터페이스
│
└── modules/
    └── users/
        └── users.types.ts      # ✅ 도메인별 타입
```

### 6.2 전역 타입 (src/types/)

**용도**: 프로젝트 전체에서 사용하는 공통 타입

```typescript
// src/types/auth-user.ts
export interface AuthUser {
    id: number;
    email: string;
    name: string;
    provider?: string;
}
```

```typescript
// src/types/express.d.ts
import type { AuthUser } from './auth-user.js';

declare global {
    namespace Express {
        interface Request {
            user?: AuthUser; // req.user 타입 확장
        }
    }
}

export {};
```

### 6.3 도메인별 타입 (src/modules/{domain}/{domain}.types.ts)

**용도**: 특정 도메인에서만 사용하는 타입

```typescript
// src/modules/users/users.types.ts
import type { User } from '@prisma/client';

// ✅ 요청 타입
export interface RegisterInput {
    email: string;
    password: string;
    name: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

// ✅ 응답 타입
export type UserResponse = Omit<User, 'password'>;

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: UserResponse;
}

// ✅ 서비스 레이어 타입
export interface CreateUserData extends RegisterInput {
    provider?: string;
    providerId?: string;
}
```

### 6.4 타입 네이밍 규칙

| 타입 종류          | 네이밍 패턴            | 예시                     |
| ------------------ | ---------------------- | ------------------------ |
| 요청 DTO           | `{Action}Input`        | `RegisterInput`          |
| 응답 DTO           | `{Entity}Response`     | `UserResponse`           |
| 서비스 계층 데이터 | `{Action}{Entity}Data` | `CreateUserData`         |
| Prisma 타입        | `Prisma.{Model}`       | `Prisma.UserCreateInput` |

---

## 7. 샘플 코드: 유저 등록

### 7.1 전체 구조

```
src/modules/users/
├── users.routes.ts        # 라우터
├── users.controller.ts    # 컨트롤러
├── users.service.ts       # 서비스
├── users.repository.ts    # 리포지토리
├── users.schema.ts        # Zod 스키마
└── users.types.ts         # 타입 정의
```

### 7.2 코드 구현

#### 1️⃣ users.schema.ts

```typescript
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
```

#### 2️⃣ users.types.ts

```typescript
import type { User } from '@prisma/client';

/** 회원가입 요청 */
export interface RegisterInput {
    email: string;
    password: string;
    name: string;
}

/** 유저 응답 (비밀번호 제외) */
export type UserResponse = Omit<User, 'password'>;
```

#### 3️⃣ users.repository.ts

```typescript
import prisma from '@/configs/prisma.js';
import type { RegisterInput } from './users.types.js';

const userRepository = {
    /** 이메일로 유저 조회 */
    async findByEmail(email: string) {
        return await prisma.user.findUnique({
            where: { email },
        });
    },

    /** 유저 생성 */
    async create(userData: RegisterInput & { provider?: string }) {
        return await prisma.user.create({
            data: {
                email: userData.email,
                password: userData.password,
                name: userData.name,
                provider: userData.provider ?? 'local',
            },
        });
    },
};

export default userRepository;
```

#### 4️⃣ users.service.ts

```typescript
import bcrypt from 'bcrypt';
import userRepository from './users.repository.js';
import { ConflictError } from '@/shared/errors/custom-error.js';
import type { RegisterInput, UserResponse } from './users.types.js';

const userService = {
    /** 유저 생성 */
    async createUser(userData: RegisterInput): Promise<UserResponse> {
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
};

export default userService;
```

#### 5️⃣ users.controller.ts

```typescript
import type { Request, Response } from 'express';
import userService from './users.service.js';
import type { RegisterInput } from './users.types.js';

const userController = {
    /** 회원가입 */
    async register(req: Request, res: Response): Promise<void> {
        const userData = req.body as RegisterInput;

        const newUser = await userService.createUser(userData);

        res.status(201).json({
            message: '회원가입이 완료되었습니다.',
            data: { userId: newUser.id },
        });
    },
};

export default userController;
```

#### 6️⃣ users.routes.ts

```typescript
import { Router } from 'express';
import { validate } from '@/shared/middlewares/validate.js';
import asyncHandler from '@/shared/utils/async-handler.js';
import userController from './users.controller.js';
import { registerUserSchema } from './users.schema.js';

const router = Router();

/** 회원가입 */
router.post('/register', validate(registerUserSchema, 'body'), asyncHandler(userController.register));

export default router;
```

#### 7️⃣ app.ts에 라우터 등록

```typescript
import express from 'express';
import userRouter from '@/modules/users/users.routes.js';
import errorHandler from '@/shared/middlewares/error-handler.js';
import notFoundHandler from '@/shared/middlewares/not-found-handler.js';

const app = express();

app.use(express.json());

/** 라우터 등록 */
app.use('/users', userRouter);

/** 에러 핸들러 */
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
```

---

## 8. 핵심 컨벤션 요약

### ✅ **필수 규칙**

1. **주석**: JSDoc 스타일 (`/** */`) 사용
2. **Export**: 객체 패턴 (default export)
3. **Import**: Default import 사용
4. **Router**: 단수형 (`userRouter`, not `userRoutes`)
5. **파일명**: modules는 dot notation, 그 외 kebab-case
6. **구조**: 3-Layer Architecture (Routes → Controller → Service → Repository)
7. **포맷팅**: 설정 파일도 Prettier 적용 (일관성)

### ❌ **금지 사항**

1. **블록 주석** (`// ===`) 사용 금지
2. **Named exports** (`export const`) 함수에 사용 금지
3. **Named imports** (`import * as`) 사용 금지
4. **계층 간 책임 위반** (예: Controller에서 DB 직접 접근)

---

## 9. 체크리스트

새로운 도메인(모듈)을 추가할 때 다음 체크리스트를 확인하세요:

- [ ] `src/modules/{domain}/` 폴더 생성
- [ ] `{domain}.schema.ts` - Zod 스키마 작성
- [ ] `{domain}.types.ts` - 도메인별 타입 정의
- [ ] `{domain}.repository.ts` - Prisma 쿼리 작성
- [ ] `{domain}.service.ts` - 비즈니스 로직 구현
- [ ] `{domain}.controller.ts` - 요청/응답 처리
- [ ] `{domain}.routes.ts` - 라우터 정의
- [ ] `app.ts`에 라우터 등록 (`app.use('/{domain}', {domain}Router)`)
- [ ] 파일 네이밍 규칙 준수 (dot notation)
- [ ] JSDoc 주석 스타일 사용 (`/** */`)
- [ ] 객체 패턴 & default export 사용
- [ ] 3-Layer Architecture 준수
- [ ] `validate` 미들웨어 적용
- [ ] `asyncHandler`로 컨트롤러 감싸기

---

## 10. 참고 문서

- [AUTH_SETUP_GUIDE.md](./AUTH_SETUP_GUIDE.md) - 인증 패턴
- [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) - Git 협업 규칙
- [Zod 공식 문서](https://zod.dev/)
- [Prisma 공식 문서](https://www.prisma.io/docs)

---

**Happy Coding! 🚀**
