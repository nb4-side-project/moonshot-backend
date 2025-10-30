---
name: 🔌 API 개발
about: 새로운 API 엔드포인트 개발을 위한 템플릿
title: '[API] '
labels: api, enhancement
assignees: ''
---

## 🎯 API 개요

개발할 API의 목적과 개요를 설명해주세요.

## 📍 엔드포인트 정보

### 메서드 및 경로

```
POST /api/v1/projects/:projectId/tasks
```

### 인증

- [x] 인증 필요 (JWT Bearer Token)
- [ ] 인증 불필요

### 권한

- [x] 프로젝트 멤버만 접근 가능
- [ ] 프로젝트 소유자만 접근 가능
- [ ] 모든 사용자 접근 가능

## 📥 요청 (Request)

### Headers

```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Path Parameters

```typescript
projectId: number; // 프로젝트 ID
```

### Query Parameters

```typescript
// 해당하는 경우만 작성
page?: number     // 페이지 번호 (default: 1)
limit?: number    // 페이지당 항목 수 (default: 10)
```

### Body (JSON)

```json
{
    "title": "새로운 할 일",
    "description": "할 일 설명",
    "startYear": 2025,
    "startMonth": 10,
    "startDay": 30,
    "endYear": 2025,
    "endMonth": 11,
    "endDay": 5,
    "status": "todo",
    "tags": ["긴급", "버그"]
}
```

### Zod 스키마

```typescript
export const createTaskSchema = z.object({
    title: z.string().min(1, '제목은 필수입니다'),
    description: z.string().optional(),
    startYear: z.number().int().min(2000),
    startMonth: z.number().int().min(1).max(12),
    startDay: z.number().int().min(1).max(31),
    endYear: z.number().int().min(2000),
    endMonth: z.number().int().min(1).max(12),
    endDay: z.number().int().min(1).max(31),
    status: z.enum(['todo', 'in_progress', 'done']).default('todo'),
    tags: z.array(z.string()).optional(),
});
```

## 📤 응답 (Response)

### 성공 응답 (201 Created)

```json
{
    "id": 1,
    "projectId": 5,
    "title": "새로운 할 일",
    "description": "할 일 설명",
    "startYear": 2025,
    "startMonth": 10,
    "startDay": 30,
    "endYear": 2025,
    "endMonth": 11,
    "endDay": 5,
    "status": "todo",
    "assignee": {
        "id": 10,
        "name": "홍길동",
        "email": "user@example.com",
        "profileImage": "https://..."
    },
    "tags": [
        { "id": 1, "name": "긴급" },
        { "id": 2, "name": "버그" }
    ],
    "createdAt": "2025-10-30T00:00:00.000Z",
    "updatedAt": "2025-10-30T00:00:00.000Z"
}
```

### 에러 응답

```json
// 400 Bad Request
{
  "message": "유효성 검증에 실패했습니다.",
  "details": [
    {
      "field": "title",
      "message": "제목은 필수입니다"
    }
  ]
}

// 401 Unauthorized
{
  "message": "로그인이 필요합니다"
}

// 403 Forbidden
{
  "message": "프로젝트 멤버가 아닙니다"
}

// 404 Not Found
{
  "message": "프로젝트를 찾을 수 없습니다"
}
```

## 🗃️ 데이터베이스

### 관련 테이블

- `tasks`
- `tags`
- `task_tags`

### 쿼리 예시

```typescript
const task = await prisma.task.create({
    data: {
        projectId,
        title: data.title,
        description: data.description,
        startYear: data.startYear,
        // ...
        assigneeId: userId,
        tags: {
            create: tagIds.map((tagId) => ({
                tagId,
            })),
        },
    },
    include: {
        assignee: {
            select: {
                id: true,
                name: true,
                email: true,
                profileImage: true,
            },
        },
        tags: {
            include: {
                tag: true,
            },
        },
    },
});
```

## 🧪 테스트 케이스

- [ ] 정상적인 요청 처리
- [ ] 인증되지 않은 사용자 접근 차단
- [ ] 권한 없는 사용자 접근 차단
- [ ] 유효성 검증 실패 처리
- [ ] 존재하지 않는 프로젝트 접근 시도
- [ ] 태그 자동 생성 (없는 경우)
- [ ] 담당자 자동 지정

## 📝 구현 체크리스트

- [ ] Controller 구현
- [ ] Service 로직 구현
- [ ] DTO (Zod 스키마) 작성
- [ ] Routes 연결
- [ ] 인증 미들웨어 적용
- [ ] 권한 검증 로직 추가
- [ ] 에러 핸들링
- [ ] API 문서 업데이트
- [ ] 단위 테스트 작성 (선택)
- [ ] 통합 테스트 작성 (선택)

## 🔗 관련 이슈/문서

- API 명세서: docs/API_SPECIFICATION.md
- Related to #

## 💭 추가 사항

구현 시 고려해야 할 사항이나 주의점을 작성해주세요.
