import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Header from "./Header";
import BottomNavigation from "./BottomNavBar"; // o ajusta la ruta según tu estructura

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Contacto: undefined;
  SobreNosotros: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;


const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Imagen a todo ancho sin espacios */}
        <Image 
          source={require("../assets/baground-Main (2).png")} 
          style={styles.fullWidthImage} 
          resizeMode="cover"
        />

        {/* Sección de características */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nuestras Características</Text>
          
          <View style={styles.featuresContainer}>
            {/* Tarjeta 1 */}
            <View style={styles.featureCard}>
              <View style={styles.cardContent}>
                <Text style={styles.featureTitle}>Monitoreo en Tiempo Real</Text>
                <Text style={styles.featureText}>
                  Visualiza el estado de los contenedores desde cualquier lugar y en cualquier momento
                </Text>
              </View>
            </View>

            {/* Tarjeta 2 */}
            <View style={styles.featureCard}>
              <View style={styles.cardContent}>
                <Text style={styles.featureTitle}>Alertas Inteligentes</Text>
                <Text style={styles.featureText}>
                  Recibe notificaciones instantáneas cuando los contenedores alcancen su capacidad
                </Text>
              </View>
            </View>

            {/* Tarjeta 3 */}
            <View style={styles.featureCard}>
              <View style={styles.cardContent}>
                <Text style={styles.featureTitle}>Histórico de Datos</Text>
                <Text style={styles.featureText}>
                  Accede a reportes detallados y análisis de patrones de uso mediante nuestra plataforma web
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Llamado a la acción */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>¡Forma parte del cambio!</Text>
          
          <View style={styles.messageContainer}>
            <Text style={styles.ctaText}>
              ¿Eres parte de una organización colaboradora?
            </Text>
            <Text style={styles.ctaSubtext}>
              Ingresa con tus credenciales para acceder al sistema
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.primaryButtonText}>Ingresar a la plataforma</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.messageContainer}>
            <Text style={styles.ctaText}>
              ¿Tu organización quiere unirse a nuestra red?
            </Text>
            <Text style={styles.ctaSubtext}>
              Contáctanos para establecer una colaboración
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("Contacto")}

          >
            <Text style={styles.secondaryButtonText}>Contactar al equipo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    paddingBottom: 40,
  },
  fullWidthImage: {
    width: "100%",
    height: 250,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
    color: "#2E7D32",
  },
  featuresContainer: {
    gap: 16,
  },
  featureCard: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  cardContent: {
    padding: 20,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2E7D32",
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: "#616161",
    lineHeight: 20,
  },
  ctaSection: {
    backgroundColor: "#F5F9F5",
    padding: 30,
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8F5E9",
  },
  messageContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1B5E20",
    marginBottom: 25,
    textAlign: "center",
  },
  ctaText: {
    fontSize: 16,
    color: "#2E7D32",
    textAlign: "center",
    fontWeight: "500",
    marginBottom: 4,
  },
  ctaSubtext: {
    fontSize: 14,
    color: "#616161",
    textAlign: "center",
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: "#2E7D32",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: "100%",
    maxWidth: 280,
    marginBottom: 20,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  secondaryButton: {
    backgroundColor: "white",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: "100%",
    maxWidth: 280,
    borderWidth: 1,
    borderColor: "#2E7D32",
  },
  secondaryButtonText: {
    color: "#2E7D32",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    width: "100%",
    maxWidth: 200,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#BDBDBD",
  },
  dividerText: {
    width: 30,
    textAlign: "center",
    color: "#757575",
    fontSize: 12,
  },
});

export default HomeScreen;