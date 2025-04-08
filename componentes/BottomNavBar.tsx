import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Home: undefined;
  Contacto: undefined;
  SobreNosotros: undefined;
  Login: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const BottomNavigation = () => {
  const navigation = useNavigation<NavigationProp>();
  const screenWidth = Dimensions.get("window").width; // Obtiene el ancho del dispositivo

  return (
    <View style={[styles.bottomNavigation, { width: screenWidth }]}>
      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Home")}>
        <Ionicons name="home" size={24} color="white" />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Contacto")}>
        <Ionicons name="call" size={24} color="white" />
        <Text style={styles.navText}>Contacto</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("SobreNosotros")}>
        <Ionicons name="information-circle" size={24} color="white" />
        <Text style={styles.navText}>Sobre Nosotros</Text>
      </TouchableOpacity>
{/**<TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Login")}>
        <Ionicons name="log-out-outline" size={24} color="white" />
        <Text style={styles.navText}>Cerrar Sesión</Text>
      </TouchableOpacity> */}
      
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNavigation: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    height: 60,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    paddingBottom: Platform.OS === "ios" ? 20 : 10, // Ajuste en iOS
  },
  navButton: { alignItems: "center", flex: 1 },
  navText: { color: "white", fontSize: 12, marginTop: 3 },
});

export default BottomNavigation;
