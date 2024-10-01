import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
    localStorage.clear();
  };

  return (
    <header className="admin-header">
      <h3 className="heading">Admin Dashboard</h3>
      <nav className="admin-nav">
        <ul>
          <li>
            <Link to="/add-course">Add Course</Link>
          </li>
          <li>
            <Link to="/assign-course">Assign Course</Link>
          </li>
          <li>
            <Link to="/employee-courses">Employee Courses</Link>
          </li>
          <li>
            <a className="logout" onClick={handleLogout}>Logout</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
