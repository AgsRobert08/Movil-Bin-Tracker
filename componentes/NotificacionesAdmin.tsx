import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomNavigationUser from "./BotonNavUser";
import axios from "axios";
import * as Notifications from "expo-notifications";
import BottomNavigationAdmin from "./BotonNavAdmin";

const NotificacionesScreenAd = () => {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const notificadasRef = useRef<string[]>([]);

  const obtenerAlertas = async () => {
    try {
      const res = await axios.get("https://api-rest-bin-tracker.onrender.com/api/contenedor");
      const promesas = res.data.map(async (contenedor: any) => {
        const matricula = contenedor.matricula;
        try {
          const sensorRes = await axios.get(
            `https://api-rest-bin-tracker.onrender.com/api/sensor/${matricula}/ultimo`
          );
          const registro = sensorRes.data;

          if (registro?.alertas?.length > 0) {
            return {
              matricula,
              nombreZona: contenedor.nombreZona,
              tipoContenedor: contenedor.tipoContenedor,
              alertas: registro.alertas,
              fecha: registro.fecha,
            };
          }
        } catch (error) {
          console.log("Error al obtener sensor de", matricula);
        }
        return null;
      });

      const resultados = await Promise.all(promesas);
      const alertasFiltradas = resultados.filter(Boolean); // eliminar nulls

      setAlertas(alertasFiltradas);

      // Enviar notificaciones después del render
      alertasFiltradas.forEach((a: any) => {
        if (!notificadasRef.current.includes(a.matricula)) {
          Notifications.scheduleNotificationAsync({
            content: {
              title: `⚠️ Contenedor ${a.matricula}`,
              body: a.alertas.join(", "),
              sound: true,
            },
            trigger: null,
          });
          notificadasRef.current.push(a.matricula);
        }
      });
    } catch (error) {
      console.error("Error al cargar alertas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerAlertas();
    const interval = setInterval(obtenerAlertas, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.header}>🔔 Notificaciones</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 40 }} />
        ) : alertas.length === 0 ? (
          <Text style={styles.noAlerts}>Sin alertas recientes</Text>
        ) : (
          alertas.map((a, index) => (
            <View key={index} style={styles.card}>
              <Ionicons name="alert-circle" size={28} color="#F44336" style={styles.icon} />
              <View style={styles.textContainer}>
                <Text style={styles.title}>Contenedor {a.matricula}</Text>
                <Text style={styles.message}>Zona: {a.nombreZona}</Text>
                <Text style={styles.message}>Tipo: {a.tipoContenedor}</Text>
                <Text style={styles.message}>⚠️ {a.alertas.join(", ")}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <BottomNavigationAdmin />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBlock:20,
    flex: 1,
    padding: 20,
    backgroundColor: "#F9F9F9",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#388E3C",
    marginBottom: 20,
    textAlign: "center",
  },
  noAlerts: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 30,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#2E7D32",
  },
  message: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
});

export default NotificacionesScreenAd;
