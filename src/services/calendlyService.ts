import axios from 'axios';
import { TimeSlot, AppointmentType } from '../types';
import { getAppointmentTypeConfig } from '../config/appointmentTypes';

// Calendly API configuration
// Note: In production, these should be environment variables
const CALENDLY_API_BASE = 'https://api.calendly.com';
const CALENDLY_TOKEN = import.meta.env.VITE_CALENDLY_TOKEN || '';
const CALENDLY_USER_URI = import.meta.env.VITE_CALENDLY_USER_URI || '';

// Mock data for development when Calendly API is not configured
const USE_MOCK_DATA = !CALENDLY_TOKEN || !CALENDLY_USER_URI;

interface CalendlyEventType {
  uri: string;
  name: string;
  duration: number;
}

interface CalendlyAvailabilitySchedule {
  rules: Array<{
    intervals: Array<{ from: string; to: string }>;
    wday: string;
  }>;
}

interface CalendlyEvent {
  uri: string;
  name: string;
  start_time: string;
  end_time: string;
  event_type: string;
}

/**
 * Get doctor's working hours and schedule
 */
export const getDoctorSchedule = async (): Promise<{
  workingHours: { day: string; start: string; end: string }[];
  timezone: string;
}> => {
  if (USE_MOCK_DATA) {
    // Mock working hours: Monday-Friday, 9 AM - 5 PM
    return {
      workingHours: [
        { day: 'monday', start: '09:00', end: '17:00' },
        { day: 'tuesday', start: '09:00', end: '17:00' },
        { day: 'wednesday', start: '09:00', end: '17:00' },
        { day: 'thursday', start: '09:00', end: '17:00' },
        { day: 'friday', start: '09:00', end: '17:00' },
      ],
      timezone: 'America/New_York',
    };
  }

  try {
    const response = await axios.get(
      `${CALENDLY_API_BASE}/user_availability_schedules`,
      {
        headers: {
          Authorization: `Bearer ${CALENDLY_TOKEN}`,
        },
        params: {
          user: CALENDLY_USER_URI,
        },
      }
    );

    const schedules = response.data.collection;
    // Process and return schedule data
    return {
      workingHours: [],
      timezone: 'UTC',
    };
  } catch (error) {
    console.error('Error fetching doctor schedule:', error);
    throw error;
  }
};

/**
 * Get existing appointments for a date range
 */
export const getExistingAppointments = async (
  startDate: string,
  endDate: string
): Promise<CalendlyEvent[]> => {
  if (USE_MOCK_DATA) {
    // Return empty array for mock data
    return [];
  }

  try {
    const response = await axios.get(`${CALENDLY_API_BASE}/scheduled_events`, {
      headers: {
        Authorization: `Bearer ${CALENDLY_TOKEN}`,
      },
      params: {
        user: CALENDLY_USER_URI,
        min_start_time: startDate,
        max_start_time: endDate,
      },
    });

    return response.data.collection || [];
  } catch (error) {
    console.error('Error fetching existing appointments:', error);
    return [];
  }
};

/**
 * Generate available time slots based on appointment type and preferences
 */
export const getAvailableTimeSlots = async (
  appointmentType: AppointmentType,
  preferredDate?: string,
  preferredTime?: string
): Promise<TimeSlot[]> => {
  const config = getAppointmentTypeConfig(appointmentType);
  const duration = config.duration;

  if (USE_MOCK_DATA) {
    // Generate mock available slots
    const baseDate = preferredDate
      ? new Date(preferredDate)
      : new Date(Date.now() + 24 * 60 * 60 * 1000); // Tomorrow

    // Set to start of day
    baseDate.setHours(9, 0, 0, 0);

    const slots: TimeSlot[] = [];
    const startHour = preferredTime
      ? parseInt(preferredTime.split(':')[0])
      : 9;
    const startMinute = preferredTime
      ? parseInt(preferredTime.split(':')[1])
      : 0;

    // Generate 5 slots starting from preferred time or 9 AM
    for (let i = 0; i < 5; i++) {
      const slotStart = new Date(baseDate);
      slotStart.setHours(startHour + i * 2, startMinute, 0, 0);

      // Skip if past 5 PM
      if (slotStart.getHours() >= 17) break;

      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotEnd.getMinutes() + duration);

      slots.push({
        start: slotStart.toISOString(),
        end: slotEnd.toISOString(),
        available: true,
      });
    }

    return slots;
  }

  try {
    const schedule = await getDoctorSchedule();
    const startDate = preferredDate || new Date().toISOString().split('T')[0];
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);

    const existingAppointments = await getExistingAppointments(
      startDate,
      endDate.toISOString()
    );

    // Generate available slots based on working hours and existing appointments
    const slots: TimeSlot[] = [];
    // Implementation would go here to generate real slots

    return slots;
  } catch (error) {
    console.error('Error generating available slots:', error);
    return [];
  }
};

/**
 * Create a new appointment via Calendly API
 */
export const createAppointment = async (
  eventTypeUri: string,
  inviteeEmail: string,
  inviteeName: string,
  startTime: string,
  customQuestions?: Array<{ question: string; answer: string }>
): Promise<{ uri: string; name: string }> => {
  if (USE_MOCK_DATA) {
    // Mock successful appointment creation
    return {
      uri: `https://calendly.com/appointments/mock-${Date.now()}`,
      name: 'Mock Appointment',
    };
  }

  try {
    const response = await axios.post(
      `${CALENDLY_API_BASE}/scheduled_events`,
      {
        event: {
          kind: 'standard',
          event_type: eventTypeUri,
          invitees: [
            {
              email: inviteeEmail,
              name: inviteeName,
            },
          ],
          start_time: startTime,
          custom_questions: customQuestions || [],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${CALENDLY_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      uri: response.data.resource.uri,
      name: response.data.resource.name,
    };
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

