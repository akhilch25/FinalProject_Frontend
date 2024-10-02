import React from 'react';
import './App.css';
import Login from './components/auth/login';
import Register from './components/auth/register';
import AddCourse from './components/admin/addCourse';
import AssignCourse from './components/admin/assignCourse';
import EmployeeAnalytics from './components/admin/employeeAnalytics';
import UserDashboard from './components/employee/userDashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/userdash" element={<UserDashboard/>}/>
        {/* <Route path="/admindash" element={<AdminDashboard />} /> */}
        <Route path="/add-course" element={<AddCourse />} />
        <Route path="/assign-course" element={<AssignCourse />} />
        <Route path="/employee-courses" element={<EmployeeAnalytics />} />
      </Routes>
    </Router>
  );
}

export default App;
