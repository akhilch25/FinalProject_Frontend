import React, { useState, useEffect } from 'react';
import Header from '../headers/userHeader';
import '../../App.css';
import GaugeChart from '../charts/guageChart';
import axios from 'axios';
import Modal from './editModel';
import CertificateModal from './certificateModel'; // Import the Certificate modal component
import TestModal from './testModal'; // Import the Test modal component
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

export default function UserDashboard() {
  const [performanceRate, setPerformanceRate] = useState(null);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeID, setEmployeeID] = useState("");
  const [courses, setCourses] = useState([]); // State for employee courses
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false); // State for certificate modal
  const [isTestModalOpen, setIsTestModalOpen] = useState(false); // State for test modal
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newCompletionRate, setNewCompletionRate] = useState(''); // State for new completion rate
  const [testData, setTestData] = useState([]); // State for test questions

  useEffect(() => {
    const fetchPerformanceRateAndCourses = async () => {
      try {
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

  const openTestModal = async (course) => {
    setSelectedCourse(course);
    try {
      const response = await axios.get(`http://localhost:5000/app/quiz/${course.courseID}`);
      
      // Ensure that response.data.testData is in the expected format
      if (response.data && response.data.testData) {
        setTestData(response.data.testData);
      } else {
        console.error('No test data found in response');
        setTestData({ Questions: {} }); // Set to an empty structure to avoid errors
      }
    } catch (error) {
      console.error('Error fetching test data:', error);
      setTestData({ Questions: {} }); // Set to an empty structure on error
    }
    setIsTestModalOpen(true);
  };
  

  const closeTestModal = () => {
    setIsTestModalOpen(false);
    setSelectedCourse(null);
  };

  const handleCompletionRateUpdate = async () => {
    try {
      if (selectedCourse) {
        await axios.put(`http://localhost:5000/app/employee-course/${selectedCourse.empID}/${selectedCourse.courseID}`, {
          completion_rate: Number(newCompletionRate)
        });
  
        const updatedCoursesResponse = await axios.get(`http://localhost:5000/app/employee-course/${employeeID}`);
        setCourses(updatedCoursesResponse.data);
  
        const updatedPerformanceResponse = await axios.get(`http://localhost:5000/app/employee/${employeeID}`);
        setPerformanceRate(updatedPerformanceResponse.data.performance_rate);
  
        toast.success('Completion rate updated successfully!');
        closeModal(); // Close the modal after the update
      }
    } catch (error) {
      console.error('Error updating completion rate', error);
      toast.error('Failed to update completion rate. Please try again.');
    }
  };

  const handleTestSubmit = async (answers) => {
    try {
        // Handle the submission of test answers, you can send it to your backend
        await axios.post(`http://localhost:5000/app/submit-test`, {
            courseID: selectedCourse.courseID,
            answers: answers,
        });
        
        // Determine the number of correct answers
        const correctAnswers = Object.keys(answers).filter(
            (key) => answers[key] === testData.Questions[key].Answer
        ).length;

        const passingScore = 0.8; // 80%
        const percentageScore = (correctAnswers / Object.keys(testData.Questions).length) * 100;

        if (percentageScore >= passingScore * 100) {
            toast.success('Congratulations! You passed the test.');
            // Optionally, issue a certificate or update the database here
        } else {
            toast.warn('You did not pass the test. Please try again.');
        }

        closeTestModal(); // Close the modal
    } catch (error) {
        console.error('Error submitting test', error);
        toast.error('Failed to submit test. Please try again.');
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
                    <td onClick={() => handleEmployeeClick(course)}>{course.courseID}</td>
                    <td onClick={() => handleEmployeeClick(course)}>{course.course.name}</td>
                    <td>{course.course.duration}</td>
                    <td>{course.course.difficulty_level}</td>
                    <td onClick={() => handleEmployeeClick(course)}>{course.completion_rate}%</td>
                    <td>
                      <button onClick={() => openTestModal(course)}>Take Test</button>
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
          {/* <GaugeChart performanceRate={performanceRate} /> */}
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

      {/* Test Modal */}
      <TestModal
        isOpen={isTestModalOpen}
        onClose={closeTestModal}
        testData={testData}
        courseName={selectedCourse?.course.name}
        onSubmit={handleTestSubmit}
      />
    </div>
  );
}
