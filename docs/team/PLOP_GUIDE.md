# Plop 사용 가이드

> 모듈 자동 생성 도구
>
> 작성일: 2025-10-31

---

## 📋 개요

Plop은 일관된 코드 스켈레톤을 자동으로 생성해주는 도구입니다. Users 모듈의 패턴을 기반으로 새로운 모듈을 빠르게 생성할 수 있습니다.

---

## 🚀 빠른 시작

### 1. 새로운 모듈 생성

```bash
# 대화형 모드
npm run generate

# 또는 직접 모듈 생성
npm run generate:module
```

### 2. 프롬프트 응답

```
? 모듈 이름을 입력하세요 (복수형, 예: users, projects, tasks):
  › auth

? 인증이 필요한 모듈인가요? (AsyncAuthRequestHandler 사용)
  › Yes
```

### 3. 생성 결과

```
✔ src/modules/auth/auth.controller.ts 생성 완료
✔ src/modules/auth/auth.service.ts 생성 완료
✔ src/modules/auth/auth.repository.ts 생성 완료
✔ src/modules/auth/auth.routes.ts 생성 완료
✔ src/modules/auth/auth.schema.ts 생성 완료
✔ src/modules/auth/auth.types.ts 생성 완료
```

---

## 📂 생성되는 파일

### 파일 구조

```
src/modules/{모듈명}/
├── {모듈명}.controller.ts   # 컨트롤러 (요청/응답 처리)
├── {모듈명}.service.ts       # 서비스 (비즈니스 로직)
├── {모듈명}.repository.ts    # 리포지토리 (DB 접근)
├── {모듈명}.routes.ts        # 라우터 (경로 정의)
├── {모듈명}.schema.ts        # Zod 스키마 (유효성 검증)
└── {모듈명}.types.ts         # 타입 정의
```

### 파일별 내용

#### controller.ts

- `create` - 생성 엔드포인트
- `getAll` - 목록 조회 엔드포인트
- `getById` - 상세 조회 엔드포인트
- `update` - 수정 엔드포인트
- `delete` - 삭제 엔드포인트

**특징:**

- 인증 필요 모듈: `AsyncAuthRequestHandler` 타입 사용, `req.user` 접근 가능
- 공개 모듈: `AsyncRequestHandler` 타입 사용

#### service.ts

- 비즈니스 로직 구현
- Repository 호출
- 에러 처리 (NotFoundError, ForbiddenError 등)
- 권한 확인 로직 (주석으로 제공)

#### repository.ts

- Prisma 쿼리
- CRUD 메서드 기본 구현
- 인증 필요 모듈: `findByUserId` 메서드 포함

#### routes.ts

- Express Router 정의
- Validate 미들웨어 적용
- AsyncHandler 적용
- 인증 필요 모듈: `authenticate` 미들웨어 자동 적용

#### schema.ts

- Zod 스키마 정의 (TODO 주석)
- DTO 타입 자동 생성
- `create`, `update`, `idParams` 스키마 템플릿

#### types.ts

- 도메인별 타입 정의 (TODO 주석)
- `CreateInput`, `UpdateInput`, `Response` 타입 템플릿

---

## 🛠️ 사용 예시

### 예시 1: Auth 모듈 (공개)

```bash
npm run generate:module
? 모듈 이름: auth
? 인증 필요: No
```

**생성 후 작업:**

1. `auth.schema.ts` - 로그인/회원가입 스키마 작성
2. `auth.types.ts` - 토큰 응답 타입 정의
3. `auth.service.ts` - JWT 토큰 생성 로직 구현
4. `app.ts` - 라우터 등록 (`app.use('/auth', authRouter)`)

### 예시 2: Projects 모듈 (인증 필요)

```bash
npm run generate:module
? 모듈 이름: projects
? 인증 필요: Yes
```

**생성 후 작업:**

1. `projects.schema.ts` - 프로젝트 생성/수정 스키마 작성
2. `projects.types.ts` - 프로젝트 응답 타입 정의
3. `projects.service.ts` - 프로젝트 소유자 검증 로직 추가
4. `app.ts` - 라우터 등록 (`app.use('/projects', projectRouter)`)

### 예시 3: Tasks 모듈 (인증 필요)

```bash
npm run generate:module
? 모듈 이름: tasks
? 인증 필요: Yes
```

**생성 후 작업:**

1. Prisma 스키마와 연동 (Task 모델)
2. 날짜 필드 처리 (startYear, endYear 등)
3. 프로젝트 멤버 권한 확인 로직 추가
4. 할당자 관리 로직 구현

---

## 📝 생성 후 체크리스트

새로운 모듈 생성 후 다음 사항을 확인하세요:

### 1. 스키마 작성

- [ ] `{module}.schema.ts`의 TODO 주석 확인
- [ ] Zod 스키마 필드 정의
- [ ] 유효성 검증 규칙 작성

### 2. 타입 정의

- [ ] `{module}.types.ts`의 TODO 주석 확인
- [ ] CreateInput 인터페이스 작성
- [ ] UpdateInput 인터페이스 작성
- [ ] Response 타입 확인

