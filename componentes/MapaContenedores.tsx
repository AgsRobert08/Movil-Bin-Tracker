import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";

const MapaContenedores = () => {
  const [contenedores, setContenedores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await axios.get("https://api-rest-bin-tracker.onrender.com/api/contenedor");
        setContenedores(res.data);
      } catch (err) {
        console.error("Error al obtener contenedores:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const posicionInicial = {
    latitude: 19.4326,
    longitude: -99.1332,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📍 Mapa de Contenedores</Text>

      {loading ? (
        <ActivityIndicator size="large" color="green" />
      ) : (
        <MapView style={styles.map} initialRegion={posicionInicial}>
          {contenedores.map((c: any, index: number) => (
            <Marker
              key={index}
              coordinate={{
                latitude: c.ubicacion?.lat ?? 0,
                longitude: c.ubicacion?.lng ?? 0,
              }}
              title={`Contenedor ${c.matricula}`}
              description={`${c.nombreZona} - ${c.tipoContenedor}`}
              pinColor="green"
            />
          ))}
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
    color: "green",
  },
  map: {
    flex: 1,
    width: "100%",
  },
});

export default MapaContenedores;
