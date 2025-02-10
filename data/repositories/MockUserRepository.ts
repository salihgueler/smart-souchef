import { UserProfile } from "../types/UserProfile";
import { IUserRepository } from "./IUserRepository";

export class MockUserRepository implements IUserRepository {
  private static userProfileCache: UserProfile | null = null;
  async getUserProfile(): Promise<UserProfile> {
    // Return cached profile if it exists
    if (MockUserRepository.userProfileCache) {
      return MockUserRepository.userProfileCache;
    }

    // Create mock profile
    const userProfile: UserProfile = {
      id: "mock-user-123",
      name: "Mock User",
      email: "mock.user@example.com",
      avatar: "https://via.placeholder.com/150",
    };

    // Cache the profile
    MockUserRepository.userProfileCache = userProfile;

    return userProfile;
  }

  async updateProfilePicture(): Promise<void> {
    const currentUser = MockUserRepository.userProfileCache!;

    // Update mock profile with new avatar
    const userProfile: UserProfile = {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      avatar: "https://via.placeholder.com/150",
    };
    MockUserRepository.userProfileCache = userProfile;
  }

  clearCache(): void {
    MockUserRepository.userProfileCache = null;
  }
}
