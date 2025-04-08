import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Pantallas
import HomeScreen from "./componentes/PaginaPrincipal";
import LoginScreen from "./componentes/Login";
import CreateAccountScreen from "./componentes/Registro";
import contenedoresData from "./componentes/Contenedores";
import usersData from "./componentes/GestionUsuarios";
import ContactItem from "./componentes/Contacto";
import DetalleContenedor from "./componentes/DetallesContenedor";
import teamMembers from "./componentes/SobreNosotros";
import containers from "./componentes/GestionContenedores";

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
  }, []);

  if (loading) return null; // O puedes mostrar un splash / loader

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Registro" component={CreateAccountScreen} />
        <Stack.Screen name="Contenedores" component={contenedoresData} />
        <Stack.Screen name="GestionUsuarios" component={usersData} />
        <Stack.Screen name="SobreNosotros" component={teamMembers} />
        <Stack.Screen name="Contacto" component={ContactItem} />
        <Stack.Screen name="DetallesContenedor" component={DetalleContenedor} />
        <Stack.Screen name="GestionContenedores" component={containers} />
      
      </Stack.Navigator>
    </NavigationContainer>
  );
}
