import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useUserStore } from "../lib/store";
import QRCode from "react-native-qrcode-svg";
import { TextSize } from "../constants/Size";

const { width } = Dimensions.get("window");
const logo = require("../assets/images/adaptive-icon.png");

const QrCodeSvg = () => {
  const { user } = useUserStore();
  const [error, setError] = useState("");
  if (!user) return null;

  return (
    <View style={styles.container}>
      <Text
        style={{ fontSize: TextSize.xxl2, fontWeight: "bold", width: "100%" }}
      >
        Mes actions
      </Text>

      <QRCode
        value={user.number}
        color={"#000"}
        backgroundColor={"#fff"}
        size={width * 0.8}
        logoSize={60}
        logo={logo}
        logoBackgroundColor="transparent"
        onError={() =>
          setError("Impossible d'afficher votre QR Code! Revenez plus tard!")
        }
      />

      {error && <Text style={{ color: "red" }}>{error}</Text>}
      <Text
        style={{
          fontSize: TextSize.sm,
          width: "100%",
          color: "dimgray",
          marginTop: 10,
        }}
      >
        faites scanner ce code QR pour lire ou échanger des points.
      </Text>
    </View>
  );
};

export default QrCodeSvg;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    width: "100%",
    gap: 20,
  },
});
