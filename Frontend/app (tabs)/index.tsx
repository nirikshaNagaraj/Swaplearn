import React, { useState } from 'react';

import Home from '../screens/Home';
import About from '../screens/About';
import Discover from '../screens/Discover';
import Match from '../screens/Match';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Profile from '../screens/Profile';   // ✅ FIXED
import Messages from '../screens/Messages';

export default function Index() {
  const [screen, setScreen] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  /* LOGIN SUCCESS */
  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    setScreen('home');
  };

  /* LOGOUT */
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setScreen('home'); // back to homepage
  };

  /* LOGIN SCREEN */
  if (screen === 'login') {
    return (
      <Login
        switchToRegister={() => setScreen('register')}
        onLoginSuccess={handleLoginSuccess}
        goBack={() => setScreen('home')}
      />
    );
  }

  /* REGISTER SCREEN */
  if (screen === 'register') {
    return (
      <Register
        switchToLogin={() => setScreen('login')}
        goBack={() => setScreen('home')}
      />
    );
  }

  /* PROFILE SCREEN */
  if (screen === 'profile') {
    return (
     <Profile
  user={user}
  setUser={setUser}
  isLoggedIn={isLoggedIn}
  onLogout={handleLogout}
  goToHome={() => setScreen('home')}
  goToAbout={() => setScreen('about')}
  goToDiscover={() => setScreen('discover')}
  goToMatch={() => setScreen('match')}
  goToMessages={() => setScreen('messages')}
  goToProfile={() => setScreen('profile')}
/>
    );
  }

  /* MESSAGES SCREEN */
  if (screen === 'messages') {
    return (
      <Messages
        user={user}
        isLoggedIn={isLoggedIn}
        goToHome={() => setScreen('home')}
        goToAbout={() => setScreen('about')}
        goToDiscover={() => setScreen('discover')}
        goToMatch={() => setScreen('match')}
        goToProfile={() => setScreen('profile')}
        goToMessages={() => setScreen('messages')}
      />
    );
  }

  /* ABOUT SCREEN */
  if (screen === 'about') {
    return (
      <About
        user={user}
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

  /* DISCOVER SCREEN */
  if (screen === 'discover') {
    return (
      <Discover
        user={user}
        isLoggedIn={isLoggedIn}
        goToHome={() => setScreen('home')}
        goToAbout={() => setScreen('about')}
        goToDiscover={() => setScreen('discover')}
        goToMatch={() => setScreen('match')}
        goToLogin={() => setScreen('login')}
        goToRegister={() => setScreen('register')}
        goToProfile={() => setScreen('profile')}
        goToMessages={() => setScreen('messages')}
      />
    );
  }

  /* MATCH SCREEN */
  if (screen === 'match') {
    return (
      <Match
        user={user}
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

  /* HOME SCREEN */
  return (
    <Home
      user={user}
      isLoggedIn={isLoggedIn}
      goToLogin={() => setScreen('login')}
      goToRegister={() => setScreen('register')}
      goToHome={() => setScreen('home')}
      goToAbout={() => setScreen('about')}
      goToDiscover={() => setScreen('discover')}
      goToMatch={() => setScreen('match')}
      goToMessages={() => setScreen('messages')}
      goToProfile={() => setScreen('profile')}
    />
  );
}