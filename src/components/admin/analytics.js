import React, { useState, useEffect } from 'react';
import '../../App.css';
import Header from '../headers/adminHeader';
import { TopCoursesChart, TopEmployeesChart, CourseCompletion } from '../charts/barChart';
import axios from 'axios';

export default function Analytics() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [courseData, setCourseData] = useState([]);
    const [completion, setCompletion] = useState([]);
    const [topEmployees, setTopEmployees] = useState([]);
    const [bottomEmployees, setBottomEmployees] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch('http://localhost:5000/app/employee'); 
                const data = await response.json();
                setEmployees(data); // Assuming the response is an array of employee objects
                setTopEmployees(getTopEmployees(data)); // Get top 5 employees based on performance rate
                setBottomEmployees(getBottomEmployees(data)); // Get bottom 5 employees based on performance rate
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
                console.error('Error fetching completion rates:', error);
            }
        };
      
        fetchCompletionData();
        fetchEmployees();
        fetchCourseData();
    }, []);

    // Function to get top 5 employees based on performance rate
    const getTopEmployees = (employeeList) => {
        return employeeList
            .sort((a, b) => b.performance_rate - a.performance_rate) // Sort by performance rate descending
            .slice(0, 5); // Take top 5 employees
    };

    // Function to get bottom 5 employees based on performance rate
    const getBottomEmployees = (employeeList) => {
        return employeeList
            .filter(employee => employee.empID !== 'EMP000')
            .sort((a, b) => a.performance_rate - b.performance_rate) // Sort by performance rate ascending
            .slice(0, 5); // Take bottom 5 employees
    };

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
                    <TopCoursesChart courses={courseData} />
                </div>
                <div className='chart'>
                    <h3>Completion Rate of Courses</h3>
                    <CourseCompletion courses={completion} />
                </div>
            </div>
            <div className='top-bottom-tables'>
                {/* Section for top 5 employees */}
                <div className='top-employees'>
                    <h3>Top 5 Employees by Performance</h3>
                    <ul>
                        {topEmployees.map((employee, index) => (
                            <li key={index}>
                                {employee.name} - Performance Rate: {employee.performance_rate.toFixed(2)}%
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Section for bottom 5 employees */}
                <div className='bottom-employees'>
                    <h3>Bottom 5 Employees by Performance</h3>
                    <ul>
                        {bottomEmployees.map((employee, index) => (
                            <li key={index}>
                                {employee.name} - Performance Rate: {employee.performance_rate.toFixed(2)}%
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
