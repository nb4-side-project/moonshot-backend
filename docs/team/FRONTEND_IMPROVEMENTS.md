# 프론트엔드 개선 사항 (향후 작업)

> **작성일**: 2025-10-30
> **프론트엔드 경로**: `/Users/mone/Downloads/project-moonshot-fe-main`
> **목적**: 백엔드 구현 후 프론트엔드 코드 개선 및 구글 로그인 구현 가이드

---

## 목차

1. [현재 프론트엔드 토큰 정책 분석](#1-현재-프론트엔드-토큰-정책-분석)
2. [수정 필요 버그](#2-수정-필요-버그)
3. [구글 로그인 구현 가이드](#3-구글-로그인-구현-가이드)
4. [추가 개선 사항](#4-추가-개선-사항)

---

## 1. 현재 프론트엔드 토큰 정책 분석

### 1.1 현재 구조 (올바른 방식)

**토큰 저장**: httpOnly 쿠키 ✅

- XSS 공격 방지
- Next.js 서버에서 관리

**토큰 전송**: Authorization 헤더 (Bearer 스킴) ✅

- Axios 인터셉터에서 자동 추가
- 백엔드 표준 방식

**토큰 갱신**: 401 에러 시 자동 갱신 ✅

- Response 인터셉터에서 처리
- 사용자 경험 향상

### 1.2 주요 파일 위치

| 파일                          | 역할                   |
| ----------------------------- | ---------------------- |
| `shared/auth.ts`              | 토큰 저장/조회/삭제    |
| `shared/axios.ts`             | Axios 인터셉터 설정    |
| `shared/api.ts`               | API 호출 함수          |
| `app/(auth)/login/actions.ts` | 로그인 Server Action   |
| `app/(main)/action.ts`        | 로그아웃 Server Action |

---

## 2. 수정 필요 버그

### 🚨 버그 1: 토큰 갱신 API 헤더 설정 오류 (심각)

**파일**: `shared/api.ts`

**현재 코드** (❌ 잘못됨):

```typescript
export const refreshToken = async (refreshToken: string | null) => {
    try {
        const response = await axios.post('/auth/refresh', {
            headers: {
                Authorization: `Bearer ${refreshToken}`,
            },
        });
        return response.data;
    } catch (error) {
        // ...
    }
};
```

**문제점**:

- `headers`가 request body에 포함됨
- 백엔드가 Authorization 헤더를 받지 못함

**수정안**:

```typescript
export const refreshToken = async (refreshToken: string | null) => {
    try {
        const response = await axios.post(
            '/auth/refresh',
            {}, // ✅ 빈 body
            {
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                },
            },
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};
```

---

### 🚨 버그 2: 401 인터셉터 무한 루프 위험

**파일**: `shared/axios.ts`

**현재 코드** (⚠️ 위험):

```typescript
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest) {
            // ❌ 잘못된 조건
            await refreshTokens();
            return axios(originalRequest);
        }
        return Promise.reject(error);
    },
);
```

**문제점**:

1. `!originalRequest` 조건이 의미 없음
2. 무한 루프 방지 장치 없음
3. `/auth/refresh` 자체가 401을 반환하면 무한 루프

**수정안**:

```typescript
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 401 에러이고, 재시도한 적이 없으며, /auth/refresh 요청이 아닌 경우
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/auth/refresh') // ✅ 추가
        ) {
            originalRequest._retry = true; // ✅ 무한 루프 방지

            const newTokens = await refreshTokens();
            if (newTokens) {
                // 새 토큰으로 헤더 업데이트
                originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
                return axios(originalRequest);
            } else {
                // 토큰 갱신 실패 시 로그인 페이지로 리다이렉트
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    },
);
```

---

### 🔧 개선 사항 1: 로그아웃 시 백엔드 호출 추가

**파일**: `app/(main)/action.ts`

**현재 코드** (⚠️ 불완전):

```typescript
export const logout = async (): Promise<ActionResult<void>> => {
    try {
        await deleteAuthCookies(); // 프론트엔드 쿠키만 삭제
        redirect('/login');
    } catch (error) {
        // ...
    }
};
```

**문제점**:

- 백엔드 DB에 저장된 Refresh Token이 남아있음
- 보안 취약점

**수정안**:

```typescript
export const logout = async (): Promise<ActionResult<void>> => {
    try {
        // 1. 백엔드에 로그아웃 요청 (DB의 Refresh Token 삭제)
        try {
            await api.logout();
        } catch (error) {
            console.error('Logout API failed:', error);
            // 실패해도 계속 진행
        }

        // 2. 프론트엔드 쿠키 삭제
        await deleteAuthCookies();

        redirect('/login');
    } catch (error) {
        return {
            success: null,
            error: error instanceof Error ? error.message : '로그아웃 중 오류가 발생했습니다.',
            data: null,
        };
    }
};
```

**백엔드 API 추가** (`shared/api.ts`):

```typescript
export const logout = async () => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) return;

    await axios.post(
        '/auth/logout',
        {},
        {
            headers: {
                Authorization: `Bearer ${refreshToken}`,
            },
        },
    );
};

export const logoutAll = async () => {
    const accessToken = await getAccessToken();
    if (!accessToken) return;

    await axios.post(
        '/auth/logout/all',
        {},
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    );
};
```

---

### 🔧 개선 사항 2: 토큰 만료 시간 일치

**파일**: `shared/auth.ts`

**현재 코드** (⚠️ 불일치):

```typescript
export const setAuthCookies = async (accessToken: string, refreshToken: string) => {
    const cookieStore = await cookies();
    cookieStore.set(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 60 * 60 * 24 * 30, // ❌ 30일 (너무 김)
        path: '/',
    });
    cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 60 * 60 * 24 * 30, // ❌ 30일
        path: '/',
    });
};
```

**수정안**:

```typescript
export const setAuthCookies = async (accessToken: string, refreshToken: string) => {
    const cookieStore = await cookies();

    // Access Token 쿠키 (15분)
    cookieStore.set(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 60 * 15, // ✅ 15분 (백엔드 JWT와 동일)
        path: '/',
    });

    // Refresh Token 쿠키 (7일)
    cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 60 * 60 * 24 * 7, // ✅ 7일 (백엔드 JWT와 동일)
        path: '/',
    });
};
```

---

## 3. 구글 로그인 구현 가이드

### 3.1 백엔드 구현 (먼저 완료)

#### 1. Google OAuth 설정

**환경 변수** (`.env`):

```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3001/auth/google/callback
```

#### 2. Google 로그인 시작 엔드포인트

**파일**: `src/modules/auth/auth.controller.ts`

```typescript
import { GOOGLE_CLIENT_ID, BASE_URL } from '@/shared/constants/constants.js';

/**
 * 구글 로그인 시작
 *
 * @route GET /auth/google
 * @access Public
 */
export const googleLogin: AsyncRequestHandler = async (req, res) => {
    const googleAuthUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${GOOGLE_CLIENT_ID}&` +
        `redirect_uri=${BASE_URL}/auth/google/callback&` +
        `response_type=code&` +
        `scope=email profile&` +
        `access_type=offline&` +
        `prompt=consent`;

    res.redirect(googleAuthUrl);
};
```

#### 3. Google 콜백 처리

```typescript
import axios from 'axios';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, FRONTEND_URL } from '@/shared/constants/constants.js';

/**
 * 구글 로그인 콜백
 *
 * @route GET /auth/google/callback
 * @access Public
 */
export const googleCallback: AsyncRequestHandler = async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.redirect(`${FRONTEND_URL}/login?error=google_auth_failed`);
    }

    try {
        // 1. Google로부터 액세스 토큰 받기
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: `${BASE_URL}/auth/google/callback`,
            grant_type: 'authorization_code',
        });

        const { access_token } = tokenResponse.data;

        // 2. Google 사용자 정보 가져오기
        const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        const googleUser = userInfoResponse.data;

        // 3. DB에서 사용자 찾거나 생성
        let user = await prisma.user.findUnique({
            where: { email: googleUser.email },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: googleUser.email,
                    name: googleUser.name,
                    profileImage: googleUser.picture,
                    provider: 'google',
                    providerId: googleUser.id,
                    password: null, // OAuth 사용자는 비밀번호 없음
                },
            });
        } else if (user.provider !== 'google') {
            // 이미 로컬 계정으로 가입한 이메일
            return res.redirect(`${FRONTEND_URL}/login?error=email_already_exists`);
        }

        // 4. JWT 토큰 생성
        const accessToken = generateAccessToken({ id: user.id, email: user.email });
        const refreshToken = generateRefreshToken(user.id);

        // 5. Refresh Token DB 저장
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        // 6. 프론트엔드로 리다이렉트 (쿼리에 토큰 포함)
        res.redirect(`${FRONTEND_URL}/auth/callback?` + `accessToken=${accessToken}&` + `refreshToken=${refreshToken}`);
    } catch (error) {
        console.error('Google OAuth error:', error);
        res.redirect(`${FRONTEND_URL}/login?error=google_auth_failed`);
    }
};
```

#### 4. 라우트 등록

**파일**: `src/modules/auth/auth.routes.ts`

```typescript
import { Router } from 'express';
import * as authController from './auth.controller.js';

