import React, { useState, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../store';
import { addTask } from '../store/slices/tasksSlice';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { TaskList } from '../components/features/TaskList';
import { AddTaskForm } from '../components/features/AddTaskForm';
import { TaskDetailModal } from '../components/features/TaskDetailModal';
import {
  Add24Regular,
  Grid24Regular,
  List24Regular,
  CheckmarkCircle24Regular,
} from '@fluentui/react-icons';

// Task interface defined locally to avoid import issues
interface Task {
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

type ViewMode = 'list' | 'card';
type FilterMode = 'todo' | 'upcoming' | 'done';

export function TasksPage() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(state => state.tasks?.tasks || []);
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [filterMode, setFilterMode] = useState<FilterMode>('todo');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Helper function to check if a task is overdue
  const isOverdue = (task: Task): boolean => {
    if (!task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today && task.status !== 'completed';
  };

  // Helper function to check if a task is due today
  const isDueToday = (task: Task): boolean => {
    if (!task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime();
  };

  // Helper function to check if a task is upcoming (after today)
  const isUpcoming = (task: Task): boolean => {
    if (!task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate > today;
  };

  // Filter tasks based on current filter mode
  const filteredTasks = useMemo(() => {
    switch (filterMode) {
      case 'todo':
        return tasks.filter(task => 
          task.status !== 'completed' && (isOverdue(task) || isDueToday(task))
        );
      case 'upcoming':
        return tasks.filter(task => 
          task.status !== 'completed' && isUpcoming(task)
        );
      case 'done':
        return tasks.filter(task => task.status === 'completed');
      default:
        return tasks;
    }
  }, [tasks, filterMode]);

  // Group tasks for todo view (overdue and today)
  const groupedTasks = useMemo(() => {
    if (filterMode !== 'todo') return { overdue: [], today: [], upcoming: [] };
    
    const overdue = tasks.filter(task => 
      task.status !== 'completed' && isOverdue(task)
    );
    const today = tasks.filter(task => 
      task.status !== 'completed' && isDueToday(task)
    );
    const upcoming = tasks.filter(task => 
      task.status !== 'completed' && isUpcoming(task)
    );

    return { overdue, today, upcoming };
  }, [tasks, filterMode]);

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch(addTask(newTask));
    setShowAddForm(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
            Tasks
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
            Manage your tasks and stay organized
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Add24Regular className="w-4 h-4" />
          <span className="text-sm font-medium">Add Task</span>
        </Button>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex items-center justify-between">
        {/* Filter Tabs */}
        <div className="flex items-center space-x-0.5 bg-gradient-to-r from-neutral-50 to-blue-50/30 dark:from-neutral-800 dark:to-blue-900/10 rounded-lg p-1 border border-neutral-200/50 dark:border-neutral-700/50">
          <button
            onClick={() => setFilterMode('todo')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-300 ${
              filterMode === 'todo'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20'
            }`}
          >
            Active ({groupedTasks.overdue.length + groupedTasks.today.length})
          </button>
          <button
            onClick={() => setFilterMode('upcoming')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-300 ${
              filterMode === 'upcoming'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20'
            }`}
          >
            Upcoming ({groupedTasks.upcoming.length})
          </button>
          <button
            onClick={() => setFilterMode('done')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-300 ${
              filterMode === 'done'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20'
            }`}
          >
            Completed ({tasks.filter(t => t.status === 'completed').length})
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-0.5 bg-gradient-to-r from-neutral-50 to-blue-50/30 dark:from-neutral-800 dark:to-blue-900/10 rounded-lg p-1 border border-neutral-200/50 dark:border-neutral-700/50">
          <button
            onClick={() => setViewMode('card')}
            className={`px-2.5 py-1.5 rounded-md transition-all duration-300 flex items-center gap-1.5 ${
              viewMode === 'card'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20'
            }`}
            title="Card View"
          >
            <Grid24Regular className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Cards</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-2.5 py-1.5 rounded-md transition-all duration-300 flex items-center gap-1.5 ${
              viewMode === 'list'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20'
            }`}
            title="List View"
          >
            <List24Regular className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">List</span>
          </button>
        </div>
      </div>

      {/* Task Lists */}
      {filterMode === 'todo' ? (
        <div className="space-y-6">
          {/* Overdue Tasks */}
          {groupedTasks.overdue.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-orange-400 to-orange-500"></div>
                  <h2 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Needs Attention
                  </h2>
                </div>
                <div className="px-2 py-0.5 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-full">
                  <span className="text-xs font-medium text-orange-700 dark:text-orange-300">
                    {groupedTasks.overdue.length}
                  </span>
                </div>
              </div>
              <TaskList 
                tasks={groupedTasks.overdue} 
                viewMode={viewMode}
                category="overdue"
                onTaskClick={setSelectedTask}
              />
            </div>
          )}

          {/* Today Tasks */}
          {groupedTasks.today.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-blue-500"></div>
                  <h2 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Due Today
                  </h2>
                </div>
                <div className="px-2 py-0.5 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 rounded-full">
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                    {groupedTasks.today.length}
                  </span>
                </div>
              </div>
              <TaskList 
                tasks={groupedTasks.today} 
                viewMode={viewMode}
                category="today"
                onTaskClick={setSelectedTask}
              />
            </div>
          )}

          {/* Empty state for todo */}
          {groupedTasks.overdue.length === 0 && groupedTasks.today.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-sky-100 dark:from-blue-900/30 dark:to-sky-900/30 rounded-xl flex items-center justify-center mx-auto mb-4 border border-blue-200/50 dark:border-blue-700/50">
                <CheckmarkCircle24Regular className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-2">
                All caught up!
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                No active tasks right now. You're doing great!
              </p>
            </div>
          )}
        </div>
      ) : (
        <TaskList 
          tasks={filteredTasks} 
          viewMode={viewMode}
          category={filterMode}
          onTaskClick={setSelectedTask}
        />
      )}

      {/* Add Task Form Modal */}
      {showAddForm && (
        <AddTaskForm
          onSubmit={handleAddTask}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={(updatedTask) => {
            // Handle task update
            setSelectedTask(updatedTask);
          }}
        />
      )}
    </div>
  );
}
