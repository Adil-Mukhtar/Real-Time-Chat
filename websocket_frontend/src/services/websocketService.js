import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.messageCallbacks = [];
    this.statusCallbacks = [];
  }

  connect(onConnected, onError) {
    // Create STOMP client with SockJS
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: {},
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    // Handle successful connection
    this.client.onConnect = (frame) => {
      console.log('Connected to WebSocket:', frame);
      this.connected = true;
      this.notifyStatusCallbacks(true);
      
      // Subscribe to public topic
      this.client.subscribe('/topic/public', (message) => {
        const chatMessage = JSON.parse(message.body);
        this.notifyMessageCallbacks(chatMessage);
      });

      if (onConnected) onConnected();
    };

    // Handle connection errors
    this.client.onStompError = (frame) => {
      console.error('STOMP error:', frame);
      this.connected = false;
      this.notifyStatusCallbacks(false);
      if (onError) onError(frame);
    };

    // Handle WebSocket errors
    this.client.onWebSocketError = (error) => {
      console.error('WebSocket error:', error);
      this.connected = false;
      this.notifyStatusCallbacks(false);
      if (onError) onError(error);
    };

    // Handle disconnection
    this.client.onDisconnect = () => {
      console.log('Disconnected from WebSocket');
      this.connected = false;
      this.notifyStatusCallbacks(false);
    };

    // Activate the client
    this.client.activate();
  }

  disconnect() {
    if (this.client && this.connected) {
      this.client.deactivate();
      this.connected = false;
      this.notifyStatusCallbacks(false);
    }
  }

  sendMessage(chatMessage) {
    if (this.client && this.connected) {
      this.client.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(chatMessage)
      });
    } else {
      console.error('WebSocket is not connected');
    }
  }

  addUser(username) {
    if (this.client && this.connected) {
      const message = {
        type: 'JOIN',
        sender: username,
        content: '',
        timestamp: Date.now()
      };
      
      this.client.publish({
        destination: '/app/chat.addUser',
        body: JSON.stringify(message)
      });
    }
  }

  removeUser(username) {
    if (this.client && this.connected) {
      const message = {
        type: 'LEAVE',
        sender: username,
        content: '',
        timestamp: Date.now()
      };
      
      this.client.publish({
        destination: '/app/chat.removeUser',
        body: JSON.stringify(message)
      });
    }
  }

  // Subscribe to message updates
  onMessage(callback) {
    this.messageCallbacks.push(callback);
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
    };
  }

  // Subscribe to connection status updates
  onStatusChange(callback) {
    this.statusCallbacks.push(callback);
    return () => {
      this.statusCallbacks = this.statusCallbacks.filter(cb => cb !== callback);
    };
  }

  // Notify all message callbacks
  notifyMessageCallbacks(message) {
    this.messageCallbacks.forEach(callback => callback(message));
  }

  // Notify all status callbacks
  notifyStatusCallbacks(connected) {
    this.statusCallbacks.forEach(callback => callback(connected));
  }

  isConnected() {
    return this.connected;
  }
}

// Export singleton instance
export default new WebSocketService();