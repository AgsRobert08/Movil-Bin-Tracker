import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import BottomNavigationAdmin from "./BotonNavAdmin";

const API_URL = "https://api-rest-bin-tracker.onrender.com/api/contenedor";

export default function GestionContenedores() {
  const [contenedores, setContenedores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editing, setEditing] = useState<any>(null);

  useEffect(() => {
    obtenerContenedores();
  }, []);

  const obtenerContenedores = async () => {
    try {
      setCargando(true);
      const res = await axios.get(API_URL);
      setContenedores(res.data);
    } catch (error) {
      console.error("Error al obtener contenedores:", error);
    } finally {
      setCargando(false);
    }
  };

  const eliminarContenedor = async (matricula: string) => {
    Alert.alert("Confirmar", "¿Estás seguro de eliminar este contenedor?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/${matricula}`);
            obtenerContenedores();
          } catch (error) {
            Alert.alert("Error", "No se pudo eliminar el contenedor.");
          }
        },
      },
    ]);
  };

  const guardarCambios = async () => {
    if (!editing) return;

    try {
      const { matricula, nombreZona, configSensor } = editing;
      await axios.put(`${API_URL}/${matricula}`, {
        nombreZona,
        configSensor,
      });
      setEditing(null);
      obtenerContenedores();
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar la edición.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Gestión de Contenedores</Text>
      </View>
      {cargando ? (
        <ActivityIndicator size="large" color="green" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {contenedores.map((container: any, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>Matrícula: {container.matricula}</Text>
              <Text style={styles.cardText}>Zona: {container.nombreZona}</Text>
              <Text style={styles.cardText}>Tipo: {container.tipoContenedor}</Text>
              <Text style={styles.cardText}>Distancia Min: {container.configSensor?.distanciaMin} cm</Text>
              <Text style={styles.cardText}>Distancia Max: {container.configSensor?.distanciaMax} cm</Text>
              <Text style={styles.cardText}>Temp. Máx: {container.configSensor?.temperaturaMax} °C</Text>

              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <TouchableOpacity
                  onPress={() =>
                    setEditing({
                      ...container,
                      configSensor: {
                        distanciaMin: container.configSensor?.distanciaMin ?? 10,
                        distanciaMax: container.configSensor?.distanciaMax ?? 40,
                        temperaturaMax: container.configSensor?.temperaturaMax ?? 35,
                      },
                    })
                  }
                  style={{ marginRight: 10 }}
                >
                  <MaterialIcons name="edit" size={24} color="green" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => eliminarContenedor(container.matricula)}>
                  <MaterialIcons name="cancel" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {editing !== null && (
        <Modal visible transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Contenedor</Text>

              <TextInput
                style={styles.input}
                placeholder="Zona"
                value={editing.nombreZona}
                onChangeText={(text) => setEditing({ ...editing, nombreZona: text })}
              />

              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Distancia Min"
                value={editing.configSensor.distanciaMin?.toString() ?? ""}
                onChangeText={(text) =>
                  setEditing({
                    ...editing,
                    configSensor: {
                      ...editing.configSensor,
                      distanciaMin: parseFloat(text),
                    },
                  })
                }
              />
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Distancia Max"
                value={editing.configSensor.distanciaMax?.toString() ?? ""}
                onChangeText={(text) =>
                  setEditing({
                    ...editing,
                    configSensor: {
                      ...editing.configSensor,
                      distanciaMax: parseFloat(text),
                    },
                  })
                }
              />
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Temperatura Máx"
                value={editing.configSensor.temperaturaMax?.toString() ?? ""}
                onChangeText={(text) =>
                  setEditing({
                    ...editing,
                    configSensor: {
                      ...editing.configSensor,
                      temperaturaMax: parseFloat(text),
                    },
                  })
                }
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.saveButton} onPress={guardarCambios}>
                  <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setEditing(null)}
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
  container: { flex: 1, backgroundColor: "#fff" },
  header: { backgroundColor: "green", padding: 15 },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  list: { padding: 15 },
  card: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  cardText: { fontSize: 14, color: "#333", marginBottom: 3 },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
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
