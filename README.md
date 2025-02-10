# Smart Sous Chef Workshop

## Overview
This project serves as a companion for a workshop that demonstrates the progression from a basic mocked application to a fully functional Smart Sous Chef app. Each step of development is captured in different branches, allowing participants to follow along and understand the evolution of the application.

## Adding Storage Capabilities

For adding storage capabilities, we have to create a new folder under `amplify` folder called `storage`. Create the folder and add a `resource.ts` file under it. 

Paste the following code to the file:

```ts
import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "profilePictures",
  access: (allow) => ({
    "profile-pictures/*": [allow.authenticated.to(["read", "write", "delete"])],
  }),
});
```

This will create the storage definition with authenticated users to "read", "write" and "delete" files under "profile-pictures" folder.

Next add the storage variable to `defineBackend` function from `backend.ts` file: 

```ts
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";

defineBackend({
  auth,
  //TODO remove the comment for the following line
  // data,
  storage,
});
```
## Using Storage Capabilities

For getting the images from the storage, you can open the `UserRepository.ts` file and replace the `TODO`s for getting a URL with the following:

```ts
try {
  const { url } = await getUrl({
    path: `profile-pictures/${currentUser.userId}.jpg`,
    // Use the following path for the second TODO
    // path: `profile-pictures/${currentUser.id}.jpg`,
    options: { validateObjectExistence: true },
  });
  image = url.toString();
} catch (e) {
  console.log(e);
}
```

To upload an image, open the `four.tsx` file under `app/(tabs)` subfolder. Replace the `TODO` for uploading images with the following:

```ts
await userRepository.updateProfilePicture();
const response = await fetch(uri);
const blob = await response.blob();
try {
  const result = await uploadData({
    path: `profile-pictures/${userData?.id}.jpg`,
    data: blob,
    options: {
      onProgress: ({ transferredBytes, totalBytes }) => {
        if (totalBytes) {
          console.log(
            `Upload progress ${Math.round(
              (transferredBytes / totalBytes) * 100
            )} %`
          );
        }
      },
    },
  }).result;
  console.log("Path from Response: ", result.path);
} catch (error) {
  console.log("Error : ", error);
}
```

This will get the selected image and upload it to the storage by using user id. 

## License
MIT-0
