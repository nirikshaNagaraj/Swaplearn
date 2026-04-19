import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

import Navbar from './Navbar';
import EditProfile from './EditProfile';

export default function Profile({
  user,
  setUser,
  onLogout,
  ...props
}) {
  const [activeTab, setActiveTab] = useState('skills');
  const [editMode, setEditMode] = useState(false);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    if (user) {
      loadSkills(user);
    }
  }, [user]);

  const loadSkills = (userData) => {
    const teach = (userData?.teachSkills || []).map((item) => ({
      type: 'teach',
      skill_name: item.skill,
      language: item.language,
    }));

    const learn = (userData?.learnSkills || []).map((item) => ({
      type: 'learn',
      skill_name: item.skill,
      language: item.language,
    }));

    setSkills([...teach, ...learn]);
  };

  if (!user) {
    return (
      <View style={{ padding: 40 }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  /* EDIT PAGE */
  if (editMode) {
    return (
      <EditProfile
        user={user}
        onCancel={() => setEditMode(false)}
        onSave={(updatedUser) => {
          setUser(updatedUser);
          loadSkills(updatedUser);
          setEditMode(false);
        }}
      />
    );
  }

  const teachSkills = skills.filter((item) => item.type === 'teach');
  const learnSkills = skills.filter((item) => item.type === 'learn');

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

        {/* STATS */}
        <View style={styles.stats}>
          <Stat number={user.credits || 10} label="Credits" />
          <Stat number={user.learnedCount || 0} label="Learned" />
          <Stat number={user.teachedCount || 0} label="Teached" />
        </View>

        {/* ACTION BUTTONS */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => setEditMode(true)}
          >
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareBtn}>
            <Text style={styles.shareText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => {
            console.log('Logout Clicked');

            if (onLogout) {
              onLogout();
            }
          }}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* TABS */}
      <View style={styles.tabs}>
        <Tab
          title="Skills"
          active={activeTab === 'skills'}
          onPress={() => setActiveTab('skills')}
        />

        <Tab
          title="Teaching"
          active={activeTab === 'teaching'}
          onPress={() => setActiveTab('teaching')}
        />

        <Tab
          title="Learning"
          active={activeTab === 'learning'}
          onPress={() => setActiveTab('learning')}
        />

        <Tab
          title="Feedback"
          active={activeTab === 'feedback'}
          onPress={() => setActiveTab('feedback')}
        />
      </View>

      {/* CONTENT */}
      <View style={styles.section}>
        {activeTab === 'skills' && (
          <SkillsSection
            teachSkills={teachSkills}
            learnSkills={learnSkills}
          />
        )}

        {activeTab === 'teaching' && (
          <Empty title="No teaching sessions yet" />
        )}

        {activeTab === 'learning' && (
          <Empty title="No learning sessions yet" />
        )}

        {activeTab === 'feedback' && (
          <Empty title="No feedback yet" />
        )}
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
    style={[styles.tab, active && styles.activeTab]}
    onPress={onPress}
  >
    <Text style={[styles.tabText, active && styles.activeTabText]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const SkillsSection = ({ teachSkills, learnSkills }) => (
  <View>
    <Text style={styles.sectionTitle}>I want to learn</Text>

    <View style={styles.grid}>
      {learnSkills.length === 0 ? (
        <Text>No learning skills</Text>
      ) : (
        learnSkills.map((item, i) => (
          <SkillCard
            key={i}
            skill={item.skill_name}
            level={item.language}
          />
        ))
      )}
    </View>

    <Text style={styles.sectionTitle}>I can teach</Text>

    <View style={styles.grid}>
      {teachSkills.length === 0 ? (
        <Text>No teaching skills</Text>
      ) : (
        teachSkills.map((item, i) => (
          <SkillCard
            key={i}
            skill={item.skill_name}
            level={item.language}
          />
        ))
      )}
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
  <View style={styles.emptyBox}>
    <Text style={{ color: '#888' }}>{title}</Text>
  </View>
);

/* STYLES */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f0',
  },

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
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },

  stats: {
    flexDirection: 'row',
    gap: 30,
    marginTop: 18,
  },

  stat: {
    alignItems: 'center',
  },

  statNumber: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
  },

  statLabel: {
    color: '#ddd',
    fontSize: 13,
  },

  actions: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 18,
  },

  editBtn: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 60,
    paddingVertical: 10,
    borderRadius: 22,
  },

  shareBtn: {
    borderWidth: 1,
    borderColor: '#4CAF50',
    paddingHorizontal: 60,
    paddingVertical: 10,
    borderRadius: 22,
  },

  editText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  shareText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },



  logoutText: {
    color: '#cf4848',
    fontWeight: 'bold',
    fontSize :13,
  },

  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 15,
  },

  tab: {
    backgroundColor: '#ddd',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },

  activeTab: {
    backgroundColor: '#4CAF50',
  },

  tabText: {
    color: '#555',
  },

  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  section: {
    padding: 20,
  },

  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
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
    padding: 14,
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

  emptyBox: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 12,
    alignItems: 'center',
  },
});