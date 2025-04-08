import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import BottomNavigation from "../componentes/BottomNavBar";

import { LineChart } from "react-native-chart-kit";
import MapView, { Marker } from "react-native-maps";

const DetalleContenedor = ({ route }: { route: any }) => {
  const { tipo, lleno, temperatura, ubicacion } = route.params;

  // Coordenadas de ubicación real
  const initialRegion = {
    latitude: ubicacion.latitude || 19.432608, // Ejemplo: CDMX si no se proporciona
    longitude: ubicacion.longitude || -99.133209,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  // Estado para las notificaciones
  const [notificaciones, setNotificaciones] = useState<string[]>([]);

  // Simular llegada de notificaciones en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      // Simular una nueva notificación
      const nuevaNotificacion = `Nueva alerta: Contenedor ${tipo} al ${Math.floor(
        Math.random() * 100
      )}% lleno.`;
      setNotificaciones((prev) => [...prev, nuevaNotificacion]); // Agregar notificación al estado
    }, 20000); // Cada 20 segundos

    return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonte
  }, [tipo]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { flexGrow: 1, paddingBottom: 100 }]}>
        {/* Encabezado */}
        <Text style={styles.header}>Contenedores</Text>
        <Text style={styles.subheader}>Detalles del contenedor: {tipo}</Text>

        {/* Sección: Tipo de contenedor */}
        <View style={styles.section}>
          <Image source={require("../assets/carrusel1.jpg")} style={styles.icon} />
          <Text style={styles.sectionText}>
            <Text style={styles.bold}>Tipo de contenedor: </Text>
            {tipo}
          </Text>
        </View>

        {/* Sección: Ubicación exacta */}
        <View style={styles.section}>
          <Text style={styles.sectionText}>
            <Text style={styles.bold}>Ubicación exacta: </Text>
          </Text>
          <MapView style={styles.map} initialRegion={initialRegion}>
            <Marker
              coordinate={{
                latitude: ubicacion.latitude || 19.432608,
                longitude: ubicacion.longitude || -99.133209,
              }}
              title="Ubicación del Contenedor"
              description={`Contenedor tipo: ${tipo}`}
            />
          </MapView>
        </View>

        {/* Sección: Capacidad actual */}
        <View style={styles.section}>
          <Image source={require("../assets/carrusel4.jpg")} style={styles.icon} />
          <Text style={styles.sectionText}>
            <Text style={styles.bold}>Capacidad actual: </Text>
            {lleno}
          </Text>
        </View>

        {/* Notificaciones en tiempo real */}
        <View style={styles.notificationsContainer}>
          <Text style={styles.notificationsTitle}>🔔 Notificaciones en Tiempo Real</Text>
          {notificaciones.map((notificacion, index) => (
            <View key={index} style={styles.notificationBox}>
              <Text style={styles.notificationText}>{notificacion}</Text>
            </View>
          ))}
        </View>

        {/* Gráficas en tiempo real */}
        <View style={styles.graphContainer}>
          <Text style={styles.graphTitle}>📊 Días de Mayor Generación de Residuos</Text>
          <LineChart
            data={{
              labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
              datasets: [
                {
                  data: [2, 3, 4, 2, 6, 5, 4], // Datos ficticios
                },
              ],
            }}
            width={300}
            height={220}
            yAxisSuffix=" residuos"
            chartConfig={{
              backgroundColor: "#4CAF50",
              backgroundGradientFrom: "#4CAF50",
              backgroundGradientTo: "#80C850",
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            bezier
          />
        </View>
      </ScrollView>

      {/* Barra de navegación inferior */}
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "orange",
  },
  subheader: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "pink",
  },
  section: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 10,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  sectionText: {
    fontSize: 16,
    flexWrap: "wrap",
  },
  bold: {
    fontWeight: "bold",
    color: "black",
  },
  map: {
    width: "100%",
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
  notificationsContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#FFF5E1",
    borderRadius: 10,
    marginBottom: 20,
  },
  notificationsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FF9800",
    textAlign: "center",
  },
  notificationBox: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#FFE4B5",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#FFC107",
  },
  notificationText: {
    fontSize: 14,
    color: "#333",
  },
  graphContainer: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default DetalleContenedor;