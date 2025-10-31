# Moonshot Backend

프로젝트 관리 도구 **Moonshot**의 백엔드 API 서버입니다.

---

## 👥 팀원

| <img src="https://github.com/winnie4869.png" width="150" height="150"/> | <img src="https://github.com/qhdltmwhs.png" width="150" height="150"/> | <img src="https://github.com/stoneME2.png" width="150" height="150"/> |
| :---------------------------------------------------------------------: | :--------------------------------------------------------------------: | :-------------------------------------------------------------------: |
|         이하영<br>[@winnie4869](https://github.com/winnie4869)          |          백엔드<br>[@qhdltmwhs](https://github.com/qhdltmwhs)          |          백엔드<br>[@stoneME2](https://github.com/stoneME2)           |
|                              기획, 백엔드                               |                              기획, 백엔드                              |                             기획, 백엔드                              |

---

## 📚 기술 스택

### Core

- **Node.js** 20.x
- **TypeScript** 5.9
- **Express** 5.1

### Database

- **PostgreSQL** 16
- **Prisma** 6.18 (ORM)

### Authentication

- **JWT** (Access Token + Refresh Token)
- **bcrypt** (비밀번호 해싱)

### Code Quality

- **ESLint** (코드 품질)
- **Prettier** (코드 포맷팅)
- **Husky** (Git Hooks)
- **lint-staged** (Pre-commit 검사)

### Development Tools

- **tsx** (TypeScript 실행)
- **Plop** (코드 생성)

---

## 🚀 빠른 시작

### 1️⃣ 사전 요구사항

- Node.js 18.x 이상
- PostgreSQL 14.x 이상
- npm 9.x 이상

### 2️⃣ 설치

```bash
# 저장소 클론
git clone https://github.com/nb4-side-project/moonshot-backend.git
cd moonshot-backend

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일을 열어 DATABASE_URL, JWT_SECRET 등 설정

# Prisma 설정
npx prisma generate
npx prisma migrate dev
```

### 3️⃣ 개발 서버 실행

```bash
npm run dev
```

서버가 `http://localhost:3001`에서 실행됩니다.

---

## 📋 주요 스크립트

```bash
# 개발
npm run dev              # 개발 서버 실행
npm run dev:cloud        # 배포 환경 개발 서버

# 빌드
npm run build            # 프로덕션 빌드
npm run start            # 빌드된 파일 실행
npm run start:prod       # 배포용 시작 (마이그레이션 포함)

# 코드 품질
npm run lint             # ESLint 실행 및 자동 수정
npm run format           # Prettier 포맷팅
npm run type-check       # TypeScript 타입 체크
npm run validate         # 전체 검사 (type-check + lint + format)

# 데이터베이스
npm run db:generate      # Prisma Client 생성
npm run db:migrate       # 마이그레이션 실행
npm run db:studio        # Prisma Studio 실행

# 코드 생성
npm run generate:module  # 새 모듈 자동 생성 (Plop)
```

---

## 📁 프로젝트 구조

```
moonshot-backend/
├── src/
│   ├── app.ts                 # Express 앱 설정
│   ├── server.ts              # 서버 진입점
│   ├── configs/               # 설정 파일
│   ├── modules/               # 도메인 모듈
│   │   └── users/            # 예시: 사용자 모듈
│   │       ├── users.routes.ts
│   │       ├── users.controller.ts
│   │       ├── users.service.ts
│   │       ├── users.repository.ts
│   │       ├── users.schema.ts
│   │       └── users.types.ts
│   ├── shared/                # 공통 모듈
│   │   ├── middlewares/
│   │   ├── errors/
│   │   ├── utils/
│   │   └── constants/
│   └── types/                 # 전역 타입
├── prisma/
│   └── schema.prisma          # Prisma 스키마
├── docs/                      # 프로젝트 문서
│   ├── team/                  # 팀 공유 문서
│   └── guides/                # 개발 가이드
└── plop-templates/            # 코드 생성 템플릿
```

---

## 📖 문서

프로젝트 문서는 `docs/` 폴더에 있습니다:

### 필수 문서 (팀원 모두 읽기)

- **[CODE_CONVENTIONS.md](docs/team/CODE_CONVENTIONS.md)** - 코드 컨벤션 및 아키텍처 ⭐
- **[AUTH_SETUP_GUIDE.md](docs/team/AUTH_SETUP_GUIDE.md)** - 인증/인가 패턴 ⭐
- **[GIT_WORKFLOW.md](docs/team/GIT_WORKFLOW.md)** - Git 협업 규칙
- **[GITHUB_AUTOMATION.md](docs/team/GITHUB_AUTOMATION.md)** - GitHub Actions & Bot 정책

### 개발 가이드

- **[DEVELOPMENT_GUIDE.md](docs/guides/DEVELOPMENT_GUIDE.md)** - 전체 개발 가이드
- **[PLOP_GUIDE.md](docs/team/PLOP_GUIDE.md)** - 모듈 자동 생성 도구
- **[문서 가이드](docs/team/README.md)** - 전체 문서 목록 및 사용법

---

## 🏗️ 아키텍처

### 3-Layer Architecture

```
Routes (라우터)
    ↓
Controller (컨트롤러) - 요청/응답 처리
    ↓
Service (서비스) - 비즈니스 로직
    ↓
Repository (리포지토리) - 데이터 접근
```

### 주요 패턴

- **Zod 스키마 검증** - 타입 안전한 요청 검증
- **JWT 인증** - Access Token + Refresh Token
- **커스텀 에러 핸들링** - 일관된 에러 응답
- **AsyncHandler** - 비동기 에러 처리 간소화

---

## 🔐 환경 변수

주요 환경 변수 (.env 파일):

```env
# Server
PORT=3001
NODE_ENV=development
BASE_URL=http://localhost:3001
CORS_ORIGINS=http://localhost:3000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/moonshot"

# JWT
ACCESS_TOKEN_SECRET="your-secret-here"
REFRESH_TOKEN_SECRET="your-secret-here"
ACCESS_TOKEN_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"
```

자세한 설정은 `.env.example` 참고

---

## 🤝 기여 가이드

1. **이슈 생성** - 기능 요청이나 버그 리포트
2. **브랜치 생성** - `feature/기능명` 또는 `fix/버그명`
3. **코드 작성** - 코드 컨벤션 준수 ([CODE_CONVENTIONS.md](docs/team/CODE_CONVENTIONS.md))
4. **커밋** - Conventional Commits 규칙 ([GIT_WORKFLOW.md](docs/team/GIT_WORKFLOW.md))
5. **PR 생성** - PR 템플릿 작성
6. **코드 리뷰** - CI 통과 및 리뷰 승인
7. **머지** - Squash & Merge

---

## 📝 라이선스

ISC

---

**마지막 업데이트:** 2025-10-31
