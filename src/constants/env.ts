import * as dotenv from 'dotenv';

dotenv.config();

export const envConfig = {
    // # Application Configuration
    NODE_ENV: process.env.NODE_ENV as string,
    PORT: process.env.PORT as string,

    // # Database Configuration
    DATABASE_URL: process.env.DATABASE_URL as string,
    DB_HOST: process.env.DB_HOST as string,
    DB_PORT: Number(process.env.DB_PORT as string),
    DB_USER: process.env.DB_USER as string,
    DB_PASSWORD: process.env.DB_PASSWORD as string,
    DB_NAME: process.env.DB_NAME as string,

    // # Authentication & Security
    JWT_SECRET_ACCESS_TOKEN: process.env.JWT_SECRET_ACCESS_TOKEN as string,
    JWT_SECRET_REFRESH_TOKEN: process.env.JWT_SECRET_REFRESH_TOKEN as string,
    JWT_SECRET_EMAIL_VERIFY_TOKEN: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
    JWT_SECRET_FORGOT_PASSWORD_TOKEN: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,

    JWT_ACCESS_TOKEN_EXPIRES_IN: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN as string,
    JWT_REFRESH_TOKEN_EXPIRES_IN: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN as string,
    JWT_EMAIL_VERIFY_TOKEN_EXPIRES_IN: process.env.JWT_EMAIL_VERIFY_TOKEN_EXPIRES_IN as string,
    JWT_FORGOT_PASSWORD_TOKEN_EXPIRES_IN: process.env.JWT_FORGOT_PASSWORD_TOKEN_EXPIRES_IN as string,

    COOKIE_SECRET: process.env.COOKIE_SECRET as string,

    // # Email Configuration
    SMTP_HOST: process.env.SMTP_HOST as string,
    SMTP_PORT: process.env.SMTP_PORT as string,
    SMTP_USER: process.env.SMTP_USER as string,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD as string,
    EMAIL_FROM: process.env.EMAIL_FROM as string,
    MAIL_AUTH_PASS: process.env.MAIL_AUTH_PASS as string,

    //  # Application-Specific Variables
    FRONTEND_URL: process.env.FRONTEND_URL as string,

    // Cloud Storage (Cloudinary)
    CLOUDINARY_URL: process.env.CLOUDINARY_URL as string,
    CLOUD_NAME: process.env.CLOUD_NAME as string,
    CLOUD_API_KEY: process.env.CLOUD_API_KEY as string,
    CLOUD_API_SECRET: process.env.CLOUD_API_SECRET as string,

    BOT_FATHER_TOKEN: process.env.BOT_FATHER_TOKEN as string,
    GROUP_CHAT_ID: process.env.GROUP_CHAT_ID as string,
    REDIS_URL: process.env.REDIS_URL as string,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD as string,
    REDIS_HOST: process.env.REDIS_HOST as string,
    REDIS_PORT: Number(process.env.REDIS_PORT),
} as const;
