import Layout from "../components/layout/Layout";
import SummaryCard from "../components/dashboard/SummaryCard";
import TaskChart from "../components/dashboard/TaskChart";
import { useTasks } from "../hooks/useTasks";
import { useAuth } from "../hooks/AuthContext";
import ActivityFeed from "../components/dashboard/ActivityFeed";

function Dashboard() {
  const { user } = useAuth();
  const { tasks, activity } = useTasks();

  // only managers see analytics; members see a limited view
  const visibleTasks =
    user?.role === "manager"
      ? tasks
      : tasks.filter((t) => t.assignedTo === user.email);

  const total = visibleTasks.length;
  const completed = visibleTasks.filter((t) => t.status === "Completed").length;
  const pending = visibleTasks.filter((t) => t.status !== "Completed").length;
  const completionRate = total ? Math.round((completed / total) * 100) : 0;

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <SummaryCard title="Total Tasks" value={total} />
        <SummaryCard title="Completed" value={completed} />
        <SummaryCard title="Pending" value={pending} />
        <SummaryCard title="Completion Rate" value={`${completionRate}%`} />
      </div>

      {user?.role === "manager" ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <TaskChart visibleTasks={visibleTasks} />
          </div>
          <div className="xl:col-span-1">
            <ActivityFeed items={activity} />
          </div>
        </div>
      ) : null}
    </Layout>
  );
}

export default Dashboard;