import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Navbar from './Navbar';

export default function About(props) {
  return (
    <View style={styles.container}>

      <Navbar {...props} />

      <Text style={styles.title}>About SwapLearn</Text>
      <Text style={styles.text}>
        This is About Page
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  text: {
    marginTop: 10,
  },
});