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
import BottomNavigation from "../componentes/BottomNavBar";
import { cerrarSesion, RootStackParamList } from "../componentes/authUtils";

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
    const max = config.distanciaMax;
    const min = config.distanciaMin;
    const porcentaje = ((max - distancia) / (max - min)) * 100;
    return Math.max(0, Math.min(100, Math.round(porcentaje)));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={toggleMenu} style={styles.menuToggle}>
          <Image source={require("../assets/menu.jpg")} style={styles.menuIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Contenedores</Text>
        <TouchableOpacity onPress={fetchContenedores}>
          <Image source={require("../assets/recargar.jpg")} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
      </View>

      {/* Menu */}
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

      {/* Contenido */}
      <ScrollView
        contentContainerStyle={{ padding: 10 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {
            setRefreshing(true);
            fetchContenedores();
          }} />
        }
      >
        {loading ? (
          <ActivityIndicator size="large" color="green" style={{ marginTop: 50 }} />
        ) : (
          <View style={styles.grid}>
            {contenedores.map((c: any, idx) => {
              const porcentaje = c.sensor
                ? calcularPorcentaje(c.sensor.distancia, c.configSensor)
                : 0;

              return (
                <View key={idx} style={styles.card}>
                  <Image
                    source={
                      c.tipoContenedor.includes("Vidrio") ? require("../assets/vidrio.png") :
                      c.tipoContenedor.includes("Plástico") ? require("../assets/plásticos.png") :
                      c.tipoContenedor.includes("Papel") ? require("../assets/papel.png") :
                      require("../assets/organico.png")
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
                    <Text style={{ fontStyle: "italic", color: "#999" }}>Sin datos</Text>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
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
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
  },
  menuToggle: {
    padding: 10,
    borderRadius: 5,
  },
  menuIcon: {
    width: 30,
    height: 30,
  },
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 100,
    resizeMode: "contain",
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "green",
    marginBottom: 5,
  },
  zone: { fontSize: 13, color: "#333" },
  type: { fontSize: 12, color: "#555" },
  label: { fontSize: 12, color: "#666", marginTop: 4 },
  progressBar: {
    width: "100%",
    height: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    marginTop: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 5,
  },
  percent: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#444",
    marginTop: 4,
  },
  temp: { fontSize: 13, color: "#EF6C00", marginTop: 4 },
  alert: { color: "red", fontWeight: "bold", fontSize: 13, marginTop: 4 },
});

export default ContenedoresScreen;
