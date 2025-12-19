import React from 'react';
import { AppointmentType } from '../../types';
import { APPOINTMENT_TYPES } from '../../config/appointmentTypes';
import './Phase.css';

interface AppointmentTypePhaseProps {
  onTypeSelected: (type: AppointmentType) => void;
  reason: string;
}

const AppointmentTypePhase: React.FC<AppointmentTypePhaseProps> = ({
  onTypeSelected,
  reason,
}) => {
  return (
    <div className="phase-container">
      <div className="message-bubble bot-message">
        <p>
          Thank you for sharing. Based on your reason: <strong>"{reason}"</strong>
        </p>
        <p>Please select the type of appointment that best fits your needs:</p>
      </div>

      <div className="appointment-types-grid">
        {APPOINTMENT_TYPES.map((type) => (
          <button
            key={type.type}
            className="appointment-type-card"
            onClick={() => onTypeSelected(type.type)}
          >
            <div className="appointment-type-header">{type.label}</div>
            <div className="appointment-type-duration">
              {type.duration} minutes
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AppointmentTypePhase;

