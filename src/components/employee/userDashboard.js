import React, { useState, useEffect } from 'react';
import Header from '../headers/userHeader';
import '../../App.css';
import GaugeChart from '../charts/guageChart';
import axios from 'axios';
import Modal from './editModel';
import CertificateModal from './certificateModel'; // Import the Certificate modal component
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

export default function UserDashboard() {
  const [performanceRate, setPerformanceRate] = useState(null);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeID, setEmployeeID] = useState("");
  const [courses, setCourses] = useState([]); // State for employee courses
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newCompletionRate, setNewCompletionRate] = useState(''); // State for new completion rate
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false); // State for certificate modal

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

  const openCertificateModal = (course) => {
    setSelectedCourse(course);
    setIsCertificateModalOpen(true);
  };

  const closeCertificateModal = () => {
    setIsCertificateModalOpen(false);
    setSelectedCourse(null);
  };

  // Function to update the completion rate
  const handleCompletionRateUpdate = async () => {
    try {
      if (selectedCourse) {
        // Send the PUT request to update the completion rate
        await axios.put(`http://localhost:5000/app/employee-course/${selectedCourse.empID}/${selectedCourse.courseID}`, {
          completion_rate: Number(newCompletionRate)
        });
  
        // Fetch the updated list of courses after the update
        const updatedCoursesResponse = await axios.get(`http://localhost:5000/app/employee-course/${employeeID}`);
        setCourses(updatedCoursesResponse.data); // Update the frontend with new course data
  
        // Fetch the updated performance rate
        const updatedPerformanceResponse = await axios.get(`http://localhost:5000/app/employee/${employeeID}`);
        setPerformanceRate(updatedPerformanceResponse.data.performance_rate); // Update the performance rate
  
        toast.success('Completion rate updated successfully!');
        closeModal(); // Close the modal after the update
      }
    } catch (error) {
      console.error('Error updating completion rate', error);
      toast.error('Failed to update completion rate. Please try again.');
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.courseID}>
                  <td onClick={()=>handleEmployeeClick(course)}>{course.courseID}</td>
                  <td onClick={()=>handleEmployeeClick(course)}>{course.course.name}</td>
                  <td>{course.course.duration}</td>
                  <td>{course.course.difficulty_level}</td>
                  <td onClick={()=>handleEmployeeClick(course)}>{course.completion_rate}%</td>
                  <td>
                    {/* View Certificate button */}
                    <button
                      onClick={() => openCertificateModal(course)}
                      disabled={course.completion_rate < 100}
                    >
                      View Certificate
                    </button>
                  </td>
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

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={isCertificateModalOpen}
        onClose={closeCertificateModal}
        employeeName={employeeName}
        courseName={selectedCourse?.course.name}
        courseDuration={selectedCourse?.course.duration}
        difficultyLevel={selectedCourse?.course.difficulty_level}
      />
    </div>
  );
}
