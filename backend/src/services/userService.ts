import { User, IUser } from '../models/User';
import { AppError } from '../utils/AppError';
import { UserRole, UserStatus } from '../types';

export interface UserListItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  isActive: boolean;
  createdAt: Date;
}

function toUserListItem(user: IUser): UserListItem {
  return {
    id: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    status: user.status,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
}

export async function getAllUsers(): Promise<UserListItem[]> {
  const users = await User.find().sort({ createdAt: -1 });
  return users.map(toUserListItem);
}

export async function updateUserStatus(
  userId: string,
  status: UserStatus
): Promise<UserListItem> {
  const user = await User.findByIdAndUpdate(
    userId,
    { status },
    { new: true }
  );

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return toUserListItem(user);
}

export async function toggleUserActive(userId: string): Promise<UserListItem> {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  user.isActive = !user.isActive;
  await user.save();

  return toUserListItem(user);
}

export async function getPendingVendors(): Promise<UserListItem[]> {
  const users = await User.find({ role: 'vendor', status: 'pending' }).sort({
    createdAt: -1,
  });
  return users.map(toUserListItem);
}
