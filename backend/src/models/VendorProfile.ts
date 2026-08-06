import { Schema, model, Document, Types } from 'mongoose';
import { UserStatus } from '../types';

export interface IVendorProfile extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  companyName: string;
  vendorGroup: string;
  parentCompany?: string;
  supplyingEntity?: string;
  businessRegistrationNumber: string;
  country: string;
  address: string;
  website?: string;
  companyEmail: string;
  companyPhone: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  vendorCategory: string;
  products: string;
  companyDescription?: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

const vendorProfileSchema = new Schema<IVendorProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    companyName: { type: String, required: true, trim: true },
    vendorGroup: { type: String, required: true, trim: true },
    parentCompany: { type: String, trim: true },
    supplyingEntity: { type: String, trim: true },
    businessRegistrationNumber: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    website: { type: String, trim: true },
    companyEmail: { type: String, required: true, trim: true, lowercase: true },
    companyPhone: { type: String, required: true, trim: true },
    primaryContactName: { type: String, required: true, trim: true },
    primaryContactEmail: { type: String, required: true, trim: true, lowercase: true },
    primaryContactPhone: { type: String, required: true, trim: true },
    vendorCategory: { type: String, required: true, trim: true },
    products: { type: String, required: true, trim: true },
    companyDescription: { type: String, trim: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended', 'deactivated'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

vendorProfileSchema.index({ userId: 1 });
vendorProfileSchema.index({ companyName: 1 });
vendorProfileSchema.index({ status: 1 });

export const VendorProfile = model<IVendorProfile>('VendorProfile', vendorProfileSchema);
