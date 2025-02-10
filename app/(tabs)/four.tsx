import {
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "@/components/Themed";
import { Meal, ServiceLocator } from "@/data/repositories";
import { useState, useEffect } from "react";
import { UserProfile } from "@/data/types/UserProfile";
import * as ImagePicker from "expo-image-picker";
import { uploadData } from "aws-amplify/storage";

export default function ProfileScreen() {
  const [userData, setUserData] = useState<UserProfile>();
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [recentMeals, setRecentMeals] = useState<Meal[]>([]);
  const [favoriteMeals, setFavoriteMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const userRepository = ServiceLocator.getInstance().getUserRepository();
  const mealRepository = ServiceLocator.getInstance().getMealRepository();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const profile = await userRepository.getUserProfile();
        const recentMealsResult = await mealRepository.getRecentMeals();
        const favoriteMealsResult = await mealRepository.getFavoriteMeals();
        setRecentMeals(recentMealsResult);
        setFavoriteMeals(favoriteMealsResult);
        setUserData(profile);
        setProfilePicture(profile.avatar);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleImagePick = async () => {
    setIsImageUploading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0].uri) {
        const uri = result.assets[0].uri;
        await userRepository.updateProfilePicture();
        const response = await fetch(uri);
        const blob = await response.blob();
        try {
          const result = await uploadData({
            path: `profile-pictures/${userData?.id}.jpg`,
            data: blob,
            options: {
              onProgress: ({ transferredBytes, totalBytes }) => {
                if (totalBytes) {
                  console.log(
                    `Upload progress ${Math.round(
                      (transferredBytes / totalBytes) * 100
                    )} %`
                  );
                }
              },
            },
          }).result;
          console.log("Path from Response: ", result.path);
        } catch (error) {
          console.log("Error : ", error);
        }
        setProfilePicture(uri);
      }
    } finally {
      setIsImageUploading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!userData) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleImagePick} disabled={isImageUploading}>
          {isImageUploading ? (
            <View style={[styles.avatar, styles.loadingAvatar]}>
              <ActivityIndicator size="large" color="#007AFF" />
            </View>
          ) : (
            <Image source={{ uri: profilePicture }} style={styles.avatar} />
          )}
          <View style={styles.editIconContainer}>
            <Ionicons name="pencil" size={16} color="#FFF" />
          </View>
        </TouchableOpacity>
        <Text style={styles.name}>{userData.name}</Text>
        <Text style={styles.role}>{userData.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Meals</Text>
        {recentMeals.length > 0 ? (
          recentMeals.map((meal: any, index: number) => (
            <View key={index} style={styles.activityItem}>
              <Ionicons name="restaurant-outline" size={24} color="#666" />
              <Text style={styles.activityText}>
                {meal.title} • Cooked {meal.cookedDate}
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.activityItem}>
            <Text style={styles.activityText}>No recent meals to display</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Favorite Meals</Text>
        {favoriteMeals.length > 0 ? (
          favoriteMeals.map((meal: any, index: number) => (
            <View key={index} style={styles.activityItem}>
              <Ionicons name="heart-outline" size={24} color="#666" />
              <Text style={styles.activityText}>
                {meal.title} • Last cooked on {meal.lastCooked?.split("T")[0]}
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.activityItem}>
            <Text style={styles.activityText}>
              No favorite meals to display
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  loadingAvatar: {
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  editIconContainer: {
    position: "absolute",
    right: 0,
    bottom: 15,
    backgroundColor: "#007AFF",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  role: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  section: {
    padding: 20,
    backgroundColor: "white",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },
  activityText: {
    fontSize: 14,
    color: "#444",
  },
});
