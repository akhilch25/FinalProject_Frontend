import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../App.css';
import Header from '../headers/adminHeader';

export default function AssignCourse() {
  const [empID, setEmpID] = useState('');
  const [courseID, setCourseID] = useState('');
  const [employees, setEmployees] = useState([]); // State to store employee data
  const [courses, setCourses] = useState([]); // State to store course data
  const [error, setError] = useState(null);

  // Fetch distinct employees from the employee table
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:5000/app/employee'); // Fetch employee data
        setEmployees(response.data); // Assuming response contains a list of employees
      } catch (error) {
        console.error('Error fetching employee data:', error);
        setError('Error fetching employee data.');
      }
    };

    // Fetch distinct courses from the course table
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/app/course'); // Fetch course data
        setCourses(response.data); // Assuming response contains a list of courses
      } catch (error) {
        console.error('Error fetching course data:', error);
        setError('Error fetching course data.');
      }
    };

    fetchEmployees();
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try{
      const response = await fetch('http://localhost:5000/app/employee-course',{
          method: "POST",
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({empID, courseID})
      });
      
      if (!response.ok){
          throw new Error("Network response was not ok.");
      }

      const newCourse = await response.json();
      setEmpID("");
      setCourseID("");
      alert("Course assigned");
  }
  catch (error) {
      setError(`Error assigning course: ${error.message}`);
  }
};

  return (
    <div>
      <Header />
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
            {employees.sort((a, b) => a.empID.localeCompare(b.empID)).map((employee) => ( // Sort employees by name
              <option key={employee.empID} value={employee.empID}>
                {employee.empID} - {employee.name} {/* Show employee name */}
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
            {courses.sort((a,b) => a.courseID.localeCompare(b.courseID)).map((course) => (
              <option key={course.courseID} value={course.courseID}>
                {course.courseID} - {course.name} {/* Show course name */}
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
