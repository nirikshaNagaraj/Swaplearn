import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Navbar from './Navbar';

export default function ProfilePage(props) {
  const [activeTab, setActiveTab] = useState('skills');

  const user = {
    name: 'nrksha',
    bio: 'Passionate learner & teacher 🚀',
    credits: 47,
    learnt: 710,
    taught: 759,
  };

  return (
    <ScrollView style={styles.container}>

      <Navbar {...props} />

      {/* 🔥 HEADER CARD */}
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>

        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.bio}>{user.bio}</Text>

        <View style={styles.stats}>
          <Stat number={user.credits} label="Credits" />
          <Stat number={user.learnt} label="Learnt" />
          <Stat number={user.taught} label="Taught" />
        </View>

        {/* 🔥 BUTTONS */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareBtn}>
            <Text style={styles.shareText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 🔥 TABS */}
      <View style={styles.tabs}>
        <Tab title="Skills" active={activeTab === 'skills'} onPress={() => setActiveTab('skills')} />
        <Tab title="Teaching" active={activeTab === 'teaching'} onPress={() => setActiveTab('teaching')} />
        <Tab title="Learning" active={activeTab === 'learning'} onPress={() => setActiveTab('learning')} />
        <Tab title="Feedback" active={activeTab === 'feedback'} onPress={() => setActiveTab('feedback')} />
      </View>

      {/* CONTENT */}
      <View style={styles.section}>
        {activeTab === 'skills' && <SkillsSection />}
        {activeTab === 'teaching' && <Empty title="Teaching Sessions" />}
        {activeTab === 'learning' && <Empty title="Learning Sessions" />}
        {activeTab === 'feedback' && <Empty title="Feedback" />}
      </View>

    </ScrollView>
  );
}

/* COMPONENTS */

const Stat = ({ number, label }) => (
  <View style={styles.stat}>
    <Text style={styles.statNumber}>{number}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const Tab = ({ title, active, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.tab, active && styles.activeTab]}
  >
    <Text style={[styles.tabText, active && styles.activeTabText]}>
      {title}
    </Text>
  </TouchableOpacity>
);

/* 🔥 SKILLS SECTION */

const SkillsSection = () => (
  <View>

    <Text style={styles.sectionTitle}>I want to learn</Text>
    <View style={styles.grid}>
      <SkillCard skill="React" level="Beginner" />
      <SkillCard skill="AI" level="Intermediate" />
      <SkillCard skill="UI/UX" level="Beginner" />
    </View>

    <Text style={styles.sectionTitle}>I can teach</Text>
    <View style={styles.grid}>
      <SkillCard skill="Python" level="Advanced" />
      <SkillCard skill="JavaScript" level="Intermediate" />
      <SkillCard skill="Editing" level="Advanced" />
    </View>

    <Text style={styles.sectionTitle}>Availability</Text>
    <View style={styles.timeGrid}>
      {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, i) => (
        <View key={i} style={styles.timeCard}>
          <Text style={styles.day}>{d}</Text>
          <Text style={styles.time}>6PM - 9PM</Text>
        </View>
      ))}
    </View>

  </View>
);

const SkillCard = ({ skill, level }) => (
  <View style={styles.skillCard}>
    <Text style={styles.skill}>{skill}</Text>
    <Text style={styles.level}>{level}</Text>
  </View>
);

const Empty = ({ title }) => (
  <View>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.emptyBox}>
      <Text style={{ color: '#aaa' }}>Nothing here yet</Text>
    </View>
  </View>
);

/* 🔥 STYLES */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f0',
  },

  /* HEADER */
  headerCard: {
    backgroundColor: '#151a3c',
    padding: 25,
 
    alignItems: 'center',
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    fontSize: 30,
  },

  name: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },

  bio: {
    color: '#ccc',
    marginTop: 5,
  },

  stats: {
    flexDirection: 'row',
    gap: 30,
    marginTop: 15,
  },

  stat: { alignItems: 'center' },

  statNumber: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize:15,
  },

  statLabel: {
    color: '#ccc',
    fontSize: 15,
  },

  /* BUTTONS */
  actions: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 15,
  },

  editBtn: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 75,
    paddingVertical: 10,
    borderRadius: 20,
  },

  shareBtn: {
    borderWidth: 1,
    borderColor: '#4CAF50',
    paddingHorizontal: 75,
    paddingVertical: 10,
    borderRadius: 20,
  },

  editText: { color: '#fff', fontWeight: 'bold' },
  shareText: { color: '#4CAF50', fontWeight: 'bold' },

  /* TABS */
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    gap: 10,
  },

  tab: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },

  activeTab: {
    backgroundColor: '#4CAF50',
  },

  tabText: { color: '#555' },
  activeTabText: { color: '#fff' },

  section: {
    padding: 20,
  },

  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 10,
    color: '#151a3c',
  },

  /* GRID */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  skillCard: {
    backgroundColor: '#fff',
    width: '30%',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3,
  },

  skill: {
    fontWeight: 'bold',
    color: '#151a3c',
  },

  level: {
    color: '#4CAF50',
    marginTop: 5,
  },

  /* TIME */
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  timeCard: {
    backgroundColor: '#151a3c',
    width: '30%',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },

  day: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },

  time: {
    color: '#fff',
    fontSize: 12,
  },

  emptyBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
});