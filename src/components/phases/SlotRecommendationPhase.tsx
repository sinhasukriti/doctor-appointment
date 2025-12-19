import React, { useState } from 'react';
import { TimeSlot, AppointmentType } from '../../types';
import { getAppointmentTypeConfig } from '../../config/appointmentTypes';
import './Phase.css';

interface SlotRecommendationPhaseProps {
  slots: TimeSlot[];
  appointmentType: AppointmentType;
  onSlotSelected: (slot: TimeSlot) => void;
  onRequestAlternatives: () => void;
  isLoading: boolean;
}

const SlotRecommendationPhase: React.FC<SlotRecommendationPhaseProps> = ({
  slots,
  appointmentType,
  onSlotSelected,
  onRequestAlternatives,
  isLoading,
}) => {
  const [showAlternatives, setShowAlternatives] = useState(false);

  const formatDateTime = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const config = getAppointmentTypeConfig(appointmentType);

  if (isLoading) {
    return (
      <div className="phase-container">
        <div className="message-bubble bot-message">
          <p>🔍 Finding available slots for you...</p>
        </div>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="phase-container">
        <div className="message-bubble bot-message">
          <p>
            I'm sorry, but I couldn't find any available slots at the moment.
          </p>
          <p>Would you like me to check for alternative dates?</p>
        </div>
        <div className="action-buttons">
          <button
            className="btn btn-primary"
            onClick={onRequestAlternatives}
            disabled={isLoading}
          >
            Check Alternative Dates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="phase-container">
      <div className="message-bubble bot-message">
        <p>
          Perfect! I found {slots.length} available slot{slots.length > 1 ? 's' : ''} for your{' '}
          <strong>{config.label}</strong> appointment ({config.duration} minutes):
        </p>
        <p className="recommendation-explanation">
          💡 These slots are recommended based on your preferences and the
          doctor's availability.
        </p>
      </div>

      <div className="slots-container">
        {slots.map((slot, index) => (
          <div key={index} className="slot-card">
            <div className="slot-time">
              <div className="slot-date">{formatDateTime(slot.start)}</div>
              <div className="slot-duration">
                {formatTime(slot.start)} - {formatTime(slot.end)}
              </div>
            </div>
            <button
              className="btn btn-primary btn-small"
              onClick={() => onSlotSelected(slot)}
            >
              Select This Slot
            </button>
          </div>
        ))}
      </div>

      {!showAlternatives && (
        <div className="action-buttons">
          <button
            className="btn btn-secondary"
            onClick={() => {
              setShowAlternatives(true);
              onRequestAlternatives();
            }}
            disabled={isLoading}
          >
            None of These Work - Show Alternatives
          </button>
        </div>
      )}

      {showAlternatives && isLoading && (
        <div className="message-bubble bot-message">
          <p>🔍 Looking for alternative slots...</p>
        </div>
      )}
    </div>
  );
};

export default SlotRecommendationPhase;

