---
name: 🐛 버그 리포트
about: 버그나 예상치 못한 동작을 보고해주세요
title: '[BUG] '
labels: bug
assignees: ''
---

## 🐛 버그 설명

버그에 대한 명확하고 간결한 설명을 작성해주세요.

## 📍 발생 위치

- **API 엔드포인트**: (예: `POST /auth/login`)
- **파일**: (예: `src/modules/auth/auth.controller.ts:45`)
- **함수/메서드**: (예: `login()`)

## 🔄 재현 방법

버그를 재현하기 위한 단계를 작성해주세요:

1. 다음 API를 호출: `POST /auth/login`
2. 다음 body와 함께 요청: `{ email: "test@test.com", password: "..." }`
3. 응답 확인
4. 에러 발생

## ✅ 예상 동작

어떤 동작이 일어나야 하는지 설명해주세요.

```json
// 예상 응답
{
    "accessToken": "...",
    "refreshToken": "..."
}
```

## ❌ 실제 동작

실제로 어떤 일이 발생했는지 설명해주세요.

```json
// 실제 응답
{
    "message": "서버 내부 오류가 발생했습니다."
}
```

## 📋 에러 로그

관련 에러 로그나 스택 트레이스를 첨부해주세요.

```
[ERROR] Global Error Handler
[ERROR] Name: TypeError
[ERROR] Message: Cannot read property 'id' of undefined
...
```

## 🌍 환경

- **Node.js 버전**: (예: v18.20.0)
- **패키지 버전**: (예: express ^5.1.0)
- **데이터베이스**: (예: PostgreSQL 16)
- **운영체제**: (예: macOS 15.0)

## 📸 스크린샷 (선택)

가능하다면 스크린샷을 첨부해주세요.

## 🔗 관련 이슈

관련된 이슈가 있다면 링크해주세요.

- Related to #

## 💭 추가 컨텍스트

버그에 대한 추가 정보가 있다면 작성해주세요.
