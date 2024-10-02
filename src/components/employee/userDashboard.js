import React, { useState, useEffect } from 'react';
import Header from '../headers/userHeader';
import '../../App.css';
import GaugeChart from './guageChart';
import axios from 'axios';

export default function UserDashboard() {
  const [performanceRate, setPerformanceRate] = useState(null);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeID, setEmployeeID] = useState("");
  const [courses, setCourses] = useState([]); // State for employee courses

  useEffect(() => {
    const fetchPerformanceRateAndCourses = async () => {
      try {
        // Retrieve empID from localStorage
        const empID = localStorage.getItem('empID');

        if (empID) {
          // Fetch performance data for the employee
          const performanceResponse = await axios.get(`http://localhost:5000/app/employee/${empID}`);
          const employeeData = performanceResponse.data;
          setPerformanceRate(employeeData.performance_rate);
          setEmployeeName(employeeData.name);
          setEmployeeID(employeeData.empID);

          // Fetch courses for the employee
          const coursesResponse = await axios.get(`http://localhost:5000/app/employee-course/${empID}`);
          setCourses(coursesResponse.data); // Expecting an array of EmployeeCourse data
        } else {
          console.error('empID not found in localStorage');
        }
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchPerformanceRateAndCourses();
  }, []);

  return (
    <div>
      <Header />
      <div className='userdash'>
      <div className="course-table">
        <h3>Hi <span style={{fontFamily:'cursive',fontWeight:'bolder'}}>{employeeID}--{employeeName}</span>, below are the courses assigned</h3>
        <table>
          <thead>
            <tr>
              <th>Course ID</th>
              <th>Course Name</th>
              <th>Duration</th>
              <th>Difficulty</th>
              <th>Completion Rate</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr>
                <td>{course.courseID}</td>
                <td>{course.course.name}</td>
                <td>{course.course.duration}</td>
                <td>{course.course.difficulty_level}</td>
                <td>{course.completion_rate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        <GaugeChart performanceRate={performanceRate} />
      </div>
    </div>
  );
}
