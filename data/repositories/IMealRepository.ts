import { Schema } from "@/amplify/data/resource";

export type Meal = Schema["meal"]["type"];
export interface IMealRepository {
  getRecentMeals(): Promise<Meal[]>;
  getFavoriteMeals(): Promise<Meal[]>;
  getMealById(id: string): Promise<Meal>;
  deleteMealById(id: string): Promise<void>;
  createMeal(
    title: string,
    ingredients: Record<string, number>,
    steps: string[]
  ): Promise<void>;
  addMealToFavorites(meal: Meal): Promise<void>;
  removeMealFromFavorites(meal: Meal): Promise<void>;
}
