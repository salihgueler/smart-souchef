import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Link, Tabs } from "expo-router";
import { Pressable, TouchableOpacity } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useAuthenticator } from "@aws-amplify/ui-react-native";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome | typeof FontAwesome6>["name"];
  color: string;
  isFontAwesome6?: boolean;
}) {
  const IconComponent = props.isFontAwesome6 ? FontAwesome6 : FontAwesome;
  return <IconComponent size={28} style={{ paddingBottom: 4 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { signOut } = useAuthenticator();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "AI Assistant",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="robot" color={color} isFontAwesome6={true} />
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "Previous Meals",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="history" color={color} isFontAwesome6={false} />
          ),
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: "Shopping List",
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name="shopping-cart"
              color={color}
              isFontAwesome6={false}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="four"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="user" color={color} isFontAwesome6={false} />
          ),
          headerRight: () => (
            <TouchableOpacity onPress={signOut}>
              <FontAwesome
                name="sign-out"
                size={25}
                color={Colors[colorScheme ?? "light"].text}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Tabs>
  );
}
