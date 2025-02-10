import { IMealRepository, Meal } from "./IMealRepository";

export class MockMealRepository implements IMealRepository {
  private mockMeals: Meal[] = [
    {
      id: "1",
      title: "Spaghetti Carbonara",
      ingredients: [
        { id: "i1", name: "Spaghetti", checked: false },
        { id: "i2", name: "Eggs", checked: false },
        { id: "i3", name: "Pecorino Romano", checked: false },
        { id: "i4", name: "Pancetta", checked: false },
      ],
      lastCooked: "2023-05-15",
      favoriteMealsId: "fav1",
    },
    {
      id: "2",
      title: "Chicken Curry",
      ingredients: [
        { id: "i5", name: "Chicken", checked: false },
        { id: "i6", name: "Curry Powder", checked: false },
        { id: "i7", name: "Coconut Milk", checked: false },
        { id: "i8", name: "Rice", checked: false },
      ],
      lastCooked: "2023-05-10",
    },
    {
      id: "3",
      title: "Caesar Salad",
      ingredients: [
        { id: "i9", name: "Romaine Lettuce", checked: false },
        { id: "i10", name: "Croutons", checked: false },
        { id: "i11", name: "Parmesan Cheese", checked: false },
        { id: "i12", name: "Caesar Dressing", checked: false },
      ],
      lastCooked: "2023-05-12",
      favoriteMealsId: "fav2",
    },
  ];

  async getRecentMeals(): Promise<Meal[]> {
    return this.mockMeals.sort((a, b) =>
      (b.lastCooked || "").localeCompare(a.lastCooked || "")
    );
  }

  async getFavoriteMeals(): Promise<Meal[]> {
    return this.mockMeals.filter((meal) => meal.favoriteMealsId !== undefined);
  }

  async getMealById(id: string): Promise<Meal> {
    const meal = this.mockMeals.find((meal) => meal.id === id);
    if (!meal) throw new Error("Meal not found");
    return meal;
  }

  async deleteMealById(id: string): Promise<void> {
    const index = this.mockMeals.findIndex((meal) => meal.id === id);
    if (index !== -1) {
      this.mockMeals.splice(index, 1);
    }
  }

  async createMeal(
    title: string,
    ingredients: Record<string, number>,
    steps: string[]
  ): Promise<void> {
    const newMeal: Meal = {
      id: Date.now().toString(),
      title,
      ingredients: Object.keys(ingredients).map((name, index) => ({
        id: `new${index}`,
        name,
        checked: false,
      })),
      lastCooked: new Date().toISOString().split("T")[0],
    };
    this.mockMeals.push(newMeal);
  }

  async addMealToFavorites(meal: Meal): Promise<void> {
    const existingMeal = this.mockMeals.find((m) => m.id === meal.id);
    if (existingMeal) {
      existingMeal.favoriteMealsId = `fav${Date.now()}`;
    }
  }

  async removeMealFromFavorites(meal: Meal): Promise<void> {
    const existingMeal = this.mockMeals.find((m) => m.id === meal.id);
    if (existingMeal) {
      delete existingMeal.favoriteMealsId;
    }
  }
}
