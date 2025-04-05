import React, { useLayoutEffect, useState } from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useUserStore } from "../lib/store";
import { getData } from "../utils/functions";
import { UserType } from "../types";
import { ActivityIndicator, View } from "react-native";
import { primary } from "../constants/Colors";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  const { user, setUser } = useUserStore();
  const [isFirstTimeLoaded, setIsFirstTimeLoaded] = useState(false);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useLayoutEffect(() => {
    const loadData = async () => {
      const getUser = async () => {
        const value = (await getData("user")) as UserType;
        if (value === null) {
          setUser(null);
        } else {
          setUser(value as UserType);
        }
        setIsFirstTimeLoaded(true);
      };
      await getUser();
    };

    loadData();
  }, []);

  useEffect(() => {
    if (loaded && isFirstTimeLoaded) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 500); // Réduisez le délai
    }
  }, [loaded, isFirstTimeLoaded]);

  if (!loaded || !isFirstTimeLoaded) {
    // Affichez un écran de chargement
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={primary} />
      </View>
    );
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { user } = useUserStore();
  if (!user) {
    return (
      <>
        <Stack initialRouteName="index">
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" animated />
      </>
    );
  }

  return (
    <>
      <Stack initialRouteName="home">
        <Stack.Screen
          name="home"
          options={{ headerShown: false, title: "Accueil" }}
        />
        <Stack.Screen
          name="profile"
          options={{ presentation: "modal", title: "Modifier votre Profile" }}
        />
      </Stack>
      <StatusBar style="auto" animated />
    </>
  );
}
