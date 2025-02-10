import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

defineBackend({
  auth,
  //TODO remove the comment for the following line
  // data,
});
