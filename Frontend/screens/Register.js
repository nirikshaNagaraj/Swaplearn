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

export default function Register({ switchToLogin, goBack }) {

  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [teachSkills, setTeachSkills] = useState([]);
  const [learnSkills, setLearnSkills] = useState([]);

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
    try {
      const res = await fetch(`${API}/metadata/`);
      const data = await res.json();

      let formatted = {};
      data.categories.forEach(c => {
        formatted[c.name] = c.skills;
      });

      setCategories(formatted);
      setLanguages(data.languages);
      setLoading(false);

    } catch (err) {
      console.log(err);
      alert("Failed to load skills ❌");
      setLoading(false);
    }
  };

  const resetFlow = () => {
    setStep('');
    setSelectedCategory('');
    setSelectedSkill('');
  };

  const addSkill = (lang) => {
    if (!selectedSkill) return;

    const newSkill = { skill: selectedSkill, language: lang };

    // ❌ prevent duplicate across teach & learn
    const existsInOther =
      selectedType === 'teach'
        ? learnSkills.some(s => s.skill === selectedSkill)
        : teachSkills.some(s => s.skill === selectedSkill);

    if (existsInOther) {
      alert("Skill already selected in other section ❌");
      return;
    }

    if (selectedType === 'teach') {
      setTeachSkills([...teachSkills, newSkill]);
    } else {
      setLearnSkills([...learnSkills, newSkill]);
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

  const handleRegister = async () => {
    if (!username || !password) {
      alert("Username & Password required");
      return;
    }

    try {
      const res = await fetch(`${API}/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          name,
          email,
          teachSkills,
          learnSkills,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registered successfully ✅");
        switchToLogin();
      } else {
        alert(data.error || "Registration failed ❌");
      }

    } catch (err) {
      console.log(err);
      alert("Server error ❌");
    }
  };

  const renderCard = (item, onPress) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.cardIcon}>  </Text>
      <Text style={styles.cardTitle}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.closeBtn} onPress={goBack}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Register</Text>

      <View style={styles.form}>

        <TextInput placeholder="Username" style={styles.input} value={username} onChangeText={setUsername} />
        <TextInput placeholder="Full Name" style={styles.input} value={name} onChangeText={setName} />
        <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />
        <TextInput placeholder="Password" style={styles.input} secureTextEntry value={password} onChangeText={setPassword} />

        {/* TEACH */}
        <Text style={styles.skillHeading}>Skills you Teach</Text>
        <View style={styles.skillBar}>
          {teachSkills.map((item, index) => (
            <TouchableOpacity key={index} style={styles.chip} onPress={() => removeSkill('teach', index)}>
              <Text style={styles.chipText}>{item.skill} ({item.language}) ✕</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              if (loading) return alert("Loading...");
              setSelectedType('teach');
              setStep('category');
            }}>
            <Text style={styles.addText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {/* LEARN */}
        <Text style={styles.skillHeading}>Skills you Want to Learn</Text>
        <View style={styles.skillBar}>
          {learnSkills.map((item, index) => (
            <TouchableOpacity key={index} style={styles.chip} onPress={() => removeSkill('learn', index)}>
              <Text style={styles.chipText}>{item.skill} ({item.language}) ✕</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              if (loading) return alert("Loading...");
              setSelectedType('learn');
              setStep('category');
            }}>
            <Text style={styles.addText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {loading && <ActivityIndicator size="large" color="#4CAF50" />}

        {/* CATEGORY GRID */}
        {step === 'category' && !loading && (
          <>
            <Text style={styles.stepTitle}>Select Category</Text>
            <FlatList
              data={Object.keys(categories)}
              numColumns={2}
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

        {/* SKILL GRID */}
        {step === 'skill' && (
          <>
            <Text style={styles.stepTitle}>Select Skill</Text>
            <FlatList
              data={categories[selectedCategory] || []}
              numColumns={2}
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

        {/* LANGUAGE GRID */}
        {step === 'language' && (
          <>
            <Text style={styles.stepTitle}>Select Language</Text>
            <FlatList
              data={languages}
              numColumns={2}
              keyExtractor={(item) => item}
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
            Already a user? <Text style={styles.loginLink}>Login</Text>
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f0', // ✅ LIGHT BACK (original)
    justifyContent: 'center',
    alignItems: 'center',
  },

  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#151a3c', // ✅ dark blue text
  },

  form: {
    width: '55%',
    backgroundColor: 'white', // ✅ white card
    padding: 20,
    borderRadius: 15,
    elevation: 5,
  },

  input: {
    backgroundColor: '#ccd2dc',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },

  skillHeading: {
    fontWeight: 'bold',
    marginTop: 10,
  },

  skillBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#e6f4ea',
    padding: 8,
    borderRadius: 12,
    marginVertical: 5,
  },

  chip: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    margin: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  chipText: {
    fontSize: 12,
  },

  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    margin: 4,
  },

  addText: {
    color: 'white',
    fontWeight: 'bold',
  },

  stepTitle: {
    marginTop: 10,
    fontWeight: 'bold',
  },

  option: {
    backgroundColor: '#eee',
    padding: 10,
    marginTop: 5,
    borderRadius: 8,
  },

  button: {
    backgroundColor: '#151a3c',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },

  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },

  loginText: {
    marginTop: 20,
    textAlign: 'center',
    color: 'gray',
  },

  loginLink: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },

  closeBtn: {
    position: 'absolute',
    top: 40,
    right: 30,
  },

  closeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});