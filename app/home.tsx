import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { useUserStore } from "../lib/store";
import { Redirect, useRouter } from "expo-router";
import { clearData } from "../utils/functions";
import { TextSize } from "../constants/Size";
import { primary } from "../constants/Colors";
import { StatusBar } from "expo-status-bar";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import QrCodeSvg from "../components/QrCodeSvg";

const DATE = new Date().getFullYear();

const HomeScreen = () => {
  const { user, setUser } = useUserStore();

  const router = useRouter();

  const deleteAllKeys = async () => {
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir supprimer toutes les données ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            clearData();
            setUser(null);

            router.replace("/"); // navigate to welcome screen.
          },
        },
      ],
      { cancelable: false }
    );
  };

  if (!user) {
    return <Redirect href="/" />;
  }
  return (
    <ScrollView contentContainerStyle={{ flex: 1 }}>
      <View style={styles.container}>
        {/* group top header */}
        <View style={styles.groupTopHeader}>
          <Text style={styles.title}>Bienvenue, {user.name}!</Text>

          {/* number */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 5,
              width: "100%",
              marginTop: 10,
            }}
          >
            <FontAwesome6 name="phone" size={20} color="white" />
            <Text style={styles.subtitle}>+(243)-{user.number}</Text>
          </View>

          {/* joined at */}
          <Text
            style={[
              styles.subtitle,
              {
                color: "lightgrey",
                fontSize: 11,
              },
            ]}
          >
            Inscrit depuis{" "}
            {new Date(user.createdAt).toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>

          {/* buttons */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              width: "100%",
              alignItems: "center",
              gap: 15,
            }}
          >
            {/* edit */}
            <Pressable
              onPress={() => {
                router.navigate("/profile");
              }}
            >
              <FontAwesome6 name="edit" size={26} color="white" />
            </Pressable>
            {/* delete all data */}
            <Pressable onPress={deleteAllKeys}>
              <FontAwesome6 name="trash" size={26} color="#f1948a" />
            </Pressable>
          </View>
        </View>

        {/* group bottom */}
        <QrCodeSvg />

        {/* footer */}
        <View
          style={{
            // position: "absolute",
            // bottom: 0,
            width: "100%",
            padding: 20,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: TextSize.xs, color: "dimgray" }}>
            FidelizMe by SERVI Group © {DATE}
          </Text>
        </View>

        <StatusBar style="light" animated />
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
    width: "100%",
  },
  title: {
    fontSize: TextSize.xxl,
    fontWeight: "bold",
    color: "white",
  },
  groupTopHeader: {
    backgroundColor: primary,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
    justifyContent: "center",
    alignItems: "flex-start",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    width: "100%",
    gap: 5,
  },
  subtitle: {
    fontSize: TextSize.md,
    color: "#fff",
  },
});
