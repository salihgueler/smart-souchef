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
