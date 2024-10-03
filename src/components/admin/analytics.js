import React, { useState, useEffect } from 'react';
import '../../App.css';
import Header from '../headers/adminHeader';
import { TopCoursesChart,TopEmployeesChart, CourseCompletion } from '../charts/barChart';
import axios from 'axios';

export default function Analytics() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [courseData, setCourseData] = useState([]);
    const [completion, setCompletion] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch('http://localhost:5000/app/employee'); 
                const data = await response.json();
                setEmployees(data); // Assuming the response is an array of employee objects
            } catch (error) {
                console.error('Error fetching employee data:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchCourseData = async () => {
            try {
              const response = await axios.get('http://localhost:5000/app/course-count'); // Endpoint for the query
              setCourseData(response.data); // Assume the backend sends an array of { courseID, Course_Count }
            } catch (error) {
              console.error('Error fetching course count data:', error);
            }
          };

        const fetchCompletionData = async () => {
            try{
                const response = await axios.get('http://localhost:5000/app/avg-completion');
                setCompletion(response.data);
            }
            catch(error){
                console.error('Error fetcing completion rates:',error);
            }
        };
      
        fetchCompletionData();
        fetchEmployees();
        fetchCourseData();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Loading state
    }

    return (
        <div>
            <Header />
            <div className='analytics'>
                <div className='chart'>
                    <h3>Employee Performance Analytics</h3>
                    <TopEmployeesChart employees={employees} />{/* Pass employee data to the chart */}
                </div> 
                <div className='chart'>
                    <h3>Most Assigned Courses</h3>
                    <TopCoursesChart courses={courseData}/>
                </div>
                <div className='chart'>
                    <h3>Competion Rate of Courses</h3>
                    <CourseCompletion courses={completion}/>
                </div>
            </div>
        </div>
    );
}
