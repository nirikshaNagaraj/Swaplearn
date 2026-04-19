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

  // 🔥 FIX: grouped availability
  const [availability, setAvailability] = useState([]);

  useEffect(() => {
    if (user) {
      loadSkills(user);
      loadAvailability();
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

  // 🔥 FIX: fetch from backend and group correctly
const loadAvailability = async () => {
  try {
    const res = await fetch(
      `http://127.0.0.1:8000/api/get_calendar_slots/?username=${user.username}`
    );

    const data = await res.json();

    console.log("AVAILABILITY RAW:", data);

    const grouped = {};

    data.forEach(item => {
      const day = item.day;
      const slots = item.slots || [];

      if (!grouped[day]) {
        grouped[day] = [];
      }

      grouped[day] = [...grouped[day], ...slots];
    });

    const formatted = Object.keys(grouped).map(day => ({
      day,
      slots: grouped[day]
    }));

    console.log("AVAILABILITY FINAL:", formatted);

    setAvailability(formatted);

  } catch (err) {
    console.log("availability error:", err);
  }
};

  if (!user) {
    return (
      <View style={{ padding: 40 }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (editMode) {
    return (
      <EditProfile
        user={user}
        onCancel={() => setEditMode(false)}
        onSave={(updatedUser) => {
          setUser(updatedUser);
          loadSkills(updatedUser);
          loadAvailability();
          setEditMode(false);
        }}
      />
    );
  }

  const teachSkills = skills.filter((i) => i.type === 'teach');
  const learnSkills = skills.filter((i) => i.type === 'learn');

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
        <TouchableOpacity
  style={styles.bell}
  onPress={() => props.goToRequests?.()}
>
  <Text style={styles.bellText}>🔔</Text>
</TouchableOpacity>

        {/* STATS */}
        <View style={styles.stats}>
  <Stat number={user.credits || 0} label="Credits" />
  <Stat number={user.learnedCount || 0} label="Learned" />
  <Stat number={user.teachedCount || 0} label="Teached" />
</View>

        {/* ACTIONS */}
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

        {/* LOGOUT */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => onLogout?.()}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* TABS */}
      <View style={styles.tabs}>
        <Tab title="Skills" active={activeTab === 'skills'} onPress={() => setActiveTab('skills')} />
        <Tab title="Teaching" active={activeTab === 'teaching'} onPress={() => setActiveTab('teaching')} />
        <Tab title="Learning" active={activeTab === 'learning'} onPress={() => setActiveTab('learning')} />
      </View>

      {/* CONTENT */}
      <View style={styles.section}>

        {activeTab === 'skills' && (
          <View>

            {/* LEARNING */}
            <Text style={styles.sectionTitle}>I want to learn</Text>
            <View style={styles.grid}>
              {learnSkills.length === 0 ? (
                <Text>No learning skills</Text>
              ) : (
                learnSkills.map((item, i) => (
                  <SkillCard key={i} skill={item.skill_name} level={item.language} />
                ))
              )}
            </View>

            {/* TEACHING */}
            <Text style={styles.sectionTitle}>I can teach</Text>
            <View style={styles.grid}>
              {teachSkills.length === 0 ? (
                <Text>No teaching skills</Text>
              ) : (
                teachSkills.map((item, i) => (
                  <SkillCard key={i} skill={item.skill_name} level={item.language} />
                ))
              )}
            </View>

            {/* ✅ FIXED AVAILABILITY */}
            <Text style={styles.sectionTitle}>📅 Availability</Text>


{availability?.length ? (
  availability.map((item, i) => (
    <View key={i} style={{ marginBottom: 10 }}>

      <Text style={{ fontWeight: 'bold', color: '#151a3c' }}>
        {item.day}
      </Text>

      <Text style={{ color: '#555', marginTop: 2 }}>
        {item.slots?.length
          ? item.slots.join(' • ')
          : 'No slots'}
      </Text>

    </View>
  ))
) : (
  <Text style={{ color: '#aaa' }}>
    No availability set
  </Text>
)}

            {/* BUTTON */}
            <TouchableOpacity
              style={styles.avlBtn}
              onPress={() => {
                props.goToAvailability?.({
                  user,
                  onSave: loadAvailability
                });
              }}
            >
              <Text style={styles.avlBtnText}>
                📅 Set Availability
              </Text>
            </TouchableOpacity>

          </View>
        )}

        {activeTab === 'teaching' && <Text>No teaching sessions yet</Text>}
        {activeTab === 'learning' && <Text>No learning sessions yet</Text>}

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

const SkillCard = ({ skill, level }) => (
  <View style={styles.skillCard}>
    <Text style={styles.skill}>{skill}</Text>
    <Text style={styles.level}>{level}</Text>
  </View>
);

/* STYLES (UNCHANGED) */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f0' },
  headerCard: { backgroundColor: '#151a3c', padding: 25, alignItems: 'center' },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 30 },
  name: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 10 },
  stats: { flexDirection: 'row', gap: 30, marginTop: 18 },
  stat: { alignItems: 'center' },
  statNumber: { color: '#4CAF50', fontSize: 18, fontWeight: 'bold' },
  statLabel: { color: '#ddd', fontSize: 13 },
  actions: { flexDirection: 'row', gap: 15, marginTop: 18 },
  editBtn: { backgroundColor: '#4CAF50', paddingHorizontal: 60, paddingVertical: 10, borderRadius: 22 },
  shareBtn: { borderWidth: 1, borderColor: '#4CAF50', paddingHorizontal: 60, paddingVertical: 10, borderRadius: 22 },
  editText: { color: '#fff', fontWeight: 'bold' },
  shareText: { color: '#4CAF50', fontWeight: 'bold' },
  logoutBtn: { marginTop: 10 },
  logoutText: { color: '#ff6b6b', fontWeight: 'bold', fontSize: 13 },
  tabs: { flexDirection: 'row', justifyContent: 'center', marginTop: 15, gap: 10 },
  tab: { backgroundColor: '#ddd', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  activeTab: { backgroundColor: '#4CAF50' },
  tabText: { color: '#555' },
  activeTabText: { color: '#fff' },
  section: { padding: 20 },
  sectionTitle: { fontWeight: 'bold', marginVertical: 10, color: '#151a3c' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  skillCard: { backgroundColor: '#fff', width: '30%', padding: 14, borderRadius: 12, marginBottom: 10 },
  skill: { fontWeight: 'bold', color: '#151a3c' },
  level: { color: '#4CAF50', marginTop: 5 },
avlBtn: {
  marginTop: 20,
  backgroundColor: '#151a3c',
  paddingVertical: 12,
  paddingHorizontal: 25,   // 👈 reduce width
  borderRadius: 12,
  alignSelf: 'flex-start', // 👈 important (prevents full stretch)
  alignItems: 'center',
},
  avlBtnText: { color: '#fff', fontWeight: 'bold' },
  bell: {
  position: 'absolute',
  top: 15,
  right: 15,
  padding: 10,
  borderRadius: 25,
  elevation: 5,
},

bellText: {
  fontSize: 18,
}
});