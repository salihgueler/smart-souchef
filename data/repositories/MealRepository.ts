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
