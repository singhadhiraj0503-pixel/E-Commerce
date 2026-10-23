import type { UserRole } from "../models/User.js";

export interface Address {
  fullName: string;
  address: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

export interface UserDocument {
  clerkUserId: string;
  name?: string;
  email?: string;
  role: UserRole;
  points: number;
  addresses: Address[];
}

export type UploadedImage = {
  url: string;
  publicId: string;
  isCover: boolean;
};
