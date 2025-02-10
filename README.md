# Smart Sous Chef Workshop

## Overview
This project serves as a companion for a workshop that demonstrates the progression from a basic mocked application to a fully functional Smart Sous Chef app. Each step of development is captured in different branches, allowing participants to follow along and understand the evolution of the application.

## Adding AI Capabilities
In this step we will add the AI capabilities to get steps and ingredients about a meal.

First open the `resource.ts` file under `amplify/data` subfolder and replace everything with the following:

```ts
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  chat: a
    .conversation({
      aiModel: a.ai.model("Claude 3 Haiku"),
      systemPrompt:
        "You are a helpful assistant that provides instructions and ingredients as items for a meal that is shared with you either as an image or text. Use metric system when you explain things. ",
    })
    .authorization((allow) => allow.owner()),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
```

For AI, we will be using Amplify AI Kit. The Amplify AI kit is built around the idea of routes. An AI route is like an API endpoint for interacting with backend AI functionality. AI routes are configured in an Amplify backend where you can define the authorization rules, what type of route (generation or conversation), AI model and inference configuration like temperature, what are the inputs and outputs, and what data it has access to. There are currently 2 types of AI routes. Conversation and Generation.

The code above, we will create a new data schema with a new data field called `chat`. The `chat` has a `conversation` type which keeps track of the conversation history. If we have used `generation` instead, it would have done one-off generation. 

The `conversation` takes an `aiModel` and the `systemPrompt` to operate. It can have more properties to enhance the capabilities (such as `tools` to use knowledge bases or external data sources)l

Now go to your `backend.ts` file and remove the `TODO` and the comment from the `data` value. Save your file and sandbox will automatically deploy your backend.

## Using AI Capabilities
For using AI capabilities, we have three ways:

1. On a web application, using the UI libraries to create an easy to implement chat experience [check the documentation](https://docs.amplify.aws/react/ai/conversation/ai-conversation/)
2. Using the react hooks to communicate with the AI library (we will do it here)
3. Using the AI library capabilities manually. Check the blog from [@tackk](https://dev.to/tacck) over [AWS Community Builders blog](https://dev.to/aws-builders/flutter-amplify-ai-kit-recipe-app-development-5172)

First go to the `index.ts` under the `app/(tabs)` subfolder. Replace the `TODO` about the imports with the following :

```ts
import { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { createAIHooks } from "@aws-amplify/ui-react-ai";

const client = generateClient<Schema>();
const { useAIConversation } = createAIHooks(client);
```

Next, update the `TODO` about using the hooks with the following:

```ts
  const [
    {
      data: { messages },
    },
    handleSendMessage,
  ] = useAIConversation("chat");
```

After this, update the `handleSend` function like the following:

```ts
const handleSend = () => {
  if (newMessage.trim()) {
    handleSendMessage({
      content: [
        {
          text: newMessage,
        },
      ],
    });
  }
  setNewMessage("");
};
```

Last but not list, go through rest of the `TODO` elements and remove all the elements that is using mock messaging logic.

## License
MIT-0
