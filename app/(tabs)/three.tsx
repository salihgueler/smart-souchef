import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { ServiceLocator } from "../../data/repositories";
import { useFocusEffect } from "expo-router";

const EmptyShoppingList = () => (
  <View style={styles.emptyContainer}>
    <Ionicons name="cart-outline" size={64} color="#666" />
    <Text style={styles.emptyText}>No active shopping list</Text>
    <Text style={styles.emptySubText}>Select a meal to start shopping</Text>
  </View>
);

export default function TabThreeScreen() {
  const shoppingListRepository =
    ServiceLocator.getInstance().getShoppingListRepository();
  const mealRepository = ServiceLocator.getInstance().getMealRepository();
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [currentMealId, setCurrentMealId] = useState<string>("");
  const [currentMealTitle, setCurrentMealTitle] = useState<string>("");
  const [allChecked, setAllChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  // Using React.useCallback to memoize the loadData function
  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const mealId = await shoppingListRepository.getCurrentMealId();
      if (mealId) {
        const meals = await mealRepository.getMealById(mealId);
        const items = Object.values(meals.ingredients!);
        setCurrentMealId(mealId);
        setIngredients(items);
        console.log(items);
        setCurrentMealTitle(meals.title);
      }
    } finally {
      setIsLoading(false);
    }
  }, [mealRepository, shoppingListRepository]);

  // Using useEffect for initial load
  React.useEffect(() => {
    loadData();
  }, [loadData]);

  // Using useFocusEffect to reload data when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadData();

      return () => {
        // Cleanup function if needed
      };
    }, [loadData])
  );

  const toggleItem = async (id: number) => {
    const ingredient = ingredients.find((i: any) => i.id === id);
    if (ingredient && currentMealId) {
      // Optimistically update UI
      const updatedIngredients = ingredients.map((ingredient: any) =>
        ingredient.id === id
          ? { ...ingredient, checked: !ingredient.checked }
          : ingredient
      );
      setIngredients(updatedIngredients);
      setAllChecked(updatedIngredients.every((item: any) => item.checked));

      // Update in background
      try {
        await shoppingListRepository.updateIngredientStatus(
          currentMealId,
          id,
          !ingredient.checked
        );
      } catch (error) {
        // Revert on error
        setIngredients(ingredients);
        setAllChecked(ingredients.every((item: any) => item.checked));
        console.error("Failed to update ingredient status:", error);
      }
    }
  };

  const handleFinishShopping = async () => {
    setIsFinishing(true);
    try {
      await shoppingListRepository.removeCurrentShoppingList();
      setIngredients([]);
      setCurrentMealId("");
      setCurrentMealTitle("");
      setAllChecked(false);
    } finally {
      setIsFinishing(false);
    }
  };

  if (!currentMealId || ingredients.length === 0) {
    return isLoading ? (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      </View>
    ) : (
      <EmptyShoppingList />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{currentMealTitle}</Text>
      <ScrollView style={styles.listContainer}>
        {ingredients.map((ingredient) => (
          <TouchableOpacity
            key={Math.random()}
            style={styles.itemContainer}
            onPress={() => toggleItem(ingredient.id)}
          >
            <View style={styles.item}>
              <Text
                style={[
                  styles.itemText,
                  ingredient.checked && styles.checkedItemText,
                ]}
              >
                {ingredient.name}
              </Text>
              <Ionicons
                name={ingredient.checked ? "checkbox" : "square-outline"}
                size={24}
                color={ingredient.checked ? "#2196F3" : "#666"}
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {allChecked && ingredients.length > 0 && (
        <TouchableOpacity
          style={[styles.finishButton, isFinishing && styles.disabledButton]}
          onPress={handleFinishShopping}
          disabled={isFinishing}
        >
          {isFinishing ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.finishButtonText}>Finish Shopping</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  listContainer: {
    flex: 1,
  },
  itemContainer: {
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
  },
  itemText: {
    fontSize: 18,
  },
  checkedItemText: {
    textDecorationLine: "line-through",
    color: "#666",
  },
  finishButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  finishButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  emptySubText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  loader: {
    flex: 1,
  },
  disabledButton: {
    opacity: 0.7,
  },
});
