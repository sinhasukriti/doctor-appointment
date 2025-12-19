import React, { useState } from 'react';
import './Phase.css';

interface PreferredTimePhaseProps {
  onTimeProvided: (date?: string, time?: string) => void;
  isLoading: boolean;
}

const PreferredTimePhase: React.FC<PreferredTimePhaseProps> = ({
  onTimeProvided,
  isLoading,
}) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTimeProvided(date || undefined, time || undefined);
  };

  const handleSkip = () => {
    onTimeProvided();
  };

  // Get minimum date (tomorrow)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  return (
    <div className="phase-container">
      <div className="message-bubble bot-message">
        <p>
          Great! When would you prefer to have your appointment? You can
          specify a date and time, or I can suggest available slots for you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="date">Preferred Date (optional)</label>
          <input
            id="date"
            type="date"
            className="form-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={minDateStr}
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">Preferred Time (optional)</label>
          <input
            id="time"
            type="time"
            className="form-input"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div className="action-buttons">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleSkip}
            disabled={isLoading}
          >
            Skip - Show Available Slots
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Finding Slots...' : 'Find Available Slots'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PreferredTimePhase;

