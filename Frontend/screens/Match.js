import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';

const MatchPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 CHANGE THIS BASED ON YOUR BACKEND
  const API = "http://10.0.2.2:8000"; 
  // OR: http://192.168.x.x:8000 for real phone

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await fetch(`${API}/get-users/`);
      const json = await res.json();

      console.log("API RESPONSE:", json);

      if (Array.isArray(json)) {
        setData(json);
      } else {
        setData([]);
      }

    } catch (err) {
      console.log("FETCH ERROR:", err);

      // 🔥 fallback so UI NEVER stays blank
      setData([
        {
          username: "demo",
          name: "Demo User",
          views: 2,
          teachSkills: [{ skill: "React" }],
          learnSkills: [{ skill: "AI" }]
        }
      ]);

    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const name = item?.name || item?.username || "Unknown";
    const views = item?.views ?? 0;

    const teach = item?.teachSkills || [];
    const learn = item?.learnSkills || [];

    return (
      <View style={styles.card}>

        {/* name */}
        <Text style={styles.name}>{name}</Text>

        {/* views */}
        <Text style={styles.views}>👁 {views} views</Text>

        {/* teach */}
        <Text style={styles.label}>Can Teach</Text>
        <Text style={styles.text}>
          {teach.length
            ? teach.map(s => s.skill).join(' • ')
            : 'Not added'}
        </Text>

        {/* learn */}
        <Text style={styles.label}>Wants to Learn</Text>
        <Text style={styles.text}>
          {learn.length
            ? learn.map(s => s.skill).join(' • ')
            : 'Not added'}
        </Text>

      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Discover People</Text>
      <Text style={styles.subtitle}>All users in Swaplearn</Text>

      {/* DEBUG LINE (VERY IMPORTANT) */}
      <Text style={styles.debug}>
        Users Loaded: {data.length}
      </Text>

      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No users found</Text>
        }
      />

    </View>
  );
};

export default MatchPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7fb',
    padding: 14,
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
  },

  subtitle: {
    fontSize: 13,
    color: '#777',
    marginBottom: 10,
  },

  debug: {
    fontSize: 12,
    color: 'red',
    marginBottom: 10,
  },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },

  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },

  views: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },

  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#aaa',
    marginTop: 10,
    textTransform: 'uppercase',
  },

  text: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },

  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  empty: {
    textAlign: 'center',
    marginTop: 50,
    color: '#999',
  },
});