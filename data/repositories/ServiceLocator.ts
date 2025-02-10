import { IMealRepository } from "./IMealRepository";
import { IShoppingListRepository } from "./IShoppingListRepository";
import { IUserRepository } from "./IUserRepository";
import { ShoppingListRepository } from "./ShoppingListRepository";
import { UserRepository } from "./UserRepository";
import { MealRepository } from "./MealRepository";

export class ServiceLocator {
  private static instance: ServiceLocator;
  private mealRepository: IMealRepository;
  private shoppingListRepository: IShoppingListRepository;
  private userRepository: IUserRepository;

  private constructor() {
    this.mealRepository = new MealRepository();
    this.shoppingListRepository = new ShoppingListRepository();
    this.userRepository = new UserRepository();
  }

  public static getInstance(): ServiceLocator {
    if (!ServiceLocator.instance) {
      ServiceLocator.instance = new ServiceLocator();
    }
    return ServiceLocator.instance;
  }

  public getMealRepository(): IMealRepository {
    return this.mealRepository;
  }

  public getShoppingListRepository(): IShoppingListRepository {
    return this.shoppingListRepository;
  }

  public getUserRepository(): IUserRepository {
    return this.userRepository;
  }
}
