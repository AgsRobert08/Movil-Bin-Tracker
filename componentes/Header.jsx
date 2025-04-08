import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <Image 
        source={require("../assets/lo.png")} 
        style={styles.logo} 
        resizeMode="contain"
      />
      <Text style={styles.title}>Bin Tracker</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    marginBottom: 10
  },
  logo: {
    width: 100,
    height: 100,
    marginRight: 15,
  },
  title: {
    fontSize: 45,
    fontWeight: "bold",
    color: "black",
    letterSpacing: 0.5
  }
});

export default Header;