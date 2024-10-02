import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
    localStorage.clear();
  };

  return (
    <header className="user-header">
      <h3 className="heading">Employee Dashboard</h3>
      <nav className="admin-nav">
        <ul>
          <li>
            <a className="logout" onClick={handleLogout}>Logout</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
