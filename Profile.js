import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Navbar from './Navbar';
import EditProfile from './EditProfile';

export default function ProfilePage({ user, setUser, ...props }) {

  const [activeTab, setActiveTab] = useState('skills');
  const [editMode, setEditMode] = useState(false);

  if (!user) {
    return (
      <View style={{ padding: 50 }}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  // ✅ EDIT MODE
  if (editMode) {
    return (
      <EditProfile
        user={user}
        onCancel={() => setEditMode(false)}
        onSave={(updatedUser) => {
          setUser(updatedUser);
          setEditMode(false);
        }}
      />
    );
  }

  return (
    <ScrollView style={styles.container}>

      <Navbar {...props} />

      {/* HEADER */}
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>

        <Text style={styles.name}>
          {user.name || user.username}
        </Text>

        <Text style={styles.bio}>
          {user.bio || 'Passionate learner 🚀'}
        </Text>

        <View style={styles.stats}>
          <Stat number={user.credits || 0} label="Credits" />
          <Stat number={user.learnSkills?.length || 0} label="Learning" />
          <Stat number={user.teachSkills?.length || 0} label="Teaching" />
        </View>

        {/* ACTIONS */}
        <View style={styles.actions}>

          {/* EDIT */}
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => setEditMode(true)}
          >
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>

          {/* SHARE */}
          <TouchableOpacity style={styles.shareBtn}>
            <Text style={styles.shareText}>Share</Text>
          </TouchableOpacity>

        </View>

        {/* 🔥 HIDDEN LOGOUT (small + subtle) */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => {
            setUser(null);
            props.goToHome();
          }}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

      </View>

      {/* TABS */}
      <View style={styles.tabs}>
        <Tab title="Skills" active={activeTab === 'skills'} onPress={() => setActiveTab('skills')} />
        <Tab title="Teaching" active={activeTab === 'teaching'} onPress={() => setActiveTab('teaching')} />
        <Tab title="Learning" active={activeTab === 'learning'} onPress={() => setActiveTab('learning')} />
        <Tab title="Feedback" active={activeTab === 'feedback'} onPress={() => setActiveTab('feedback')} />
      </View>

      {/* CONTENT */}
      <View style={styles.section}>
        {activeTab === 'skills' && <SkillsSection user={user} />}
        {activeTab === 'teaching' && <SkillsList data={user.teachSkills} title="Teaching Skills" />}
        {activeTab === 'learning' && <SkillsList data={user.learnSkills} title="Learning Skills" />}
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

/* SKILLS SECTION */

const SkillsSection = ({ user }) => (
  <View>

    <Text style={styles.sectionTitle}>I want to learn</Text>
    <View style={styles.grid}>
      {user.learnSkills?.length ? (
        user.learnSkills.map((item, i) => (
          <SkillCard key={i} skill={item.skill} level={item.language} />
        ))
      ) : (
        <Text>No skills added</Text>
      )}
    </View>

    <Text style={styles.sectionTitle}>I can teach</Text>
    <View style={styles.grid}>
      {user.teachSkills?.length ? (
        user.teachSkills.map((item, i) => (
          <SkillCard key={i} skill={item.skill} level={item.language} />
        ))
      ) : (
        <Text>No skills added</Text>
      )}
    </View>

  </View>
);

/* LIST VIEW */

const SkillsList = ({ data, title }) => (
  <View>
    <Text style={styles.sectionTitle}>{title}</Text>

    {data?.length ? (
      data.map((item, i) => {

        const skillName =
          typeof item.skill === "object" ? item.skill.name : item.skill;

        const languageName =
          typeof item.language === "object" ? item.language.name : item.language;

        return (
          <View key={i} style={styles.skillCard}>
            <Text style={styles.skill}>{skillName}</Text>
            <Text style={styles.level}>{languageName}</Text>
          </View>
        );
      })
    ) : (
      <Empty title={title} />
    )}
  </View>
);

/* SAFE CARD */

const SkillCard = ({ skill, level }) => {

  const skillName =
    typeof skill === "object" ? skill.name : skill;

  const languageName =
    typeof level === "object" ? level.name : level;

  return (
    <View style={styles.skillCard}>
      <Text style={styles.skill}>{skillName}</Text>
      <Text style={styles.level}>{languageName}</Text>
    </View>
  );
};

const Empty = ({ title }) => (
  <View>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.emptyBox}>
      <Text style={{ color: '#aaa' }}>Nothing here yet</Text>
    </View>
  </View>
);

/* STYLES */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f0' },

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

  avatarText: { fontSize: 30 },

  name: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },

  bio: { color: '#ccc', marginTop: 5 },

  stats: {
    flexDirection: 'row',
    gap: 30,
    marginTop: 15,
  },

  stat: { alignItems: 'center' },

  statNumber: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },

  statLabel: { color: '#ccc' },

  actions: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 15,
  },

  editBtn: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 20,
  },

  shareBtn: {
    borderWidth: 1,
    borderColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 20,
  },

  editText: { color: '#fff', fontWeight: 'bold' },
  shareText: { color: '#4CAF50', fontWeight: 'bold' },

  /* 🔥 subtle logout */
  logoutBtn: {
    marginTop: 8,
  },

  logoutText: {
    color: '#888',
    fontSize: 11,
  },

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

  activeTab: { backgroundColor: '#4CAF50' },

  tabText: { color: '#555' },
  activeTabText: { color: '#fff' },

  section: { padding: 20 },

  sectionTitle: {
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#151a3c',
  },

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
  },

  skill: { fontWeight: 'bold', color: '#151a3c' },

  level: { color: '#4CAF50', marginTop: 5 },

  emptyBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
});