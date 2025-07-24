// Task types
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
  assigneeId: string;
  projectId?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

// Task filter types
export interface TaskFilters {
  status?: Task['status'][];
  priority?: Task['priority'][];
  assignee?: string[];
  project?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
}
