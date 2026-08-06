import bcrypt from 'bcryptjs';
import { User, IUser } from '../models/User';
import { AppError } from '../utils/AppError';

export interface StaffUserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  isActive: boolean;
  createdAt: string;
}

function toStaffResponse(user: IUser): StaffUserResponse {
  return {
    id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    department: user.department ?? 'Procurement',
    isActive: user.isActive,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function getStaffUsers(): Promise<StaffUserResponse[]> {
  const users = await User.find({ role: 'staff' }).sort({ createdAt: -1 });
  return users.map(toStaffResponse);
}

export async function createStaffUser(input: {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  password?: string;
}): Promise<StaffUserResponse> {
  const existing = await User.findOne({ email: input.email });
  if (existing) throw new AppError('Email already registered', 409);

  const password = input.password ?? 'Staff@123';
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    email: input.email,
    password: hashedPassword,
    firstName: input.firstName,
    lastName: input.lastName,
    role: 'staff',
    status: 'approved',
    isActive: true,
    department: input.department,
  });

  return toStaffResponse(user);
}

export async function updateStaffUser(
  id: string,
  input: Partial<{ firstName: string; lastName: string; email: string; department: string; isActive: boolean }>
): Promise<StaffUserResponse> {
  const user = await User.findOneAndUpdate({ _id: id, role: 'staff' }, input, { new: true });
  if (!user) throw new AppError('Staff user not found', 404);
  return toStaffResponse(user);
}

export async function deleteStaffUser(id: string): Promise<void> {
  const user = await User.findOneAndUpdate(
    { _id: id, role: 'staff' },
    { isActive: false, status: 'deactivated' },
    { new: true }
  );
  if (!user) throw new AppError('Staff user not found', 404);
}
