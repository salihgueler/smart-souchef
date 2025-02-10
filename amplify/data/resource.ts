import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  chat: a
    .conversation({
      aiModel: a.ai.model("Claude 3 Haiku"),
      systemPrompt:
        "You are a helpful assistant that provides instructions and ingredients as items for a meal that is shared with you either as an image or text. Use metric system when you explain things. ",
    })
    .authorization((allow) => allow.owner()),
  meal: a
    .model({
      id: a.id(),
      title: a.string().required(),
      ingredients: a.ref("ingredient").array(),
      lastCooked: a.string(),
      favoriteMealsId: a.id(),
      favoriteMeals: a.belongsTo("favoriteMeals", "favoriteMealsId"),
    })
    .authorization((allow) => allow.authenticated()),
  ingredient: a.customType({
    id: a.id(),
    name: a.string().required(),
    checked: a.boolean().required(),
  }),
  favoriteMeals: a
    .model({
      meals: a.hasMany("meal", "favoriteMealsId"),
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
