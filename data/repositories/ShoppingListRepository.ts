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
