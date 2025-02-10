import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "profilePictures",
  access: (allow) => ({
    "profile-pictures/*": [allow.authenticated.to(["read", "write", "delete"])],
  }),
});
