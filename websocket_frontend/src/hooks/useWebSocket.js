import { useState, useEffect, useCallback } from 'react';
import websocketService from '../services/websocketService';

export const useWebSocket = () => {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState(new Set());

  // Connect to WebSocket
  const connect = useCallback((username) => {
    return new Promise((resolve, reject) => {
      websocketService.connect(
        () => {
          // Add user after connection
          websocketService.addUser(username);
          resolve();
        },
        (error) => {
          reject(error);
        }
      );
    });
  }, []);

  // Disconnect from WebSocket
  const disconnect = useCallback((username) => {
    if (username && websocketService.isConnected()) {
      websocketService.removeUser(username);
    }
    websocketService.disconnect();
  }, []);

  // Send a message
  const sendMessage = useCallback((content, sender) => {
    const message = {
      type: 'CHAT',
      content,
      sender,
      timestamp: Date.now()
    };
    websocketService.sendMessage(message);
  }, []);

  // Handle incoming messages
  useEffect(() => {
    const unsubscribeMessage = websocketService.onMessage((message) => {
      setMessages(prev => [...prev, message]);
      
      // Update users list based on JOIN/LEAVE messages
      if (message.type === 'JOIN') {
        setUsers(prev => new Set([...prev, message.sender]));
      } else if (message.type === 'LEAVE') {
        setUsers(prev => {
          const newUsers = new Set(prev);
          newUsers.delete(message.sender);
          return newUsers;
        });
      }
    });

    const unsubscribeStatus = websocketService.onStatusChange((isConnected) => {
      setConnected(isConnected);
      if (!isConnected) {
        setUsers(new Set());
      }
    });

    return () => {
      unsubscribeMessage();
      unsubscribeStatus();
    };
  }, []);

  return {
    connected,
    messages,
    users: Array.from(users),
    connect,
    disconnect,
    sendMessage
  };
};