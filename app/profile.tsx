import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { TextSize } from "../constants/Size";
import { Redirect, useRouter } from "expo-router";
import { useUserStore } from "../lib/store";
import { primary } from "../constants/Colors";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { isEmptyString, setData } from "../utils/functions";

const ProfileScreen = () => {
  const { user, setUser } = useUserStore();

  const [name, setName] = useState(user ? user.name : "");
  const [number, setNumber] = useState(user ? user.number : "");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (error) {
      setTimeout(() => setError(""), 3000);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      setTimeout(() => setSuccess(""), 3000);
    }
  }, [success]);

  if (!user) {
    return <Redirect href="/" />;
  }

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

      const formData = {
        name: name.trim(),
        number,
        createdAt: user.createdAt,
      };

      const updatedUser = await setData("user", formData);

      if (!updatedUser) {
        setError(
          "Une erreur s'est produite lors de la mise à jour de votre compte."
        );
        setLoading(false);
        return;
      }

      setTimeout(() => setUser(formData), 1500);
      setSuccess("Compte a été mis à jour avec succès!");
    } catch (error) {
      setError("Impossible de continuer, Veuillez reessayer plus tard!");
    } finally {
      setTimeout(() => setLoading(false), 3000);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={100}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={{ fontSize: TextSize.sm, color: "dimgray" }}>
            Tous les champs sont obligatoires. Si vous modifier votre numero,
            vous perdrez tous vos points accumules dans divers boutiques.
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
                (name === user.name && number === user.number) ||
                number.length < 9
                  ? styles.disableButton
                  : styles.button
              }
              disabled={
                loading ||
                isEmptyString(name) ||
                isEmptyString(number) ||
                (name === user.name && number === user.number) ||
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
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    width: "100%",
    gap: 20,
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
  form: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 15,
  },
});
