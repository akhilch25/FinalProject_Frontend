import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../headers/adminHeader';
import '../../App.css';

export default function EmployeeAnalytics() {
  const [employeeCourses, setEmployeeCourses] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchEmployeeCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/app/employee-course');
        setEmployeeCourses(response.data);
      } catch (error) {
        console.error('Error fetching employee course data', error);
      }
    };

    const fetchCourses = async () => {
      try{
        const res = await axios.get('http://localhost:5000/app/course');
        setCourses(res.data);
      }
      catch(error){
        console.error('Error fetching course data',error);
      }
    };

    fetchCourses();
    fetchEmployeeCourses();
  }, []);

  return (
    <div>
      <Header />
      <div className='admindash'>
        <div className="emp-table">
          <h3>Employee - Courses assigned</h3>
          <div className='table-container'>
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
              {employeeCourses.sort((a, b) => a.empID.localeCompare(b.empID)).map((course) => (
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
        <div className="emp-table">
          <h3>Courses registered</h3>
          <div className='table-container'>
          <table>
            <thead>
              <tr>
                <th>Course ID</th>
                <th>Course Name</th>
                <th>Duration</th>
                <th>Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {courses.sort((a,b)=> a.courseID.localeCompare(b.courseID)).map((course) => (
                <tr key={`${course.courseID}`}>
                  <td>{course.courseID}</td>
                  <td>{course.name}</td>
                  <td>{course.duration}</td>
                  <td>{course.difficulty_level}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  );
}
