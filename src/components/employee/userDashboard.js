import React, { useState, useEffect } from 'react';
import Header from '../headers/userHeader';
import '../../App.css';
import GaugeChart from '../charts/guageChart';
import axios from 'axios';
import Modal from './editModel';

export default function UserDashboard() {
  const [performanceRate, setPerformanceRate] = useState(null);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeID, setEmployeeID] = useState("");
  const [courses, setCourses] = useState([]); // State for employee courses
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newCompletionRate, setNewCompletionRate] = useState(''); // State for new completion rate

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
      setLoading(false);
    };

    fetchPerformanceRateAndCourses();
  }, []);

  const handleEmployeeClick = (course) => {
    setSelectedCourse(course);
    setNewCompletionRate(course.completion_rate); // Pre-fill with current completion rate
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  // Function to update the completion rate
  const handleCompletionRateUpdate = async () => {
    try {
      if (selectedCourse) {
        // Update the completion rate in the backend
        await axios.put(`http://localhost:5000/app/employee-course/${selectedCourse.empID}/${selectedCourse.courseID}`, {
          completion_rate: Number(newCompletionRate)
        });
        window.location.reload();
        // After successful update, refresh the courses
        const updatedCoursesResponse = await axios.get(`http://localhost:5000/app/employee-course/${employeeID}`);
        setCourses(updatedCoursesResponse.data); // Update the courses in the frontend
        closeModal(); // Close the modal after successful update
      }
    } catch (error) {
      console.error('Error updating completion rate', error);
    }
  };

  if (loading) {
    return (<div>Loading....</div>);
  }

  return (
    <div>
      <Header />
      <div className='userdash'>
        <div className="course-table">
          <h3>Hi <span style={{ fontFamily: 'cursive', fontWeight: 'bolder' }}>{employeeID}--{employeeName}</span>, below are the courses assigned</h3>
          <div className='table-container'>
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
                <tr key={course.courseID} onClick={() => handleEmployeeClick(course)}>
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
        </div>
        <div className='perf'>
          <GaugeChart performanceRate={performanceRate} />
        </div>
      </div>

      {/* Modal for updating completion rate */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {isModalOpen && (
          <div>
              <h3>Update Completion Rate for {selectedCourse?.course.name}</h3>
              <p>Current Completion Rate: {selectedCourse?.completion_rate}%</p>
              <label>New Completion Rate:</label>
              <input
                type="number"
                value={newCompletionRate}
                min="0"
                max="100"
                onChange={(e) => setNewCompletionRate(e.target.value)}
              />
              <button className='update-button' onClick={handleCompletionRateUpdate}>Update</button>
          </div>
        )}
      </Modal>
    </div>
  );
}
