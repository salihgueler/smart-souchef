# Smart Sous Chef Workshop

## Overview
This project serves as a companion for a workshop that demonstrates the progression from a basic mocked application to a fully functional Smart Sous Chef app. Each step of development is captured in different branches, allowing participants to follow along and understand the evolution of the application.

## Adding Auth Capabilities

For adding Auth capabilities, we will work with the `resource.ts` file under the `amplify/auth` subfolder. If we deploy the file as it is right now, we will get a auth setup with email sign up. However, we can also expand the capabilities of the auth flow. Update the `resource.ts` file with the following code:

```ts
import { defineAuth } from "@aws-amplify/backend";

export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailSubject: "Hello DAs, Whats up",
      verificationEmailBody: (createCode: () => string) =>
        `Verification code is right here ${createCode()}`,
    },
  },
  userAttributes: {
    fullname: {
      required: true,
    },
    email: {
      required: true,
    },
  },
});
```

This will update the verification email's subject and content and ask users to add name and email as a required field for user information. 

Once this is done, we can do our initial deployment. The deployment can be done two ways, one is the actual deployment through the Amplify Console or we can deploy our app through the `sandbox` command. 

Before doing in-to deployment, make sure to update the `backend.ts` like the following: 

```ts
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

defineBackend({
  auth,
  //TODO remove the comment for the following line
  // data,
});
```

This will prevent us from deployin the data and only deploy the authentication.

Run the `npx ampx sandbox` command and wait for the deployment. 

## Using Auth Capabilities

For using Auth capabilities, we have to import the Amplify configuration files to our project. Open the `_layout.tsx` file under `app` folder. Replace the `TODO` for importing Amplify configurations with the following:

```ts
import { Amplify } from "aws-amplify";
import amplifyConfig from "../amplify_outputs.json";

Amplify.configure(amplifyConfig);
```

The next step is to add the [Amplify UI](https://ui.docs.amplify.aws/) libraries to control the authentication flow and also call the information about the authenticated users.

Find the `TODO` in the `_layout.tsx` file and update it with the following:

```ts
<Authenticator.Provider>
  <Authenticator>
    <RootLayoutNav />
  </Authenticator>
</Authenticator.Provider>
```

 With this we will have an actual authentication flow. Now it is time to use the information that our users entered. Delete the `MockUserRepository.ts` under `data/repositories` subfolder. Create a new file called `UserRepository.ts` and paste the following code there: 

 ```ts
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
    //TODO Add getUrl logic here

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
    // TODO Add getUrl logic

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
```

Update the `MockUserRepository` references in `index.ts` and `ServiceLocator.ts` files under `data/repositories` subfolders with `UserRepository`.

Lastly, open the `_layout.tsx` file under `app/(tabs)` subfolder and first, replace the authenticator import `TODO` with the following:

```ts
import { useAuthenticator } from "@aws-amplify/ui-react-native";
```

Next, find the create sign out function `TODO` and replace it with the following:
```ts
const { signOut } = useAuthenticator();
```

Lastly, find the `TODO` with replacing the empty function with `signOut` implementation and add the signOut there. 

Now you can run the application to have a full authentication flow.

## License
MIT-0
