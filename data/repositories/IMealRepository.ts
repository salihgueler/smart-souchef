// TODO: Remove the following type and add the type from the data
export interface Meal {
  id: string;
  title: string;
  ingredients: Array<{
    id: string;
    name: string;
    checked: boolean;
  }>;
  lastCooked?: string;
  favoriteMealsId?: string;
}

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
