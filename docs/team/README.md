# Moonshot Backend 문서 가이드

이 디렉토리는 Moonshot 백엔드 API 개발을 위한 모든 문서를 포함합니다.

## 📂 문서 폴더 구조

문서는 팀 공유 문서와 개인 참고 문서로 분리되어 있습니다:

```
docs/
├── team/                    # 팀 공유 문서 (Git 추적 ✅)
│   ├── README.md           # 문서 가이드 (이 파일)
│   ├── AUTH_SETUP_GUIDE.md # 인증/인가 설정 가이드 (필독!)
│   └── GIT_WORKFLOW.md     # Git 협업 규칙
│
└── guides/                  # 개인 참고 문서 (Git 추적 ❌)
    ├── SETUP_GUIDE.md      # 프로젝트 초기 설정
    ├── DEVELOPMENT_GUIDE.md # 개발 가이드
    ├── API_SPECIFICATION.md # API 레퍼런스
    ├── ESM_CONFIG_FILES.md  # 설정 파일 모음
    └── COMMANDS_REFERENCE.md # 명령어 모음
```

**구분 이유:**

- **team/**: 팀원 모두가 따라야 하는 규칙 (Git 워크플로우, 인증/인가 패턴, 프로젝트 가이드)
- **guides/**: 개발 중 참고하는 문서 (각자 수정 가능, Git에서 제외되어 팀원 간 충돌 방지)

---

## 📚 문서 구조

### 0. **SETUP_GUIDE.md** (첫 시작 시 필독 🔧)

**프로젝트를 처음 설정할 때 읽는 문서입니다.**

**포함 내용:**

- 🔧 패키지 설치 가이드 (의존성 전체)
- ⚡ ESM 방식 채택 이유 및 장단점
- 🌐 환경 변수 설정
- ✨ ESLint, Prettier, Husky 설정
- 📋 Git Hooks 설정 (pre-commit, commit-msg)
- 📦 Package.json scripts 전체
- 💻 VSCode 설정 파일
- 📂 초기 프로젝트 구조 생성
- ✅ 설정 완료 체크리스트

**언제 읽어야 하나요?**

- 프로젝트를 처음 clone하거나 시작할 때
- 개발 환경을 세팅할 때
- ESLint, Prettier, Husky 등 도구 설정할 때
- ESM 방식에 대해 궁금할 때

---

### 1. **DEVELOPMENT_GUIDE.md** (필수 읽기 ⭐)

**가장 중요한 문서입니다.** 백엔드 개발을 시작하기 전에 반드시 읽어야 합니다.

**포함 내용:**

- ✅ 프로젝트 개요 및 기술 요구사항
- ✅ 권장 아키텍처 (Layered Architecture)
- ✅ 완전한 Prisma 데이터베이스 스키마
- ✅ 모든 API 엔드포인트 명세 (Request/Response)
- ✅ 인증 및 보안 구현 가이드
- ✅ 에러 처리 전략
- ✅ 프론트엔드 연동 가이드
- ✅ 단계별 개발 순서

**언제 읽어야 하나요?**

- 백엔드 개발을 처음 시작할 때
- API 엔드포인트 구현 방법을 확인할 때
- 데이터베이스 스키마를 설계할 때
- 프론트엔드와 통신 규격을 확인할 때

---

### 2. **API_SPECIFICATION.md**

간결하게 정리된 API 레퍼런스입니다.

**포함 내용:**

- 📡 모든 API 엔드포인트 목록
- 📥 Request 형식 (Header, Body, Query)
- 📤 Response 형식 (성공/실패)
- ⚠️ 에러 응답 예시
- 🔐 인증 요구사항

**언제 읽어야 하나요?**

- 특정 API의 정확한 형식을 빠르게 확인할 때
- Postman/Thunder Client로 API 테스트할 때
- API 문서를 팀원과 공유할 때

---

### 3. **MoonShot-Api-Specification.md**

원본 프로젝트 명세서입니다.

**포함 내용:**

- 📋 기능 요구사항 (Feature Requirements)
- 🎯 비즈니스 로직 제약사항
- 🚀 심화 요구사항 (Advanced Requirements)
- 🎨 디자인 시안 링크
- 🌐 프론트엔드 예시 링크

**언제 읽어야 하나요?**

- 프로젝트의 전체 요구사항을 이해할 때
- 비즈니스 로직을 설계할 때
- 프론트엔드 동작을 확인할 때

---

### 4. **COMMANDS_REFERENCE.md** (명령어 레퍼런스 📋)

**개발 시 자주 사용하는 모든 명령어를 정리한 문서입니다.**

**포함 내용:**

- 📦 NPM 명령어 (설치, 업데이트, 스크립트)
- 🚀 개발 서버 실행 및 디버깅
- 🗄️ Prisma 데이터베이스 명령어
- ✨ ESLint, Prettier, TypeScript 명령어
- 🏗️ 빌드 및 배포 명령어
- 🔧 유틸리티 명령어 (파일 검색, 프로세스 관리)
- 🔍 디버깅 명령어
- 📊 자주 사용하는 조합

**언제 읽어야 하나요?**

- 특정 명령어를 빠르게 찾을 때
- Prisma 명령어가 기억나지 않을 때
- 빌드/배포 프로세스를 확인할 때
- 디버깅 방법을 찾을 때

---

### 5. **AUTH_SETUP_GUIDE.md** (인증/인가 설정 가이드 🔐)

**프로젝트 분배 전 필독! 팀원 모두가 동일한 방식으로 인증을 처리하기 위한 가이드입니다.**

**포함 내용:**

- 🔐 AuthUser 타입 이해하기
- 🔒 AsyncRequestHandler vs AsyncAuthRequestHandler 구분
- 🛡️ 인증 미들웨어 구현 방법
- ✅ 컨트롤러 작성 패턴 (공개/인증 필요 엔드포인트)
- 🚦 라우트 설정 패턴 및 미들웨어 순서
- 🔑 권한 검증 미들웨어 (프로젝트 소유자/멤버 확인)
- 📋 실전 예제 (Tasks, Invitations API)
- ⚠️ 자주 하는 실수 및 해결 방법

**언제 읽어야 하나요?**

- **프로젝트 분배 전 필수 읽기** (모든 팀원)
- 인증이 필요한 API를 구현할 때
- `req.user` 타입 에러가 발생할 때
- 권한 검증 로직을 구현할 때
- 코드 리뷰 전 패턴 확인

---

### 6. **GIT_WORKFLOW.md** (Git 워크플로우 🌿)

**팀 프로젝트를 위한 Git 명령어 및 협업 가이드입니다.**

**포함 내용:**

- ⚙️ Git 초기 설정 (SSH 키, 사용자 정보)
- 🌿 브랜치 전략 및 명명 규칙
- 🔄 일상 워크플로우 (기능 개발 프로세스)
- 📝 커밋 컨벤션 (Conventional Commits)
- 🔀 Pull Request 프로세스
- 🔥 충돌 해결 방법
- 📚 유용한 Git 명령어
- 🤝 협업 시나리오
- 🔧 문제 해결
- 🪝 Git Hooks (Husky)

**언제 읽어야 하나요?**

- 팀 프로젝트를 시작할 때
- Git 충돌을 해결해야 할 때
- 브랜치 전략을 확인할 때
- 커밋 메시지 규칙을 확인할 때

---

### 7. **ESM_CONFIG_FILES.md** (ESM 설정 파일 ⚙️)

**ESM 프로젝트의 모든 설정 파일을 완벽하게 정리한 문서입니다.**

**포함 내용:**

- 📦 package.json (완전한 설정)
- 📘 tsconfig.json (ESM 최적화)
- 🗄️ prisma.config.ts 및 schema.prisma
- ✨ ESLint 설정 (Flat Config & 레거시)
- 💅 Prettier 설정
- 🪝 Husky 및 lint-staged 설정
- 📝 Commitlint 설정
- 🚫 .gitignore, .prettierignore
- 🌐 .env 설정
- 💻 VSCode 설정

**언제 읽어야 하나요?**

- 프로젝트 초기 설정 시
- ESLint/Prettier 설정을 변경할 때
- ESM 관련 오류가 발생했을 때
- 설정 파일 템플릿이 필요할 때

---

## 🚀 빠른 시작 가이드

### 1단계: 초기 설정 (처음 한 번만)

```bash
# SETUP_GUIDE.md 문서 참고
# - 패키지 설치
# - ESLint, Prettier, Husky 설정
# - 환경 변수 설정
# - 폴더 구조 생성

docs/guides/SETUP_GUIDE.md
```

### 2단계: 개발 가이드 읽기

```bash
# 전체 개발 흐름 파악
docs/guides/DEVELOPMENT_GUIDE.md
```

### 3단계: 데이터베이스 설정

```bash
# Prisma 스키마 작성 (DEVELOPMENT_GUIDE.md 섹션 3 참고)
# prisma/schema.prisma 파일 생성

# 마이그레이션 실행
npx prisma migrate dev --name init

# Prisma Client 생성
npx prisma generate
```

### 4단계: 개발 시작

```bash
# 개발 서버 실행
npm run dev
# 또는
npx tsx watch src/server.ts
```

---

## 📖 문서별 사용 시나리오

### 시나리오 0: "프로젝트를 처음 Clone했습니다"

```
1. SETUP_GUIDE.md → 패키지 설치 및 초기 설정
2. .env 파일 설정 → JWT_SECRET 생성 등
3. Prisma 마이그레이션 실행
4. npm run dev → 개발 서버 실행 확인
5. AUTH_SETUP_GUIDE.md → 인증 패턴 숙지 (필수!)
```

### 시나리오 1: "프로젝트를 처음 시작합니다"

```
1. MoonShot-Api-Specification.md → 프로젝트 이해
2. SETUP_GUIDE.md → 초기 설정 완료
3. DEVELOPMENT_GUIDE.md → 전체 흐름 파악
4. 섹션 3 (데이터베이스 스키마) → Prisma 스키마 작성
5. 섹션 8 (개발 시작하기) → 환경 설정 및 개발 순서
```

### 시나리오 2: "로그인 API를 구현하고 싶습니다"

```
1. AUTH_SETUP_GUIDE.md → 인증 패턴 전체 이해 (필수!)
2. DEVELOPMENT_GUIDE.md 섹션 4.1 (인증 API)
3. DEVELOPMENT_GUIDE.md 섹션 5 (인증 및 보안)
4. API_SPECIFICATION.md → POST /auth/login 확인
```

### 시나리오 3: "프론트엔드와 연동이 안 됩니다"

```
1. DEVELOPMENT_GUIDE.md 섹션 7 (프론트엔드 연동 가이드)
2. CORS 설정 확인
3. 토큰 형식 확인
4. Response 형식 확인 (API_SPECIFICATION.md)
```

### 시나리오 4: "할 일(Task) CRUD를 구현하고 싶습니다"

```
1. AUTH_SETUP_GUIDE.md → 인증 컨트롤러 패턴 확인
2. DEVELOPMENT_GUIDE.md 섹션 3.1 (데이터베이스 스키마 - Task)
3. DEVELOPMENT_GUIDE.md 섹션 4.4 (할 일 API)
4. API_SPECIFICATION.md → Tasks 섹션
```

### 시나리오 5: "에러 처리를 어떻게 해야 하나요?"

```
1. DEVELOPMENT_GUIDE.md 섹션 6 (에러 처리)
2. 커스텀 에러 클래스 구현
3. 전역 에러 핸들러 구현
```

### 시나리오 6: "ESLint/Prettier를 설정하고 싶습니다"

```
1. ESM_CONFIG_FILES.md 섹션 4, 5 (ESLint, Prettier 설정)
2. SETUP_GUIDE.md 섹션 4 (코드 품질 도구 설정)
3. COMMANDS_REFERENCE.md 섹션 4 (ESLint, Prettier 명령어)
```

### 시나리오 7: "Git 브랜치 전략이 궁금합니다"

```
1. GIT_WORKFLOW.md 섹션 2 (브랜치 전략)
2. GIT_WORKFLOW.md 섹션 4 (커밋 컨벤션)
3. GIT_WORKFLOW.md 섹션 5 (PR 프로세스)
```

### 시나리오 8: "Prisma 명령어를 찾고 싶습니다"

```
1. COMMANDS_REFERENCE.md 섹션 3 (데이터베이스 명령어)
2. ESM_CONFIG_FILES.md 섹션 3 (Prisma 설정)
```

### 시나리오 9: "ESM 관련 오류가 발생했습니다"

```
1. ESM_CONFIG_FILES.md (전체 확인)
2. SETUP_GUIDE.md 섹션 2 (ESM 방식 채택 이유)
3. COMMANDS_REFERENCE.md 섹션 11 (문제 해결)
```

### 시나리오 10: "팀원과 협업 중 충돌이 발생했습니다"

```
1. GIT_WORKFLOW.md 섹션 6 (충돌 해결)
2. GIT_WORKFLOW.md 섹션 8 (협업 시나리오)
3. GIT_WORKFLOW.md 섹션 9 (문제 해결)
```

---

## 🎯 핵심 참고 사항

### 데이터베이스 제약사항

- ✅ 유저당 최대 5개 프로젝트
- ✅ 프로젝트 삭제 시 관련 데이터 Cascading 삭제
- ✅ 트랜잭션 사용: 프로젝트 생성, 초대 수락

### 인증

- ✅ JWT (Access Token 15분 + Refresh Token 7일)
- ✅ 비밀번호 bcrypt 해싱
- ✅ Authorization: Bearer {token} 헤더

### 프론트엔드 연동

- ✅ Next.js 15 (BFF 아키텍처)
- ✅ httpOnly 쿠키로 토큰 관리
- ✅ 401 응답 시 자동 토큰 갱신
- ✅ CORS 설정 필수

### ESM (ECMAScript Modules)

- ✅ 모든 import에 `.js` 확장자 필수
- ✅ Path alias도 `.js` 필요: `import x from '@/module.js'`
- ✅ `__dirname` 대신 `import.meta.url` 사용

---

## 📞 추가 리소스

### 프론트엔드 코드

```
경로: /Users/mone/Downloads/project-moonshot-fe-main
```

### 프론트엔드 예시 사이트

```
URL: https://project-moonshot-fe.vercel.app
테스트 계정: user1@test.com / password1
```

### Figma 디자인

```
MoonShot-Api-Specification.md 파일 참고
```

---

## 🛠️ 개발 팁

### API 테스트

1. **Postman/Thunder Client 사용**
    - API_SPECIFICATION.md 참고
    - Collection 만들어서 재사용

2. **Prisma Studio 사용**

    ```bash
    npx prisma studio
    ```

    - 데이터베이스 GUI로 확인

3. **프론트엔드로 테스트**
    - 실제 사용자 플로우 확인

### 디버깅

- `console.log` 대신 `console.error` 사용
- Prisma 쿼리 로깅 활성화 (개발 환경)
- 에러 핸들러에서 상세 로그 출력

### 코드 품질

```bash
# TypeScript 타입 체크
npx tsc --noEmit

# Prettier 포맷팅
npx prettier --write .
```

---

## 📝 문서 업데이트

문서에 오류가 있거나 추가할 내용이 있다면:

1. 해당 문서를 직접 수정
2. 팀원들과 공유
3. 주요 변경사항은 git commit 메시지에 명시

---

**작성일:** 2025-10-29
**마지막 업데이트:** 2025-10-29

**Happy Coding! 🚀**
