import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Navbar from './Navbar';

export default function Match(props) {

  const currentUser = {
    teaches: 'Python',
    learns: 'UI Design',
  };

  const users = [
    { username: 'Rahul', teaches: 'UI Design', learns: 'Python' },
    { username: 'Anjali', teaches: 'Dance', learns: 'Video Editing' },
    { username: 'Sneha', teaches: 'UI Design', learns: 'Python' },
  ];

  const matches = users.filter(
    (u) =>
      u.teaches === currentUser.learns &&
      u.learns === currentUser.teaches
  );

  return (
    <ScrollView style={styles.container}>
      <Navbar {...props} />

      <Text style={styles.title}>Best Matches</Text>

      {matches.length === 0 ? (
        <Text style={styles.noMatch}>No matches found</Text>
      ) : (
        <View style={styles.grid}>
          {matches.map((user, index) => (
            <View key={index} style={styles.card}>

              <Text style={styles.username}>{user.username}</Text>

              <View style={styles.matchBadge}>
                <Text style={styles.matchText}>Perfect Match</Text>
              </View>

              <View style={styles.tag}>
                <Text style={styles.tagText}>Teaches: {user.teaches}</Text>
              </View>

              <View style={styles.tagAlt}>
                <Text style={styles.tagTextAlt}>Learns: {user.learns}</Text>
              </View>

              <TouchableOpacity
                style={styles.connectBtn}
                onPress={() => {
                  if (!props.isLoggedIn) props.goToLogin();
                  else alert('Matched & Connected!');
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
    textAlign: 'center',
    marginVertical: 20,
    color: '#151a3c',
  },

  noMatch: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  card: {
    backgroundColor: '#fff',
    width: 240,
    padding: 20,
    margin: 12,
    borderRadius: 15,
    elevation: 5,
  },

  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#151a3c',
    marginBottom: 8,
  },

  matchBadge: {
    backgroundColor: '#4CAF50',
    padding: 5,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },

  matchText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },

  tag: {
    backgroundColor: '#151a3c',
    padding: 6,
    borderRadius: 8,
    marginBottom: 6,
  },

  tagAlt: {
    backgroundColor: '#4CAF50',
    padding: 6,
    borderRadius: 8,
    marginBottom: 10,
  },

  tagText: {
    color: '#fff',
    fontSize: 12,
  },

  tagTextAlt: {
    color: '#fff',
    fontSize: 12,
  },

  connectBtn: {
    backgroundColor: '#151a3c',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  connectText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});