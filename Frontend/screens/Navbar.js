import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Navbar({
  user,
  isLoggedIn,
  goToLogin,
  goToRegister,
  goToHome,
  goToAbout,
  goToDiscover,
  goToMatch,
  goToProfile,
  goToMessages,
}) {

  // 🔥 SAFE LOGIN CHECK (FIXED)
  const loggedIn = isLoggedIn || !!user;

  return (
    <View style={styles.navbar}>

      {/* LOGO */}
      <TouchableOpacity onPress={() => goToHome?.()}>
        <Text style={styles.logo}>SwapLearn</Text>
      </TouchableOpacity>

      {/* MENU */}
      <View style={styles.menu}>
        <Text style={styles.link} onPress={() => goToHome?.()}>Home</Text>
        <Text style={styles.link} onPress={() => goToAbout?.()}>About</Text>
        <Text style={styles.link} onPress={() => goToDiscover?.()}>Discover</Text>
        <Text style={styles.link} onPress={() => goToMatch?.()}>Match</Text>

        {loggedIn && (
          <Text style={styles.link} onPress={() => goToMessages?.()}>
            Messages
          </Text>
        )}
      </View>

      {/* AUTH */}
      <View style={styles.auth}>

        {!loggedIn ? (
          <>
            <TouchableOpacity onPress={() => goToLogin?.()}>
              <Text style={styles.login}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => goToRegister?.()}>
              <Text style={styles.signup}>Sign Up</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={() => goToProfile?.()}>
            <Text style={styles.profile}>Profile</Text>
          </TouchableOpacity>
        )}

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#151a3c',
    paddingHorizontal: 30,
    paddingVertical: 15,
  },

  logo: {
    color: '#4CAF50',
    fontSize: 20,
    fontWeight: 'bold',
  },

  menu: {
    flexDirection: 'row',
  },

  link: {
    color: 'white',
    marginHorizontal: 8,
  },

  auth: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },

  login: {
    color: 'white',
  },

  signup: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },

  profile: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});