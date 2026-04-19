import React, { useState } from 'react';

import Home from '../screens/Home';
import About from '../screens/About';
import Discover from '../screens/Discover';
import Match from '../screens/Match';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Profile from '../screens/Profile';
import Messages from '../screens/Messages';
import Availability from '../screens/Availability';
import Requests from '../screens/Requests';

export default function Index() {
  const [screen, setScreen] = useState('home');
  const [user, setUser] = useState(null);

  const isLoggedIn = user !== null;

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setScreen('profile');   // always go profile after login
  };

  const handleLogout = () => {
    setUser(null);
    setScreen('home');
  };

  const commonProps = {
    user,
    isLoggedIn,
    goToLogin: () => setScreen('login'),
    goToRegister: () => setScreen('register'),
    goToHome: () => setScreen('home'),
    goToAbout: () => setScreen('about'),
    goToDiscover: () => setScreen('discover'),
    goToMatch: () => setScreen('match'),
    goToProfile: () => setScreen('profile'),
    goToMessages: () => setScreen('messages'),
  };

  if (screen === 'login') {
    return (
      <Login
        switchToRegister={() => setScreen('register')}
        onLoginSuccess={handleLoginSuccess}
        goBack={() => setScreen('home')}
      />
    );
  }

  if (screen === 'register') {
    return (
      <Register
        switchToLogin={() => setScreen('login')}
        goBack={() => setScreen('home')}
      />
    );
  }

  if (screen === 'profile') {
    return (
      <Profile
        {...commonProps}
        setUser={setUser}
        onLogout={handleLogout}
        goToAvailability={() => setScreen('availability')}
        goToRequests={() => setScreen('requests')} 
      />
    );
  }

  if (screen === 'messages') {
    return <Messages {...commonProps} />;
  }

  if (screen === 'about') return <About {...commonProps} />;
  if (screen === 'discover') return <Discover {...commonProps} />;
  if (screen === 'match') return <Match {...commonProps} />;

  if (screen === 'availability') {
    return (
      <Availability
        user={user}
        setUser={setUser}
        goBack={() => setScreen('profile')}
      />
    );
  }
  if (screen === 'requests') {
  return (
    <Requests
      user={user}
      goBack={() => setScreen('profile')}
    />
  );
}

  return <Home {...commonProps} />;
}