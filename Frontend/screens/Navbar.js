import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Navbar({
  user,
  isLoggedIn,
  goToHome,
  goToAbout,
  goToDiscover,
  goToMatch,
  goToMessages,
  goToProfile,
  goToLogin,
  goToRegister,
}) {

  const logged = isLoggedIn || !!user;

  return (
    <View style={styles.navbar}>

      <Text style={styles.logo} onPress={goToHome}>
        SwapLearn
      </Text>

      <View style={styles.menu}>
        <Text style={styles.link} onPress={goToHome}>Home</Text>
        <Text style={styles.link} onPress={goToAbout}>About</Text>
        <Text style={styles.link} onPress={goToDiscover}>Discover</Text>
        <Text style={styles.link} onPress={goToMatch}>Match</Text>

        {logged && (
          <Text style={styles.link} onPress={goToMessages}>
            Messages
          </Text>
        )}
      </View>

      <View style={styles.auth}>
        {!logged ? (
          <>
            <Text style={styles.link} onPress={goToLogin}>Login</Text>
            <Text style={styles.signup} onPress={goToRegister}>Sign Up</Text>
          </>
        ) : (
          <Text style={styles.profile} onPress={goToProfile}>
            Profile
          </Text>
        )}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#151a3c',
    padding: 15,
  },
  logo: { color: '#4CAF50', fontWeight: 'bold', fontSize: 18 },
  menu: { flexDirection: 'row' },
  auth: { flexDirection: 'row' },
  link: { color: '#fff', marginHorizontal: 8 },
  signup: { color: '#4CAF50', marginLeft: 10 },
  profile: { color: '#4CAF50', fontWeight: 'bold' },
});