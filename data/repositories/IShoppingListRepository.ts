export interface IShoppingListRepository {
  getCurrentMealId(): Promise<string>;
  setCurrentMealId(mealId: string): Promise<void>;
  getShoppingListForMeal(mealId: string): Promise<
    {
      id: number;
      name: string;
      checked: boolean;
    }[]
  >;
  updateIngredientStatus(
    mealId: string,
    ingredientId: number,
    checked: boolean
  ): Promise<void>;
  removeCurrentShoppingList(): Promise<void>;
}
