import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Team, User } from '../../types/index';

interface TeamsState {
  teams: Team[];
  members: User[];
  loading: boolean;
  error: string | null;
}

// Mock team members data
const mockMembers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'team_leader',
    status: 'online',
    lastSeen: new Date(),
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    role: 'member',
    status: 'online',
    lastSeen: new Date(),
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'member',
    status: 'away',
    lastSeen: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    role: 'member',
    status: 'offline',
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: '5',
    name: 'Alex Kim',
    email: 'alex@example.com',
    role: 'admin',
    status: 'online',
    lastSeen: new Date(),
  },
];

// Mock teams data
const mockTeams: Team[] = [
  {
    id: 'team-1',
    name: 'Frontend Team',
    description: 'Responsible for UI/UX development and frontend architecture',
    memberIds: ['1', '2', '3'],
    leaderId: '1',
    createdAt: new Date('2024-12-01'),
  },
  {
    id: 'team-2',
    name: 'Backend Team',
    description: 'Handles server-side development and API design',
    memberIds: ['4', '5'],
    leaderId: '5',
    createdAt: new Date('2024-12-01'),
  },
  {
    id: 'team-3',
    name: 'DevOps Team',
    description: 'Manages infrastructure, deployment, and monitoring',
    memberIds: ['3', '5'],
    leaderId: '5',
    createdAt: new Date('2024-12-15'),
  },
];

const initialState: TeamsState = {
  teams: mockTeams,
  members: mockMembers,
  loading: false,
  error: null,
};

const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addTeam: (state, action: PayloadAction<Omit<Team, 'id' | 'createdAt'>>) => {
      const newTeam: Team = {
        ...action.payload,
        id: `team-${Date.now()}`,
        createdAt: new Date(),
      };
      state.teams.push(newTeam);
    },
    updateTeam: (state, action: PayloadAction<{ id: string; updates: Partial<Team> }>) => {
      const { id, updates } = action.payload;
      const teamIndex = state.teams.findIndex(team => team.id === id);
      if (teamIndex !== -1) {
        state.teams[teamIndex] = {
          ...state.teams[teamIndex],
          ...updates,
        };
      }
    },
    deleteTeam: (state, action: PayloadAction<string>) => {
      state.teams = state.teams.filter(team => team.id !== action.payload);
    },
    addMemberToTeam: (state, action: PayloadAction<{ teamId: string; memberId: string }>) => {
      const { teamId, memberId } = action.payload;
      const team = state.teams.find(team => team.id === teamId);
      if (team && !team.memberIds.includes(memberId)) {
        team.memberIds.push(memberId);
      }
    },
    removeMemberFromTeam: (state, action: PayloadAction<{ teamId: string; memberId: string }>) => {
      const { teamId, memberId } = action.payload;
      const team = state.teams.find(team => team.id === teamId);
      if (team) {
        team.memberIds = team.memberIds.filter(id => id !== memberId);
      }
    },
    updateMemberStatus: (state, action: PayloadAction<{ memberId: string; status: User['status'] }>) => {
      const { memberId, status } = action.payload;
      const member = state.members.find(member => member.id === memberId);
      if (member) {
        member.status = status;
        member.lastSeen = new Date();
      }
    },
    addMember: (state, action: PayloadAction<Omit<User, 'id'>>) => {
      const newMember: User = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.members.push(newMember);
    },
    updateMember: (state, action: PayloadAction<{ id: string; updates: Partial<User> }>) => {
      const { id, updates } = action.payload;
      const memberIndex = state.members.findIndex(member => member.id === id);
      if (memberIndex !== -1) {
        state.members[memberIndex] = {
          ...state.members[memberIndex],
          ...updates,
        };
      }
    },
  },
});

export const {
  setLoading,
  setError,
  addTeam,
  updateTeam,
  deleteTeam,
  addMemberToTeam,
  removeMemberFromTeam,
  updateMemberStatus,
  addMember,
  updateMember,
} = teamsSlice.actions;

export default teamsSlice.reducer;