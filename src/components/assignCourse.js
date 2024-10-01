import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import Header from './adminHeader';

export default function AssignCourse() {
  const [empID, setEmpID] = useState('');
  const [courseID, setCourseID] = useState('');
  const [employeeCourses, setEmployeeCourses] = useState([]); // State to store employee-course data
  const [error, setError] = useState(null);

  // Fetch distinct employees and courses from the employee_course table
  useEffect(() => {
    const fetchEmployeeCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/app/employee-course');
        setEmployeeCourses(response.data);
      } catch (error) {
        console.error('Error fetching employee course data:', error);
      }
    };

    fetchEmployeeCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/app/employee-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ empID, courseID }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const newAssignment = await response.json();
      setEmpID('');
      setCourseID('');
      alert('Course assigned successfully');
    } catch (error) {
      setError(`Error assigning course: ${error.message}`);
    }
  };

  // Extract distinct employees and courses from employeeCourses data
  const distinctEmployees = [...new Set(employeeCourses.map((course) => course.empID))];
  const distinctCourses = [...new Set(employeeCourses.map((course) => course.courseID))];

  return (
    <div>
        <Header/>
        <div className="form-container">
        <form className="admin-form" onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}
            <h3>Assign Course to Employee</h3>

            {/* Employee Dropdown */}
            <label className="admin-label" htmlFor="empID">
            Select Employee
            </label>
            <select
            id="empID"
            value={empID}
            onChange={(e) => setEmpID(e.target.value)}
            required
            >
            <option value="">-- Select Employee --</option>
            {distinctEmployees.map((emp) => (
                <option key={emp} value={emp}>
                {emp}
                </option>
            ))}
            </select>

            {/* Course Dropdown */}
            <label className="admin-label" htmlFor="courseID">
            Select Course
            </label>
            <select
            id="courseID"
            value={courseID}
            onChange={(e) => setCourseID(e.target.value)}
            required
            >
            <option value="">-- Select Course --</option>
            {distinctCourses.map((course) => (
                <option key={course} value={course}>
                {course}
                </option>
            ))}
            </select>

            <button className="submit" type="submit">
            Assign
            </button>
        </form>
        </div>
    </div>
  );
}
