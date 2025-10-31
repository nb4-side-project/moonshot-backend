# GitHub 자동화 및 정책 가이드

> **작성일**: 2025-10-31
> **목적**: GitHub Actions, Bot, 템플릿 등 자동화 정책 안내

---

## 📋 목차

1. [개요](#1-개요)
2. [CI/CD (Continuous Integration)](#2-cicd-continuous-integration)
3. [Dependabot (의존성 업데이트)](#3-dependabot-의존성-업데이트)
4. [Stale Bot (비활성 이슈/PR 관리)](#4-stale-bot-비활성-이슈pr-관리)
5. [Auto Label (자동 라벨링)](#5-auto-label-자동-라벨링)
6. [Issue 템플릿](#6-issue-템플릿)
7. [PR 템플릿](#7-pr-템플릿)

---

## 1. 개요

프로젝트의 `.github` 폴더에는 다음과 같은 자동화 설정이 포함되어 있습니다:

```
.github/
├── workflows/
│   ├── ci.yml           # CI/CD 파이프라인
│   ├── auto-label.yml   # 자동 라벨링
│   └── stale.yml        # 비활성 이슈/PR 자동 닫기
├── ISSUE_TEMPLATE/      # 이슈 템플릿 (5개)
├── pull_request_template.md
├── dependabot.yml       # 의존성 자동 업데이트
└── labeler.yml          # 라벨링 규칙
```

---

## 2. CI/CD (Continuous Integration)

### 📍 파일 위치

`.github/workflows/ci.yml`

### ⚡ 실행 시점

- `main`, `develop` 브랜치에 push 시
- `main`, `develop` 브랜치로 PR 생성 시

### 🔍 검사 항목

#### **1단계: Lint and Type Check**

```yaml
Node 버전: 20.x (단일 버전)
```

실행 검사:

- ✅ ESLint 검사 (`npm run lint:check`)
- ✅ Prettier 포맷 검사 (`npm run format:check`)
- ✅ TypeScript 타입 체크 (`npm run type-check`)
- ✅ Prisma 스키마 검증 (`npx prisma validate`)

#### **2단계: Build**

- ✅ Prisma Client 생성
- ✅ 프로젝트 빌드 (`npm run build`)
- ✅ 빌드 아티팩트 업로드 (7일 보관)

### ⚠️ 주의사항

**PR 머지 전 필수 통과:**
모든 CI 검사를 통과해야 PR을 머지할 수 있습니다.

**로컬에서 미리 확인:**

```bash
# 전체 검사 실행
npm run validate

# 개별 실행
npm run lint:check
npm run format:check
npm run type-check
npm run build
```

---

## 3. Dependabot (의존성 업데이트)

### 📍 파일 위치

`.github/dependabot.yml`

### ⚙️ 설정

#### npm 패키지

```yaml
주기: 매월 첫째 주 월요일 09:00 (KST)
최대 PR 개수: 3개
자동 무시: 메이저 버전 업데이트
```

#### GitHub Actions

```yaml
주기: 매월
```

### 📋 동작 방식

1. **자동 PR 생성**
    - 월 1회, 최대 3개의 PR 자동 생성
    - PR 제목: `chore(deps): update dependency-name to vX.X.X`

2. **라벨 자동 추가**
    - `dependencies` 라벨
    - `automated` 라벨

3. **리뷰어 자동 지정**
    - `@nb4-side-project/moonshot-backend-team`

### ✅ 처리 방법

1. PR 확인 후 로컬 테스트
2. 문제없으면 승인 & 머지
3. 메이저 업데이트는 수동 검토 필요

---

## 4. Stale Bot (비활성 이슈/PR 관리)

### 📍 파일 위치

`.github/workflows/stale.yml`

### ⚡ 실행 시점

매주 월요일 오전 9시 (KST)

### ⚙️ 설정

#### Issue

```yaml
비활동 기간: 90일
경고 기간: 14일
총 닫힘까지: 104일 (약 3.5개월)
```

#### Pull Request

```yaml
비활동 기간: 60일
경고 기간: 14일
총 닫힘까지: 74일 (약 2.5개월)
```

### 🛡️ 제외 라벨

다음 라벨이 있는 이슈/PR은 자동 닫기 대상에서 제외됩니다:

- `pinned` - 중요한 이슈
- `security` - 보안 관련
- `in-progress` - 진행 중
- `blocked` - 외부 요인으로 차단됨
- `work-in-progress` - 작업 중 (PR)

### 📝 처리 방법

**Stale 라벨이 추가된 경우:**

1. 이슈/PR이 여전히 유효하면 → 댓글 작성 (자동으로 stale 라벨 제거됨)
2. 더 이상 필요없으면 → 그대로 두기 (14일 후 자동 닫힘)

**자동으로 닫힌 경우:**

- 필요하면 언제든 다시 열 수 있습니다

---

## 5. Auto Label (자동 라벨링)

### 📍 파일 위치

`.github/workflows/auto-label.yml`
`.github/labeler.yml`

### ⚡ 실행 시점

PR 생성, 수정, 동기화 시

### 🏷️ 자동 라벨 규칙

#### 파일 경로 기반

| 변경된 파일                   | 라벨             |
| ----------------------------- | ---------------- |
| `src/modules/auth/**/*`       | `auth`           |
| `prisma/**/*`                 | `database`       |
| `**/*.controller.ts`          | `api`            |
| `**/*.service.ts`             | `service`        |
| `**/*.schema.ts`              | `validation`     |
| `src/shared/middlewares/**/*` | `middleware`     |
| `src/shared/errors/**/*`      | `error-handling` |
| `docs/**/*`                   | `documentation`  |
| `**/*.test.ts`                | `test`           |
| `.github/workflows/**/*`      | `ci/cd`          |
| `package.json`                | `dependencies`   |

#### PR 크기 기반

| 변경 라인 수 | 라벨      |
| ------------ | --------- |
| 1-10줄       | `size/XS` |
| 11-100줄     | `size/S`  |
| 101-500줄    | `size/M`  |
| 501-1000줄   | `size/L`  |
| 1000줄 이상  | `size/XL` |

**XL 크기 PR 시:**

- 자동 코멘트: "이 PR은 매우 큽니다. 더 작은 PR로 나누는 것을 고려해주세요."

---

## 6. Issue 템플릿

### 📍 파일 위치

`.github/ISSUE_TEMPLATE/`

### 📋 템플릿 종류

#### 1️⃣ API 개발 (`api_development.md`)

새로운 API 엔드포인트 개발 시 사용

**포함 내용:**

- 엔드포인트 정보 (메서드, 경로, 인증)
- Request/Response 예시
- Zod 스키마
- 데이터베이스 쿼리
- 구현 체크리스트

**사용 예시:**

```
제목: [API] POST /projects 프로젝트 생성
```

#### 2️⃣ 버그 리포트 (`bug_report.md`)

버그 발견 시 사용

**포함 내용:**

- 버그 설명
- 재현 단계
- 예상 동작 vs 실제 동작
- 환경 정보

#### 3️⃣ 기능 요청 (`feature_request.md`)

새로운 기능 제안 시 사용

#### 4️⃣ TODO 생성 (`todo-생성-템플릿.md`)

작업 항목 생성 시 사용

#### 5️⃣ 기본 이슈 (`기본-이슈-생성-템플릿.md`)

일반적인 이슈 사용

---

## 7. PR 템플릿

### 📍 파일 위치

`.github/pull_request_template.md`

### 📝 구조

```markdown
## 📝 변경 사항

<!-- 무엇을 변경했는지 간단히 설명 -->

## 🔗 관련 이슈

<!-- Closes #123 -->

## ✅ 체크리스트

- [ ] 코드 작성 완료
- [ ] 로컬에서 테스트 완료
- [ ] Lint/Format 검사 통과
- [ ] 타입 체크 통과
- [ ] 문서 업데이트 (필요시)

## 💬 참고사항

<!-- 리뷰어에게 알려줄 내용 -->
```

### 🎯 작성 가이드

1. **변경 사항**: 핵심 변경사항을 3-5줄로 요약
2. **관련 이슈**: `Closes #123` 또는 `Related to #123`
3. **체크리스트**: 모두 체크 후 PR 생성
4. **참고사항**: 리뷰 포인트나 특이사항

---

## 8. 팁 & 베스트 프랙티스

### ✅ CI 실패 시

```bash
# 로컬에서 검사
npm run lint
npm run format
npm run type-check

# 수정 후 커밋
git add .
git commit -m "fix: resolve lint errors"
git push
```

### ✅ Dependabot PR 처리

```bash
# 1. PR 브랜치 체크아웃
gh pr checkout [PR-NUMBER]

# 2. 로컬 테스트
npm run dev
npm run build

# 3. 문제 없으면 머지
gh pr merge [PR-NUMBER] --squash
```

### ✅ 큰 PR 피하기

- 500줄 이상 변경 시 → 여러 PR로 분리
- 기능별로 작은 단위로 PR 생성
- Draft PR 활용하여 진행상황 공유

---

## 9. 변경 이력

### 2025-10-31

- ✅ CI Node 버전: 18.x, 20.x → 20.x 단일화 (실행 시간 50% 단축)
- ✅ Dependabot: 주간 10개 PR → 월간 3개 PR (부담 92% 감소)
- ✅ Stale bot 기간 연장:
    - Issue: 30+7일 → 90+14일
    - PR: 14+7일 → 60+14일
- ✅ PR 템플릿 간소화: 67줄 → 20줄 (70% 감소)
- ✅ API Issue 템플릿 간소화: 224줄 → 86줄 (62% 감소)

---

**마지막 업데이트:** 2025-10-31

**Happy Automation! 🤖**