const router = Router();

// Google OAuth
router.get('/google', authController.googleLogin);
router.get('/google/callback', authController.googleCallback);

export default router;
```

---

### 3.2 프론트엔드 구현

#### 1. OAuth 콜백 페이지 생성

**파일**: `app/auth/callback/page.tsx` (신규 생성)

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setAuthCookies } from '@/shared/auth';
import { toast } from 'react-toastify';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const error = searchParams.get('error');

    if (error) {
      let errorMessage = '로그인 중 오류가 발생했습니다.';

      switch (error) {
        case 'google_auth_failed':
          errorMessage = '구글 로그인에 실패했습니다.';
          break;
        case 'email_already_exists':
          errorMessage = '이미 가입된 이메일입니다. 로컬 계정으로 로그인해주세요.';
          break;
      }

      toast.error(errorMessage);
      router.push('/login');
      return;
    }

    if (accessToken && refreshToken) {
      // 쿠키에 토큰 저장
      setAuthCookies(accessToken, refreshToken)
        .then(() => {
          toast.success('로그인되었습니다.');
          router.push('/');
        })
        .catch((err) => {
          console.error('Failed to set cookies:', err);
          toast.error('로그인 중 오류가 발생했습니다.');
          router.push('/login');
        });
    } else {
      toast.error('로그인 정보가 올바르지 않습니다.');
      router.push('/login');
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
}
```

