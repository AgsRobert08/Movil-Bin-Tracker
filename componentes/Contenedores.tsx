import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import axios from "axios";
import { cerrarSesion, RootStackParamList } from "../componentes/authUtils";
import { FontAwesome } from "@expo/vector-icons";


import BottomNavigationAdmin from "./BotonNavAdmin";

type NavigationProp = StackNavigationProp<RootStackParamList>;

const ContenedoresScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [menuVisible, setMenuVisible] = useState(false);
  const [contenedores, setContenedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const toggleMenu = () => setMenuVisible(!menuVisible);

  const handleMenuPress = (option: string) => {
    setMenuVisible(false);
    switch (option) {
      case "GestionContenedores":
        navigation.navigate("GestionContenedores");
        break;
      case "GestionUsuarios":
        navigation.navigate("GestionUsuarios");
        break;
      case "CerrarSesion":
        cerrarSesion(navigation);
        break;
    }
  };

  const fetchContenedores = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://api-rest-bin-tracker.onrender.com/api/contenedor");
      const datos = await Promise.all(
        res.data.map(async (contenedor: any) => {
          try {
            const sensorRes = await axios.get(
              `https://api-rest-bin-tracker.onrender.com/api/sensor/${contenedor.matricula}/ultimo`
            );
            return { ...contenedor, sensor: sensorRes.data };
          } catch {
            return { ...contenedor, sensor: null };
          }
        })
      );
      setContenedores(datos);
    } catch (err) {
      console.error("Error al obtener contenedores:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchContenedores();
    const interval = setInterval(fetchContenedores, 30000);
    return () => clearInterval(interval);
  }, []);

  const calcularPorcentaje = (distancia: number, config: any) => {
    const max = config?.distanciaMax || 40;
    const min = config?.distanciaMin || 10;
    const porcentaje = ((max - distancia) / (max - min)) * 100;
    return Math.max(0, Math.min(100, Math.round(porcentaje)));
  };

  const resumen = contenedores.reduce(
    (acc, c) => {
      const p = c.sensor ? calcularPorcentaje(c.sensor.distancia, c.configSensor) : 0;
      if (p >= 80) acc.llenos += 1;
      if (c.sensor?.alertas?.length > 0) acc.alertas += 1;
      return acc;
    },
    { total: contenedores.length, llenos: 0, alertas: 0 }
  );

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={toggleMenu} style={styles.menuToggle}>
          <Image source={require("../assets/menu.jpg")} style={styles.menuIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Bienvenido a tu cuenta Administrador</Text>
        <TouchableOpacity onPress={fetchContenedores}>
          <Image source={require("../assets/recargar.jpg")} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
      </View>

      {/* Menu lateral */}
      {menuVisible && (
        <View style={styles.menuContent}>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress("GestionContenedores")}>
            <Image source={require("../assets/gestionbasura.png")} style={styles.menuItemIcon} />
            <Text style={styles.menuText}>Gestión de Contenedores</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress("GestionUsuarios")}>
            <Image source={require("../assets/gestionusuarios.png")} style={styles.menuItemIcon} />
            <Text style={styles.menuText}>Gestión de Usuarios</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuItem, styles.logoutItem]}
            onPress={() => handleMenuPress("CerrarSesion")}
          >
            <Image source={require("../assets/cerrarsesion.png")} style={styles.menuItemIcon} />
            <Text style={[styles.menuText, { color: "#d32f2f" }]}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Contenido principal */}
      <ScrollView
        contentContainerStyle={{ padding: 10, paddingBottom: 100, flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchContenedores} />
        }
      >
        {loading ? (
          <ActivityIndicator size="large" color="green" style={{ marginTop: 50 }} />
        ) : (
          <>
            {/* Resumen */}
            <View style={styles.resumenCard}>
              <Text style={styles.resumenTitle}>📊 Resumen General</Text>
              <Text style={styles.resumenText}>Total: {resumen.total}</Text>
              <Text style={styles.resumenText}>Llenos: {resumen.llenos}</Text>
              <Text style={styles.resumenText}>Con alertas: {resumen.alertas}</Text>
            </View>

            {/* Tarjetas */}
            <View style={styles.grid}>
              {contenedores.map((c: any, idx) => {
                const porcentaje = c.sensor
                  ? calcularPorcentaje(c.sensor.distancia, c.configSensor)
                  : 0;

                return (
                  <View key={idx} style={styles.card}>
                    <Image
                      source={
                        c.tipoContenedor.includes("Organico") ? require("../assets/bote-verde.png") :
                        c.tipoContenedor.includes("Inorganico") ? require("../assets/bote-rojo.png") :
                        c.tipoContenedor.includes("Papel") ? require("../assets/bote-amarillo.png") :
                        require("../assets/bote-azul.png")
                      }
                      style={styles.image}
                    />
                    <Text style={styles.cardTitle}>{c.matricula}</Text>
                    <Text style={styles.zone}>{c.nombreZona}</Text>
                    <Text style={styles.type}>{c.tipoContenedor}</Text>

                    {c.sensor ? (
                      <>
                        <Text style={styles.label}>Llenado:</Text>
                        <View style={styles.progressBar}>
                          <View
                            style={[
                              styles.progressFill,
                              {
                                width: `${porcentaje}%`,
                                backgroundColor: porcentaje > 80 ? "#d32f2f" : "#66bb6a",
                              },
                            ]}
                          />
                        </View>
                        <Text style={styles.percent}>{porcentaje}%</Text>
                        <Text style={styles.temp}>Temperatura: {c.sensor.temperatura} °C</Text>
                        {c.sensor.alertas?.length > 0 && (
                          <Text style={styles.alert}>⚠️ {c.sensor.alertas.join(", ")}</Text>
                        )}
                      </>
                    ) : (
                      <Text style={{ fontStyle: "italic", color: "#999", textAlign: "center" }}>
                        Sin datos del sensor
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>

     <BottomNavigationAdmin />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "green",
  },
  menuToggle: { padding: 10, borderRadius: 5 },
  menuIcon: { width: 30, height: 30 },
  menuContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginHorizontal: 10,
    marginBottom: 10,
    paddingVertical: 5,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  logoutItem: { borderBottomWidth: 0 },
  menuItemIcon: { width: 25, height: 25, marginRight: 10 },
  menuText: { fontSize: 16, color: "#333" },
  resumenCard: {
    backgroundColor: "#F1F8E9",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  resumenTitle: { fontSize: 20, fontWeight: "bold", color: "#2E7D32", marginBottom: 10 },
  resumenText: { fontSize: 16, color: "#388E3C", marginVertical: 2 },
  grid: { flexDirection: "column", alignItems: "center" },
  card: {
    width: "90%",
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 140,
    resizeMode: "contain",
    marginBottom: 10,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 22,
    color: "#388E3C",
    textAlign: "center",
  },
  zone: { fontSize: 15, color: "#333", textAlign: "center" },
  type: { fontSize: 14, color: "#555", textAlign: "center", marginBottom: 6 },
  label: { fontSize: 12, color: "#666", marginTop: 4 },
  progressBar: {
    width: "100%",
    height: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    marginTop: 6,
  },
  progressFill: {
    height: "100%",
    borderRadius: 6,
  },
  percent: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#444",
    marginTop: 4,
    textAlign: "center",
  },
  temp: {
    fontSize: 15,
    fontWeight: "600",
    color: "#EF6C00",
    textAlign: "center",
  },
  alert: {
    marginTop: 8,
    color: "#C62828",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#4CAF50", // Fondo verde
    height: 70,
    borderTopWidth: 1,
    borderTopColor: "#388E3C",
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingBottom: 10,
  },
  navButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    fontSize: 12,
    color: "white", // Texto blanco
    marginTop: 4,
  },
});

export default ContenedoresScreen;
