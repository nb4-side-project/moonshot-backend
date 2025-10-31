import dotenv from 'dotenv';
dotenv.config();

function getEnvVar(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`환경 변수 ${name}이(가) 설정되지 않았습니다.`);
    }
    return value;
}

// Server
export const PORT = getEnvVar('PORT');
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const BASE_URL = getEnvVar('BASE_URL');

// CORS
export const CORS_ORIGINS = getEnvVar('CORS_ORIGINS')
    .split(',')
    .map((origin) => origin.trim());

// JWT
export const ACCESS_TOKEN_SECRET = getEnvVar('ACCESS_TOKEN_SECRET');
export const REFRESH_TOKEN_SECRET = getEnvVar('REFRESH_TOKEN_SECRET');
export const ACCESS_TOKEN_EXPIRES_IN = getEnvVar('ACCESS_TOKEN_EXPIRES_IN');
export const REFRESH_TOKEN_EXPIRES_IN = getEnvVar('REFRESH_TOKEN_EXPIRES_IN');

// Cloudinary (선택)
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || '';
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '';
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || '';

// File Upload
export const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';

// Email - Nodemailer (선택)
export const SMTP_HOST = process.env.SMTP_HOST || '';
export const SMTP_PORT = process.env.SMTP_PORT || '587';
export const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
export const SMTP_USER = process.env.SMTP_USER || '';
export const SMTP_PASS = process.env.SMTP_PASS || '';
export const SMTP_FROM = process.env.SMTP_FROM || '';

// Email - SendGrid (선택)
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
export const SENDGRID_FROM = process.env.SENDGRID_FROM || '';
