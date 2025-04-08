import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Notificaciones locales
import * as Notifications from "expo-notifications";

// Pantallas
import HomeScreen from "./componentes/PaginaPrincipal";
import LoginScreen from "./componentes/Login";
import contenedoresData from "./componentes/Contenedores";
import usersData from "./componentes/GestionUsuarios";
import ContactItem from "./componentes/Contacto";
import teamMembers from "./componentes/SobreNosotros";
import containers from "./componentes/GestionContenedores";
import ContenedoresUsuario from './componentes/ContenedoresUser';
import NotificacionesScreen from "./componentes/Notificaciones";
import NotificacionesScreenAd from "./componentes/NotificacionesAdmin";
import SplashScreen from "./componentes/SplashScreen";


// Configura comportamiento de notificaciones en primer plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Stack = createStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<"Home" | "Contenedores">("Home");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("usuario");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          if (user.rol === "admin" || user.rol === "superadmin") {
            setInitialRoute("Contenedores");
          }
        }
      } catch (error) {
        console.log("Error al verificar sesión:", error);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();

    // Solicitar permisos de notificaciones al iniciar la app
    Notifications.requestPermissionsAsync().then((status) => {
      if (status.granted) {
        console.log("🔔 Permiso de notificaciones otorgado");
      } else {
        console.log("❌ Permiso de notificaciones DENEGADO");
      }
    });
  }, []);

  if (loading) return <SplashScreen />; // Puedes mostrar un splash o loader aquí

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false}} />
        <Stack.Screen name="Contenedores" component={contenedoresData} />
        <Stack.Screen name="GestionUsuarios" component={usersData}  options={{headerShown:false}}/>
        <Stack.Screen name="SobreNosotros" component={teamMembers} />
        <Stack.Screen name="Contacto" component={ContactItem} />
        <Stack.Screen name="GestionContenedores" component={containers}  />
        <Stack.Screen name="ContenedoresUser" component={ContenedoresUsuario} />
        <Stack.Screen name="Notificaciones" component={NotificacionesScreen} options={{headerShown:false}}/>
        <Stack.Screen name="NotificacionesAdmin" component={NotificacionesScreenAd} options={{headerShown:false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
