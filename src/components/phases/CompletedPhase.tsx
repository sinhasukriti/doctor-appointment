import React from 'react';
import { TimeSlot, AppointmentType, PatientInfo } from '../../types';
import { getAppointmentTypeConfig } from '../../config/appointmentTypes';
import './Phase.css';

interface CompletedPhaseProps {
  appointmentType: AppointmentType;
  selectedSlot: TimeSlot;
  patientInfo: PatientInfo;
}

const CompletedPhase: React.FC<CompletedPhaseProps> = ({
  appointmentType,
  selectedSlot,
  patientInfo,
}) => {
  const config = getAppointmentTypeConfig(appointmentType);

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

  return (
    <div className="phase-container">
      <div className="message-bubble bot-message success-message">
        <div className="success-icon">✅</div>
        <h2>Appointment Confirmed!</h2>
        <p>
          Your appointment has been successfully booked. Here are your
          confirmation details:
        </p>
      </div>

      <div className="confirmation-details">
        <div className="detail-row">
          <strong>Appointment Type:</strong>
          <span>{config.label} ({config.duration} minutes)</span>
        </div>
        <div className="detail-row">
          <strong>Date & Time:</strong>
          <span>{formatDateTime(selectedSlot.start)}</span>
        </div>
        <div className="detail-row">
          <strong>Patient Name:</strong>
          <span>{patientInfo.name}</span>
        </div>
        <div className="detail-row">
          <strong>Email:</strong>
          <span>{patientInfo.email}</span>
        </div>
        <div className="detail-row">
          <strong>Phone:</strong>
          <span>{patientInfo.phone}</span>
        </div>
        <div className="detail-row">
          <strong>Reason for Visit:</strong>
          <span>{patientInfo.reason}</span>
        </div>
      </div>

      <div className="message-bubble bot-message">
        <p>
          📧 A confirmation email has been sent to <strong>{patientInfo.email}</strong> with
          all the details.
        </p>
        <p>
          Please arrive 10 minutes before your appointment time. If you need to
          reschedule or cancel, please contact us at least 24 hours in advance.
        </p>
        <p>We look forward to seeing you!</p>
      </div>
    </div>
  );
};

export default CompletedPhase;

