import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useState } from "react";
import { useUserStore } from "../lib/store";
import { primary } from "../constants/Colors";
import { StatusBar } from "expo-status-bar";
import { TextSize } from "../constants/Size";
import { Redirect, useRouter } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { isEmptyString, setData } from "../utils/functions";

const IMAGE1 = require("../assets/images/woman1.jpg");
const IMAGE2 = require("../assets/images/woman2.jpg");
const IMAGE3 = require("../assets/images/woman3.jpg");

const IMAGES = [IMAGE1, IMAGE2, IMAGE3];

const WelcomeSCreen = () => {
  const [index, setIndex] = useState(0);
  const { user, setUser } = useUserStore();

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isEmptyString(name) || isEmptyString(number)) {
        setError("Veuillez remplir tous les champs.");
        setLoading(false);
        return;
      }
      //   const phoneNumberRegex = /^\+[1-9]\d{1,14}$/;
      //   if (!phoneNumberRegex.test(number)) {
      //     setError("Veuillez entrer un numéro de téléphone valide.");
      //     setLoading(false);
      //     return;
      //   }

      if (number.length < 9) {
        setError("Veuillez entrer un numéro de téléphone correct.");
        setLoading(false);
        return;
      }

      const formData = {
        name: name.trim(),
        number,
        createdAt: Date.now(),
      };

      const newUser = await setData("user", formData);

      if (!newUser) {
        setError(
          "Une erreur s'est produite lors de la création de votre compte."
        );
        return;
      }

      setTimeout(() => {
        setUser(formData);
        router.replace("/home");
      }, 2500);

      setSuccess("Compte créé avec succès!");
    } catch (error) {
      setError("Impossible de continuer, Veuillez reessayer plus tard!");
    } finally {
      setTimeout(() => setLoading(false), 3000);
    }
  };

  if (user) {
    return <Redirect href="/home" />;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={100}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={{ flex: 1, width: "100%", position: "relative" }}>
            <Image
              source={IMAGES[index]}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              key={index}
            />
            {/* navigation buttons */}
            <View style={styles.navigationButtons}>
              {IMAGES.map((_, idx) => (
                <Pressable
                  style={{
                    width: 10,
                    height: 10,
                    backgroundColor: idx === index ? primary : "darkgray",
                    borderRadius: 5,
                  }}
                  key={idx}
                />
              ))}
            </View>
          </View>

          <View style={styles.group2}>
            {/* title */}
            <Text style={styles.title} numberOfLines={2}>
              Bienvenue dans <Text style={{ color: primary }}>FidelizMe!</Text>
            </Text>

            {/* description */}
            <Text style={styles.description}>
              Profiter des meilleures offres de vos vendeurs préférés grace des
              options de fidélité.
            </Text>

            {/* form */}
            <View style={styles.form}>
              {/* name */}
              <View style={styles.inputGroup}>
                <FontAwesome5 name="user" size={24} color="black" />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Prenom et Nom"
                  returnKeyType="next"
                  placeholderTextColor={"#ccc"}
                  maxLength={40}
                />
              </View>
              {/* number */}
              <View style={styles.inputGroup}>
                <FontAwesome6 name="phone-volume" size={24} color="black" />
                <TextInput
                  style={styles.input}
                  value={number}
                  onChangeText={setNumber}
                  keyboardType="number-pad"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Numéro de téléphone"
                  returnKeyType="done"
                  placeholderTextColor={"#ccc"}
                  maxLength={9}
                />
              </View>

              {/* error */}
              {error && (
                <Text style={{ color: "red", marginTop: 5 }}>{error}</Text>
              )}

              {/* success */}
              {success && (
                <Text style={{ color: "green", marginTop: 5 }}>{success}</Text>
              )}

              {number.length > 3 && number.length < 9 && (
                <Text style={{ color: "dimgray", marginTop: 5, fontSize: 12 }}>
                  Le numero ne doit pas contenir 0 ou +243 au debut.
                </Text>
              )}

              {/* submit */}
              <TouchableOpacity
                style={
                  loading ||
                  isEmptyString(name) ||
                  isEmptyString(number) ||
                  number.length < 9
                    ? styles.disableButton
                    : styles.button
                }
                disabled={
                  loading ||
                  isEmptyString(name) ||
                  isEmptyString(number) ||
                  number.length < 9
                }
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>
                  {loading ? "chargement..." : "Commencer"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <StatusBar style="light" animated />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default WelcomeSCreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    gap: 5,
    zIndex: 1,
    backgroundColor: "transparent",
  },
  group2: {
    width: "100%",
    gap: 20,
    padding: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: TextSize.xxl3,
    fontWeight: "900",
  },
  description: {
    fontSize: TextSize.sm,
    lineHeight: 20,
  },

  form: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 15,
  },
  inputGroup: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 15,
    width: "100%",
    fontSize: TextSize.md,
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: TextSize.md,
    color: "black",
    borderLeftWidth: 1,
    borderColor: "#ccc",
    paddingLeft: 10,
  },

  button: {
    backgroundColor: primary,
    paddingVertical: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  disableButton: {
    backgroundColor: "gray",
    paddingVertical: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: TextSize.md,
    fontWeight: "bold",
  },
});
