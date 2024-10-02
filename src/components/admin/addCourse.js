import React,{ useState } from 'react';
import '../../App.css';
import Header from '../headers/adminHeader';

export default function AddCourse(){
    const [courseID, setCourseID] = useState("");
    const [name, setName] = useState("");
    const [duration, setDuration] = useState("");
    const [difficulty_level, setDifficulty_level] = useState("");
    const [error, setError] = useState(null);

    const handleCourseSubmit = async (e)=>{
        e.preventDefault();

        try{
            const response = await fetch('http://localhost:5000/app/course',{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({courseID, name, duration, difficulty_level})
            });
            
            if (!response.ok){
                throw new Error("Network response was not ok.");
            }

            const newCourse = await response.json();
            setCourseID("");
            setName("");
            setDuration("");
            setDifficulty_level("");
            alert("Course added");
        }
        catch (error) {
            setError(`Error adding course: ${error.message}`);
        }
    };

    return(
        <div>
            <Header/>
        <div className="form-container">
            <form className="admin-form" onSubmit={handleCourseSubmit}>
                {error && <p className="error">{error}</p>}
                <h3>Add New Course</h3>
                <label className='admin-label' htmlFor="courseID">Course ID</label>
                <input
                    id="courseID"
                    type="text"
                    value={courseID}
                    onChange={(e) => setCourseID(e.target.value)}
                    required
                />

                <label className='admin-label' htmlFor="name">Course name</label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <label className='admin-label' htmlFor="duration">Course duration</label>
                <input
                    id="duration"
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                />

                <label className='admin-label' htmlFor="difficulty">Difficulty level</label>
                <input
                    id="difficulty"
                    type="text"
                    value={difficulty_level}
                    onChange={(e) => setDifficulty_level(e.target.value)}
                    required
                />    
                
                <button className="submit" type="submit">Add Course</button>
            </form>
        </div>
        </div>
    );
}