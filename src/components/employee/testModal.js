import React, { useState } from 'react';
import '../../App.css'; // Assuming you have some CSS for your modal

const TestModal = ({ isOpen, onClose, testData, courseName, onSubmit }) => {
    const [answers, setAnswers] = useState({}); // Store answers for the questions
  
    const handleChange = (questionId, answer) => {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: answer,
      }));
    };
  
    const handleSubmit = () => {
      onSubmit(answers); // Pass answers to the parent component
      onClose(); // Close the modal
    };
  
    if (!isOpen) return null;
  
    // Safely access questions
    const questions = testData?.Questions;
  
    // If questions are not loaded yet, show loading message
    if (!questions) {
      return <div>Loading questions...</div>; // Show loading or error state
    }
  
    return (
      <div className="modal-overlay-">
        <div className="modal-content-">
          <h3>Test for {courseName}</h3>
          {Object.keys(questions).map((key) => {
            const question = questions[key];
            return (
              <div key={key}>
                <p>{question.Question}</p>
                {question.Options.map((option) => (
                  <label key={option}>
                    <input
                      type="radio"
                      name={key}
                      value={option}
                      onChange={() => handleChange(key, option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            );
          })}
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };
  
export default TestModal;
