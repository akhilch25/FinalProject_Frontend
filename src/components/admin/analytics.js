import React, { useState, useEffect } from 'react';
import '../../App.css';
import Header from '../headers/adminHeader';
import TopEmployeesChart from '../charts/barChart'; // Adjust the import path as necessary

export default function Analytics() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

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

        fetchEmployees();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Loading state
    }

    return (
        <div>
            <Header />
            <div className='emp-table'>
            <h3>Employee Performance Analytics</h3>
            <TopEmployeesChart employees={employees} />
            </div> {/* Pass employee data to the chart */}
        </div>
    );
}
