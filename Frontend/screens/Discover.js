import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Navbar from './Navbar';
import { API } from '../../api';

export default function Discover(props) {

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [connections, setConnections] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API}/users/`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setUsers([
        {
          username: "testuser",
          name: "Test User",
          credits: 120,
          teachedCount: 5,
          learnedCount: 3,
          teachSkills: [{ skill: "React" }],
          learnSkills: [{ skill: "Python" }]
        }
      ]);
    }
  };

  // ✅ CONNECT / CANCEL (LOGIN PROTECTED)
  const toggleConnect = (user) => {

    if (!props.isLoggedIn) {
      props.goToLogin();
      return;
    }

    const status = connections[user.username];

    if (!status) {
      setConnections(prev => ({
        ...prev,
        [user.username]: 'pending'
      }));
    } else {
      const updated = { ...connections };
      delete updated[user.username];
      setConnections(updated);
    }
  };

  const statusText = (status) => {
    if (status === 'pending') return 'Request Sent ⏳';
    if (status === 'connected') return 'Connected 🤝';
    return '';
  };

  return (
    <ScrollView style={styles.container}>

      <Navbar {...props} />

      <Text style={styles.title}>Discover People</Text>

      <View style={styles.grid}>

        {users.map((user, index) => {

          const status = connections[user.username];

          return (
            <View key={index} style={styles.card}>

              {/* NAME */}
              <Text style={styles.name}>
                {user.name || user.username}
              </Text>

              {/* QUICK STATS */}
              <Text style={styles.smallText}>
                💰 Credits: {user.credits || 0}
              </Text>

              <Text style={styles.smallText}>
                🧑‍🏫 Teached: {user.teachedCount || 0}
              </Text>

              <Text style={styles.smallText}>
                📚 Learned: {user.learnedCount || 0}
              </Text>

              {/* VIEW PROFILE */}
              <TouchableOpacity
                style={styles.viewBtn}
                onPress={() => setSelectedUser(user)}
              >
                <Text style={styles.btnText}>👁 View Profile</Text>
              </TouchableOpacity>

              {/* CONNECT BUTTON */}
              <TouchableOpacity
                style={[
                  props.isLoggedIn ? styles.connectBtn : styles.disabledBtn
                ]}
                onPress={() => toggleConnect(user)}
              >
                <Text style={styles.btnText}>
                  {status ? "❌ Cancel Request" : "🤝 Connect"}
                </Text>
              </TouchableOpacity>

              {status && (
                <Text style={styles.status}>
                  {statusText(status)}
                </Text>
              )}

            </View>
          );
        })}

      </View>

      {/* PROFILE MODAL */}
      <Modal visible={!!selectedUser} animationType="slide">

        <View style={styles.modalContainer}>

          {selectedUser && (
            <View style={styles.modalCard}>

              <Text style={styles.modalName}>
                {selectedUser.name || selectedUser.username}
              </Text>

              {/* STATS */}
              <View style={styles.statsBox}>

                <View style={styles.stat}>
                  <Text style={styles.statNumber}>
                    {selectedUser.credits || 0}
                  </Text>
                  <Text style={styles.statLabel}>Credits</Text>
                </View>

                <View style={styles.stat}>
                  <Text style={styles.statNumber}>
                    {selectedUser.teachedCount || 0}
                  </Text>
                  <Text style={styles.statLabel}>Taught</Text>
                </View>

                <View style={styles.stat}>
                  <Text style={styles.statNumber}>
                    {selectedUser.learnedCount || 0}
                  </Text>
                  <Text style={styles.statLabel}>Learned</Text>
                </View>

              </View>

              {/* SKILLS */}
              <Text style={styles.section}>Skills</Text>

              <Text style={styles.modalText}>
                🧑‍🏫 Teaches: {selectedUser.teachSkills?.map(s => s.skill).join(', ') || 'None'}
              </Text>

              <Text style={styles.modalText}>
                📚 Learns: {selectedUser.learnSkills?.map(s => s.skill).join(', ') || 'None'}
              </Text>

              {/* CONNECT INSIDE MODAL */}
              <TouchableOpacity
                style={[
                  props.isLoggedIn ? styles.modalBtn : styles.disabledBtn
                ]}
                onPress={() => {

                  if (!props.isLoggedIn) {
                    setSelectedUser(null);
                    props.goToLogin();
                    return;
                  }

                  toggleConnect(selectedUser);
                }}
              >
                <Text style={styles.btnText}>
                  {connections[selectedUser.username]
                    ? "❌ Cancel Request"
                    : "🤝 Send Request"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setSelectedUser(null)}>
                <Text style={styles.close}>Close</Text>
              </TouchableOpacity>

            </View>
          )}

        </View>

      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f6f8fb',
  },

  title: {
    fontSize: 28,
    fontWeight: '900',
    margin: 20,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },

  card: {
    width: '31%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 3,
  },

  name: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 6,
  },

  smallText: {
    fontSize: 11,
    color: '#555',
  },

  viewBtn: {
    marginTop: 8,
    backgroundColor: '#6366f1',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
  },

  connectBtn: {
    marginTop: 6,
    backgroundColor: '#22c55e',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
  },

  disabledBtn: {
    marginTop: 6,
    backgroundColor: '#9ca3af',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
    opacity: 0.6,
  },

  btnText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 11,
  },

  status: {
    fontSize: 10,
    marginTop: 4,
    color: '#6b7280',
  },

  modalContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    padding: 20,
  },

  modalCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
  },

  modalName: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 15,
  },

  statsBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },

  stat: {
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 20,
    fontWeight: '900',
  },

  statLabel: {
    fontSize: 11,
    color: '#6b7280',
  },

  section: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 6,
  },

  modalText: {
    fontSize: 13,
    marginBottom: 6,
    color: '#374151',
  },

  modalBtn: {
    marginTop: 15,
    backgroundColor: '#22c55e',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },

  close: {
    marginTop: 12,
    textAlign: 'center',
    color: '#ef4444',
    fontWeight: '800',
  },

});