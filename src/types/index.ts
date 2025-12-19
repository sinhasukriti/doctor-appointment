export enum AppointmentType {
  GENERAL_CONSULTATION = 'GENERAL_CONSULTATION',
  FOLLOW_UP = 'FOLLOW_UP',
  PHYSICAL_EXAM = 'PHYSICAL_EXAM',
  SPECIALIST_CONSULTATION = 'SPECIALIST_CONSULTATION',
}

export interface AppointmentTypeConfig {
  type: AppointmentType;
  label: string;
  duration: number; // in minutes
}

export interface TimeSlot {
  start: string; // ISO datetime string
  end: string; // ISO datetime string
  available: boolean;
}

export interface PatientInfo {
  name: string;
  phone: string;
  email: string;
  reason: string;
}

export interface AppointmentDetails {
  type: AppointmentType;
  patientInfo: PatientInfo;
  selectedSlot: TimeSlot;
}

export enum ConversationPhase {
  GREETING = 'GREETING',
  UNDERSTANDING_NEEDS = 'UNDERSTANDING_NEEDS',
  APPOINTMENT_TYPE = 'APPOINTMENT_TYPE',
  PREFERRED_TIME = 'PREFERRED_TIME',
  SLOT_RECOMMENDATION = 'SLOT_RECOMMENDATION',
  BOOKING_CONFIRMATION = 'BOOKING_CONFIRMATION',
  COMPLETED = 'COMPLETED',
}

export interface ConversationState {
  phase: ConversationPhase;
  appointmentType?: AppointmentType;
  preferredDate?: string;
  preferredTime?: string;
  reason?: string;
  recommendedSlots?: TimeSlot[];
  selectedSlot?: TimeSlot;
  patientInfo?: Partial<PatientInfo>;
}

