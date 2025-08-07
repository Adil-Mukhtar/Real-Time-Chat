import React from 'react';
import MessageList from './MessageList/MessageList';
import MessageInput from './MessageInput/MessageInput';
import UserList from './UserList/UserList';
import './Chat.css';

const Chat = ({ currentUser, connected, messages, users, onSendMessage, onLogout }) => {
  const handleSendMessage = (content) => {
    onSendMessage(content, currentUser);
  };

  return (
    <div className="chat-container animate-fade-in">
      {/* Header */}
      <div className="chat-header">
        <div className="header-info">
          <h1 className="chat-title">💬 WebSocket Chat</h1>
          <div className="connection-status">
            <div className={`status-indicator ${connected ? 'connected' : 'disconnected'}`}></div>
            <span className="status-text">
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        
        <div className="header-actions">
          <div className="current-user">
            <span className="user-label">Welcome, </span>
            <span className="username">{currentUser}</span>
          </div>
          <button onClick={onLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-body">
        {/* Messages Area */}
        <div className="messages-section">
          <MessageList messages={messages} currentUser={currentUser} />
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={!connected}
            placeholder={connected ? "Type your message..." : "Connecting..."}
          />
        </div>

        {/* Users Sidebar */}
        <div className="users-section">
          <UserList users={users} currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
};

export default Chat;