import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

interface EnvConfig {
  port: number;
  nodeEnv: string;
  mongodbUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  clientUrl: string;
  corsOrigin: string | string[] | boolean;
  uploadDir: string;
  apiPublicUrl: string;
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function resolveCorsOrigin(): string | string[] | boolean {
  const raw = process.env.CORS_ORIGIN ?? process.env.CLIENT_URL ?? 'http://localhost:3000';
  if (raw === '*') return true;
  if (raw.includes(',')) {
    return raw.split(',').map((origin) => origin.trim());
  }
  return raw;
}

export const env: EnvConfig = {
  port: parseInt(process.env.PORT ?? '5000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  mongodbUri: getEnvVar('MONGODB_URI', 'mongodb://localhost:27017/wasco-vendor-portal'),
  jwtSecret: getEnvVar('JWT_SECRET', 'dev-secret-change-me'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:3000',
  corsOrigin: resolveCorsOrigin(),
  uploadDir: path.resolve(process.cwd(), process.env.UPLOAD_DIR ?? 'uploads'),
  apiPublicUrl: process.env.API_PUBLIC_URL ?? `http://localhost:${process.env.PORT ?? '5000'}`,
};
