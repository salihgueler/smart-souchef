# Smart Sous Chef Workshop

## Overview
This project serves as a companion for a workshop that demonstrates the progression from a basic mocked application to a fully functional Smart Sous Chef app. Each step of development is captured in different branches, allowing participants to follow along and understand the evolution of the application.

## Adding Data
In this step we will add the data capabilities to create a meal and it's ingredients, a shopping list and favoriting a meal.

First open the `resource.ts` file under `amplify/data` subfolder and update like the following:

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
```

The data model consists of three main components: `meal`, `ingredient`, and `favoriteMeals`. 

The `meal` model contains a unique ID, a required title string, an array of ingredient references, a lastCooked string timestamp, and a relationship with `favoriteMeals` through `favoriteMealsId`. Only authenticated users can access the Meal model. 

The `ingredients` are defined as a custom type with an ID, a required name string, and a required checked boolean field to track their status. 

The `favoriteMeals` model maintains a collection of meals through a one-to-many relationship with the `meal` model using the favoriteMealsId field. The `favoriteMeals` model implements owner-based authorization, meaning only the owner of a `favoriteMeals` collection can access it. 

This structure allows users to create and manage meals with their ingredients while maintaining a separate collection of favorite meals that's private to each user.

Now save the files and the sandbox should automatically deploy the changes.

## Using Data

For using the data, we will delete the mock repositories and create ones that would work with cloud data. For doing that, we will work on the `data/repositories`" to update/remove/create files.

First step is to open the `IMealRepository.ts` file and locate the `TODO` in the file. Replace the TODO and the `Meal` type with the following:

```ts
import { Schema } from "@/amplify/data/resource";

export type Meal = Schema["meal"]["type"];
```

Next delete the `MockMealRepository.ts` file and create a new file called `MealRepository.ts` and update it like the following.

```ts
import { Schema } from "@/amplify/data/resource";
import { IMealRepository, Meal } from "./IMealRepository";
import { generateClient } from "aws-amplify/api";

export class MealRepository implements IMealRepository {
  private client;

  constructor() {
    this.client = generateClient<Schema>();
  }
  async deleteMealById(id: string): Promise<void> {
    this.client.models.meal.delete({ id: id });
  }
  async createMeal(
    title: string,
    ingredients: Record<string, number>,
    steps: string[]
  ): Promise<void> {
    const ingredientsList = Object.keys(ingredients);
    const ingredientsMapped = ingredientsList.map((ingredient) => ({
      name: ingredient,
      checked: false,
    }));
    this.client.models.meal.create({
      title: title,
      ingredients: ingredientsMapped,
      lastCooked: new Date().toISOString(),
    });
  }
  async addMealToFavorites(meal: Meal): Promise<void> {
    this.client.models.meal.update({
      id: meal.id!,
      favoriteMealsId: meal.id!,
    });
    await this.client.models.favoriteMeals.create({ id: meal.id! });
  }

  async removeMealFromFavorites(meal: Meal): Promise<void> {
    await this.client.models.meal.update({
      id: meal.id!,
      favoriteMealsId: null,
    });
    await this.client.models.favoriteMeals.delete({ id: meal.id! });
  }

  async getRecentMeals(): Promise<Meal[]> {
    const meals = await this.client.models.meal.list();
    return meals.data!;
  }

  async getFavoriteMeals(): Promise<Meal[]> {
    const meals = await this.client.models.favoriteMeals.list();
    if (meals.data.length == 0) {
      return [];
    } else {
      const favoriteMeals = await meals.data[0].meals();
      return favoriteMeals.data!;
    }
  }

  async getMealById(id: string): Promise<Meal> {
    const meal = await this.client.models.meal.get({ id: id });
    return meal.data!;
  }
}
```
Next delete the `MockShoppingListRepository.ts` file and create a new file called `ShoppingListRepository.ts` and update it like the following.

```ts
import { Schema } from "@/amplify/data/resource";
import { IShoppingListRepository } from "./IShoppingListRepository";
import { generateClient } from "aws-amplify/api";

export class ShoppingListRepository implements IShoppingListRepository {
  private client;
  private currentMealId: string | null = null;

  constructor() {
    this.client = generateClient<Schema>();
  }

  async getCurrentMealId(): Promise<string> {
    return this.currentMealId || "";
  }

  async setCurrentMealId(mealId: string): Promise<void> {
    this.currentMealId = mealId;
  }

  async getShoppingListForMeal(mealId: string): Promise<
    {
      id: number;
      name: string;
      checked: boolean;
    }[]
  > {
    const meal = await this.client.models.meal.get({ id: mealId });
    if (!meal.data?.ingredients) return [];
    return meal.data.ingredients.map((ingredient, index) => ({
      id: index,
      name: ingredient?.name ?? "Undefined",
      checked: ingredient?.checked ?? false,
    }));
  }

  async updateIngredientStatus(
    mealId: string,
    ingredientId: number,
    checked: boolean
  ): Promise<void> {
    const meal = await this.client.models.meal.get({ id: mealId });
    if (!meal.data?.ingredients) return;

    const updatedIngredients = meal.data.ingredients.map((ingredient, index) =>
      index === ingredientId
        ? {
            id: ingredient?.id,
            name: ingredient?.name ?? "Undefined",
            checked: checked,
          }
        : ingredient
    );

    await this.client.models.meal.update({
      id: mealId,
      ingredients: updatedIngredients,
    });
  }

  async removeCurrentShoppingList(): Promise<void> {
    if (!this.currentMealId) return;
    const meal = await this.client.models.meal.get({ id: this.currentMealId });
    if (!meal.data?.ingredients) return;

    const resetIngredients = meal.data.ingredients.map((ingredient) => ({
      id: ingredient?.id,
      name: ingredient?.name ?? "Undefined",
      checked: false,
    }));

    await this.client.models.meal.update({
      id: this.currentMealId,
      ingredients: resetIngredients,
    });

    this.currentMealId = null;
  }
}
```

Next, update the `index.ts` file by replacing the `TODO` and the following two lines with the following.

```ts
//TODO: Update with the real repository references
export * from "./ShoppingListRepository";
export * from "./MealRepository";
```

Last but not least, we will update the `ServiceLocater` by replacing the mock repository references with real ones. Replace the `TODO`s with the following:

```ts
import { ShoppingListRepository } from "./MockShoppingListRepository";
import { MealRepository } from "./MockMealRepository";
```

and 

```ts
this.mealRepository = new MealRepository();
this.shoppingListRepository = new ShoppingListRepository();
```

## License
MIT-0
