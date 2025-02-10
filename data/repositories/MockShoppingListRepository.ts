import { IShoppingListRepository } from "./IShoppingListRepository";

export class MockShoppingListRepository implements IShoppingListRepository {
  private currentMealId: string = "meal-123";
  private mockShoppingList = new Map<
    string,
    { id: number; name: string; checked: boolean }[]
  >();

  constructor() {
    // Initialize with some mock data
    this.mockShoppingList.set("meal-123", [
      { id: 1, name: "Tomatoes", checked: false },
      { id: 2, name: "Onions", checked: true },
      { id: 3, name: "Garlic", checked: false },
      { id: 4, name: "Olive Oil", checked: true },
    ]);

    this.mockShoppingList.set("meal-456", [
      { id: 1, name: "Pasta", checked: false },
      { id: 2, name: "Cheese", checked: false },
      { id: 3, name: "Basil", checked: false },
    ]);
  }
  async getCurrentMealId(): Promise<string> {
    return this.currentMealId;
  }

  async setCurrentMealId(mealId: string): Promise<void> {
    this.currentMealId = mealId;
  }

  async getShoppingListForMeal(
    mealId: string
  ): Promise<{ id: number; name: string; checked: boolean }[]> {
    const list = this.mockShoppingList.get(mealId);
    if (!list) {
      return [];
    }
    return [...list]; // Return a copy to prevent direct modification
  }

  async updateIngredientStatus(
    mealId: string,
    ingredientId: number,
    checked: boolean
  ): Promise<void> {
    const list = this.mockShoppingList.get(mealId);
    if (list) {
      const ingredient = list.find((item) => item.id === ingredientId);
      if (ingredient) {
        ingredient.checked = checked;
      }
    }
  }

  async removeCurrentShoppingList(): Promise<void> {
    this.mockShoppingList.delete(this.currentMealId);
    this.currentMealId = "";
  }
}
