import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Navbar from './Navbar';

export default function Profile({
  isLoggedIn,
  goToHome,
  goToAbout,
  goToDiscover,
  goToMatch,
  goToLogin,
  goToRegister,
}) {
  const [activeTab, setActiveTab] = useState('skills');

  const user = {
    name: "nrksha",
    bio: "Passionate learner & teacher 🚀",
    credits: 47,
    learnt: 710,
    taught: 759,
  };

  return (
    <ScrollView style={styles.container}>

      {/* NAVBAR */}
      <Navbar
        isLoggedIn={isLoggedIn}
        goToHome={goToHome}
        goToAbout={goToAbout}
        goToDiscover={goToDiscover}
        goToMatch={goToMatch}
        goToLogin={goToLogin}
        goToRegister={goToRegister}
      />

      {/* PROFILE HEADER */}
      <View style={styles.profileTop}>
        <View style={styles.avatar} />

        <View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.bio}>{user.bio}</Text>

          <View style={styles.stats}>
            <Stat number={user.credits} label="Credits" />
            <Stat number={user.learnt} label="Learnt" />
            <Stat number={user.taught} label="Taught" />
          </View>
        </View>
      </View>

      {/* ACTIONS */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* TABS */}
      <View style={styles.tabs}>
        <Tab title="Skills" active={activeTab==='skills'} onPress={()=>setActiveTab('skills')} />
        <Tab title="Teaching" active={activeTab==='teaching'} onPress={()=>setActiveTab('teaching')} />
        <Tab title="Learning" active={activeTab==='learning'} onPress={()=>setActiveTab('learning')} />
      </View>

      {/* CONTENT */}
      <View style={styles.section}>
        {activeTab === 'skills' && <Text>Skills Info</Text>}
        {activeTab === 'teaching' && <Text>No teaching sessions</Text>}
        {activeTab === 'learning' && <Text>No learning sessions</Text>}
      </View>

    </ScrollView>
  );
}

const Stat = ({ number, label }) => (
  <View style={styles.stat}>
    <Text style={styles.statNumber}>{number}</Text>
    <Text>{label}</Text>
  </View>
);

const Tab = ({ title, active, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.tab,
      { backgroundColor: active ? '#4CAF50' : '#151a3c' }
    ]}
  >
    <Text style={{ color: '#fff' }}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f0',
  },

  profileTop: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ccc',
    marginRight: 15,
  },

  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  bio: {
    color: '#666',
  },

  stats: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 20,
  },

  stat: {
    alignItems: 'center',
  },

  statNumber: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },

  btn: {
    backgroundColor: '#151a3c',
    padding: 10,
    borderRadius: 8,
  },

  btnText: {
    color: '#fff',
  },

  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 10,
  },

  tab: {
    padding: 10,
    borderRadius: 8,
  },

  section: {
    padding: 20,
  },
});