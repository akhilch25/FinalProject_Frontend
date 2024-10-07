import React from 'react';
import './App.css';
import Login from './components/auth/login';
import Register from './components/auth/register';
import AddCourse from './components/admin/addCourse';
import AssignCourse from './components/admin/assignCourse';
import EmployeeAnalytics from './components/admin/adminHome';
import Analytics from './components/admin/analytics';
import UserDashboard from './components/employee/userDashboard';
import AddQuiz from './components/admin/addQuiz';
import PrivateRoute from './components/privateRoute'; // Import the PrivateRoute component
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protect the user dashboard and admin routes */}
        <Route path="/userdash" element={<PrivateRoute element={<UserDashboard />} />} />
        <Route path="/employee-courses" element={<PrivateRoute element={<EmployeeAnalytics />} />} />
        <Route path="/add-course" element={<PrivateRoute element={<AddCourse />} />} />
        <Route path="/assign-course" element={<PrivateRoute element={<AssignCourse />} />} />
        <Route path="/analytics" element={<PrivateRoute element={<Analytics />} />} />
        <Route path="/add-quiz" element={<PrivateRoute element={<AddQuiz/>}/>}/>
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
