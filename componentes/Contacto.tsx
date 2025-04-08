import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import BottomNavigation from "../componentes/BottomNavBar";

export default function Contacto() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState({ correo: '', telefono: '', general: '', campos: '', exito: '' });

  const validarFormulario = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telefonoRegex = /^[0-9]{10}$/;
    let valid = true;
    const nuevosErrores = { correo: '', telefono: '', general: '', campos: '', exito: '' };

    if (!emailRegex.test(correo)) {
      nuevosErrores.correo = 'Por favor ingresa un correo válido.';
      valid = false;
    }

    if (!telefonoRegex.test(telefono)) {
      nuevosErrores.telefono = 'El número debe tener 10 dígitos.';
      valid = false;
    }

    setErrores((prev) => ({ ...prev, ...nuevosErrores }));
    return valid;
  };

  const handleEnviar = async () => {
    setErrores({ correo: '', telefono: '', general: '', campos: '', exito: '' });

    if (!nombre || !correo || !telefono || !mensaje) {
      setErrores((prev) => ({ ...prev, campos: 'Todos los campos son obligatorios.' }));
      return;
    }

    if (!validarFormulario()) return;

    try {
      await axios.post('https://api-rest-bin-tracker.onrender.com/api/contacto', {
        nombre,
        correo,
        telefono,
        mensaje
      });

      setErrores({ correo: '', telefono: '', general: '', campos: '', exito: '✅ Datos enviados correctamente.' });
      setNombre('');
      setCorreo('');
      setTelefono('');
      setMensaje('');
    } catch (error) {
      console.error(error);
      setErrores((prev) => ({ ...prev, general: '❌ Hubo un problema al enviar los datos. Inténtalo más tarde.' }));
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Contáctanos</Text>
        <Text style={styles.subtitle}>Déjanos tus datos y nos pondremos en contacto contigo para brindarte acceso al sistema.</Text>

        <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} maxLength={10} />

        <TextInput style={styles.input} placeholder="Correo" value={correo} onChangeText={setCorreo} keyboardType="email-address" />
        {errores.correo !== '' && <Text style={styles.errorText}>{errores.correo}</Text>}

        <TextInput style={styles.input} placeholder="Teléfono" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />
        {errores.telefono !== '' && <Text style={styles.errorText}>{errores.telefono}</Text>}

        <TextInput style={[styles.input, styles.textArea]} placeholder="Mensaje" value={mensaje} onChangeText={setMensaje} multiline numberOfLines={4} />

        {errores.campos !== '' && <Text style={styles.errorText}>{errores.campos}</Text>}
        {errores.general !== '' && <Text style={styles.errorText}>{errores.general}</Text>}
        {errores.exito !== '' && <Text style={styles.successText}>{errores.exito}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleEnviar}>
          <Text style={styles.buttonText}>Enviar Datos</Text>
        </TouchableOpacity>

        {/* Footer institucional */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Rastreador de contenedores</Text>
          <Text style={styles.footerDesc}>Sistema inteligente de monitoreo de residuos mediante IoT y análisis de datos.</Text>

          <View style={styles.contactInfo}>
            {/**PONER LIMITE DE LETRAS */}
            <FontAwesome name="envelope" size={20} color="#fff" />
            <Text style={styles.contactText} onPress={() => Linking.openURL('mailto:betoazhueyapa@gmail.com')}> betoazhueyapa@gmail.com</Text>
          </View>

          <View style={styles.contactInfo}>
            <FontAwesome name="whatsapp" size={20} color="#fff" />
            <Text style={styles.contactText} onPress={() => Linking.openURL('https://wa.me/+527717884363')}> +52 771 788 4363</Text>
          </View>

          <View style={styles.socialIcons}>
            <TouchableOpacity onPress={() => Linking.openURL('https://facebook.com')}>
              <FontAwesome name="facebook" size={24} color="#fff" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('https://wa.me/+527717884363')}>
              <FontAwesome name="whatsapp" size={24} color="#fff" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('mailto:betoazhueyapa@gmail.com')}>
              <FontAwesome name="envelope" size={24} color="#fff" style={styles.icon} />
            </TouchableOpacity>
          </View>

          <Text style={styles.footerBottom}>© 2025 Bin Tracker. Todos los derechos reservados.</Text>
          <Text style={styles.footerBottom}>Universidad Tecnológica de la Sierra Hidalguense</Text>
        </View>
      </ScrollView>

      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 20, paddingBottom: 100 },
  title: { fontSize: 24, fontWeight: 'bold', color: 'green', textAlign: 'center' },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 20, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 5 },
  textArea: { height: 100, textAlignVertical: 'top' },
  button: { backgroundColor: 'green', padding: 12, borderRadius: 5, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  errorText: { color: 'red', fontSize: 12, marginBottom: 8 },
  successText: { color: 'green', fontSize: 13, textAlign: 'center', marginBottom: 10 },

  footer: { backgroundColor: '#1B3C1D', padding: 20, marginTop: 30, borderRadius: 10 },
  footerTitle: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  footerDesc: { fontSize: 13, color: '#ccc', marginBottom: 10 },
  contactInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  contactText: { color: '#fff', marginLeft: 10 },
  socialIcons: { flexDirection: 'row', marginTop: 10 },
  icon: { marginRight: 15 },
  footerBottom: { color: '#ccc', fontSize: 11, textAlign: 'center', marginTop: 5 }
});