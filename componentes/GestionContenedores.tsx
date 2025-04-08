import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";

export default function GestionContenedores() {
  const [contenedores, setContenedores] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerContenedores = async () => {
      try {
        const res = await axios.get("https://api-rest-bin-tracker.onrender.com/api/contenedor");
        setContenedores(res.data);
      } catch (error) {
        console.error("Error al obtener contenedores:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerContenedores();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Gestión de contenedores</Text>
      </View>

      {/* Lista de contenedores */}
      {cargando ? (
        <ActivityIndicator size="large" color="green" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {contenedores.map((container: any, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>Matrícula: {container.matricula}</Text>
              <Text style={styles.cardText}>
                <Text style={styles.bold}>Zona:</Text> {container.nombreZona}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.bold}>Tipo:</Text> {container.tipoContenedor}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.bold}>Ubicación:</Text>{" "}
                Lat {container.ubicacion.lat}, Lng {container.ubicacion.lng}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.bold}>Distancia Min:</Text> {container.configSensor.distanciaMin} cm
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.bold}>Distancia Max:</Text> {container.configSensor.distanciaMax} cm
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.bold}>Temp. Máx:</Text> {container.configSensor.temperaturaMax} °C
              </Text>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Navegación inferior */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <FontAwesome name="home" size={24} color="green" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <FontAwesome name="product-hunt" size={24} color="green" />
          <Text style={styles.navText}>Producto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <FontAwesome name="phone" size={24} color="green" />
          <Text style={styles.navText}>Contacto</Text>
        </TouchableOpacity>
      </View>
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
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  cardText: { fontSize: 14, color: "#333", marginBottom: 3 },
  bold: { fontWeight: "bold", color: "#000" },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingVertical: 10,
    backgroundColor: "#f9f9f9",
  },
  navButton: { alignItems: "center" },
  navText: { fontSize: 12, color: "green", marginTop: 3 },
});
