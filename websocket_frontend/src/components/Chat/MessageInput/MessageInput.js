import React, { useState, useRef } from 'react';
import { validateMessage } from '../../../utils/messageUtils';
import './MessageInput.css';

const MessageInput = ({ onSendMessage, disabled, placeholder = "Type your message..." }) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (disabled) return;

    const validation = validateMessage(message);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    onSendMessage(message.trim());
    setMessage('');
    setError('');
    inputRef.current?.focus();
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    if (error) setError(''); // Clear error when user starts typing
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="message-input-container">
      {error && <div className="input-error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="message-input-form">
        <div className="input-wrapper">
          <textarea
            ref={inputRef}
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className={`message-textarea ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}
            rows="1"
            maxLength={1000}
          />
          
          <button
            type="submit"
            disabled={disabled || !message.trim()}
            className="send-button"
            title="Send message (Enter)"
          >
            <svg className="send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        
        <div className="input-footer">
          <span className="char-count">
            {message.length}/1000
          </span>
          <span className="input-hint">
            Press Enter to send, Shift+Enter for new line
          </span>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;