### 3. Repository 구현

- [ ] Prisma 모델과 연동
- [ ] 필드명 확인 (예: `userId` vs `ownerId`)
- [ ] 관계 필드 include 추가 (필요시)

### 4. Service 로직

- [ ] 비즈니스 규칙 구현
- [ ] 권한 확인 로직 활성화 (주석 해제)
- [ ] 에러 처리 추가

### 5. Controller 수정

- [ ] 응답 메시지 한글화
- [ ] 추가 로직 구현 (필요시)

### 6. Routes 확인

- [ ] 경로 확인 (`/:id`, `/` 등)
- [ ] Middleware 순서 확인
- [ ] 추가 라우트 정의 (필요시)

### 7. App 등록

- [ ] `app.ts`에 라우터 import
- [ ] `app.use('/{module}', {module}Router)` 추가

### 8. 테스트

- [ ] `npm run dev` 실행
- [ ] API 테스트 (Postman/Thunder Client)
- [ ] `npm run lint` 실행
- [ ] `npm run type-check` 실행

---

## 🎯 네이밍 규칙

### 모듈명 입력 시

| 입력       | 결과                      |
| ---------- | ------------------------- |
| `users`    | Users 모듈 (복수형, 기본) |
| `auth`     | Auth 모듈 (단수형, 예외)  |
| `projects` | Projects 모듈 (복수형)    |
| `tasks`    | Tasks 모듈 (복수형)       |

**권장:**

- ✅ 복수형 사용 (users, projects, tasks)
- ✅ 소문자 사용
- ✅ 케밥 케이스 허용 (auth-tokens → authTokens)

**비권장:**

- ❌ PascalCase (Users, Projects)
- ❌ camelCase (authTokens)
- ❌ 단수형 (user, project) - 특별한 경우 제외

### 생성되는 네이밍

#### 파일명

```
입력: projects
→ projects.controller.ts
→ projects.service.ts
→ projects.repository.ts
```

#### 변수명 (camelCase)

```
입력: projects
→ projectsController
→ projectsService
→ projectsRepository
```

#### 타입명 (PascalCase)

```
입력: projects → Project (단수형 변환)
→ CreateProjectDto
→ UpdateProjectDto
→ ProjectResponse
```

---

## 🔧 커스터마이징

### 템플릿 수정

템플릿은 `plop-templates/module/` 폴더에 있습니다:

```
plop-templates/module/
├── controller.hbs
├── service.hbs
├── repository.hbs
├── routes.hbs
├── schema.hbs
└── types.hbs
```

### Handlebars 헬퍼

**사용 가능한 헬퍼:**

- `{{pascalCase name}}` - PascalCase 변환 (users → Users)
- `{{camelCase name}}` - camelCase 변환 (auth-tokens → authTokens)
- `{{singular name}}` - 단수형 변환 (users → user, tasks → task)

### plopfile.js 수정

새로운 생성기 추가 가능:

```javascript
// plopfile.js
plop.setGenerator('service', {
    description: '서비스만 생성',
    prompts: [...],
    actions: [...],
});
```

---

## ⚠️ 주의사항

### 1. 기존 파일 덮어쓰기 방지

Plop은 기본적으로 기존 파일을 덮어쓰지 않습니다. 이미 존재하는 모듈을 다시 생성하면 오류가 발생합니다.

### 2. Prisma 스키마 먼저 작성

모듈 생성 전에 Prisma 스키마를 먼저 작성하는 것을 권장합니다:

```prisma
model Project {
    id      Int    @id @default(autoincrement())
    name    String
    ownerId Int
    // ...
}
```

### 3. Import 순서

생성된 파일은 ESLint import/order 규칙을 따릅니다:

1. 외부 라이브러리 (express, zod)
2. `@/` 별칭 import
3. 상대 경로 import
4. Type import

### 4. JSDoc 주석

생성된 파일에는 기본 JSDoc 주석이 포함되어 있습니다. 필요시 파라미터 설명을 추가하세요.

---

## 🛡️ 코드 컨벤션 자동 적용

Plop으로 생성된 코드는 자동으로 다음 규칙을 따릅니다:

✅ **파일 네이밍**

- modules 폴더: dot notation (`users.controller.ts`)
- 복수형 사용 (`users`, `projects`)

✅ **코드 스타일**

- JSDoc 주석 스타일 (`/** */`)
- 객체 패턴 default export
- Import 순서 정렬

✅ **3-Layer Architecture**

- Controller → Service → Repository 분리
- 각 계층의 책임 준수

✅ **타입 안전성**

- Zod 스키마 + DTO 타입
- TypeScript strict 모드

---

## 📚 참고 자료

- [CODE_CONVENTIONS.md](./CODE_CONVENTIONS.md) - 코드 컨벤션
- [AUTH_SETUP_GUIDE.md](./AUTH_SETUP_GUIDE.md) - 인증 패턴
- [Plop 공식 문서](https://plopjs.com/)

---

**작성일:** 2025-10-31

**Happy Coding! 🚀**
