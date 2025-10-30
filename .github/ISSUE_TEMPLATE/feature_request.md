---
name: ✨ 기능 요청
about: 새로운 기능이나 개선 사항을 제안해주세요
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

## 🎯 목표

이 기능을 통해 달성하고자 하는 목표를 설명해주세요.

## 💡 제안하는 기능

제안하는 기능에 대한 명확하고 간결한 설명을 작성해주세요.

## 📝 상세 설명

### API 엔드포인트 (해당하는 경우)

```
POST /api/projects/:id/members
```

### 요청 형식

```json
{
    "userId": 123,
    "role": "member"
}
```

### 응답 형식

```json
{
    "id": 1,
    "projectId": 5,
    "userId": 123,
    "role": "member",
    "createdAt": "2025-10-30T00:00:00.000Z"
}
```

## 🗃️ 데이터베이스 변경 (해당하는 경우)

새로운 테이블, 컬럼 추가 등이 필요한 경우 작성해주세요.

```prisma
model ProjectMember {
    id        Int      @id @default(autoincrement())
    projectId Int
    userId    Int
    role      String   @default("member")
    createdAt DateTime @default(now())

    project Project @relation(fields: [projectId], references: [id])
    user    User    @relation(fields: [userId], references: [id])

    @@unique([projectId, userId])
}
```

## 🔐 보안 고려사항

이 기능과 관련된 보안 이슈가 있다면 작성해주세요.

- 인증/인가 필요 여부
- 데이터 검증 요구사항
- Rate limiting 필요 여부

## 📚 참고 자료

관련 문서, 링크, 예시 등을 첨부해주세요.

## ✅ 완료 조건 (Definition of Done)

이 기능이 완료되었다고 판단할 수 있는 조건을 작성해주세요.

- [ ] API 엔드포인트 구현 완료
- [ ] 유효성 검증 추가
- [ ] 에러 핸들링 구현
- [ ] 단위 테스트 작성
- [ ] API 문서 업데이트
- [ ] 프론트엔드 연동 테스트 완료

## 🔗 관련 이슈

관련된 이슈가 있다면 링크해주세요.

- Related to #

## 💭 추가 컨텍스트

기능에 대한 추가 정보가 있다면 작성해주세요.
