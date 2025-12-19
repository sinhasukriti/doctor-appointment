import { AppointmentType, AppointmentTypeConfig } from '../types';

export const APPOINTMENT_TYPES: AppointmentTypeConfig[] = [
  {
    type: AppointmentType.GENERAL_CONSULTATION,
    label: 'General Consultation',
    duration: 30,
  },
  {
    type: AppointmentType.FOLLOW_UP,
    label: 'Follow-up',
    duration: 15,
  },
  {
    type: AppointmentType.PHYSICAL_EXAM,
    label: 'Physical Exam',
    duration: 45,
  },
  {
    type: AppointmentType.SPECIALIST_CONSULTATION,
    label: 'Specialist Consultation',
    duration: 60,
  },
];

export const getAppointmentTypeConfig = (
  type: AppointmentType
): AppointmentTypeConfig => {
  const config = APPOINTMENT_TYPES.find((at) => at.type === type);
  if (!config) {
    throw new Error(`Unknown appointment type: ${type}`);
  }
  return config;
};

