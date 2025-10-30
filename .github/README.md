# .github 디렉토리

이 디렉토리는 GitHub 관련 설정 파일과 템플릿을 포함합니다.

## 📁 구조

```
.github/
├── ISSUE_TEMPLATE/          # 이슈 템플릿
│   ├── bug_report.md        # 버그 리포트
│   ├── feature_request.md   # 기능 요청
│   ├── api_development.md   # API 개발
│   ├── todo-생성-템플릿.md    # Todo/작업 계획
│   └── 기본-이슈-생성-템플릿.md # 일반 이슈
├── workflows/               # GitHub Actions 워크플로우
│   ├── ci.yml              # CI 파이프라인
│   ├── auto-label.yml      # 자동 라벨링
│   └── stale.yml           # Stale 이슈/PR 관리
├── CODEOWNERS              # 코드 소유자 정의
├── dependabot.yml          # Dependabot 설정
├── labeler.yml             # Auto-label 설정
└── pull_request_template.md # PR 템플릿
```

## 🎯 사용 가이드

### 이슈 템플릿

새로운 이슈를 생성할 때, 목적에 맞는 템플릿을 선택하세요:

1. **🐛 버그 리포트** (`bug_report.md`)
    - API 에러, 데이터베이스 오류 등의 버그를 보고할 때
    - 재현 방법, 예상/실제 동작, 에러 로그 포함

2. **✨ 기능 요청** (`feature_request.md`)
    - 새로운 기능이나 개선 사항을 제안할 때
    - API 명세, DB 스키마 변경, 보안 고려사항 포함

3. **🔌 API 개발** (`api_development.md`)
    - 새로운 API 엔드포인트를 개발할 때
    - 요청/응답 형식, Zod 스키마, 테스트 케이스 포함

4. **✅ Todo / 작업 계획** (`todo-생성-템플릿.md`)
    - 일일 작업 계획이나 Sprint Todo를 작성할 때
    - 백엔드 개발, 테스트, 문서화, 배포 체크리스트 포함

5. **📋 일반 이슈** (`기본-이슈-생성-템플릿.md`)
    - 위 카테고리에 속하지 않는 일반적인 이슈

### PR 템플릿

PR을 생성하면 자동으로 템플릿이 적용됩니다. 다음 섹션을 작성하세요:

- 배경 (Background)
- 관련 이슈 (Related Issues)
- 구현 사항 (Implementation Details)
- 리뷰 요청사항 (Review Request)
- 후속 작업 (Next Steps)
- 알리고 싶은 사항 (Notes)

### GitHub Actions 워크플로우

#### CI 파이프라인 (`ci.yml`)

PR 또는 Push 시 자동으로 실행됩니다:

- ✅ ESLint 검사
- ✅ Prettier 포맷 검사
- ✅ TypeScript 타입 체크
- ✅ Prisma 스키마 검증
- ✅ 빌드 테스트

#### 자동 라벨링 (`auto-label.yml`)

PR 생성 시 변경된 파일에 따라 자동으로 라벨을 추가합니다:

- `auth`, `database`, `api`, `config` 등
- PR 크기에 따라 `size/XS` ~ `size/XL` 라벨 추가

#### Stale 관리 (`stale.yml`)

- 이슈: 30일 활동 없음 → `stale` 라벨 → 7일 후 자동 닫힘
- PR: 14일 활동 없음 → `stale` 라벨 → 7일 후 자동 닫힘
- `pinned`, `security`, `in-progress`, `blocked` 라벨이 있는 이슈/PR은 제외

### CODEOWNERS

파일별 코드 소유자가 정의되어 있습니다. PR 생성 시 해당 파일의 소유자가 자동으로 리뷰어로 지정됩니다:

- 인증 관련: `@nb4-side-project/auth-team`
- 데이터베이스: `@nb4-side-project/database-team`
- 설정 파일: `@nb4-side-project/devops-team`
- 문서: `@nb4-side-project/documentation-team`

### Dependabot

자동으로 의존성 업데이트 PR을 생성합니다:

- **npm 패키지**: 매주 월요일 오전 9시 (KST)
- **GitHub Actions**: 매월 1회
- 메이저 버전 업데이트는 제외 (수동 관리)

## 🛠️ 커스터마이징

### 새로운 이슈 템플릿 추가

`ISSUE_TEMPLATE/` 폴더에 새로운 `.md` 파일을 생성하세요:

```markdown
---
name: 템플릿 이름
about: 템플릿 설명
title: '[PREFIX] '
labels: 'label1,label2'
assignees: ''
---

템플릿 내용...
```

### 새로운 워크플로우 추가

`workflows/` 폴더에 새로운 `.yml` 파일을 생성하세요:

```yaml
name: Workflow Name

on:
    push:
        branches: [main]

jobs:
    job-name:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            # ...
```

### 라벨링 규칙 수정

`labeler.yml` 파일을 수정하여 자동 라벨링 규칙을 변경할 수 있습니다:

```yaml
'새로운-라벨':
    - 'path/to/files/**/*'
```

## 📚 참고 자료

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [About Issue Templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/about-issue-and-pull-request-templates)
- [About CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [Configuring Dependabot](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file)

---

**마지막 업데이트**: 2025-10-30
