import { StatusBar } from "expo-status-bar";
import {
  Platform,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { useLocalSearchParams } from "expo-router";
import { Meal, ServiceLocator } from "@/data/repositories";
import { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";

const Header = ({
  title,
  lastCooked,
}: {
  title?: string;
  lastCooked?: string;
}) => (
  <View style={styles.headerContainer}>
    <Text style={styles.title}>{title}</Text>
    <View style={styles.lastCookedContainer}>
      <MaterialIcons
        name="access-time"
        size={20}
        color={colors.textSecondary}
      />
      <Text style={styles.lastCookedText}>Last Cooked: {lastCooked}</Text>
    </View>
  </View>
);

const IngredientsList = ({
  ingredients,
}: {
  ingredients: { name: string }[];
}) => (
  <View style={styles.ingredientsContainer}>
    <Text style={styles.sectionTitle}>Ingredients</Text>
    <View style={styles.ingredientsList}>
      {ingredients.map((ingredient, index) => (
        <View key={index} style={styles.ingredientItem}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.ingredientText}>{ingredient.name}</Text>
        </View>
      ))}
    </View>
  </View>
);

export default function ModalScreen() {
  const { mealId } = useLocalSearchParams();
  const [meal, setMeal] = useState<Meal>();
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingToList, setIsAddingToList] = useState(false);

  useEffect(() => {
    const repository = ServiceLocator.getInstance().getMealRepository();
    const loadData = async () => {
      setIsLoading(true);
      try {
        if (mealId) {
          const selectedMeal = await repository.getMealById(mealId as string);
          setMeal(selectedMeal);
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [mealId]);

  const handleAddToShoppingList = async () => {
    if (mealId) {
      setIsAddingToList(true);
      try {
        const shoppingListRepository =
          ServiceLocator.getInstance().getShoppingListRepository();
        await shoppingListRepository.setCurrentMealId(mealId as string);
      } finally {
        setIsAddingToList(false);
      }
    }
  };

  if (!mealId) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Meal not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <>
          <Header title={meal?.title} lastCooked={meal?.lastCooked ?? ""} />

          <View
            style={styles.separator}
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.1)"
          />

          {meal?.ingredients && (
            <IngredientsList
              ingredients={meal?.ingredients.map((ingredient) => ({
                name: ingredient?.name ?? "",
              }))}
            />
          )}

          <TouchableOpacity
            style={[
              styles.addToListButton,
              isAddingToList && styles.disabledButton,
            ]}
            onPress={handleAddToShoppingList}
            disabled={isAddingToList}
          >
            {isAddingToList ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.addToListButtonText}>
                Add to Shopping List
              </Text>
            )}
          </TouchableOpacity>
        </>

        <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      </View>
    </ScrollView>
  );
}

const colors = {
  primary: "#333",
  textSecondary: "#666",
  error: "#ff6b6b",
  background: "#f5f5f5",
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  lastCookedContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 10,
    borderRadius: 8,
  },
  lastCookedText: {
    marginLeft: 8,
    color: colors.textSecondary,
    fontSize: 16,
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: "100%",
  },
  ingredientsContainer: {
    width: "100%",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 15,
  },
  ingredientsList: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 15,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    backgroundColor: colors.background,
  },
  bulletPoint: {
    fontSize: 20,
    marginRight: 10,
    color: colors.textSecondary,
  },
  ingredientText: {
    fontSize: 16,
    color: colors.primary,
  },
  errorText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.error,
  },
  addToListButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  addToListButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.7,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
});
