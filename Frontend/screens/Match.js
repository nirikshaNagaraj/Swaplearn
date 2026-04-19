import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import Navbar from './Navbar';
import { API } from '../../api';

export default function Match({
  user,
  isLoggedIn,
  goToLogin,
  goToHome,
  goToDiscover,
  goToProfile,
  goToAbout,
  goToMessages,
}) {

  const [matches, setMatches] = useState([]);

  // ==============================
  // FETCH MATCHES
  // ==============================
  useEffect(() => {
    if (!user?.username) return;

    fetch(`${API}/match/?username=${user.username}`)
      .then(res => res.json())
      .then(data => {
        console.log("MATCH DATA:", data);
        setMatches(data);
      })
      .catch(err => console.log("Match error:", err));
  }, [user]);

  // ==============================
  // CONNECT BUTTON
  // ==============================
  const sendRequest = async (m) => {

    if (!isLoggedIn || !user) {
      goToLogin?.();
      return;
    }

    try {
      const res = await fetch(`${API}/send-request/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: user.username,
          receiver: m.username,
          skill: m.skill || "",
          language: m.language || "",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Request Sent 🚀");
      } else {
        alert(data.error || "Failed to send request");
      }

    } catch (err) {
      console.log(err);
      alert("Server error ❌");
    }
  };

  // ==============================
  // UI
  // ==============================
  return (
    <ScrollView style={styles.container}>

      {/* NAVBAR FIXED */}
      <Navbar
        isLoggedIn={isLoggedIn}
        goToLogin={goToLogin}
        goToHome={goToHome}
        goToDiscover={goToDiscover}
        goToProfile={goToProfile}
        goToAbout={goToAbout}
        goToMessages={goToMessages}
      />

      <Text style={styles.title}>Best Matches</Text>

      {/* NO USER */}
      {!user ? (
        <Text style={styles.noMatch}>
          Login to see matches
        </Text>
      ) : matches.length === 0 ? (
        <Text style={styles.noMatch}>
          No matches found
        </Text>
      ) : (
        <View style={styles.grid}>
          {matches.map((m, i) => (
            <View key={i} style={styles.card}>

              <Text style={styles.username}>
                {m.name || m.username}
              </Text>

              <Text style={styles.tag}>
                Match Score: {m.matchScore || 0}
              </Text>

              <Text style={styles.tagAlt}>
                Click connect to send request
              </Text>

              <TouchableOpacity
                style={styles.connectBtn}
                onPress={() => sendRequest(m)}
              >
                <Text style={styles.connectText}>
                  Connect
                </Text>
              </TouchableOpacity>

            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

// ==============================
// STYLES
// ==============================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f0',
  },

  title: {
    fontSize: 28,
    textAlign: 'center',
    margin: 20,
    fontWeight: 'bold',
    color: '#151a3c',
  },

  noMatch: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
  },

  card: {
    backgroundColor: '#fff',
    padding: 18,
    margin: 10,
    borderRadius: 12,
    width: 180,
    elevation: 4,
  },

  username: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },

  tag: {
    marginTop: 5,
    color: '#333',
  },

  tagAlt: {
    marginBottom: 10,
    color: '#777',
    fontSize: 12,
  },

  connectBtn: {
    backgroundColor: '#151a3c',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },

  connectText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});