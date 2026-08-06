import bcrypt from 'bcryptjs';
import { User, IUser } from '../models/User';
import { VendorProfile } from '../models/VendorProfile';
import { AppError } from '../utils/AppError';
import { signToken } from '../utils/jwt';
import { JwtPayload } from '../types';

export interface RegisterInput {
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
  password: string;
  confirmPassword: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResult {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    status: string;
  };
}

function sanitizeUser(user: IUser): AuthResult['user'] {
  return {
    id: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    status: user.status,
  };
}

export async function registerVendor(input: RegisterInput): Promise<{ message: string }> {
  if (input.password !== input.confirmPassword) {
    throw new AppError('Passwords do not match', 400);
  }

  const existingUser = await User.findOne({ email: input.companyEmail });
  if (existingUser) {
    throw new AppError('Email already registered', 409);
  }

  const nameParts = input.primaryContactName.trim().split(/\s+/);
  const firstName = nameParts[0] ?? input.primaryContactName;
  const lastName = nameParts.slice(1).join(' ') || '-';

  const hashedPassword = await bcrypt.hash(input.password, 12);

  const user = await User.create({
    email: input.companyEmail,
    password: hashedPassword,
    firstName,
    lastName,
    role: 'vendor',
    status: 'pending',
    isActive: true,
  });

  await VendorProfile.create({
    userId: user._id,
    companyName: input.companyName,
    vendorGroup: input.vendorGroup,
    parentCompany: input.parentCompany,
    supplyingEntity: input.supplyingEntity,
    businessRegistrationNumber: input.businessRegistrationNumber,
    country: input.country,
    address: input.address,
    website: input.website,
    companyEmail: input.companyEmail,
    companyPhone: input.companyPhone,
    primaryContactName: input.primaryContactName,
    primaryContactEmail: input.primaryContactEmail,
    primaryContactPhone: input.primaryContactPhone,
    vendorCategory: input.vendorCategory,
    products: input.products,
    status: 'pending',
  });

  return {
    message:
      'Registration successful. Your account is pending administrator approval.',
  };
}

export async function login(input: LoginInput): Promise<AuthResult> {
  const user = await User.findOne({ email: input.email }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!user.isActive || user.status === 'deactivated') {
    throw new AppError('Account is deactivated', 403);
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  if (user.role === 'vendor' && user.status !== 'approved') {
    throw new AppError(
      'Your account is pending approval. Please wait for admin confirmation.',
      403
    );
  }

  const payload: JwtPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const token = signToken(payload);

  return {
    token,
    user: sanitizeUser(user),
  };
}

export async function getCurrentUser(userId: string): Promise<AuthResult['user']> {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  return sanitizeUser(user);
}
