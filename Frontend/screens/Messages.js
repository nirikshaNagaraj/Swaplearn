import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Navbar from './Navbar';
import { API } from '../../api';

export default function Messages({ user, openChat, ...props }) {
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState('');

  const loadChats = () => {
    if (!user) return;

    fetch(`${API}/chats/${user.user_id}/`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setChats(data);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadChats();

    const interval = setInterval(loadChats, 3000);

    return () => clearInterval(interval);
  }, [user]);

  const filteredChats = chats.filter((item) => {
    const text = `${item.name || ''} ${item.username || ''}`.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  const renderChat = ({ item }) => {
    if (!item || !item.room_id) return null;

    const firstLetter = (item.name || item.username || '?')
      .charAt(0)
      .toUpperCase();

    return (
      <TouchableOpacity
        style={styles.chatCard}
        onPress={() => openChat(item.room_id, item)}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{firstLetter}</Text>
        </View>

        <View style={styles.chatInfo}>
          <Text style={styles.name}>
            {item.name || item.username}
          </Text>

          <Text style={styles.username}>
            @{item.username}
          </Text>

          <Text style={styles.message} numberOfLines={1}>
            {item.last_message || 'Start chatting...'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Navbar {...props} />

      <Text style={styles.title}>Messages</Text>

      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search chats..."
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {!user ? (
        <Text style={styles.empty}>Login to see chats</Text>
      ) : filteredChats.length === 0 ? (
        <Text style={styles.empty}>No chats yet</Text>
      ) : (
    <FlatList
  data={filteredChats.filter(item => item && item.room_id)}
  keyExtractor={(item) => String(item.room_id)}
  renderItem={renderChat}
  contentContainerStyle={{ padding: 15 }}
/>
      )}
    </View>
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
    color: '#151a3c',
    marginLeft: 20,
    marginTop: 10,
  },

  searchBox: {
    backgroundColor: '#e6e9ef',
    margin: 15,
    borderRadius: 10,
    paddingHorizontal: 12,
  },

  searchInput: {
    height: 42,
  },

  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  chatInfo: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#151a3c',
  },

  username: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },

  message: {
    color: '#666',
    marginTop: 4,
    fontSize: 13,
  },

  empty: {
    textAlign: 'center',
    marginTop: 30,
    color: 'gray',
    fontSize: 15,
  },
});