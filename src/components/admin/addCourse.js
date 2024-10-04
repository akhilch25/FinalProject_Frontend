import React, { useState } from 'react';
import '../../App.css';
import Header from '../headers/adminHeader';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

export default function AddCourse() {
    const [courseID, setCourseID] = useState("");
    const [name, setName] = useState("");
    const [duration, setDuration] = useState("");
    const [difficulty_level, setDifficulty_level] = useState("");
    const [learning_path, setLearning_path] = useState("");
    const [error, setError] = useState(null);

    const handleCourseSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/app/course', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ courseID, name, duration, difficulty_level, learning_path })
            });
            
            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }

            const newCourse = await response.json();
            setCourseID("");
            setName("");
            setDuration("");
            setDifficulty_level("");
            setLearning_path("");
            toast.success("Course Created Successfully");
        } catch (error) {
            setError(`Error adding course: ${error.message}`);
            toast.error(`Error adding course`);
        }
    };

    return (
        <div>
            <Header />
            <div className="form-container">
                <form className="admin-form" onSubmit={handleCourseSubmit}>
                    <h3>Add New Course</h3>
                    <label className='admin-label' htmlFor="courseID">Course ID</label>
                    <input
                        id="courseID"
                        type="text"
                        value={courseID}
                        onChange={(e) => setCourseID(e.target.value)}
                        required
                    />

                    <label className='admin-label' htmlFor="name">Course Name</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <label className='admin-label' htmlFor="duration">Course Duration</label>
                    <input
                        id="duration"
                        type="text"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        required
                    />

                    <label className='admin-label' htmlFor="difficulty">Difficulty Level</label>
                    <input
                        id="difficulty"
                        type="text"
                        value={difficulty_level}
                        onChange={(e) => setDifficulty_level(e.target.value)}
                        required
                    />

                    <label className='admin-label' htmlFor="learning_path">Learning Path</label>
                    <input
                        id="learning_path"
                        type="text"
                        value={learning_path}
                        onChange={(e) => setLearning_path(e.target.value)}
                        required
                    />     

                    <button className="submit" type="submit">Add Course</button>
                </form>
            </div>
        </div>
    );
}
