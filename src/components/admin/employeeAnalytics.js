import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../headers/adminHeader';
import '../../App.css';

export default function EmployeeAnalytics() {
  const [employeeCourses, setEmployeeCourses] = useState([]);

  useEffect(() => {
    const fetchEmployeeCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/app/employee-course');
        setEmployeeCourses(response.data);
      } catch (error) {
        console.error('Error fetching employee course data', error);
      }
    };

    fetchEmployeeCourses();
  }, []);

  return (
    <div>
      <Header />
      <div className='admindash'>
        <div className="emp-table">
          <h3>Employee Courses</h3>
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Course ID</th>
                <th>Course Name</th>
                <th>Completion Rate</th>
              </tr>
            </thead>
            <tbody>
              {employeeCourses.map((course) => (
                <tr key={`${course.empID}-${course.courseID}`}>
                  <td>{course.empID}</td>
                  <td>{course.employee.name}</td>
                  <td>{course.courseID}</td>
                  <td>{course.course.name}</td>
                  <td>{course.completion_rate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