#### 2. 소셜 로그인 버튼 수정

**파일**: `app/(auth)/components/SocialButton.tsx`

**현재 코드** (동작 안 함):

```typescript
<button
  className={cx(styles.button, styles[provider])}
  onClick={() => {
    // TODO: 소셜 로그인 구현
  }}
>
  {/* ... */}
</button>
```

**수정안**:

```typescript
'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import cx from 'classnames';
import styles from './SocialButton.module.scss';

interface SocialButtonProps {
  provider: 'google' | 'kakao' | 'naver' | 'facebook';
}

export default function SocialButton({ provider }: SocialButtonProps) {
  const router = useRouter();

  const handleSocialLogin = () => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;

    switch (provider) {
      case 'google':
        window.location.href = `${backendUrl}/auth/google`;
        break;
      case 'kakao':
        window.location.href = `${backendUrl}/auth/kakao`;
        break;
      case 'naver':
        window.location.href = `${backendUrl}/auth/naver`;
        break;
      case 'facebook':
        window.location.href = `${backendUrl}/auth/facebook`;
        break;
      default:
        console.error('Unsupported provider:', provider);
    }
  };

  return (
    <button
      className={cx(styles.button, styles[provider])}
      onClick={handleSocialLogin}
    >
      <Image
        src={`/images/social/${provider}.svg`}
        alt={provider}
        width={20}
        height={20}
      />
      <span>{providerNames[provider]}로 계속하기</span>
    </button>
  );
}

const providerNames = {
  google: 'Google',
  kakao: 'Kakao',
  naver: 'Naver',
  facebook: 'Facebook',
};
```

#### 3. 환경 변수 설정

**파일**: `.env.local`

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

### 3.3 카카오 로그인 구현 (선택)

백엔드에서 카카오 OAuth 처리:

```typescript
/**
 * 카카오 로그인 시작
 */
export const kakaoLogin: AsyncRequestHandler = async (req, res) => {
    const kakaoAuthUrl =
        `https://kauth.kakao.com/oauth/authorize?` +
        `client_id=${KAKAO_CLIENT_ID}&` +
        `redirect_uri=${BASE_URL}/auth/kakao/callback&` +
        `response_type=code`;

    res.redirect(kakaoAuthUrl);
};

/**
 * 카카오 로그인 콜백
 */
export const kakaoCallback: AsyncRequestHandler = async (req, res) => {
    const { code } = req.query;

    // 1. 카카오 액세스 토큰 받기
    const tokenResponse = await axios.post('https://kauth.kakao.com/oauth/token', null, {
        params: {
            grant_type: 'authorization_code',
            client_id: KAKAO_CLIENT_ID,
            redirect_uri: `${BASE_URL}/auth/kakao/callback`,
            code,
        },
    });

    const { access_token } = tokenResponse.data;

    // 2. 카카오 사용자 정보 가져오기
    const userInfoResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    const kakaoUser = userInfoResponse.data;

    // 3. 사용자 찾거나 생성 (구글과 동일)
    // ...
};
```

---

## 4. 추가 개선 사항

### 4.1 토큰 갱신 로딩 상태

**문제**: 토큰 갱신 중에 사용자에게 피드백 없음

**개선안**: 토큰 갱신 중 전역 로딩 상태 표시

```typescript
// lib/loadingStore.ts (신규 생성)
import { create } from 'zustand';

interface LoadingState {
    isRefreshing: boolean;
    setIsRefreshing: (value: boolean) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
    isRefreshing: false,
    setIsRefreshing: (value) => set({ isRefreshing: value }),
}));

