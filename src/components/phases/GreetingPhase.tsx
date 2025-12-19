import React, { useState, useEffect } from 'react';
import './Phase.css';

interface GreetingPhaseProps {
  onComplete: () => void;
}

const GreetingPhase: React.FC<GreetingPhaseProps> = ({ onComplete }) => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Show button after greeting message appears
    const timer = setTimeout(() => setShowButton(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="phase-container">
      <div className="message-bubble bot-message">
        <p>
          👋 Hello! Welcome to our appointment booking system. I'm here to help
          you schedule an appointment with our doctor.
        </p>
        <p>Let's get started! How can I assist you today?</p>
      </div>

      {showButton && (
        <div className="action-buttons">
          <button className="btn btn-primary" onClick={onComplete}>
            Start Booking
          </button>
        </div>
      )}
    </div>
  );
};

export default GreetingPhase;

