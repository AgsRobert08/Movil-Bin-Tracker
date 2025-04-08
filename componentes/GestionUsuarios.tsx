import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import BottomNavigationAdmin from "./BotonNavAdmin";  

const API_URL = "https://api-rest-bin-tracker.onrender.com/api/usuarios";

type User = {
  matricula: string;
  nombreCompleto: string;
  correo: string;
  telefono: string;
  rol: string;
  creadoPor: string;
};

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [usuarioActual, setUsuarioActual] = useState<any>(null);

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const data = await AsyncStorage.getItem("usuario");
        if (data) {
          const user = JSON.parse(data);
          setUsuarioActual(user);
          obtenerUsuarios(user._id);
        } else {
          Alert.alert("No logueado", "Por favor inicia sesión.");
          setLoading(false);
        }
      } catch (error) {
        Alert.alert("Error", "No se pudo leer el usuario local.");
        setLoading(false);
      }
    };

    cargarUsuario();
  }, []);

  const obtenerUsuarios = async (adminId: string) => {
    try {
      const res = await axios.get(API_URL);
      const filtrados = res.data.filter(
        (user: User) => user.rol === "normal" && user.creadoPor === adminId
      );
      setUsers(filtrados);
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar la lista de usuarios.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (matricula: string) => {
    try {
      await axios.delete(`${API_URL}/${matricula}`);
      if (usuarioActual) obtenerUsuarios(usuarioActual._id);
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar el usuario.");
    }
  };

  const handleEdit = (matricula: string) => {
    const user = users.find((u) => u.matricula === matricula);
    if (user) {
      setEditingUser({ ...user });
    }
  };

  const saveEdit = async () => {
    if (!editingUser) return;
    const { matricula, nombreCompleto, correo, telefono } = editingUser;

    try {
      await axios.put(`${API_URL}/${matricula}`, {
        nombreCompleto,
        correo,
        telefono,
      });
      setEditingUser(null);
      if (usuarioActual) obtenerUsuarios(usuarioActual._id);
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el usuario.");
    }
  };

  return (
    <View style={styles.container}>

      <Text style={[styles.title, { color: "#3bbdbb" }]}>Usuarios</Text>

      {loading ? (
        <ActivityIndicator size="large" color="green" style={{ marginTop: 30 }} />
      ) : users.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20, color: "#777" }}>
          No hay usuarios registrados aún.
        </Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.matricula}
          renderItem={({ item }) => (
            <View style={styles.userCard}>
              <Image source={require("../assets/user-bg.png")} style={styles.avatar} />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.nombreCompleto}</Text>
                <Text>{item.telefono}</Text>
                <Text>{item.correo}</Text>
                <Text style={styles.userId}>Matrícula: {item.matricula}</Text>
              </View>
              <TouchableOpacity onPress={() => handleEdit(item.matricula)}>
                <MaterialIcons name="edit" size={24} color="green" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.matricula)}>
                <MaterialIcons name="cancel" size={23} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {editingUser && (
        <Modal animationType="slide" transparent={true} visible={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Usuario</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={editingUser.nombreCompleto}
                onChangeText={(text) =>
                  setEditingUser({ ...editingUser, nombreCompleto: text })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Teléfono"
                keyboardType="phone-pad"
                value={editingUser.telefono}
                onChangeText={(text) =>
                  setEditingUser({ ...editingUser, telefono: text })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Correo"
                value={editingUser.correo}
                onChangeText={(text) =>
                  setEditingUser({ ...editingUser, correo: text })
                }
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.saveButton} onPress={saveEdit}>
                  <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setEditingUser(null)}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      <BottomNavigationAdmin />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 30 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
    justifyContent: "center",
  },
  icon: { marginRight: 10 },
  title: { fontSize: 24, fontWeight: "bold", color: "green" },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  userInfo: { flex: 1 },
  userName: { fontWeight: "bold" },
  userId: { fontWeight: "bold", color: "blue" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  saveButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold" },
});
