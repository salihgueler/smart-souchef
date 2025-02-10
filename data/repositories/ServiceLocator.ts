import { IMealRepository } from "./IMealRepository";
import { IShoppingListRepository } from "./IShoppingListRepository";
import { IUserRepository } from "./IUserRepository";
import { UserRepository } from "./UserRepository";
//TODO: Update this with real repositories
import { MockShoppingListRepository } from "./MockShoppingListRepository";
import { MockMealRepository } from "./MockMealRepository";

export class ServiceLocator {
  private static instance: ServiceLocator;
  private mealRepository: IMealRepository;
  private shoppingListRepository: IShoppingListRepository;
  private userRepository: IUserRepository;

  private constructor() {
    //TODO: Update this with real repositories
    this.mealRepository = new MockMealRepository();
    this.shoppingListRepository = new MockShoppingListRepository();
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
