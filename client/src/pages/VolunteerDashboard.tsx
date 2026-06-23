import { useState, useEffect } from 'react';
import { useAppSelector } from '../hooks/useAppStore';
import { volunteerApi, taskApi } from '../services/api';
import { VolunteerTask, TaskStatus } from '../types';
import Skeleton from '../components/Skeleton';
import PageTitle from '../components/PageTitle';

const VolunteerDashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [tasks, setTasks] = useState<VolunteerTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      try {
        const res = await volunteerApi.getTasks(user.id);
        setTasks(res.data.data);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [user]);

  const updateStatus = async (taskId: string, status: string) => {
    try {
      await taskApi.updateStatus(taskId, status);
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: status as TaskStatus } : t))
      );
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <PageTitle title="Volunteer Dashboard" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-4 text-center space-y-2">
              <Skeleton className="h-8 w-12 mx-auto" />
              <Skeleton className="h-4 w-16 mx-auto" />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card-hover p-6 space-y-3">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-9 w-28 rounded-btn" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const tasksByStatus = (status: string) =>
    tasks.filter((t) => t.status === status);

  const statusCounts = [
    { status: 'pending', label: 'Pending' },
    { status: 'accepted', label: 'Accepted' },
    { status: 'in_progress', label: 'In Progress' },
    { status: 'completed', label: 'Completed' },
  ];

  return (
    <div>
      <PageTitle title="Volunteer Dashboard" />
      <div className="mb-8">
        <h1 className="page-title">Volunteer Dashboard</h1>
        <p className="page-subtitle">
          Welcome, <span className="text-ink font-medium">{user?.name}</span>. Here are your assigned tasks.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statusCounts.map((sc) => (
          <div key={sc.status} className="card p-4 text-center">
            <p className="text-2xl font-bold text-ink">{tasksByStatus(sc.status).length}</p>
            <p className="text-sm text-ink-secondary">{sc.label}</p>
          </div>
        ))}
      </div>

      {tasks.length === 0 ? (
        <div className="card p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-ink-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-ink-muted text-sm">No tasks assigned yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="card-hover p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-ink">{task.title}</h3>
                    <span className={`badge ${
                      task.status === 'completed' ? 'badge-success' :
                      task.status === 'in_progress' ? 'badge-accent' :
                      task.status === 'accepted' ? 'badge-warning' : 'bg-surface-subtle text-ink-muted'
                    }`}>
                      {task.status.replace('_', ' ')}
                    </span>
                    <span className={`badge ${
                      task.priority === 'urgent' ? 'badge-danger' :
                      task.priority === 'high' ? 'badge-warning' :
                      task.priority === 'medium' ? 'badge-warning' : 'badge-accent'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-ink-secondary">{task.description}</p>
                  {task.progressUpdates && task.progressUpdates.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {task.progressUpdates.map((update, j) => (
                        <div key={j} className="flex items-start space-x-2 text-sm text-ink-secondary bg-surface-subtle rounded-btn p-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5" />
                          <span>{update.message}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 flex space-x-3">
                {task.status === 'pending' && (
                  <button onClick={() => updateStatus(task._id, 'accepted')} className="btn-primary">
                    Accept Task
                  </button>
                )}
                {task.status === 'accepted' && (
                  <button onClick={() => updateStatus(task._id, 'in_progress')} className="btn-primary">
                    Start Working
                  </button>
                )}
                {task.status === 'in_progress' && (
                  <button onClick={() => updateStatus(task._id, 'completed')} className="btn-success">
                    Mark Complete
                  </button>
                )}
                {(task.status === 'completed' || task.status === 'cancelled') && (
                  <span className="text-sm text-ink-muted italic">No actions available</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VolunteerDashboard;
