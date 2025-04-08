import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Contenedores: undefined;
  DashboardAdmin: undefined; // Si aún no existe, lo puedes crear luego
};

type NavigationProps = StackNavigationProp<RootStackParamList, "Login">;

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!usuario.trim() || !password.trim()) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    try {
      const res = await axios.post("https://api-rest-bin-tracker.onrender.com/api/login", {
        usuario,
        password,
      });

      const user = res.data;
      await AsyncStorage.setItem("usuario", JSON.stringify(user));

      if (user.rol === "admin") {
        navigation.navigate("Contenedores"); // Crear o configurar componente admin
      } else if (user.rol === "normal") {
        navigation.navigate("ContenedoresUser");
      } else {
        Alert.alert("Error", "Rol no reconocido");
      }

    } catch (error: any) {
      console.error("Login error:", error);
      Alert.alert("Error de servidor", error.response?.data?.message || "Ocurrió un error inesperado.");
    }
  };

  const handleCancel = () => {
    navigation.navigate("Home");
  };

  return (
    <ImageBackground source={require("../assets/Fondo.jpg")} style={styles.background}>
      <View style={styles.loginContainer}>
        <Text style={styles.title}>Bin Tracker</Text>
        <Image source={require("../assets/lo.png")} style={styles.logo} />

        <View style={styles.inputContainer}>
          <Ionicons name="person" size={20} color="gray" style={styles.icon} />
          <TextInput
            placeholder="Usuario"
            style={styles.input}
            value={usuario}
            onChangeText={setUsuario}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed" size={20} color="gray" style={styles.icon} />
          <TextInput
            placeholder="**************"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <LinearGradient colors={["#F6DD61", "#1DE3F1"]} style={styles.gradientBorder}>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Aceptar</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  loginContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.29)",
    padding: 40,
    borderRadius: 15,
    alignItems: "center",
    width: "90%",
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "serif",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.29)",
    borderRadius: 25,
    width: "90%",
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "gray",
    height: 60,
  },
  icon: { marginRight: 10 },
  input: {
    flex: 1,
    padding: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 25,
    width: "90%",
  },
  gradientBorder: {
    borderRadius: 25,
    padding: 3,
    flex: 1,
  },
  button: {
    backgroundColor: "#66D467",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
    fontStyle: "italic",
  },
  cancelButton: {
    backgroundColor: "#FF5C5C",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    flex: 1,
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default LoginScreen;
