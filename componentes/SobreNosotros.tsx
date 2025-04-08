import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import BottomNavigation from './BottomNavBar'; // Asegúrate de que la ruta sea correcta
const teamMembers = [
  { name: 'Robert Agustín Zavaleta', image: require('../assets/RobertDev.jpg') },
  { name: 'Jose Maria Cano Cruz', image: require('../assets/ChemaDev.jpg') },
  { name: 'Liliana Leticia Pérez del Ángel', image: require('../assets/LiliDev.jpg') },
  { name: 'Rita Yamelit Gomez Gutierrez', image: require('../assets/YamelitDev.jpg') }
];


export default function App() {
  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          <FontAwesome name="users" size={24} color="green" style={styles.icon} />
          <Text style={styles.headerText}>Sobre Nosotros</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Nuestro Objetivo</Text>
          <Text style={styles.description}>
            Crear un sistema integrando tecnología IoT y almacenamiento en la nube para monitorear
            en tiempo real la ubicación, temperatura y nivel de llenado de los contenedores de
            basura permitiendo asi a los administradores optimizar la recolección de residuos y
            mejorar la eficiencia operativa, contribuyendo a la sostenibilidad ambiental.
          </Text>
        </View>

        <Text style={styles.sectionTitleLeft}>Equipo de trabajo</Text>
        <View style={styles.teamContainer}>
          {teamMembers.map((member, index) => (
            <View key={index} style={styles.member}>
              <View style={styles.avatarContainer}>
                <Image source={member.image} style={styles.avatar} />
              </View>
              <Text style={styles.memberName}>{member.name}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitleLeft}>Producto</Text>
        <Image source={require('../assets/NuestroProducto.png')} style={styles.productImage} />

      </ScrollView>
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: { flex: 1, backgroundColor: '#fff', padding: 15 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  icon: { marginRight: 10 },
  headerText: { fontSize: 22, fontWeight: 'bold', color: 'green' },
  card: { backgroundColor: '#f5f5f5', padding: 15, borderRadius: 10, marginBottom: 15 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  description: { fontSize: 14, color: '#333' },
  sectionTitleLeft: { fontSize: 18, fontWeight: 'bold', marginVertical: 10, textAlign: 'left' },
  teamContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 15 },
  member: { alignItems: 'center', width: '45%', marginBottom: 10 },
  avatarContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center', marginBottom: 5 },
  avatar: { width: 70, height: 70, borderRadius: 35 },
  memberName: { fontSize: 12, textAlign: 'center', fontWeight: 'bold' },
  productImage: { width: '100%', height: 200, borderRadius: 10, marginBottom:10 }
});