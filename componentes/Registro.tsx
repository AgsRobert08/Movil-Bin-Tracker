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
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const CreateAccountScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const isValidName = (text: string) => /^[A-Za-zÀ-ÿ\s]+$/.test(text.trim());

  const isValidEmail = (text: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);

  const handleRegister = () => {
    if (!name || !email || !username || !password) {
      Alert.alert("Todos los campos son obligatorios");
      return;
    }

    if (!isValidName(name)) {
      Alert.alert(
        "El nombre no puede contener números ni caracteres inválidos"
      );
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Por favor, introduce un correo válido");
      return;
    }

    if (password.length > 14) {
      Alert.alert("La contraseña no puede exceder los 14 caracteres");
      return;
    }

    navigation.navigate("Login");
  };

  return (
    <ImageBackground
      source={require("../assets/Fondo.jpg")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Crear Cuenta</Text>
        <Image source={require("../assets/lo.png")} style={styles.logo} />

        <View style={styles.inputContainer}>
          <FontAwesome5
            name="id-card"
            size={20}
            color="black"
            style={styles.icon}
          />
          <TextInput
            placeholder="Nombre"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
            name="mail"
            size={20}
            color="black"
            style={styles.icon}
          />
          <TextInput
            placeholder="Correo electrónico"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
            name="person-circle"
            size={20}
            color="black"
            style={styles.icon}
          />
          <TextInput
            placeholder="Crea un usuario"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed"
            size={20}
            color="black"
            style={styles.icon}
          />
          <TextInput
            placeholder="Crea una contraseña"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            maxLength={14}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.registerText}>Crear cuenta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    width: "85%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    fontStyle: "italic",
    marginBottom: 10,
    color: "#000",
    textShadowColor: "black",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    textAlign: "center",
  },
  logo: { width: 120, height: 120, marginBottom: 20 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 25,
    width: "100%",
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 50,
    borderWidth: 1,
    borderColor: "black",
  },
  icon: { marginRight: 10 },
  input: { flex: 1, padding: 10 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  registerButton: {
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  registerText: { color: "white", fontWeight: "bold" },
  cancelButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  cancelText: { color: "white", fontWeight: "bold" },
});

export default CreateAccountScreen;