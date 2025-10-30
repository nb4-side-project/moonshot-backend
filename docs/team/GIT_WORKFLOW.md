# Git 워크플로우 가이드

팀 프로젝트에서 사용하는 Git 명령어와 협업 워크플로우를 정리한 문서입니다.

---

## 목차

1. [기본 Git 설정](#1-기본-git-설정)
2. [브랜치 전략](#2-브랜치-전략)
3. [일상 워크플로우](#3-일상-워크플로우)
4. [커밋 컨벤션](#4-커밋-컨벤션)
5. [Pull Request 프로세스](#5-pull-request-프로세스)
6. [충돌 해결](#6-충돌-해결)
7. [유용한 Git 명령어](#7-유용한-git-명령어)
8. [협업 시나리오](#8-협업-시나리오)
9. [문제 해결](#9-문제-해결)
10. [Git Hooks](#10-git-hooks)

---

## 1. 기본 Git 설정

### 1.1 초기 설정

```bash
# 사용자 정보 설정 (최초 1회)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 기본 브랜치 이름 설정
git config --global init.defaultBranch main

# 에디터 설정
git config --global core.editor "code --wait"  # VSCode
git config --global core.editor "vim"           # Vim

# 줄바꿈 설정
git config --global core.autocrlf input         # macOS/Linux
git config --global core.autocrlf true          # Windows

# 설정 확인
git config --list
git config user.name
git config user.email
```

### 1.2 SSH 키 설정 (권장)

```bash
# SSH 키 생성
ssh-keygen -t ed25519 -C "your.email@example.com"

# SSH 키 복사 (macOS)
pbcopy < ~/.ssh/id_ed25519.pub

# SSH 키 복사 (Linux)
cat ~/.ssh/id_ed25519.pub

# GitHub에 등록
# Settings → SSH and GPG keys → New SSH key

# 연결 테스트
ssh -T git@github.com
```

### 1.3 저장소 복제

```bash
# HTTPS로 복제
git clone https://github.com/username/moonshot-backend.git

# SSH로 복제 (권장)
git clone git@github.com:username/moonshot-backend.git

# 특정 브랜치 복제
git clone -b develop git@github.com:username/moonshot-backend.git

# 복제 후 이동
cd moonshot-backend
```

---

## 2. 브랜치 전략

### 2.1 브랜치 구조 (Git Flow)

```
main (프로덕션)
  ↑
develop (개발)
  ↑
feature/기능명 (기능 개발)
hotfix/버그명 (긴급 수정)
```

### 2.2 브랜치 명명 규칙

```bash
# Feature 브랜치
feature/user-authentication
feature/project-crud
feature/task-management

# Bugfix 브랜치
bugfix/login-error
bugfix/task-delete-issue

# Hotfix 브랜치
hotfix/security-patch
hotfix/database-connection

# 개인 작업 브랜치
<이름>/feature/기능명
mone/feature/user-auth
```

### 2.3 브랜치 관리 명령어

```bash
# 브랜치 목록
git branch                          # 로컬 브랜치
git branch -r                       # 원격 브랜치
git branch -a                       # 전체 브랜치

# 브랜치 생성
git branch feature/user-auth        # 생성만
git checkout -b feature/user-auth   # 생성 + 이동
git switch -c feature/user-auth     # 생성 + 이동 (최신)

# 브랜치 이동
git checkout develop                # 이동 (구버전)
git switch develop                  # 이동 (권장)

# 브랜치 삭제
git branch -d feature/user-auth     # 로컬 삭제 (merge된 경우)
git branch -D feature/user-auth     # 로컬 강제 삭제
git push origin --delete feature/user-auth  # 원격 삭제

# 브랜치 이름 변경
git branch -m old-name new-name     # 다른 브랜치
git branch -m new-name              # 현재 브랜치
```

---

## 3. 일상 워크플로우

### 3.1 기능 개발 프로세스

```bash
# 1. 최신 코드 받기
git checkout develop
git pull origin develop

# 2. 새 브랜치 생성
git checkout -b feature/user-auth

# 3. 코드 작성
# ... 파일 수정 ...

# 4. 변경사항 확인
git status
git diff

# 5. 스테이징
git add .                           # 모든 변경사항
git add src/modules/auth/           # 특정 폴더
git add src/app.ts                  # 특정 파일

# 6. 커밋
git commit -m "feat: 사용자 인증 API 구현"

# 7. 원격 푸시
git push origin feature/user-auth

# 8. Pull Request 생성 (GitHub)
```

### 3.2 작업 중간 저장

```bash
# Stash: 임시 저장
git stash                           # 현재 변경사항 임시 저장
git stash save "작업 중인 기능"       # 메시지와 함께 저장

# Stash 목록
git stash list

# Stash 복원
git stash pop                       # 가장 최근 stash 복원 + 삭제
git stash apply                     # 복원만 (삭제 안 함)
git stash apply stash@{1}           # 특정 stash 복원

# Stash 삭제
git stash drop                      # 가장 최근 stash 삭제
git stash clear                     # 모든 stash 삭제
```

### 3.3 변경사항 확인

```bash
# 상태 확인
git status                          # 파일 상태
git status -s                       # 짧은 형식

# 변경 내용 보기
git diff                            # 스테이징 안 된 변경사항
git diff --staged                   # 스테이징된 변경사항
git diff HEAD                       # 모든 변경사항
git diff main..develop              # 브랜치 간 차이

# 파일별 변경사항
git diff src/app.ts
git diff --name-only                # 파일 이름만

# 로그
git log                             # 커밋 히스토리
git log --oneline                   # 한 줄로
git log --graph --oneline --all     # 그래프로
git log -n 5                        # 최근 5개
git log --author="mone"             # 특정 작성자
```

---

## 4. 커밋 컨벤션

### 4.1 커밋 메시지 구조

```
<타입>: <제목>

<본문> (선택)

<푸터> (선택)
```

### 4.2 커밋 타입

| 타입       | 설명                         | 예시                                 |
| ---------- | ---------------------------- | ------------------------------------ |
| `feat`     | 새 기능 추가                 | `feat: 사용자 인증 API 추가`         |
| `fix`      | 버그 수정                    | `fix: 로그인 토큰 만료 버그 수정`    |
| `docs`     | 문서 변경                    | `docs: API 명세서 업데이트`          |
| `style`    | 코드 포맷팅 (동작 변경 없음) | `style: Prettier 적용`               |
| `refactor` | 리팩토링                     | `refactor: 인증 로직 개선`           |
| `test`     | 테스트 추가/수정             | `test: 사용자 서비스 테스트 추가`    |
| `chore`    | 빌드/설정 변경               | `chore: ESLint 설정 추가`            |
| `perf`     | 성능 개선                    | `perf: 데이터베이스 쿼리 최적화`     |
| `ci`       | CI/CD 설정                   | `ci: GitHub Actions 워크플로우 추가` |
| `revert`   | 커밋 되돌리기                | `revert: feat: 사용자 인증 API 추가` |

### 4.3 좋은 커밋 메시지 예시

```bash
# 좋은 예 ✅
git commit -m "feat: JWT 기반 인증 미들웨어 구현"
git commit -m "fix: 프로젝트 삭제 시 cascading 버그 수정"
git commit -m "docs: SETUP_GUIDE.md에 Prisma 설정 추가"
git commit -m "refactor: 에러 핸들러를 커스텀 클래스로 개선"
git commit -m "test: 사용자 CRUD API 통합 테스트 추가"

# 나쁜 예 ❌
git commit -m "수정"
git commit -m "bug fix"
git commit -m "커밋"
git commit -m "WIP"
```

### 4.4 상세한 커밋 메시지

```bash
# 본문 포함
git commit -m "feat: 프로젝트 멤버 초대 기능 추가

- 이메일로 초대 링크 전송
- SendGrid API 연동
- 초대 수락/거절 엔드포인트 구현

Closes #123"

# 또는 에디터로 작성
git commit
# 에디터가 열리면 상세하게 작성
```

### 4.5 Commitlint 규칙

```bash
# .husky/commit-msg hook이 자동으로 검증

# 올바른 형식
feat: 기능 추가
fix: 버그 수정
docs: 문서 수정

# 잘못된 형식 (커밋 실패)
Feature: 기능 추가              # 타입 소문자 필수
feat : 기능 추가                # 콜론 앞 공백 불가
feat:기능 추가                  # 콜론 뒤 공백 필수
```

---

## 5. Pull Request 프로세스

### 5.1 PR 생성 전 체크리스트

```bash
# 1. 최신 코드 동기화
git checkout develop
git pull origin develop
git checkout feature/user-auth
git merge develop                   # 또는 rebase

# 2. 코드 품질 검증
npm run validate
npm run build

# 3. 커밋 정리 (필요시)
git log --oneline
git rebase -i HEAD~3                # 최근 3개 커밋 정리

# 4. 원격 푸시
git push origin feature/user-auth

# 5. GitHub에서 PR 생성
```

### 5.2 PR 템플릿

```markdown
## 📝 변경 사항

- 사용자 인증 API 구현
- JWT 토큰 기반 인증
- Access Token / Refresh Token 발급

## 🧪 테스트

- [x] 로그인 API 테스트
- [x] 토큰 갱신 API 테스트
- [x] 인증 미들웨어 테스트

## 📸 스크린샷 (선택)

![image](url)

## 🔗 관련 이슈

Closes #123

## 📌 리뷰 포인트

- JWT 만료 시간 설정이 적절한지 확인 필요
- 에러 처리 로직 검토 요청
```

### 5.3 PR 리뷰 및 머지

```bash
# 리뷰어 피드백 반영
git add .
git commit -m "refactor: 리뷰 피드백 반영 - 에러 메시지 개선"
git push origin feature/user-auth

# PR 승인 후 머지
# GitHub에서 "Merge pull request" 클릭

# 로컬 정리
git checkout develop
git pull origin develop
git branch -d feature/user-auth     # 로컬 브랜치 삭제
git push origin --delete feature/user-auth  # 원격 브랜치 삭제 (선택)
```

---

## 6. 충돌 해결

### 6.1 충돌 발생 시나리오

```bash
# develop 브랜치 최신화
git checkout develop
git pull origin develop

# feature 브랜치로 merge 시도
git checkout feature/user-auth
git merge develop
# CONFLICT 발생!
```

### 6.2 충돌 해결 프로세스

```bash
# 1. 충돌 파일 확인
git status

# 2. 충돌 파일 열기
# <<<<<<< HEAD
# 현재 브랜치 코드
# =======
# 머지하려는 브랜치 코드
# >>>>>>> develop

# 3. 충돌 해결 (직접 편집)
code src/app.ts

# 4. 충돌 해결 완료 표시
git add src/app.ts

# 5. 머지 커밋
git commit -m "merge: develop 브랜치 병합"

# 6. 푸시
git push origin feature/user-auth
```

### 6.3 충돌 해결 도구

```bash
# VSCode 사용 (권장)
code .
# VSCode가 충돌을 시각적으로 표시

# Git mergetool
git mergetool

# 충돌 취소
git merge --abort
git rebase --abort
```

---

## 7. 유용한 Git 명령어

### 7.1 되돌리기

```bash
# 스테이징 취소
git reset HEAD src/app.ts           # 특정 파일
git reset HEAD .                    # 모든 파일

# 파일 변경 취소 (주의!)
git checkout -- src/app.ts          # 특정 파일
git restore src/app.ts              # 특정 파일 (최신)

# 커밋 취소
git reset --soft HEAD~1             # 커밋만 취소 (파일 유지)
git reset --mixed HEAD~1            # 커밋 + 스테이징 취소
git reset --hard HEAD~1             # 커밋 + 파일 모두 취소 (주의!)

# 커밋 수정
git commit --amend                  # 마지막 커밋 수정
git commit --amend --no-edit        # 메시지 유지하고 파일 추가

# 특정 커밋으로 되돌리기
git revert <commit-hash>            # 새 커밋으로 되돌림 (안전)
```

### 7.2 검색

```bash
# 파일 이력 검색
git log -- src/app.ts               # 특정 파일의 커밋 이력
git log -p src/app.ts               # 변경 내용 포함

# 코드 검색
git grep "function"                 # 현재 코드에서 검색
git grep "function" main            # 특정 브랜치에서 검색

# 커밋 메시지 검색
git log --grep="auth"               # 커밋 메시지에서 검색
git log --author="mone"             # 작성자로 검색
git log --since="2 weeks ago"       # 날짜로 검색
```

### 7.3 태그 관리

```bash
# 태그 생성
git tag v1.0.0                      # Lightweight 태그
git tag -a v1.0.0 -m "버전 1.0.0"   # Annotated 태그 (권장)

# 태그 목록
git tag
git tag -l "v1.*"

# 태그 푸시
git push origin v1.0.0              # 특정 태그
git push origin --tags              # 모든 태그

# 태그 삭제
git tag -d v1.0.0                   # 로컬
git push origin --delete v1.0.0     # 원격

# 특정 태그로 체크아웃
git checkout v1.0.0
```

### 7.4 원격 저장소 관리

```bash
# 원격 저장소 확인
git remote -v

# 원격 저장소 추가
git remote add upstream https://github.com/original/repo.git

# 원격 저장소 제거
git remote remove origin

# 원격 저장소 URL 변경
git remote set-url origin git@github.com:username/repo.git

# 원격 브랜치 동기화
git fetch origin                    # 가져오기만
git pull origin develop             # 가져오기 + 머지
git pull --rebase origin develop    # 가져오기 + 리베이스
```

---

## 8. 협업 시나리오

### 8.1 시나리오 1: 새 기능 개발

```bash
# 1. 최신 코드 받기
git checkout develop
git pull origin develop

# 2. 기능 브랜치 생성
git checkout -b feature/task-crud

# 3. 작업
# ... 코드 작성 ...

# 4. 중간 커밋
git add .
git commit -m "feat: Task 생성 API 구현"

# ... 더 작업 ...

git add .
git commit -m "feat: Task 조회 API 구현"

# 5. develop 최신 코드 반영
git checkout develop
git pull origin develop
git checkout feature/task-crud
git merge develop

# 6. 푸시 및 PR
git push origin feature/task-crud
# GitHub에서 PR 생성

# 7. 리뷰 후 머지
# GitHub에서 Merge

# 8. 정리
git checkout develop
git pull origin develop
git branch -d feature/task-crud
```

### 8.2 시나리오 2: 긴급 버그 수정

```bash
# 1. main에서 hotfix 브랜치 생성
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug

# 2. 버그 수정
# ... 코드 수정 ...

# 3. 커밋 및 푸시
git add .
git commit -m "fix: 로그인 토큰 검증 버그 수정"
git push origin hotfix/critical-bug

# 4. main으로 PR 생성 및 머지
# GitHub에서 PR → main

# 5. develop에도 반영
git checkout develop
git pull origin develop
git merge hotfix/critical-bug
git push origin develop

# 6. 정리
git branch -d hotfix/critical-bug
```

### 8.3 시나리오 3: 동료 코드 리뷰

```bash
# 1. 동료의 브랜치 가져오기
git fetch origin
git checkout feature/user-auth      # 원격 브랜치 자동 추적

# 2. 코드 확인
git log --oneline
git diff develop..feature/user-auth

# 3. 로컬에서 테스트
npm install
npm run dev

# 4. GitHub에서 리뷰 코멘트 작성

# 5. 완료 후 자신의 브랜치로 복귀
git checkout feature/my-feature
```

---

## 9. 문제 해결

### 9.1 실수한 커밋 취소

```bash
# 마지막 커밋 취소 (파일 유지)
git reset --soft HEAD~1
git add .
git commit -m "올바른 커밋 메시지"

# 잘못된 파일 커밋한 경우
git reset HEAD~1
git add 올바른파일.ts
git commit -m "올바른 커밋"
```

### 9.2 잘못된 브랜치에 커밋

```bash
# feature-a에 작업해야 하는데 develop에 커밋한 경우

# 1. 현재 커밋 해시 확인
git log --oneline
# abc123 최신 커밋

# 2. 올바른 브랜치로 이동
git checkout feature-a

# 3. 커밋 가져오기
git cherry-pick abc123

# 4. develop에서 커밋 제거
git checkout develop
git reset --hard HEAD~1
```

### 9.3 푸시 취소

```bash
# 경고: 협업 중에는 위험!

# 로컬 커밋 취소 후 강제 푸시
git reset --hard HEAD~1
git push origin feature/my-feature --force

# 또는 되돌리는 커밋 생성 (안전)
git revert HEAD
git push origin feature/my-feature
```

### 9.4 원격 브랜치 복구

```bash
# 삭제한 브랜치 복구
git reflog
# abc123 HEAD@{1}: checkout: moving from feature/deleted

git checkout -b feature/deleted abc123
```

---

## 10. Git Hooks

### 10.1 Husky Hooks

**Pre-commit (커밋 전):**

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

**Commit-msg (커밋 메시지 검증):**

```bash
# .husky/commit-msg
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit $1
```

**Pre-push (푸시 전):**

```bash
# .husky/pre-push
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run validate
```

### 10.2 Hook 우회 (긴급 시만)

```bash
# Commit hook 우회
git commit --no-verify -m "긴급 수정"

# Push hook 우회
git push --no-verify
```

---

## 11. 빠른 참조

### 11.1 자주 쓰는 명령어

```bash
# 기본
git status                          # 상태 확인
git add .                           # 모든 변경사항 스테이징
git commit -m "메시지"              # 커밋
git push                            # 푸시

# 브랜치
git checkout -b feature/new         # 브랜치 생성 + 이동
git checkout develop                # 브랜치 이동
git merge feature/new               # 브랜치 병합

# 동기화
git pull origin develop             # 원격 가져오기
git fetch origin                    # 원격 정보 가져오기

# 되돌리기
git reset --soft HEAD~1             # 커밋 취소
git checkout -- 파일명              # 파일 변경 취소

# 정보
git log --oneline                   # 커밋 로그
git diff                            # 변경사항 확인
git branch -a                       # 모든 브랜치
```

### 11.2 Git 별칭 (Alias)

```bash
# ~/.gitconfig 또는 git config --global로 설정

git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.lg "log --graph --oneline --all"

# 사용
git co develop                      # git checkout develop
git st                              # git status
git lg                              # git log --graph --oneline --all
```

---

## 12. 팁과 트릭

### 12.1 유용한 설정

```bash
# 색상 활성화
git config --global color.ui auto

# 기본 에디터 설정
git config --global core.editor "code --wait"

# Pull 시 rebase 기본 설정
git config --global pull.rebase true

# 브랜치 자동 추적
git config --global push.autoSetupRemote true
```

### 12.2 생산성 향상

```bash
# 변경된 파일만 추가
git add -u

# 대화형 스테이징
git add -p

# 커밋과 동시에 모든 변경사항 추가
git commit -am "메시지"

# 빠른 커밋 (스테이징 생략)
git commit -a --no-verify -m "WIP"  # 개발 중 임시 저장용
```

---

**작성일:** 2025-10-29
**마지막 업데이트:** 2025-10-29

**참고**: 이 문서는 프로젝트 협업 경험을 바탕으로 지속적으로 업데이트됩니다.