// shared/axios.ts
import { useLoadingStore } from '@/lib/loadingStore';

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/auth/refresh')
        ) {
            originalRequest._retry = true;

            // ✅ 로딩 상태 시작
            useLoadingStore.getState().setIsRefreshing(true);

            const newTokens = await refreshTokens();

            // ✅ 로딩 상태 종료
            useLoadingStore.getState().setIsRefreshing(false);

            if (newTokens) {
                originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
                return axios(originalRequest);
            } else {
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
            }
        }

        return Promise.reject(error);
    },
);
```

### 4.2 에러 메시지 개선

**문제**: 에러 메시지가 일반적임

**개선안**: 상황별 구체적인 에러 메시지

```typescript
// shared/api.ts
export const handleApiError = (error: any) => {
    if (error.response) {
        const { status, data } = error.response;

        switch (status) {
            case 400:
                return data.message || '잘못된 요청입니다.';
            case 401:
                return '로그인이 필요합니다.';
            case 403:
                return '권한이 없습니다.';
            case 404:
                return '요청한 리소스를 찾을 수 없습니다.';
            case 409:
                return data.message || '이미 존재하는 데이터입니다.';
            case 500:
                return '서버 오류가 발생했습니다.';
            default:
                return data.message || '오류가 발생했습니다.';
        }
    }

    if (error.request) {
        return '서버에 연결할 수 없습니다.';
    }

    return error.message || '알 수 없는 오류가 발생했습니다.';
};
```

### 4.3 토큰 자동 갱신 백그라운드 처리

**현재**: 401 에러 발생 시에만 갱신

**개선**: Access Token 만료 전에 미리 갱신

```typescript
// lib/tokenRefreshTimer.ts (신규 생성)
import { refreshTokens } from '@/shared/auth';

let refreshTimer: NodeJS.Timeout | null = null;

export const startTokenRefreshTimer = () => {
  // Access Token 만료 5분 전에 갱신 (15분 - 5분 = 10분)
  const refreshInterval = 10 * 60 * 1000;

  refreshTimer = setInterval(async () => {
    console.log('Auto-refreshing tokens...');
    await refreshTokens();
  }, refreshInterval);
};

export const stopTokenRefreshTimer = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
};

// app/(main)/layout.tsx
import { useEffect } from 'react';
import { startTokenRefreshTimer, stopTokenRefreshTimer } from '@/lib/tokenRefreshTimer';

export default function MainLayout({ children }) {
  useEffect(() => {
    startTokenRefreshTimer();

    return () => {
      stopTokenRefreshTimer();
    };
  }, []);

  return <>{children}</>;
}
```

---

## 5. 작업 우선순위

### 우선순위 1 (필수): 버그 수정

1. ✅ 토큰 갱신 API 헤더 설정 수정 (`shared/api.ts`)
2. ✅ 401 인터셉터 무한 루프 방지 (`shared/axios.ts`)
3. ✅ 로그아웃 시 백엔드 호출 추가 (`app/(main)/action.ts`)

### 우선순위 2 (권장): 보안 개선

1. ✅ 토큰 만료 시간 일치 (`shared/auth.ts`)
2. ✅ 에러 처리 개선

### 우선순위 3 (선택): 구글 로그인

1. 백엔드 구현 완료 후 작업
2. 프론트엔드 콜백 페이지 생성
3. 소셜 버튼 동작 연결

### 우선순위 4 (선택): UX 개선

1. 토큰 갱신 로딩 상태
2. 자동 토큰 갱신 타이머

---

## 6. 체크리스트

### 버그 수정 완료 확인

- [ ] `shared/api.ts`: refreshToken 헤더 수정
- [ ] `shared/axios.ts`: 401 인터셉터 무한 루프 방지
- [ ] `shared/axios.ts`: `/auth/refresh` 제외 조건 추가
- [ ] `app/(main)/action.ts`: 로그아웃 백엔드 호출 추가
- [ ] `shared/auth.ts`: 토큰 쿠키 만료 시간 수정

### 구글 로그인 구현 확인

- [ ] 백엔드: Google OAuth 환경 변수 설정
- [ ] 백엔드: `/auth/google` 엔드포인트 구현
- [ ] 백엔드: `/auth/google/callback` 엔드포인트 구현
- [ ] 프론트엔드: `app/auth/callback/page.tsx` 생성
- [ ] 프론트엔드: `SocialButton.tsx` 수정
- [ ] 프론트엔드: `.env.local` 환경 변수 설정
- [ ] 테스트: 구글 로그인 동작 확인

---

**작성일**: 2025-10-30
**마지막 업데이트**: 2025-10-30

이 문서는 백엔드 구현이 완료된 후 프론트엔드 개선 작업 시 참고하세요.
