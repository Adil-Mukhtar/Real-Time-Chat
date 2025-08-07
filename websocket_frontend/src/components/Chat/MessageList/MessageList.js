import React, { useEffect, useRef } from 'react';
import { formatTime, getUserColor, getUserInitials } from '../../../utils/messageUtils';
import './MessageList.css';

const MessageList = ({ messages, currentUser }) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const renderMessage = (message, index) => {
    const isCurrentUser = message.sender === currentUser;
    const isSystemMessage = message.type === 'JOIN' || message.type === 'LEAVE';
    const userColor = getUserColor(message.sender);
    const userInitials = getUserInitials(message.sender);

    if (isSystemMessage) {
      return (
        <div key={index} className="message system-message animate-slide-up">
          <div className="system-content">
            <span className="system-icon">
              {message.type === 'JOIN' ? '👋' : '👋'}
            </span>
            <span className="system-text">{message.content}</span>
          </div>
          <div className="message-time">{formatTime(message.timestamp)}</div>
        </div>
      );
    }

    return (
      <div key={index} className={`message chat-message ${isCurrentUser ? 'own-message' : 'other-message'} animate-slide-up`}>
        <div className="message-container">
          {!isCurrentUser && (
            <div 
              className="user-avatar" 
              style={{ backgroundColor: userColor }}
              title={message.sender}
            >
              {userInitials}
            </div>
          )}
          
          <div className="message-content">
            {!isCurrentUser && <div className="message-sender">{message.sender}</div>}
            <div className="message-bubble">
              <div className="message-text">{message.content}</div>
              <div className="message-time">{formatTime(message.timestamp)}</div>
            </div>
          </div>

          {isCurrentUser && (
            <div 
              className="user-avatar own-avatar" 
              style={{ backgroundColor: userColor }}
              title="You"
            >
              {getUserInitials(currentUser)}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="message-list">
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <h3>Welcome to the chat!</h3>
            <p>Start the conversation by sending your first message.</p>
          </div>
        ) : (
          messages.map((message, index) => renderMessage(message, index))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;