import React, { useState } from 'react';
import Home from '../screens/Home';
import About from '../screens/About';
import Discover from '../screens/Discover';
import Match from '../screens/Match';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Profile from '../screens/Profile';


export default function Index() {
  const [screen, setScreen] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setScreen('home');
  };
if (screen === 'login') {
  return (
    <Login
      switchToRegister={() => setScreen('register')}
      onLoginSuccess={handleLoginSuccess}
      goBack={() => setScreen('discover')} // 🔥 ADD THIS
    />
  );
}

  if (screen === 'register') {
    return (
      <Register 
      switchToLogin={() => setScreen('login')}
      goBack={() => setScreen('home')}  />
    );
  }

 if (screen === 'about') {
  return (
    <About
      isLoggedIn={isLoggedIn}
      goToHome={() => setScreen('home')}
      goToAbout={() => setScreen('about')}
      goToDiscover={() => setScreen('discover')}
      goToMatch={() => setScreen('match')}
      goToLogin={() => setScreen('login')}
      goToRegister={() => setScreen('register')}
      goToProfile={() => setScreen('profile')}

    />
  );
}

if (screen === 'discover') {
  return (
    <Discover
      isLoggedIn={isLoggedIn}
      goToHome={() => setScreen('home')}
      goToAbout={() => setScreen('about')}
      goToDiscover={() => setScreen('discover')}
      goToMatch={() => setScreen('match')}
      goToLogin={() => setScreen('login')}
      goToRegister={() => setScreen('register')}
      goToProfile={() => setScreen('profile')}

    />
  );
}

if (screen === 'match') {
  return (
    <Match
      isLoggedIn={isLoggedIn}
      goToHome={() => setScreen('home')}
      goToAbout={() => setScreen('about')}
      goToDiscover={() => setScreen('discover')}
      goToMatch={() => setScreen('match')}
      goToLogin={() => setScreen('login')}
      goToRegister={() => setScreen('register')}
      goToProfile={() => setScreen('profile')}

    />
  );
}
if (screen === 'profile') {
  return (
    <Profile
      isLoggedIn={isLoggedIn}
      goToHome={() => setScreen('home')}
      goToAbout={() => setScreen('about')}
      goToDiscover={() => setScreen('discover')}
      goToMatch={() => setScreen('match')}
      goToLogin={() => setScreen('login')}
      goToRegister={() => setScreen('register')}
      goToProfile={() => setScreen('profile')}

    />
  );
}
  

return (
  <Home
    isLoggedIn={isLoggedIn}
    goToLogin={() => setScreen('login')}
    goToRegister={() => setScreen('register')}
    goToHome={() => setScreen('home')}
    goToAbout={() => setScreen('about')}
    goToDiscover={() => setScreen('discover')}
    goToMatch={() => setScreen('match')}
    goToProfile={() => setScreen('profile')}

  />
);
}