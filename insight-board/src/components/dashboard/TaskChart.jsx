import { useMemo } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";
import { useTheme } from "../../hooks/ThemeContext";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const TaskChart = ({ visibleTasks }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const accent = useMemo(() => {
    if (typeof window === "undefined") return "#7c3aed";
    const v = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
    return v || "#7c3aed";
  }, [isDark]);

  const total = visibleTasks.length;
  const completed = visibleTasks.filter((t) => t.status === "Completed").length;
  const pending = visibleTasks.filter((t) => t.status !== "Completed").length;

  // pie data
  const pieData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        data: [completed, pending],
        backgroundColor: ["#4ade80", "#fde68a"],
      },
    ],
  };

  // bar data by priority
  const priorities = ["Low", "Medium", "High"];
  const byPriority = priorities.map(
    (p) => visibleTasks.filter((t) => t.priority === p).length
  );
  const barData = {
    labels: priorities,
    datasets: [
      {
        label: "Tasks",
        data: byPriority,
        backgroundColor: accent,
      },
    ],
  };

  // line data tasks created per day (last 7 days)
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  const counts = dates.map(
    (date) => visibleTasks.filter((t) => t.createdAt.slice(0, 10) === date).length
  );
  const lineData = {
    labels: dates,
    datasets: [
      {
        label: "Created",
        data: counts,
        borderColor: "#f97316",
        tension: 0.3,
      },
    ],
  };

  const commonOptions = useMemo(() => {
    const gridColor = isDark ? "rgba(113,113,122,0.26)" : "rgba(107,114,128,0.15)";
    const tickColor = isDark ? "rgba(244,244,245,0.85)" : "rgba(55,65,81,0.85)";
    return {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: tickColor },
        },
        tooltip: {
          enabled: true,
        },
      },
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { color: tickColor },
        },
        y: {
          grid: { color: gridColor },
          ticks: { color: tickColor },
        },
      },
    };
  }, [isDark]);

  const pieOptions = useMemo(() => {
    const tickColor = isDark ? "rgba(244,244,245,0.85)" : "rgba(55,65,81,0.85)";
    return {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: tickColor },
        },
      },
    };
  }, [isDark]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="p-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] shadow-sm">
        <div className="text-sm font-semibold text-[color:var(--text)] mb-3">
          Completion
        </div>
        <Pie data={pieData} options={pieOptions} />
      </div>
      <div className="p-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] shadow-sm">
        <div className="text-sm font-semibold text-[color:var(--text)] mb-3">
          Priority breakdown
        </div>
        <Bar data={barData} options={commonOptions} />
      </div>
      <div className="p-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] shadow-sm md:col-span-2">
        <div className="text-sm font-semibold text-[color:var(--text)] mb-3">
          Tasks created (last 7 days)
        </div>
        <Line data={lineData} options={commonOptions} />
      </div>
    </div>
  );
};

export default TaskChart;
