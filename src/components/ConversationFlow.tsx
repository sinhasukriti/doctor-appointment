import React, { useState, useEffect } from 'react';
import {
  ConversationPhase,
  ConversationState,
  AppointmentType,
  TimeSlot,
  PatientInfo,
} from '../types';
import { getAvailableTimeSlots, createAppointment } from '../services/calendlyService';
import { APPOINTMENT_TYPES } from '../config/appointmentTypes';
import GreetingPhase from './phases/GreetingPhase';
import UnderstandingNeedsPhase from './phases/UnderstandingNeedsPhase';
import AppointmentTypePhase from './phases/AppointmentTypePhase';
import PreferredTimePhase from './phases/PreferredTimePhase';
import SlotRecommendationPhase from './phases/SlotRecommendationPhase';
import BookingConfirmationPhase from './phases/BookingConfirmationPhase';
import CompletedPhase from './phases/CompletedPhase';
import './ConversationFlow.css';

const ConversationFlow: React.FC = () => {
  const [state, setState] = useState<ConversationState>({
    phase: ConversationPhase.GREETING,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGreetingComplete = () => {
    setState((prev) => ({
      ...prev,
      phase: ConversationPhase.UNDERSTANDING_NEEDS,
    }));
  };

  const handleReasonProvided = (reason: string) => {
    setState((prev) => ({
      ...prev,
      reason,
      phase: ConversationPhase.APPOINTMENT_TYPE,
    }));
  };

  const handleAppointmentTypeSelected = (type: AppointmentType) => {
    setState((prev) => ({
      ...prev,
      appointmentType: type,
      phase: ConversationPhase.PREFERRED_TIME,
    }));
  };

  const handlePreferredTimeProvided = async (
    date?: string,
    time?: string
  ) => {
    if (!state.appointmentType) return;

    setIsLoading(true);
    setError(null);

    try {
      const slots = await getAvailableTimeSlots(
        state.appointmentType,
        date,
        time
      );

      setState((prev) => ({
        ...prev,
        preferredDate: date,
        preferredTime: time,
        recommendedSlots: slots,
        phase: ConversationPhase.SLOT_RECOMMENDATION,
      }));
    } catch (err) {
      setError('Failed to fetch available slots. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSlotSelected = (slot: TimeSlot) => {
    setState((prev) => ({
      ...prev,
      selectedSlot: slot,
      phase: ConversationPhase.BOOKING_CONFIRMATION,
      patientInfo: {},
    }));
  };

  const handleRequestAlternatives = async () => {
    if (!state.appointmentType) return;

    setIsLoading(true);
    setError(null);

    try {
      // Generate slots for next week
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const slots = await getAvailableTimeSlots(
        state.appointmentType,
        nextWeek.toISOString().split('T')[0]
      );

      setState((prev) => ({
        ...prev,
        recommendedSlots: slots,
        preferredDate: nextWeek.toISOString().split('T')[0],
      }));
    } catch (err) {
      setError('Failed to fetch alternative slots. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePatientInfoCollected = (info: PatientInfo) => {
    setState((prev) => ({
      ...prev,
      patientInfo: info,
    }));
  };

  const handleBookingConfirmed = async () => {
    if (!state.appointmentType || !state.selectedSlot || !state.patientInfo) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, you would get the event type URI from Calendly
      const eventTypeUri = `event_type_${state.appointmentType}`;
      
      await createAppointment(
        eventTypeUri,
        state.patientInfo.email,
        state.patientInfo.name,
        state.selectedSlot.start,
        [
          {
            question: 'Reason for visit',
            answer: state.patientInfo.reason,
          },
        ]
      );

      setState((prev) => ({
        ...prev,
        phase: ConversationPhase.COMPLETED,
      }));
    } catch (err) {
      setError('Failed to create appointment. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPhase = () => {
    switch (state.phase) {
      case ConversationPhase.GREETING:
        return <GreetingPhase onComplete={handleGreetingComplete} />;

      case ConversationPhase.UNDERSTANDING_NEEDS:
        return (
          <UnderstandingNeedsPhase
            onReasonProvided={handleReasonProvided}
            initialReason={state.reason}
          />
        );

      case ConversationPhase.APPOINTMENT_TYPE:
        return (
          <AppointmentTypePhase
            onTypeSelected={handleAppointmentTypeSelected}
            reason={state.reason}
          />
        );

      case ConversationPhase.PREFERRED_TIME:
        return (
          <PreferredTimePhase
            onTimeProvided={handlePreferredTimeProvided}
            isLoading={isLoading}
          />
        );

      case ConversationPhase.SLOT_RECOMMENDATION:
        return (
          <SlotRecommendationPhase
            slots={state.recommendedSlots || []}
            appointmentType={state.appointmentType!}
            onSlotSelected={handleSlotSelected}
            onRequestAlternatives={handleRequestAlternatives}
            isLoading={isLoading}
          />
        );

      case ConversationPhase.BOOKING_CONFIRMATION:
        return (
          <BookingConfirmationPhase
            appointmentType={state.appointmentType!}
            selectedSlot={state.selectedSlot!}
            reason={state.reason || ''}
            patientInfo={state.patientInfo}
            onInfoCollected={handlePatientInfoCollected}
            onConfirmed={handleBookingConfirmed}
            isLoading={isLoading}
          />
        );

      case ConversationPhase.COMPLETED:
        return (
          <CompletedPhase
            appointmentType={state.appointmentType!}
            selectedSlot={state.selectedSlot!}
            patientInfo={state.patientInfo!}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="conversation-flow">
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      <div className="conversation-container">{renderPhase()}</div>
    </div>
  );
};

export default ConversationFlow;

