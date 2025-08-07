import React, { useState, useEffect } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import Login from './components/Login/Login';
import Chat from './components/Chat/Chat';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { connected, messages, users, connect, disconnect, sendMessage } = useWebSocket();

  // Handle user login
  const handleLogin = async (username) => {
    try {
      await connect(username);
      setCurrentUser(username);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Failed to connect:', error);
      throw error;
    }
  };

  // Handle user logout
  const handleLogout = () => {
    disconnect(currentUser);
    setCurrentUser('');
    setIsLoggedIn(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentUser) {
        disconnect(currentUser);
      }
    };
  }, [currentUser, disconnect]);

  return (
    <div className="app">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Chat
          currentUser={currentUser}
          connected={connected}
          messages={messages}
          users={users}
          onSendMessage={sendMessage}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;