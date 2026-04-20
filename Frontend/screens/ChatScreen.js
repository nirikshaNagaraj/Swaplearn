import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { API } from '../../api';

export default function ChatScreen({ route, goBack }) {
  const { room_id, name, user } = route.params;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  const loadMessages = () => {
    fetch(`${API}/messages/${room_id}/`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMessages(data);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadMessages();

    const interval = setInterval(loadMessages, 2000);

    return () => clearInterval(interval);
  }, []);

  const sendMessage = async () => {
    if (!text.trim()) return;

    const msg = text;
    setText('');

    setMessages((prev) => [
      ...prev,
      {
        sender: user.user_id,
        text: msg,
      },
    ]);

    try {
      await fetch(`${API}/send-message/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender_id: user.user_id,
          room_id: room_id,
          text: msg,
        }),
      });

      loadMessages();
    } catch (err) {
      console.log(err);
    }
  };

  const renderMessage = ({ item, index }) => {
    const isMe = String(item.sender) === String(user.user_id);

    return (
      <View
        style={[
          styles.row,
          isMe ? styles.rightRow : styles.leftRow,
        ]}
      >
        <View
          style={[
            styles.bubble,
            isMe ? styles.myBubble : styles.otherBubble,
          ]}
        >
          <Text>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Text style={{ color: '#fff' }}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerText}>{name}</Text>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ padding: 10 }}
      />

      <View style={styles.bottom}>
        <TextInput
          placeholder="Type message..."
          style={styles.input}
          value={text}
          onChangeText={setText}
        />

        <TouchableOpacity
          style={styles.sendBtn}
          onPress={sendMessage}
        >
          <Text style={{ color: '#fff' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  header: {
    backgroundColor: '#151a3c',
    padding: 15,
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },

  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },

  row: {
    width: '100%',
    marginVertical: 4,
  },

  rightRow: {
    alignItems: 'flex-end',
  },

  leftRow: {
    alignItems: 'flex-start',
  },

  bubble: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 12,
  },

  myBubble: {
    backgroundColor: '#4CAF50',
  },

  otherBubble: {
    backgroundColor: '#ddd',
  },

  bottom: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
  },

  sendBtn: {
    backgroundColor: '#151a3c',
    paddingHorizontal: 18,
    marginLeft: 10,
    justifyContent: 'center',
    borderRadius: 10,
  },
});