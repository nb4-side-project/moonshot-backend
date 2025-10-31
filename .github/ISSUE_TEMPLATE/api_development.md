---
name: 🔌 API 개발
about: 새로운 API 엔드포인트 개발을 위한 템플릿
title: '[API] '
labels: api, enhancement
assignees: ''
---

## 🎯 API 개요

<!-- 개발할 API의 목적과 개요를 설명해주세요 -->

## 📍 엔드포인트

```
[METHOD] /api/v1/[path]
```

**인증 및 권한:**

- [ ] 인증 필요 (JWT)
- [ ] 특정 권한 필요: ****\_\_\_****

## 📥 요청 (Request)

### Path/Query Parameters

```typescript
// 필요한 경우만 작성
```

### Request Body

```json
{
    // 요청 본문 예시
}
```

### Zod 스키마

```typescript
export const exampleSchema = z.object({
    // 스키마 정의
});
```

## 📤 응답 (Response)

### 성공 (2xx)

```json
{
    // 성공 응답 예시
}
```

### 에러 (4xx, 5xx)

```json
{
    "message": "에러 메시지"
}
```

## 🗃️ 데이터베이스

**관련 테이블:**

**주요 쿼리:**

```typescript
// Prisma 쿼리 예시
```

## 📝 구현 체크리스트

- [ ] Controller 구현
- [ ] Service 로직 구현
- [ ] Zod 스키마 작성
- [ ] Routes 연결
- [ ] 인증/권한 미들웨어 적용
- [ ] 에러 핸들링
- [ ] 테스트 (선택)

## 💬 추가 사항

<!-- 구현 시 고려사항이나 참고할 내용 -->
