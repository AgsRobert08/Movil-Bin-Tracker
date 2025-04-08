import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
  Login: undefined;
  Contenedores: undefined;
  Home: undefined;
  GestionContenedores: undefined;
  GestionUsuarios: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

export const cerrarSesion = async (navigation: NavigationProp) => {
  await AsyncStorage.removeItem("usuario");
  navigation.reset({
    index: 0,
    routes: [{ name: "Login" }],
  });
};
