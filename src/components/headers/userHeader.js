import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
    localStorage.clear();
    toast.success("Logged out Successfully");
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
