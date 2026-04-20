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
import Chat from '../screens/ChatScreen';   // ✅ NEW SCREEN

export default function Index() {

  const [screen, setScreen] = useState('home');
  const [user, setUser] = useState(null);
  const [chatUser, setChatUser] = useState<any>(null);// ✅ IMPORTANT

  const isLoggedIn = !!user;

  // ================= NAV =================
  const nav = {
    user,
    isLoggedIn,
    setUser,

    goToLogin: () => setScreen('login'),
    goToRegister: () => setScreen('register'),
    goToHome: () => setScreen('home'),
    goToAbout: () => setScreen('about'),
    goToDiscover: () => setScreen('discover'),
    goToMatch: () => setScreen('match'),
    goToProfile: () => setScreen('profile'),
    goToMessages: () => setScreen('messages'),
    goToRequests: () => setScreen('requests'),
  };

  // ================= LOGIN =================
  const handleLoginSuccess = (data) => {
    setUser(data);
    setScreen('profile');
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    setUser(null);
    setScreen('home');
  };

  // ================= LOGIN =================
  if (screen === 'login') {
    return (
      <Login
        switchToRegister={() => setScreen('register')}
        onLoginSuccess={handleLoginSuccess}
        goBack={() => setScreen('home')}
      />
    );
  }

  // ================= REGISTER =================
  if (screen === 'register') {
    return (
      <Register
        switchToLogin={() => setScreen('login')}
        goBack={() => setScreen('home')}
      />
    );
  }

  // ================= CHAT SCREEN (NEW) =================
if (screen === 'chat' && chatUser) {
  return (
<Chat
  route={{
    params: {
      room_id: chatUser?.room_id,
      name: chatUser?.name || chatUser?.username,
      user: user,
    },
  }}
  goBack={() => setScreen('messages')}
/>
  );
}

  // ================= PROFILE =================
  if (screen === 'profile') {
    return (
      <Profile
        {...nav}
        onLogout={handleLogout}
        goToAvailability={() => setScreen('availability')}
        goToRequests={() => setScreen('requests')}
      />
    );
  }

  // ================= REQUESTS =================
  if (screen === 'requests') {
    return <Requests {...nav} />;
  }

  // ================= MESSAGES =================
if (screen === 'messages') {
  return (
    <Messages
      {...nav}
    openChat={(room_id, otherUser) => {
  setChatUser({
    ...otherUser,
    room_id: room_id,
  });

  setScreen('chat');
}}
    />
  );
}

  // ================= OTHER SCREENS =================
  if (screen === 'about') return <About {...nav} />;
  if (screen === 'discover') return <Discover {...nav} />;
  if (screen === 'match') return <Match {...nav} />;

  if (screen === 'availability') {
    return (
      <Availability
        user={user}
        setUser={setUser}
        goBack={() => setScreen('profile')}
      />
    );
  }

  // ================= HOME =================
  return <Home {...nav} />;
}