import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Meeting } from '../../types/index';

interface MeetingsState {
  meetings: Meeting[];
  loading: boolean;
  error: string | null;
}

// Mock meetings data
const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Sprint Planning',
    description: 'Plan tasks for the upcoming sprint',
    startTime: new Date('2025-01-25T10:00:00'),
    endTime: new Date('2025-01-25T11:30:00'),
    attendeeIds: ['1', '2', '3'],
    location: 'Conference Room A',
    meetingLink: 'https://meet.example.com/sprint-planning',
    agenda: ['Review previous sprint', 'Plan new tasks', 'Assign responsibilities'],
    projectId: 'proj-1',
    createdBy: '1',
    status: 'scheduled',
  },
  {
    id: '2',
    title: 'Design Review',
    description: 'Review new dashboard designs',
    startTime: new Date('2025-01-26T14:00:00'),
    endTime: new Date('2025-01-26T15:00:00'),
    attendeeIds: ['1', '4'],
    meetingLink: 'https://meet.example.com/design-review',
    agenda: ['Present new designs', 'Gather feedback', 'Discuss next steps'],
    projectId: 'proj-1',
    createdBy: '1',
    status: 'scheduled',
  },
  {
    id: '3',
    title: 'Team Standup',
    description: 'Daily team standup meeting',
    startTime: new Date('2025-01-24T09:00:00'),
    endTime: new Date('2025-01-24T09:30:00'),
    attendeeIds: ['1', '2', '3', '4'],
    meetingLink: 'https://meet.example.com/standup',
    agenda: ['What did you do yesterday?', 'What will you do today?', 'Any blockers?'],
    createdBy: '1',
    status: 'completed',
  },
  {
    id: '4',
    title: 'Client Presentation',
    description: 'Present project progress to client',
    startTime: new Date('2025-01-27T16:00:00'),
    endTime: new Date('2025-01-27T17:00:00'),
    attendeeIds: ['1', '2'],
    location: 'Client Office',
    meetingLink: 'https://meet.example.com/client-presentation',
    agenda: ['Demo current features', 'Discuss timeline', 'Get feedback'],
    projectId: 'proj-1',
    createdBy: '1',
    status: 'scheduled',
  },
];

const initialState: MeetingsState = {
  meetings: mockMeetings,
  loading: false,
  error: null,
};

const meetingsSlice = createSlice({
  name: 'meetings',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addMeeting: (state, action: PayloadAction<Omit<Meeting, 'id'>>) => {
      const newMeeting: Meeting = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.meetings.push(newMeeting);
    },
    updateMeeting: (state, action: PayloadAction<{ id: string; updates: Partial<Meeting> }>) => {
      const { id, updates } = action.payload;
      const meetingIndex = state.meetings.findIndex(meeting => meeting.id === id);
      if (meetingIndex !== -1) {
        state.meetings[meetingIndex] = {
          ...state.meetings[meetingIndex],
          ...updates,
        };
      }
    },
    deleteMeeting: (state, action: PayloadAction<string>) => {
      state.meetings = state.meetings.filter(meeting => meeting.id !== action.payload);
    },
    updateMeetingStatus: (state, action: PayloadAction<{ id: string; status: Meeting['status'] }>) => {
      const { id, status } = action.payload;
      const meeting = state.meetings.find(meeting => meeting.id === id);
      if (meeting) {
        meeting.status = status;
      }
    },
    addAttendee: (state, action: PayloadAction<{ meetingId: string; attendeeId: string }>) => {
      const { meetingId, attendeeId } = action.payload;
      const meeting = state.meetings.find(meeting => meeting.id === meetingId);
      if (meeting && !meeting.attendeeIds.includes(attendeeId)) {
        meeting.attendeeIds.push(attendeeId);
      }
    },
    removeAttendee: (state, action: PayloadAction<{ meetingId: string; attendeeId: string }>) => {
      const { meetingId, attendeeId } = action.payload;
      const meeting = state.meetings.find(meeting => meeting.id === meetingId);
      if (meeting) {
        meeting.attendeeIds = meeting.attendeeIds.filter(id => id !== attendeeId);
      }
    },
  },
});

export const {
  setLoading,
  setError,
  addMeeting,
  updateMeeting,
  deleteMeeting,
  updateMeetingStatus,
  addAttendee,
  removeAttendee,
} = meetingsSlice.actions;

export default meetingsSlice.reducer;