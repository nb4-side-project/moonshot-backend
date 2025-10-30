/**
 * 인증된 사용자 정보
 *
 * JWT 토큰에서 추출된 사용자 정보입니다.
 */
export interface AuthUser {
    id: number;
    email: string;
}
