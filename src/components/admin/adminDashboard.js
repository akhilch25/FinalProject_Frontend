import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../headers/adminHeader';
import '../../App.css';

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <Header />
      <Outlet />
    </div>
  );
}
