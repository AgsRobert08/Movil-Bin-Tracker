// componentes/SplashScreen.tsx
import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={require("../assets/lo.png")} style={styles.logo} />
      <Text style={styles.title}>Bin Tracker</Text>
      <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />
      <Text style={styles.loadingText}>Cargando sistema...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
});

export default SplashScreen;
