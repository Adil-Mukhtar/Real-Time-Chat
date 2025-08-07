import React, { useState } from 'react';
import { validateUsername } from '../../utils/messageUtils';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate username
    const validation = validateUsername(username);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onLogin(username.trim());
    } catch (err) {
      setError('Failed to connect to chat server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container animate-fade-in">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title gradient-text">💬 WebSocket Chat</h1>
          <p className="login-subtitle">Enter your username to join the conversation</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`login-input ${error ? 'error' : ''}`}
              disabled={loading}
              maxLength={20}
              autoFocus
            />
            {error && <span className="error-message">{error}</span>}
          </div>

          <button
            type="submit"
            className={`login-button ${loading ? 'loading' : ''}`}
            disabled={loading || !username.trim()}
          >
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                Connecting...
              </div>
            ) : (
              'Join Chat'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>🚀 Powered by Spring Boot & React</p>
        </div>
      </div>
    </div>
  );
};

export default Login;