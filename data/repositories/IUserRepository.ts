import { UserProfile } from "../types/UserProfile";

export interface IUserRepository {
  getUserProfile(): Promise<UserProfile>;
  updateProfilePicture(): Promise<void>;
}
