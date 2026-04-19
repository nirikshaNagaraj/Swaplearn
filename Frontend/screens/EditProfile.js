import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import { API } from '../../api';

export default function EditProfile({ user, onSave, onCancel }) {
  const [username, setUsername] = useState(user?.username || '');
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');

  const [teachSkills, setTeachSkills] = useState(user?.teachSkills || []);
  const [learnSkills, setLearnSkills] = useState(user?.learnSkills || []);

  const [categories, setCategories] = useState({});
  const [languages, setLanguages] = useState([]);

  const [selectedType, setSelectedType] = useState('');
  const [step, setStep] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMeta();
  }, []);

  const fetchMeta = async () => {
    try {
      const res = await fetch(`${API}/metadata/`);
      const data = await res.json();

      let obj = {};
      data.categories.forEach((item) => {
        obj[item.name] = item.skills;
      });

      setCategories(obj);
      setLanguages(data.languages);
    } catch (err) {
      console.log(err);
    }
  };

  const resetFlow = () => {
    setStep('');
    setSelectedCategory('');
    setSelectedSkill('');
  };

  const addSkill = (lang) => {
    const item = {
      skill: selectedSkill,
      language: lang,
    };

    if (selectedType === 'teach') {
      setTeachSkills([...teachSkills, item]);
    } else {
      setLearnSkills([...learnSkills, item]);
    }

    resetFlow();
  };

  const removeSkill = (type, index) => {
    if (type === 'teach') {
      setTeachSkills(teachSkills.filter((_, i) => i !== index));
    } else {
      setLearnSkills(learnSkills.filter((_, i) => i !== index));
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);

      const payload = {
        old_username: user.username,
        username: username.trim(),
        name: name.trim(),
        bio: bio.trim(),
        teachSkills,
        learnSkills,
      };

      const res = await fetch(`${API}/update_profile/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      setSaving(false);

      if (res.ok) {
        Alert.alert('Success', 'Profile Updated');

        onSave({
          ...user,
          username: data.username,
          name: data.name,
          bio: data.bio || '',
          teachSkills: data.teachSkills || [],
          learnSkills: data.learnSkills || [],
        });
      } else {
        Alert.alert('Error', data.error || 'Update failed');
      }
    } catch (error) {
      setSaving(false);
      Alert.alert('Error', 'Server error');
      console.log(error);
    }
  };

  const renderCard = (item, onPress) => (
    <TouchableOpacity style={styles.cardOption} onPress={onPress}>
      <Text style={styles.cardText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderChip = (item, index, type) => (
    <TouchableOpacity
      key={index}
      style={styles.chip}
      onPress={() => removeSkill(type, index)}
    >
      <Text style={styles.chipText}>
        {item.skill} ({item.language}) ✕
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <View style={styles.box}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={[styles.input, { height: 90 }]}
          placeholder="Bio"
          multiline
          value={bio}
          onChangeText={setBio}
        />

        <Text style={styles.title}>Teach Skills</Text>

        <View style={styles.skillWrap}>
          {teachSkills.map((item, i) => renderChip(item, i, 'teach'))}

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => {
              setSelectedType('teach');
              setStep('category');
            }}
          >
            <Text style={styles.addText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Learn Skills</Text>

        <View style={styles.skillWrap}>
          {learnSkills.map((item, i) => renderChip(item, i, 'learn'))}

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => {
              setSelectedType('learn');
              setStep('category');
            }}
          >
            <Text style={styles.addText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {step === 'category' && (
          <>
            <Text style={styles.title}>Choose Category</Text>
            <FlatList
              data={Object.keys(categories)}
              numColumns={2}
              scrollEnabled={false}
              keyExtractor={(item) => item}
              renderItem={({ item }) =>
                renderCard(item, () => {
                  setSelectedCategory(item);
                  setStep('skill');
                })
              }
            />
          </>
        )}

        {step === 'skill' && (
          <>
            <Text style={styles.title}>Choose Skill</Text>
            <FlatList
              data={categories[selectedCategory] || []}
              numColumns={2}
              scrollEnabled={false}
              keyExtractor={(item) => item}
              renderItem={({ item }) =>
                renderCard(item, () => {
                  setSelectedSkill(item);
                  setStep('language');
                })
              }
            />
          </>
        )}

        {step === 'language' && (
          <>
            <Text style={styles.title}>Choose Language</Text>
            <FlatList
              data={languages}
              numColumns={2}
              scrollEnabled={false}
              keyExtractor={(item) => item}
              renderItem={({ item }) =>
                renderCard(item, () => addSkill(item))
              }
            />
          </>
        )}

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={saveProfile}
          disabled={saving}
        >
          <Text style={styles.saveText}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={onCancel}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f6f3',
  },

  header: {
    backgroundColor: '#151a3c',
    padding: 25,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
  },

  box: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
  },

  input: {
    backgroundColor: '#eef1f5',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 10,
    color: '#151a3c',
  },

  skillWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#e9f7eb',
    padding: 8,
    borderRadius: 12,
  },

  chip: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
  },

  chipText: {
    fontSize: 12,
  },

  addBtn: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
  },

  addText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  cardOption: {
    backgroundColor: '#eef1f5',
    width: '47%',
    margin: '1.5%',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  cardText: {
    fontWeight: '600',
    color: '#151a3c',
  },

  saveBtn: {
    backgroundColor: '#151a3c',
    padding: 16,
    borderRadius: 12,
    marginTop: 22,
    alignItems: 'center',
  },

  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  cancelBtn: {
    marginTop: 14,
    alignItems: 'center',
  },

  cancelText: {
    color: '#666',
    fontWeight: '600',
  },
});