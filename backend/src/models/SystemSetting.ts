import { Schema, model, Document } from 'mongoose';

export interface ISystemSetting extends Document {
  baseUrl: string;
  accessToken: string;
  agentId: string;
  /** Base URL of this API for building attachment URLs (e.g. http://localhost:5000) */
  apiPublicUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const systemSettingSchema = new Schema<ISystemSetting>(
  {
    baseUrl: {
      type: String,
      required: true,
      trim: true,
    },
    accessToken: {
      type: String,
      required: true,
      select: false,
    },
    agentId: {
      type: String,
      required: true,
      trim: true,
    },
    apiPublicUrl: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

export const SystemSetting = model<ISystemSetting>('SystemSetting', systemSettingSchema);
