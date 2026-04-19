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
    } catch (error) {
      console.log("FETCH USERS ERROR:", error);
    }
  };

const toggleConnect = async (user) => {
  if (!props.isLoggedIn) {
    props.goToLogin();
    return;
  }

  try {
    const res = await fetch(`${API}/send-request/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender_id: props.user?.user_id,
        receiver_id: user.user_id,
        skill: user.teachSkills?.[0]?.skill || "General",
        language: user.teachSkills?.[0]?.language || "English",
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setConnections((prev) => ({
        ...prev,
        [user.username]: "pending",
      }));
    } else {
      alert(data.error || "Request failed");
    }
  } catch (err) {
    console.log(err);
    alert("Server error");
  }
};

  const teachSkills = (user) => {
    if (!user.teachSkills || user.teachSkills.length === 0) {
      return 'No skills added';
    }

    return user.teachSkills
      .map((item) => `${item.skill} (${item.language})`)
      .join(', ');
  };

  const learnSkills = (user) => {
    if (!user.learnSkills || user.learnSkills.length === 0) {
      return 'No skills added';
    }

    return user.learnSkills
      .map((item) => `${item.skill} (${item.language})`)
      .join(', ');
  };

  const formatAvailability = (availability) => {
    if (!availability || availability.length === 0) {
      return 'No availability set';
    }

    return availability
      .map(item => `${item.day}: ${item.slots.join(', ')}`)
      .join('\n');
  };

  return (
    <ScrollView style={styles.container}>
      <Navbar {...props} />

      <Text style={styles.title}>Discover People</Text>

      <View style={styles.grid}>
        {users.map((user, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.name}>
              {user.name || user.username}
            </Text>

            <Text style={styles.info}>
              Credits: {user.credits || 0}
            </Text>

            <Text style={styles.info}>
              Teaches: {teachSkills(user)}
            </Text>

            <Text style={styles.info}>
              Learns: {learnSkills(user)}
            </Text>

            <TouchableOpacity
              style={styles.viewBtn}
              onPress={() => setSelectedUser(user)}
            >
              <Text style={styles.btnText}>View Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.connectBtn}
              onPress={() => toggleConnect(user)}
            >
              <Text style={styles.btnText}>
                {connections[user.username]
                  ? 'X Cancel Request'
                  : ' Connect'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* MODAL */}
      <Modal visible={!!selectedUser} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          {selectedUser && (
            <View style={styles.modalCard}>

              <View style={styles.topRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {(selectedUser.name || selectedUser.username)
                      .charAt(0)
                      .toUpperCase()}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.modalName}>
                    {selectedUser.name || selectedUser.username}
                  </Text>

                  <Text style={styles.username}>
                    @{selectedUser.username}
                  </Text>
                </View>
              </View>

              <Text style={styles.section}>Email</Text>
              <Text style={styles.detail}>
                {selectedUser.email || 'No email added'}
              </Text>

              <Text style={styles.section}>Skills They Teach</Text>
              <Text style={styles.detail}>
                {teachSkills(selectedUser)}
              </Text>

              <Text style={styles.section}>Skills They Learn</Text>
              <Text style={styles.detail}>
                {learnSkills(selectedUser)}
              </Text>

              <Text style={styles.section}>Availability</Text>
              <Text style={styles.detail}>
                {formatAvailability(selectedUser.availability)}
              </Text>

              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => toggleConnect(selectedUser)}
              >
                <Text style={styles.btnText}>
                  {connections[selectedUser.username]
                    ? 'X Cancel Request'
                    : ' Send Request ->'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setSelectedUser(null)}
              >
                <Text style={styles.closeText}>Close</Text>
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
    backgroundColor: '#f5f7fb',
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    margin: 20,
    color: '#111827',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },

  card: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    elevation: 4,
  },

  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  info: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 5,
  },

  viewBtn: {
    backgroundColor: '#5b5ce2',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },

  connectBtn: {
    backgroundColor: '#22c55e',
    padding: 10,
    borderRadius: 10,
    marginTop: 8,
    alignItems: 'center',
  },

  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalCard: {
    width: '68%',
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 28,
  },

  topRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#5b5ce2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
  },

  avatarText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },

  modalName: {
    fontSize: 26,
    fontWeight: 'bold',
  },

  username: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },

  bio: {
    marginTop: 8,
    color: '#374151',
    fontSize: 14,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
  },

  statBox: {
    width: '31%',
    backgroundColor: '#f3f4f6',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },

  section: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 6,
    color: '#111827',
  },

  detail: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },

  modalBtn: {
    backgroundColor: '#22c55e',
    padding: 13,
    borderRadius: 12,
    marginTop: 18,
    alignItems: 'center',
  },

  closeBtn: {
    marginTop: 14,
    alignItems: 'center',
  },

  closeText: {
    color: '#ef4444',
    fontWeight: 'bold',
    fontSize: 14,
  },
});