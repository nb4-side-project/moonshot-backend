export interface LoginResponseDto {
    accessToken: 'string';
    refreshToken: 'string';
}

export interface RegisterResponseDto {
    id: number;
    email: string;
    name: string;
    profileImage: string;
    createdAt: string;
    updatedAt: string;
}

// 토큰 재발급 응답 DTO
export interface RefreshTokenResponseDto {
    accessToken: string;
    refreshToken: string;
}

export type GetMeResponseDto = RegisterResponseDto;
export type UpdateMeResponseDto = RegisterResponseDto;
