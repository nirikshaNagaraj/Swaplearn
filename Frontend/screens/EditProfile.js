import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { API } from '../../api';

export default function EditProfile({ user, onSave, onCancel }) {

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const [teachSkills, setTeachSkills] = useState(user.teachSkills || []);
  const [learnSkills, setLearnSkills] = useState(user.learnSkills || []);

  const [selectedType, setSelectedType] = useState('');
  const [step, setStep] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  const [categories, setCategories] = useState({});
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    const res = await fetch(`${API}/metadata/`);
    const data = await res.json();

    let formatted = {};
    data.categories.forEach(c => {
      formatted[c.name] = c.skills;
    });

    setCategories(formatted);
    setLanguages(data.languages);
    setLoading(false);
  };

  const addSkill = (lang) => {
    const newSkill = { skill: selectedSkill, language: lang };

    if (selectedType === 'teach') {
      setTeachSkills([...teachSkills, newSkill]);
    } else {
      setLearnSkills([...learnSkills, newSkill]);
    }

    setStep('');
  };

  const removeSkill = (type, index) => {
    if (type === 'teach') {
      setTeachSkills(teachSkills.filter((_, i) => i !== index));
    } else {
      setLearnSkills(learnSkills.filter((_, i) => i !== index));
    }
  };

  const handleSave = async () => {
    const res = await fetch(`${API}/update-profile/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: user.username,
        name,
        email,
        teachSkills,
        learnSkills,
      }),
    });

    if (res.ok) {
      onSave({
        ...user,
        name,
        email,
        teachSkills,
        learnSkills
      });
    }
  };

  const renderCard = (item, onPress) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.cardTitle}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      <Text style={styles.heading}>Edit Profile</Text>

      <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="Name" />
      <TextInput value={email} onChangeText={setEmail} style={styles.input} placeholder="Email" />

      <Text style={styles.skillHeading}>Teach Skills</Text>
      <View style={styles.skillBar}>
        {teachSkills.map((s, i) => (
          <TouchableOpacity key={i} onPress={() => removeSkill('teach', i)}>
            <Text>{s.skill} ({s.language}) ✕</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={() => { setSelectedType('teach'); setStep('category'); }}>
          <Text>+ Add</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.skillHeading}>Learn Skills</Text>
      <View style={styles.skillBar}>
        {learnSkills.map((s, i) => (
          <TouchableOpacity key={i} onPress={() => removeSkill('learn', i)}>
            <Text>{s.skill} ({s.language}) ✕</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={() => { setSelectedType('learn'); setStep('category'); }}>
          <Text>+ Add</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator />}

      {step === 'category' && (
        <FlatList
          data={Object.keys(categories)}
          numColumns={2}
          renderItem={({ item }) =>
            renderCard(item, () => {
              setSelectedCategory(item);
              setStep('skill');
            })
          }
        />
      )}

      {step === 'skill' && (
        <FlatList
          data={categories[selectedCategory]}
          numColumns={2}
          renderItem={({ item }) =>
            renderCard(item, () => {
              setSelectedSkill(item);
              setStep('language');
            })
          }
        />
      )}

      {step === 'language' && (
        <FlatList
          data={languages}
          numColumns={2}
          renderItem={({ item }) =>
            renderCard(item, () => addSkill(item))
          }
        />
      )}

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={{ color: 'white' }}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onCancel}>
        <Text style={{ textAlign: 'center', marginTop: 10 }}>Cancel</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  heading: { fontSize: 24, fontWeight: 'bold' },
  input: { backgroundColor: '#eee', padding: 10, marginTop: 10 },
  skillHeading: { marginTop: 10, fontWeight: 'bold' },
  skillBar: { marginTop: 5 },
  card: { flex: 1, backgroundColor: '#ddd', margin: 5, padding: 15 },
  cardTitle: { textAlign: 'center' },
  saveBtn: { backgroundColor: 'green', padding: 12, marginTop: 20 }
});