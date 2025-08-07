import React from 'react';
import { getUserColor, getUserInitials } from '../../../utils/messageUtils';
import './UserList.css';

const UserList = ({ users, currentUser }) => {
  const sortedUsers = [...users].sort((a, b) => {
    // Current user first, then alphabetical
    if (a === currentUser) return -1;
    if (b === currentUser) return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="user-list">
      <div className="user-list-header">
        <h3 className="user-list-title">
          <span className="users-icon">👥</span>
          Online Users ({users.length})
        </h3>
      </div>

      <div className="user-list-content">
        {users.length === 0 ? (
          <div className="empty-users">
            <div className="empty-users-icon">😴</div>
            <p>No users online</p>
          </div>
        ) : (
          <div className="users-container">
            {sortedUsers.map((user, index) => {
              const isCurrentUser = user === currentUser;
              const userColor = getUserColor(user);
              const userInitials = getUserInitials(user);

              return (
                <div key={index} className={`user-item ${isCurrentUser ? 'current-user' : ''} animate-slide-up`}>
                  <div 
                    className="user-item-avatar" 
                    style={{ backgroundColor: userColor }}
                  >
                    {userInitials}
                  </div>
                  
                  <div className="user-item-info">
                    <div className="user-item-name">
                      {user}
                      {isCurrentUser && <span className="you-label">(You)</span>}
                    </div>
                    <div className="user-item-status">
                      <div className="status-dot online"></div>
                      Online
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;