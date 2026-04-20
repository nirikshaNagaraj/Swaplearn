import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Navbar from './Navbar';
import { API } from '../../api';

export default function Requests({ user, isLoggedIn, ...props }) {

  const [requests, setRequests] = useState([]);

  const userId = user?.user_id || user?.id;

  const loadRequests = async () => {
    if (!userId) return;

    try {
      const res = await fetch(`${API}/requests/${userId}/`);
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.log("LOAD ERROR:", err);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [userId]);

  const acceptRequest = async (id) => {
    try {
      await fetch(`${API}/accept-request/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_id: id }),
      });

      loadRequests();
    } catch (err) {
      console.log("ACCEPT ERROR:", err);
    }
  };

  const rejectRequest = async (id) => {
    try {
      await fetch(`${API}/reject-request/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_id: id }),
      });

      loadRequests();
    } catch (err) {
      console.log("REJECT ERROR:", err);
    }
  };

  return (
    <View style={{ flex: 1 }}>

      {/* ✅ NAVBAR FIXED */}
      <Navbar
        user={user}
        isLoggedIn={isLoggedIn}
        goToHome={props.goToHome}
        goToAbout={props.goToAbout}
        goToDiscover={props.goToDiscover}
        goToMatch={props.goToMatch}
        goToProfile={props.goToProfile}
        goToMessages={props.goToMessages}
        goToLogin={props.goToLogin}
        goToRegister={props.goToRegister}
      />

      <ScrollView style={styles.container}>

        <Text style={styles.title}>Requests</Text>

        {!userId ? (
          <Text style={styles.msg}>Please login first</Text>
        ) : requests.length === 0 ? (
          <Text style={styles.msg}>No requests</Text>
        ) : (
          requests.map((r) => (
            <View key={r.request_id} style={styles.card}>

              <Text style={styles.name}>{r.sender_name}</Text>
              <Text>Skill: {r.skill}</Text>
              <Text>Status: {r.status}</Text>

              {r.status === "pending" && (
                <View style={styles.row}>

                  <TouchableOpacity
                    style={styles.accept}
                    onPress={() => acceptRequest(r.request_id)}
                  >
                    <Text style={{ color: "#fff" }}>Accept</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.reject}
                    onPress={() => rejectRequest(r.request_id)}
                  >
                    <Text style={{ color: "#fff" }}>Reject</Text>
                  </TouchableOpacity>

                </View>
              )}

            </View>
          ))
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  title: {
    fontSize: 24,
    textAlign: "center",
    margin: 20,
  },

  msg: {
    textAlign: "center",
    marginTop: 20,
  },

  card: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 15,
    borderRadius: 10,
  },

  name: {
    fontWeight: "bold",
    fontSize: 18,
  },

  row: {
    flexDirection: "row",
    marginTop: 10,
  },

  accept: {
    backgroundColor: "green",
    padding: 10,
    marginRight: 10,
    borderRadius: 6,
  },

  reject: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 6,
  },
});