import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { useState, useEffect } from "react";
import { Meal, ServiceLocator } from "@/data/repositories";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function TabTwoScreen() {
  const router = useRouter();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newMealTitle, setNewMealTitle] = useState("");
  const [newIngredient, setNewIngredient] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const repository = ServiceLocator.getInstance().getMealRepository();
        const recentMeals = await repository.getRecentMeals();
        setMeals(recentMeals);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleMealPress = (meal: Meal) => {
    router.push({
      pathname: "/modal",
      params: {
        mealId: meal.id,
      },
    });
  };

  const handleMealLongPress = async (meal: Meal) => {
    setIsLoading(true);
    try {
      const repository = ServiceLocator.getInstance().getMealRepository();
      await repository.deleteMealById(meal.id!);
      const recentMeals = await repository.getRecentMeals();
      setMeals(recentMeals);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient("");
    }
  };

  const handleSaveMeal = async () => {
    if (newMealTitle.trim() && ingredients.length > 0) {
      setIsSaving(true);
      try {
        const repository = ServiceLocator.getInstance().getMealRepository();
        const ingredientsMap: Record<string, number> = {};
        ingredients.forEach((ingredient) => {
          ingredientsMap[ingredient] = 1;
        });
        await repository.createMeal(newMealTitle, ingredientsMap, []);
        setModalVisible(false);
        setNewMealTitle("");
        setIngredients([]);
        const recentMeals = await repository.getRecentMeals();
        setMeals(recentMeals);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleAddMeal = () => {
    setModalVisible(true);
  };

  const renderRightActions = (meal: Meal) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
      <TouchableOpacity
        style={[
          {
            backgroundColor: meal.favoriteMealsId ? "#ff69b4" : "#f0f0f0",
            justifyContent: "center",
            alignItems: "center",
            width: 80,
            height: "100%",
            borderTopRightRadius: 8,
            borderBottomRightRadius: 8,
            elevation: 2,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
          },
          isLoading && { opacity: 0.7 },
        ]}
        onPress={async () => {
          if (isLoading) return;
          setIsLoading(true);
          try {
            const repository = ServiceLocator.getInstance().getMealRepository();
            if (meal.favoriteMealsId) {
              await repository.removeMealFromFavorites(meal);
            } else {
              await repository.addMealToFavorites(meal);
            }
            // Optimistically update the UI
            setMeals((prevMeals) =>
              prevMeals.map((m) =>
                m.id === meal.id
                  ? { ...m, favoriteMealsId: meal.favoriteMealsId }
                  : m
              )
            );
            // Then fetch the updated meal in the background
            const updatedMeal = await repository.getMealById(meal.id!);
            setMeals((prevMeals) =>
              prevMeals.map((m) => (m.id === meal.id ? updatedMeal : m))
            );
          } catch (error) {
            console.error("Failed to toggle favorite:", error);
          } finally {
            setIsLoading(false);
          }
        }}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={meal.favoriteMealsId ? "#fff" : "#666"} />
        ) : (
          <MaterialIcons
            name={meal.favoriteMealsId ? "favorite" : "favorite-border"}
            size={28}
            color={meal.favoriteMealsId ? "#fff" : "#666"}
          />
        )}
      </TouchableOpacity>
    );
  };

  const renderMealItem = ({ item }: { item: Meal }) => (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Swipeable renderRightActions={() => renderRightActions(item)}>
        <TouchableOpacity
          style={[
            styles.mealItem,
            item.favoriteMealsId && styles.favoriteMealItem,
          ]}
          onPress={() => handleMealPress(item)}
          onLongPress={() => handleMealLongPress(item)}
        >
          <View style={styles.mealItemContent}>
            <Text style={styles.mealName}>{item.title}</Text>
            <Text style={styles.mealDate}>{item.lastCooked}</Text>
          </View>
          {item.favoriteMealsId && (
            <MaterialIcons
              name="favorite"
              size={24}
              color="#ff69b4"
              style={styles.favoriteIcon}
            />
          )}
        </TouchableOpacity>
      </Swipeable>
    </GestureHandlerRootView>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : meals.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons
            name="restaurant"
            size={50}
            color="#666"
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyText}>No previous meals found</Text>
          <Text style={styles.emptySubText}>
            Your cooked meals will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          style={styles.list}
          data={meals}
          renderItem={renderMealItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={handleAddMeal}>
        <MaterialIcons name="add" size={24} color="#FFF" />
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Meal</Text>
            <TextInput
              style={styles.input}
              placeholder="Meal Title"
              value={newMealTitle}
              onChangeText={setNewMealTitle}
            />
            <View style={styles.ingredientInputContainer}>
              <TextInput
                style={styles.ingredientInput}
                placeholder="Add Ingredient"
                value={newIngredient}
                onChangeText={setNewIngredient}
              />
              <TouchableOpacity
                style={styles.addIngredientButton}
                onPress={handleAddIngredient}
              >
                <MaterialIcons name="add" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.ingredientsList}>
              {ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <Text>{ingredient}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.saveButton, isSaving && styles.disabledButton]}
              onPress={handleSaveMeal}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.saveButtonText}>Save Meal</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#666",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: "80%",
  },
  list: {
    width: "100%",
    paddingHorizontal: 20,
  },
  mealItem: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  favoriteMealItem: {
    borderLeftWidth: 4,
    borderLeftColor: "#ff69b4",
  },
  mealItemContent: {
    flex: 1,
  },
  mealName: {
    fontSize: 18,
    fontWeight: "600",
  },
  mealDate: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  favoriteIcon: {
    position: "absolute",
    right: 15,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#007AFF",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  ingredientInputContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  ingredientInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  addIngredientButton: {
    backgroundColor: "#007AFF",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  ingredientsList: {
    maxHeight: 200,
  },
  ingredientItem: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  saveButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
