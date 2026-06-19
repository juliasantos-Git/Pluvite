import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CloudSun, Newspaper, Phone, User } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Clima from "../pages/clima/page";
import Feed from "../pages/feed/page";
import Contatos from "../pages/contatos/page";
import Perfil from "../pages/perfil/page";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
            backgroundColor: "#19316e",
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen
        name="Clima"
        component={Clima}
        options={{
          tabBarIcon: ({ color, size }) => <CloudSun color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarIcon: ({ color, size }) => <Newspaper color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Contatos"
        component={Contatos}
        options={{
          tabBarIcon: ({ color, size }) => <Phone color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}