import { useState } from 'react'
import { AppShell } from './components/layout/AppShell'
import { useAuth } from './hooks/useAuth'
import { useAppSelector } from './store'
import { Button } from './components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/Card'
import { Badge } from './components/ui/Badge'
import { TasksPage } from './pages/TasksPage'

type CurrentPage = 'dashboard' | 'tasks' | 'calendar' | 'meetings' | 'projects' | 'team' | 'analytics';

function App() {
  const [count, setCount] = useState(0)
  const [currentPage, setCurrentPage] = useState<CurrentPage>('dashboard')
  const { isAuthenticated, loading } = useAuth()
  const tasks = useAppSelector(state => state.tasks.tasks)
  const projects = useAppSelector(state => state.projects.projects)
  const members = useAppSelector(state => state.teams.members)

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading Uniteam...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-neutral-900 mb-4">
            Welcome to Uniteam
          </h1>
          <p className="text-neutral-600">
            Please wait while we set up your workspace...
          </p>
        </div>
      </div>
    )
  }

  // Calculate stats from real data
  const activeTasks = tasks.filter(task => task.status === 'in_progress').length
  const completedTasks = tasks.filter(task => task.status === 'completed').length
  const overdueTasks = tasks.filter(task => task.status === 'overdue').length
  const activeProjects = projects.filter(project => project.status === 'active').length

  // Navigation handler
  const handleNavigation = (page: CurrentPage) => {
    setCurrentPage(page);
  };

  // Render current page content
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'tasks':
        return <TasksPage />;
      case 'dashboard':
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Dashboard Content */}
      {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
            Dashboard
          </h1>
          <p className="text-base font-normal text-neutral-600 dark:text-neutral-400 mt-1">
            Welcome back! Here's what's happening with your projects and tasks today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card hover>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Active Tasks</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mt-2">{activeTasks}</p>
                </div>
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <Badge variant="success" size="sm">+12%</Badge>
                <span className="text-sm text-neutral-500 dark:text-neutral-400 ml-2">from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Completed</p>
                  <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mt-2">{completedTasks}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <Badge variant="success" size="sm">+8%</Badge>
                <span className="text-sm text-neutral-500 dark:text-neutral-400 ml-2">from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Team Members</p>
                  <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mt-2">{members.length}</p>
                </div>
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <Badge variant="primary" size="sm">+2</Badge>
                <span className="text-sm text-neutral-500 dark:text-neutral-400 ml-2">new this month</span>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Projects</p>
                  <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mt-2">{activeProjects}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <Badge variant="warning" size="sm">{overdueTasks} overdue</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Tasks</CardTitle>
                <Button variant="ghost" size="sm">View all</Button>
              </div>
            </CardHeader>
            <CardContent>
            <div className="space-y-4">
              {[
                { title: 'Update user dashboard design', status: 'In Progress', priority: 'High' },
                { title: 'Review API documentation', status: 'Pending', priority: 'Medium' },
                { title: 'Setup CI/CD pipeline', status: 'Completed', priority: 'High' },
                { title: 'Write unit tests', status: 'In Progress', priority: 'Low' },
              ].map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors duration-200">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                      {task.title}
                    </p>
                    <div className="flex items-center mt-1 space-x-2">
                      <Badge 
                        variant={
                          task.status === 'Completed' ? 'success' :
                          task.status === 'In Progress' ? 'primary' : 'default'
                        }
                        size="sm"
                      >
                        {task.status}
                      </Badge>
                      <Badge 
                        variant={
                          task.priority === 'High' ? 'error' :
                          task.priority === 'Medium' ? 'warning' : 'default'
                        }
                        size="sm"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Team Activity</CardTitle>
                <Button variant="ghost" size="sm">View all</Button>
              </div>
            </CardHeader>
            <CardContent>
            <div className="space-y-4">
              {[
                { user: 'Sarah Chen', action: 'completed', target: 'Website Redesign', time: '2 hours ago' },
                { user: 'Mike Johnson', action: 'created', target: 'New Feature Request', time: '4 hours ago' },
                { user: 'Emily Davis', action: 'commented on', target: 'Bug Report #123', time: '6 hours ago' },
                { user: 'Alex Kim', action: 'assigned', target: 'Database Migration', time: '1 day ago' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                      {activity.user.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-900 dark:text-neutral-100">
                      <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                      <span className="font-medium">{activity.target}</span>
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Interactive Demo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base text-neutral-600 dark:text-neutral-400 mb-6">
              Test the button interactions and see the polished design system in action.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="primary"
                onClick={() => setCount((count) => count + 1)}
              >
                Primary Action ({count})
              </Button>
              <Button variant="secondary">
                Secondary Action
              </Button>
              <Button variant="ghost">
                Ghost Action
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <AppShell onNavigate={handleNavigation} currentPage={currentPage}>
      {renderCurrentPage()}
    </AppShell>
  )
}

export default App
