import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function Register({ switchToLogin }) {
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

  const categories = {
    Programming: ['JavaScript', 'Python', 'Java'],
    Music: ['Guitar', 'Piano', 'Singing'],
    Language: ['English', 'Spanish', 'Hindi']
  };

  const languages = ['English', 'Hindi', 'Kannada'];

  const resetFlow = () => {
    setStep('');
    setSelectedCategory('');
    setSelectedSkill('');
  };

  const addSkill = (lang) => {
    const newSkill = { skill: selectedSkill, language: lang };

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

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Register</Text>

      <View style={styles.form}>

        <TextInput placeholder="Username" style={styles.input} value={username} onChangeText={setUsername} />
        <TextInput placeholder="Full Name" style={styles.input} value={name} onChangeText={setName} />
        <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />
        <TextInput placeholder="Password" style={styles.input} secureTextEntry value={password} onChangeText={setPassword} />

        <Text style={styles.skillHeading}>Skills you Teach</Text>

        <View style={styles.skillBarTeach}>
          {teachSkills.map((item, index) => (
            <TouchableOpacity key={index} style={styles.chip} onPress={() => removeSkill('teach', index)}>
              <Text style={styles.chipText}>
                {item.skill} ({item.language}) ✕
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.addButtonGreen}
            onPress={() => {
              setSelectedType('teach');
              setStep('category');
            }}>
            <Text style={styles.addText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {selectedType === 'teach' && step === 'category' && (
          <>
            <Text style={styles.stepTitle}>Select Category</Text>
            {Object.keys(categories).map((cat) => (
              <TouchableOpacity key={cat} style={styles.option} onPress={() => {
                setSelectedCategory(cat);
                setStep('skill');
              }}>
                <Text>{cat}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}

        {selectedType === 'teach' && step === 'skill' && (
          <>
            <Text style={styles.stepTitle}>Select Skill</Text>
            {categories[selectedCategory].map((skill) => (
              <TouchableOpacity key={skill} style={styles.option} onPress={() => {
                setSelectedSkill(skill);
                setStep('language');
              }}>
                <Text>{skill}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}

        {selectedType === 'teach' && step === 'language' && (
          <>
            <Text style={styles.stepTitle}>Select Preferred Language</Text>
            {languages.map((lang) => (
              <TouchableOpacity key={lang} style={styles.option} onPress={() => addSkill(lang)}>
                <Text>{lang}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}

        <Text style={styles.skillHeading}>Skills you Want to Learn</Text>

        <View style={styles.skillBarLearn}>
          {learnSkills.map((item, index) => (
            <TouchableOpacity key={index} style={styles.chip} onPress={() => removeSkill('learn', index)}>
              <Text style={styles.chipText}>
                {item.skill} ({item.language}) ✕
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.addButtonGreen}
            onPress={() => {
              setSelectedType('learn');
              setStep('category');
            }}>
            <Text style={styles.addText}>+ Add</Text>
          </TouchableOpacity>
        </View>

    
        {selectedType === 'learn' && step === 'category' && (
          <>
            <Text style={styles.stepTitle}>Select Category</Text>
            {Object.keys(categories).map((cat) => (
              <TouchableOpacity key={cat} style={styles.option} onPress={() => {
                setSelectedCategory(cat);
                setStep('skill');
              }}>
                <Text>{cat}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}

        {selectedType === 'learn' && step === 'skill' && (
          <>
            <Text style={styles.stepTitle}>Select Skill</Text>
            {categories[selectedCategory].map((skill) => (
              <TouchableOpacity key={skill} style={styles.option} onPress={() => {
                setSelectedSkill(skill);
                setStep('language');
              }}>
                <Text>{skill}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}

        {selectedType === 'learn' && step === 'language' && (
          <>
            <Text style={styles.stepTitle}>Select Preferred Language</Text>
            {languages.map((lang) => (
              <TouchableOpacity key={lang} style={styles.option} onPress={() => addSkill(lang)}>
                <Text>{lang}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}

        <TouchableOpacity style={styles.button}>
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
    backgroundColor: '#f0f4f0',
    justifyContent: 'center',
    alignItems: 'center',
    

  },

  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  form: {
    width: '55%',
    backgroundColor: 'white',
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

  stepTitle: {
    marginTop: 10,
    fontWeight: 'bold',
  },

  skillBarTeach: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#e6f4ea',
    padding: 8,
    borderRadius: 12,
    marginVertical: 5,
  },

  skillBarLearn: {
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

  addButtonGreen: {
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
    fontSize: 22,
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
});