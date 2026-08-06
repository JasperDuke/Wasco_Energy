import { VendorProfile, IVendorProfile } from '../models/VendorProfile';
import { User } from '../models/User';
import { AppError } from '../utils/AppError';
import { UserStatus } from '../types';

export interface VendorProfileResponse {
  id: string;
  userId: string;
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
  createdAt: string;
}

function toVendorResponse(profile: IVendorProfile): VendorProfileResponse {
  return {
    id: profile._id.toString(),
    userId: profile.userId.toString(),
    companyName: profile.companyName,
    vendorGroup: profile.vendorGroup,
    parentCompany: profile.parentCompany,
    supplyingEntity: profile.supplyingEntity,
    businessRegistrationNumber: profile.businessRegistrationNumber,
    country: profile.country,
    address: profile.address,
    website: profile.website,
    companyEmail: profile.companyEmail,
    companyPhone: profile.companyPhone,
    primaryContactName: profile.primaryContactName,
    primaryContactEmail: profile.primaryContactEmail,
    primaryContactPhone: profile.primaryContactPhone,
    vendorCategory: profile.vendorCategory,
    products: profile.products,
    companyDescription: profile.companyDescription,
    status: profile.status as UserStatus,
    createdAt: profile.createdAt.toISOString(),
  };
}

export async function getVendorProfile(userId: string): Promise<VendorProfileResponse> {
  const profile = await VendorProfile.findOne({ userId });
  if (!profile) throw new AppError('Vendor profile not found', 404);
  return toVendorResponse(profile);
}

export async function updateVendorProfile(
  userId: string,
  data: Partial<Pick<IVendorProfile, 'address' | 'companyPhone' | 'website' | 'companyDescription' | 'products'>>
): Promise<VendorProfileResponse> {
  const profile = await VendorProfile.findOneAndUpdate({ userId }, data, { new: true });
  if (!profile) throw new AppError('Vendor profile not found', 404);
  return toVendorResponse(profile);
}

export async function getAllVendors(): Promise<VendorProfileResponse[]> {
  const profiles = await VendorProfile.find().sort({ createdAt: -1 });
  return profiles.map(toVendorResponse);
}

export async function approveVendor(userId: string): Promise<VendorProfileResponse> {
  const profile = await VendorProfile.findOneAndUpdate(
    { userId },
    { status: 'approved' },
    { new: true }
  );
  if (!profile) throw new AppError('Vendor not found', 404);

  await User.findByIdAndUpdate(userId, { status: 'approved', isActive: true });
  return toVendorResponse(profile);
}

export async function deactivateVendor(userId: string): Promise<VendorProfileResponse> {
  const profile = await VendorProfile.findOneAndUpdate(
    { userId },
    { status: 'deactivated' },
    { new: true }
  );
  if (!profile) throw new AppError('Vendor not found', 404);

  await User.findByIdAndUpdate(userId, { status: 'deactivated', isActive: false });
  return toVendorResponse(profile);
}
