import { fetchUserAttributes, getCurrentUser } from "aws-amplify/auth";
import { UserProfile } from "../types/UserProfile";
import { IUserRepository } from "./IUserRepository";
import { getUrl } from "aws-amplify/storage";

export class UserRepository implements IUserRepository {
  private static userProfileCache: UserProfile | null = null;

  async getUserProfile(): Promise<UserProfile> {
    // Return cached profile if it exists
    if (UserRepository.userProfileCache) {
      return UserRepository.userProfileCache;
    }

    // If no cached profile, fetch from external APIs
    const attributes = await fetchUserAttributes();
    const currentUser = await getCurrentUser();
    let image = "https://via.placeholder.com/150";
    try {
      const { url } = await getUrl({
        path: `profile-pictures/${currentUser.userId}.jpg`,
        options: { validateObjectExistence: true },
      });
      image = url.toString();
    } catch (e) {
      console.log(e);
    }
    // Create new profile
    const userProfile: UserProfile = {
      id: currentUser.userId,
      name: attributes.name!,
      email: attributes.email!,
      avatar: image,
    };

    // Cache the profile
    UserRepository.userProfileCache = userProfile;

    return userProfile;
  }

  async updateProfilePicture(): Promise<void> {
    const currentUser = UserRepository.userProfileCache!;
    let image = "https://via.placeholder.com/150";
    try {
      const { url } = await getUrl({
        path: `profile-pictures/${currentUser.id}.jpg`,
        options: { validateObjectExistence: true },
      });
      image = url.toString();
    } catch (e) {
      console.log(e);
    }
    // Create new profile
    const userProfile: UserProfile = {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      avatar: image,
    };
    UserRepository.userProfileCache = userProfile;
  }

  clearCache(): void {
    UserRepository.userProfileCache = null;
  }
}
