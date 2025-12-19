import React, { useState } from 'react';
import { TimeSlot, AppointmentType, PatientInfo } from '../../types';
import { getAppointmentTypeConfig } from '../../config/appointmentTypes';
import './Phase.css';

interface BookingConfirmationPhaseProps {
  appointmentType: AppointmentType;
  selectedSlot: TimeSlot;
  reason: string;
  patientInfo?: Partial<PatientInfo>;
  onInfoCollected: (info: PatientInfo) => void;
  onConfirmed: () => void;
  isLoading: boolean;
}

const BookingConfirmationPhase: React.FC<BookingConfirmationPhaseProps> = ({
  appointmentType,
  selectedSlot,
  reason,
  patientInfo: initialPatientInfo,
  onInfoCollected,
  onConfirmed,
  isLoading,
}) => {
  const [patientInfo, setPatientInfo] = useState<Partial<PatientInfo>>(
    initialPatientInfo || {}
  );
  const [showConfirmation, setShowConfirmation] = useState(false);

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

  const handleInputChange = (field: keyof PatientInfo, value: string) => {
    setPatientInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      patientInfo.name &&
      patientInfo.email &&
      patientInfo.phone &&
      patientInfo.reason
    ) {
      onInfoCollected(patientInfo as PatientInfo);
      setShowConfirmation(true);
    }
  };

  const handleConfirmBooking = () => {
    onConfirmed();
  };

  const isFormValid =
    patientInfo.name &&
    patientInfo.email &&
    patientInfo.phone &&
    patientInfo.reason &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientInfo.email);

  if (showConfirmation) {
    return (
      <div className="phase-container">
        <div className="message-bubble bot-message">
          <p>Please review your appointment details:</p>
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

        <div className="action-buttons">
          <button
            className="btn btn-secondary"
            onClick={() => setShowConfirmation(false)}
            disabled={isLoading}
          >
            Edit Details
          </button>
          <button
            className="btn btn-primary"
            onClick={handleConfirmBooking}
            disabled={isLoading}
          >
            {isLoading ? 'Booking...' : 'Confirm & Book Appointment'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="phase-container">
      <div className="message-bubble bot-message">
        <p>
          Excellent choice! I've selected the slot on{' '}
          <strong>{formatDateTime(selectedSlot.start)}</strong>
        </p>
        <p>
          Now I need some information to complete your booking. Please fill in
          the details below:
        </p>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            id="name"
            type="text"
            className="form-input"
            value={patientInfo.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
            placeholder="John Doe"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            id="email"
            type="email"
            className="form-input"
            value={patientInfo.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
            placeholder="john.doe@example.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number *</label>
          <input
            id="phone"
            type="tel"
            className="form-input"
            value={patientInfo.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            required
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div className="form-group">
          <label htmlFor="reason">Reason for Visit *</label>
          <textarea
            id="reason"
            className="form-input"
            value={patientInfo.reason || reason}
            onChange={(e) => handleInputChange('reason', e.target.value)}
            required
            rows={3}
            placeholder="Brief description of your reason for visit"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={!isFormValid}
        >
          Review & Confirm
        </button>
      </form>
    </div>
  );
};

export default BookingConfirmationPhase;

