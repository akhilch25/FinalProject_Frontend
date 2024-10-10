import React, { useState, useEffect } from 'react';
import Header from '../headers/userHeader';
import '../../App.css';
import GaugeChart from '../charts/guageChart';
import axios from 'axios';
import Modal from './editModel';
import CertificateModal from './certificateModel'; 
import TestModal from './testModal'; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

export default function UserDashboard() {
  const [performanceRate, setPerformanceRate] = useState(null);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeID, setEmployeeID] = useState("");
  const [courses, setCourses] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newCompletionRate, setNewCompletionRate] = useState('');
  const [testData, setTestData] = useState([]);
  const [hasPassedTest, setHasPassedTest] = useState(false);

  useEffect(() => {
    const fetchPerformanceRateAndCourses = async () => {
      try {
        const empID = localStorage.getItem('empID');
        if (empID) {
          const performanceResponse = await axios.get(`http://localhost:5000/app/employee/${empID}`);
          const employeeData = performanceResponse.data;
          setPerformanceRate(employeeData.performance_rate);
          setEmployeeName(employeeData.name);
          setEmployeeID(employeeData.empID);

          const coursesResponse = await axios.get(`http://localhost:5000/app/employee-course/${empID}`);
          setCourses(coursesResponse.data); 
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
    setNewCompletionRate(course.completion_rate); 
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
      if (response.data && response.data.testData) {
        setTestData(response.data.testData);
      } else {
        console.error('No test data found in response');
        setTestData([]); 
      }
    } catch (error) {
      console.error('Error fetching test data:', error);
      setTestData([]); 
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
        closeModal();
      }
    } catch (error) {
      console.error('Error updating completion rate', error);
      toast.error('Failed to update completion rate. Please try again.');
    }
  };

  const handleTestSubmit = async (answers) => {
    try {
        const empID = localStorage.getItem('empID');
        await axios.post(`http://localhost:5000/app/submit-test`, {
            empID,  
            courseID: selectedCourse.courseID,
            answers: answers,
        });

        const correctAnswers = Object.keys(answers).filter(
            (key) => answers[key] === testData.Questions[key].Answer
        ).length;

        const passingScore = 0.8; 
        const percentageScore = (correctAnswers / Object.keys(testData.Questions).length) * 100;

        const canViewCertificate = percentageScore >= (passingScore * 100) && selectedCourse.completion_rate === 100;

        if (canViewCertificate) {
            setHasPassedTest(prevState => ({ ...prevState, [selectedCourse.courseID]: true })); 
            toast.success('Congratulations! You passed the test');
        } else if(selectedCourse.completion_rate !== 100 && percentageScore >= (passingScore * 100)) {
            setHasPassedTest(prevState => ({ ...prevState, [selectedCourse.courseID]: true })); 
            toast.warn('Congratulations! Complete the course to view the certificate');
        } else {
            setHasPassedTest(prevState => ({ ...prevState, [selectedCourse.courseID]: false }));
            toast.error('You failed! Better luck next time');
        }

        closeTestModal();
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
                      <button style={{padding: '5px',border:'none',borderRadius: '5px',cursor: 'pointer',marginLeft:'10px',marginRight:'10px'}} onClick={() => openTestModal(course)}>Take Test</button>
                      <button style={{padding: '5px',border:'none',borderRadius: '5px',cursor: 'pointer',marginLeft:'10px'}}
                        onClick={() => openCertificateModal(course)}
                        disabled={course.completion_rate < 100 || !hasPassedTest[course.courseID]} 
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

      {/* Modal for certificate viewing */}
      <CertificateModal
        isOpen={isCertificateModalOpen}
        onClose={closeCertificateModal}
        employeeName={employeeName}
        courseName={selectedCourse?.course.name}
        courseDuration={selectedCourse?.course.duration}
        difficultyLevel={selectedCourse?.course.difficulty_level}
        hasPassedTest={hasPassedTest}
      />

      {/* Modal for taking the test */}
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
