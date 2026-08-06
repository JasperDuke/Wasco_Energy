import { SystemSetting, ISystemSetting } from '../models/SystemSetting';
import { AppError } from '../utils/AppError';

export interface SettingsInput {
  baseUrl: string;
  accessToken: string;
  agentId: string;
  apiPublicUrl?: string;
}

export interface SettingsResponse {
  id: string;
  baseUrl: string;
  agentId: string;
  apiPublicUrl: string;
  hasAccessToken: boolean;
  createdAt: Date;
  updatedAt: Date;
}

function toSettingsResponse(setting: ISystemSetting): SettingsResponse {
  return {
    id: setting._id.toString(),
    baseUrl: setting.baseUrl,
    agentId: setting.agentId,
    apiPublicUrl: setting.apiPublicUrl ?? '',
    hasAccessToken: Boolean(setting.accessToken),
    createdAt: setting.createdAt,
    updatedAt: setting.updatedAt,
  };
}

export async function getSettings(): Promise<SettingsResponse | null> {
  const setting = await SystemSetting.findOne().select('+accessToken');
  return setting ? toSettingsResponse(setting) : null;
}

export async function upsertSettings(input: SettingsInput): Promise<SettingsResponse> {
  const existing = await SystemSetting.findOne().select('+accessToken');

  if (existing) {
    existing.baseUrl = input.baseUrl;
    existing.agentId = input.agentId;
    existing.apiPublicUrl = input.apiPublicUrl ?? '';
    if (input.accessToken) {
      existing.accessToken = input.accessToken;
    }
    await existing.save();
    return toSettingsResponse(existing);
  }

  if (!input.accessToken) {
    throw new AppError('Access token is required for initial setup', 400);
  }

  const setting = await SystemSetting.create(input);
  return toSettingsResponse(setting);
}

export async function getSettingsForInternal(): Promise<ISystemSetting | null> {
  return SystemSetting.findOne().select('+accessToken');
}
