import React, { useState } from 'react';
import './Phase.css';

interface UnderstandingNeedsPhaseProps {
  onReasonProvided: (reason: string) => void;
  initialReason?: string;
}

const UnderstandingNeedsPhase: React.FC<UnderstandingNeedsPhaseProps> = ({
  onReasonProvided,
  initialReason,
}) => {
  const [reason, setReason] = useState(initialReason || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim()) {
      onReasonProvided(reason.trim());
    }
  };

  return (
    <div className="phase-container">
      <div className="message-bubble bot-message">
        <p>
          I'd like to understand why you're visiting today. Could you please
          tell me the reason for your appointment?
        </p>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <textarea
          className="form-input"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="E.g., I need a check-up, I have a specific concern, follow-up visit..."
          rows={4}
          required
        />
        <button type="submit" className="btn btn-primary" disabled={!reason.trim()}>
          Continue
        </button>
      </form>
    </div>
  );
};

export default UnderstandingNeedsPhase;

