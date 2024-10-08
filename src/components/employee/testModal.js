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
      handleClose(); // Close the modal
    };

    const handleClose = () => {
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
      <div className="test-modal-overlay">
        <div className="test-modal-content">
          <h3>Test for {courseName}</h3>
          {Object.keys(questions).map((key, index) => {
            const question = questions[key];
            return (
              <div key={key}>
                {/* Displaying question number */}
                <p>{index + 1}. {question.Question}</p>
                {question.Options.map((option) => (
                  <label key={option} style={{ display: 'flex',alignItems:'center' }}>
                    {/* Radio button before option */}
                    <input
                      className='radio'
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
          <button className='submit-button' onClick={handleSubmit}>Submit</button>
          <button className='test-close' onClick={handleClose}>Close</button>
        </div>
      </div>
    );
  };

export default TestModal;
