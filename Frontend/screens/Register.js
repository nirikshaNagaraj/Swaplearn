import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { API } from '../../api';

export default function Register({ switchToLogin, goBack }) {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [teachSkills, setTeachSkills] = useState([]);
  const [learnSkills, setLearnSkills] = useState([]);

  const [categories, setCategories] = useState([]);
  const [languages, setLanguages] = useState([]);

  const [loading, setLoading] = useState(true);

  const [mode, setMode] = useState(''); // teach / learn
  const [step, setStep] = useState(''); // category / skill / language
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState('');

  useEffect(() => {
    loadMetadata();
  }, []);

  const loadMetadata = async () => {
    try {
      const res = await fetch(`${API}/metadata/`);
      const data = await res.json();

      setCategories(data.categories || []);
      setLanguages(data.languages || []);
      setLoading(false);
    } catch (error) {
      console.log(error);
      alert('Failed to load skills from database');
      setLoading(false);
    }
  };

  const startAddSkill = (type) => {
    setMode(type);
    setStep('category');
    setSelectedCategory(null);
    setSelectedSkill('');
  };

  const addSkill = (language) => {
    const newSkill = {
      skill: selectedSkill,
      language: language,
    };

    if (mode === 'teach') {
      setTeachSkills([...teachSkills, newSkill]);
    } else {
      setLearnSkills([...learnSkills, newSkill]);
    }

    setStep('');
    setSelectedCategory(null);
    setSelectedSkill('');
  };

  const removeSkill = (type, index) => {
    if (type === 'teach') {
      setTeachSkills(teachSkills.filter((_, i) => i !== index));
    } else {
      setLearnSkills(learnSkills.filter((_, i) => i !== index));
    }
  };

  const handleRegister = async () => {
    if (!username || !password) {
      alert('Username and password required');
      return;
    }

    try {
      const res = await fetch(`${API}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          name,
          email,
          password,
          teachSkills,
          learnSkills,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Registered Successfully');
        switchToLogin();
      } else {
        alert(data.error || 'Registration Failed');
      }
    } catch (error) {
      console.log(error);
      alert('Server Error');
    }
  };

  const renderCard = (text, onPress) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.cardText}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.closeBtn} onPress={goBack}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Register</Text>

      <View style={styles.form}>
        <TextInput
          placeholder="Username"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          placeholder="Full Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* TEACH */}
        <Text style={styles.label}>Skills You Teach</Text>

        <View style={styles.skillBox}>
          {teachSkills.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.skillChip}
              onPress={() => removeSkill('teach', index)}
            >
              <Text style={styles.skillText}>
                {item.skill} ({item.language}) ✕
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => startAddSkill('teach')}
          >
            <Text style={styles.addText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {/* LEARN */}
        <Text style={styles.label}>Skills You Want To Learn</Text>

        <View style={styles.skillBox}>
          {learnSkills.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.skillChip}
              onPress={() => removeSkill('learn', index)}
            >
              <Text style={styles.skillText}>
                {item.skill} ({item.language}) ✕
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => startAddSkill('learn')}
          >
            <Text style={styles.addText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {/* LOADING */}
        {loading && <ActivityIndicator size="large" color="#4CAF50" />}

        {/* CATEGORY */}
        {step === 'category' && (
          <>
            <Text style={styles.stepTitle}>Select Category</Text>

            <FlatList
              data={categories}
              numColumns={2}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) =>
                renderCard(item.name, () => {
                  setSelectedCategory(item);
                  setStep('skill');
                })
              }
            />
          </>
        )}

        {/* SKILL */}
        {step === 'skill' && selectedCategory && (
          <>
            <Text style={styles.stepTitle}>Select Skill</Text>

            <FlatList
              data={selectedCategory.skills}
              numColumns={2}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) =>
                renderCard(item, () => {
                  setSelectedSkill(item);
                  setStep('language');
                })
              }
            />
          </>
        )}

        {/* LANGUAGE */}
        {step === 'language' && (
          <>
            <Text style={styles.stepTitle}>Select Language</Text>

            <FlatList
              data={languages}
              numColumns={2}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) =>
                renderCard(item, () => addSkill(item))
              }
            />
          </>
        )}

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={switchToLogin}>
          <Text style={styles.loginText}>
            Already Registered?{' '}
            <Text style={styles.loginLink}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    alignItems: 'center',
    backgroundColor: '#f0f4f0',
  },

  closeBtn: {
    position: 'absolute',
    top: 30,
    right: 25,
    zIndex: 10,
  },

  closeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  heading: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#151a3c',
    marginBottom: 20,
  },

  form: {
    width: '60%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    elevation: 5,
  },

  input: {
    backgroundColor: '#dde3ea',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },

  label: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },

  skillBox: {
    backgroundColor: '#e8f5e9',
    padding: 8,
    borderRadius: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },

  skillChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    margin: 4,
  },

  skillText: {
    fontSize: 12,
  },

  addBtn: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    margin: 4,
  },

  addText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  stepTitle: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 8,
  },

  card: {
    flex: 1,
    backgroundColor: '#eef2ff',
    margin: 5,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  cardText: {
    fontWeight: 'bold',
    color: '#151a3c',
  },

  button: {
    backgroundColor: '#151a3c',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  loginText: {
    marginTop: 15,
    textAlign: 'center',
    color: '#555',
  },

  loginLink: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});