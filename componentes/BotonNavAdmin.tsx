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

const BottomNavigationAdmin = () => {
  const navigation = useNavigation<NavigationProp>();
  const screenWidth = Dimensions.get("window").width; // Obtiene el ancho del dispositivo

  return (
    <View style={[styles.bottomNavigation, { width: screenWidth }]}>
      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Contenedores")}>
        <Ionicons name="settings" size={24} color="white" />
        <Text style={styles.navText}>Panel Principal</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("NotificacionesAdmin")}>
        <Ionicons name="notifications" size={24} color="white" />
        <Text style={styles.navText}>Notificaciones</Text>
      </TouchableOpacity>

      
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

export default BottomNavigationAdmin;
