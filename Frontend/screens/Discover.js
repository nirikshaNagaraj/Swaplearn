import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Navbar from './Navbar';
import { API } from '../../api';

export default function Discover(props) {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    console.log("DISCOVER OPENED ✅"); // 🔥 debug
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API}/users/`);
      const data = await res.json();

      console.log("USERS:", data);
      setUsers(data);

    } catch (err) {
      console.log("ERROR:", err);

      // 🔥 fallback test data (prevents blank screen)
      setUsers([
        {
          username: "testuser",
          name: "Test User",
          teachSkills: [{ skill: "React" }],
          learnSkills: [{ skill: "Python" }]
        }
      ]);
    }
  };

  return (
    <ScrollView style={styles.container}>

      {/* ✅ FIXED NAVBAR */}
      <Navbar
        isLoggedIn={props.isLoggedIn}
        goToHome={props.goToHome}
        goToAbout={props.goToAbout}
        goToDiscover={props.goToDiscover}
        goToMatch={props.goToMatch}
        goToMessages={props.goToMessages}
        goToProfile={props.goToProfile}
        goToLogin={props.goToLogin}
        goToRegister={props.goToRegister}
      />

      <Text style={styles.title}>Discover People</Text>

      {/* ✅ SAFE RENDER */}
      {users?.length === 0 ? (
        <Text style={{ textAlign: 'center' }}>No users found</Text>
      ) : (
        <View style={styles.grid}>
          {users.map((user, index) => (
            <View key={index} style={styles.card}>

              <Text style={styles.username}>
                {user.name || user.username}
              </Text>

              <Text style={styles.skill}>
                Teaches: {
                  user.teachSkills?.length
                    ? user.teachSkills.map(s => s.skill).join(', ')
                    : 'None'
                }
              </Text>

              <Text style={styles.skill}>
                Learns: {
                  user.learnSkills?.length
                    ? user.learnSkills.map(s => s.skill).join(', ')
                    : 'None'
                }
              </Text>

              <TouchableOpacity
                style={styles.connectBtn}
                onPress={() => {
                  if (!props.isLoggedIn) props.goToLogin();
                  else alert('Connected!');
                }}
              >
                <Text style={styles.connectText}>Connect</Text>
              </TouchableOpacity>

            </View>
          ))}
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f0',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    margin: 20,
    color: '#151a3c',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },

  card: {
    width: '30%',
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    elevation: 3,
  },

  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#151a3c',
    marginBottom: 8,
  },

  skill: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },

  connectBtn: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },

  connectText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});