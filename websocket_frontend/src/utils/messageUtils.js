// Format timestamp to readable time
export const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Format timestamp to readable date and time
export const formatDateTime = (timestamp) => {
  const date = new Date(timestamp);
  const today = new Date();
  
  if (date.toDateString() === today.toDateString()) {
    return `Today at ${formatTime(timestamp)}`;
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${formatTime(timestamp)}`;
  }
  
  return date.toLocaleString();
};

// Generate random colors for user avatars
export const getUserColor = (username) => {
  const colors = [
    '#667eea', '#764ba2', '#f093fb', '#f5576c',
    '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
    '#ffecd2', '#fcb69f', '#a8edea', '#fed6e3',
    '#ff9a9e', '#fecfef', '#ffeaa7', '#fab1a0'
  ];
  
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

// Get user initials for avatar
export const getUserInitials = (username) => {
  if (!username) return '';
  const names = username.split(' ');
  if (names.length >= 2) {
    return (names[0][0] + names[1][0]).toUpperCase();
  }
  return username.substring(0, 2).toUpperCase();
};

// Validate message content
export const validateMessage = (content) => {
  if (!content || content.trim().length === 0) {
    return { valid: false, error: 'Message cannot be empty' };
  }
  
  if (content.length > 1000) {
    return { valid: false, error: 'Message is too long (max 1000 characters)' };
  }
  
  return { valid: true };
};

// Validate username
export const validateUsername = (username) => {
  if (!username || username.trim().length === 0) {
    return { valid: false, error: 'Username cannot be empty' };
  }
  
  if (username.length < 2) {
    return { valid: false, error: 'Username must be at least 2 characters' };
  }
  
  if (username.length > 20) {
    return { valid: false, error: 'Username must be less than 20 characters' };
  }
  
  if (!/^[a-zA-Z0-9_\s]+$/.test(username)) {
    return { valid: false, error: 'Username can only contain letters, numbers, underscores and spaces' };
  }
  
  return { valid: true };
};