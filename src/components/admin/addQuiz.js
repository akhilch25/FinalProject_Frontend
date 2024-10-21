import React, { useState, useEffect } from 'react';
import '../../App.css'; // Importing custom CSS for styling
import Header from '../headers/adminHeader'; // Importing header component for consistent UI
import { toast } from 'react-toastify'; // Importing toast notifications for feedback
import 'react-toastify/dist/ReactToastify.css'; // Importing CSS for toast notifications

export default function AddQuiz() {
    // State variables to store form data and fetched courses
    const [courseID, setCourseID] = useState(""); // Selected course ID
    const [testData, setTestData] = useState(""); // Test data (as a string)
    const [courses, setCourses] = useState([]); // List of available courses fetched from the API
    const [error, setError] = useState(null); // Error state for handling API errors

    // useEffect hook to fetch courses from the server when the component mounts
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Fetch courses from the backend
                const response = await fetch('http://localhost:5000/app/course');
                if (!response.ok) {
                    throw new Error("Network response was not ok."); // Throw error if request fails
                }
                const data = await response.json(); // Parse the response data as JSON
                setCourses(data); // Store fetched courses in the state
            } catch (error) {
                setError(`Error fetching courses: ${error.message}`); // Handle fetch errors
                toast.error(`Error fetching courses`); // Show toast notification for errors
            }
        };

        fetchCourses(); // Trigger the fetch on component mount
    }, []); // Empty dependency array to ensure it runs once when the component mounts

    // Function to handle quiz form submission
    const handleQuizSubmit = async (e) => {
        e.preventDefault(); // Prevents default form submission behavior

        try {
            const parsedTestData = JSON.parse(testData); // Parse the input JSON string into an object
            // Send POST request to the server to add the quiz
            const response = await fetch('http://localhost:5000/app/quiz', {
                method: "POST", // Specify the request method
                headers: {
                    'Content-Type': 'application/json' // Set content type to JSON
                },
                body: JSON.stringify({ courseID, testData: parsedTestData }) // Send the course ID and quiz data
            });
            
            if (!response.ok) {
                throw new Error("Network response was not ok."); // Handle network errors
            }

            // Clear form fields on successful quiz creation
            const newQuiz = await response.json();
            setCourseID(""); // Reset courseID field
            setTestData(""); // Reset testData field
            toast.success("Quiz Added Successfully"); // Show success notification
        } catch (error) {
            setError(`Error adding quiz: ${error.message}`); // Set error state if request fails
            toast.error(`Error adding quiz`); // Show error notification
        }
    };

    return (
        <div>
            <Header /> {/* Reusable header component */}
            <div className="form-container">
                {/* Form for adding a new quiz */}
                <form className="quiz-form" onSubmit={handleQuizSubmit}>
                    <h3>Add Quiz to Course</h3>

                    {/* Select input for choosing the course */}
                    <label className="admin-label" htmlFor="courseID">
                        Select Course
                    </label>
                    <select
                        id="courseID"
                        value={courseID} // Set the value to the selected courseID
                        onChange={(e) => setCourseID(e.target.value)} // Update courseID on change
                        required
                    >
                        <option value="">-- Select Course --</option>
                        {courses
                            .sort((a, b) => a.courseID.localeCompare(b.courseID)) // Sort courses alphabetically by courseID
                            .map((course) => (
                                <option key={course.courseID} value={course.courseID}>
                                    {course.courseID} - {course.name} {/* Display course ID and name */}
                                </option>
                        ))}
                    </select>

                    {/* Text area for inputting quiz questions in JSON format */}
                    <label>Test Data (JSON format):</label>
                    <textarea
                        rows="30" // Number of visible rows
                        cols="120" // Number of visible columns
                        value={testData} // Set the value to testData
                        onChange={(e) => setTestData(e.target.value)} // Update testData on change
                        placeholder={`Enter the JSON structure for test data
{
    "courseID": "COURSE001",
    "Questions": {
        "Q1": {
            "Question": "",
            "Options": [],
            "Answer": ""
        }
    }
}`} // Placeholder showing the required JSON structure
                        required
                    />

                    {/* Submit button to add the quiz */}
                    <button className="submit" type="submit">Add Quiz</button>
                </form>
            </div>
        </div>
    );
}
