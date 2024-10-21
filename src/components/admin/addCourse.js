import React, { useState } from 'react';
import '../../App.css'; // Importing custom CSS for styling
import Header from '../headers/adminHeader'; // Importing a reusable header component
import { toast } from 'react-toastify'; // Importing toast notifications for feedback
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS for styling

export default function AddCourse() {
    // Defining state variables for each input field
    const [courseID, setCourseID] = useState("");
    const [name, setName] = useState("");
    const [duration, setDuration] = useState("");
    const [difficulty_level, setDifficulty_level] = useState("");
    const [learning_path, setLearning_path] = useState("");
    const [error, setError] = useState(null); // State for handling and displaying errors

    // Function to handle the form submission
    const handleCourseSubmit = async (e) => {
        e.preventDefault(); // Prevents default form submission behavior (page reload)

        try {
            // Sending a POST request to add the new course to the server
            const response = await fetch('http://localhost:5000/app/course', {
                method: "POST", // HTTP method for creating new course data
                headers: {
                    'Content-Type': 'application/json' // Sending data as JSON format
                },
                body: JSON.stringify({ courseID, name, duration, difficulty_level, learning_path }) // Sending the form data in the request body
            });
            
            if (!response.ok) {
                // If the server response is not ok, throw an error
                throw new Error("Network response was not ok.");
            }

            // If successful, clear the form and show a success toast notification
            const newCourse = await response.json(); // Parsing the response data
            setCourseID(""); // Resetting the form fields after successful submission
            setName("");
            setDuration("");
            setDifficulty_level("");
            setLearning_path("");
            toast.success("Course Created Successfully"); // Displaying success message using toast
        } catch (error) {
            // Handling errors if the request fails
            setError(`Error adding course: ${error.message}`); // Set error message in state
            toast.error(`Error adding course`); // Displaying error message using toast
        }
    };

    return (
        <div>
            <Header /> {/* Header component for consistent page design */}
            <div className="form-container"> {/* Container for form layout */}
                <form className="admin-form" onSubmit={handleCourseSubmit}> {/* Form with onSubmit handler */}
                    <h3>Add New Course</h3> {/* Form heading */}

                    {/* Input field for Course ID */}
                    <label className='admin-label' htmlFor="courseID">Course ID</label>
                    <input
                        id="courseID"
                        type="text"
                        value={courseID}
                        onChange={(e) => setCourseID(e.target.value)} // Update state on change
                        required
                    />

                    {/* Input field for Course Name */}
                    <label className='admin-label' htmlFor="name">Course Name</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)} // Update state on change
                        required
                    />

                    {/* Input field for Course Duration */}
                    <label className='admin-label' htmlFor="duration">Course Duration</label>
                    <input
                        id="duration"
                        type="text"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)} // Update state on change
                        required
                    />

                    {/* Input field for Difficulty Level */}
                    <label className='admin-label' htmlFor="difficulty">Difficulty Level</label>
                    <input
                        id="difficulty"
                        type="text"
                        value={difficulty_level}
                        onChange={(e) => setDifficulty_level(e.target.value)} // Update state on change
                        required
                    />

                    {/* Input field for Learning Path */}
                    <label className='admin-label' htmlFor="learning_path">Learning Path</label>
                    <input
                        id="learning_path"
                        type="text"
                        value={learning_path}
                        onChange={(e) => setLearning_path(e.target.value)} // Update state on change
                        required
                    />     

                    {/* Submit button */}
                    <button className="submit" type="submit">Add Course</button>
                </form>
                
                {/* Image next to the form */}
                <img className='assign-img' src="/course_add.jpg" alt="Add Course" style={{ width: '100%', maxWidth: '1150px', height: '100%' }}/>
            </div>
        </div>
    );
}
