import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const LoginScreen = () => {
  return (
    <View style={styles.navBar}>
      <TouchableOpacity style={styles.navItem}>
        <Ionicons name="home" size={24} color="black" />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem}>
        <Ionicons name="list" size={24} color="black" />
        <Text style={styles.navText}>Producto</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem}>
        <Ionicons name="mail" size={24} color="black" />
        <Text style={styles.navText}>Contacto</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: { flexDirection: "row", justifyContent: "space-around", backgroundColor: "white", paddingVertical: 15, borderTopWidth: 1, borderColor: "#ddd" },
  navItem: { alignItems: "center" },
  navText: { fontSize: 12, marginTop: 5 },
});

export default LoginScreen;