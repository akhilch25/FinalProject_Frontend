import React, { useState, useEffect } from 'react';
import '../../App.css';
import Header from '../headers/adminHeader';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

export default function AddQuiz() {
    const [courseID, setCourseID] = useState("");
    const [testData, setTestData] = useState("");
    const [courses, setCourses] = useState([]); // State to hold courses
    const [error, setError] = useState(null);

    // Fetch courses from the API on component mount
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('http://localhost:5000/app/course');
                if (!response.ok) {
                    throw new Error("Network response was not ok.");
                }
                const data = await response.json();
                setCourses(data);
            } catch (error) {
                setError(`Error fetching courses: ${error.message}`);
                toast.error(`Error fetching courses`);
            }
        };

        fetchCourses();
    }, []);

    const handleQuizSubmit = async (e) => {
        e.preventDefault();

        try {
            const parsedTestData = JSON.parse(testData); // Parse testData to JSON
            const response = await fetch('http://localhost:5000/app/quiz', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ courseID, testData: parsedTestData }) // Send parsed JSON
            });
            
            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }

            const newQuiz = await response.json();
            setCourseID("");
            setTestData("");
            toast.success("Quiz Added Successfully");
        } catch (error) {
            setError(`Error adding quiz: ${error.message}`);
            toast.error(`Error adding quiz`);
        }
    };

    return (
        <div>
            <Header />
            <div className="form-container">
                <form className="quiz-form" onSubmit={handleQuizSubmit}>
                    <h3>Add Quiz to Course</h3>
                    <label className="admin-label" htmlFor="courseID">
                        Select Course
                    </label>
                    <select
                        id="courseID"
                        value={courseID}
                        onChange={(e) => setCourseID(e.target.value)}
                        required
                    >
                        <option value="">-- Select Course --</option>
                        {courses.sort((a,b) => a.courseID.localeCompare(b.courseID)).map((course) => (
                            <option key={course.courseID} value={course.courseID}>
                                {course.courseID} - {course.name} {/* Show course name */}
                            </option>
                        ))}
                    </select>

                    <label>Test Data (JSON format):</label>
                    <textarea
                        rows="30"
                        cols="120"
                        value={testData}
                        onChange={(e) => setTestData(e.target.value)}
                        placeholder="Enter the JSON structure for test data"
                        required
                    />

                    <button className="submit" type="submit">Add Quiz</button>
                </form>
            </div>
        </div>
    );
}
