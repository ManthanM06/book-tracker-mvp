import { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ReadingStats = () => {
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({ totalPages: 0, totalTime: 0, speed: 0 });
  const [chartData, setChartData] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get("/api/sessions", config);
        setSessions(data);
        processData(data);
      } catch (error) {
        console.error("Error fetching sessions", error);
      }
    };

    fetchSessions();
  }, [user]);

  const processData = (data) => {
    // 1. Calculate Totals
    let pages = 0;
    let minutes = 0;

    // 2. Group by Date for the Chart
    const dailyData = {};

    data.forEach((session) => {
      pages += session.pagesRead;
      minutes += session.durationMinutes;

      // Format date as "Mon DD" (e.g., "Oct 25")
      const dateKey = new Date(session.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      if (dailyData[dateKey]) {
        dailyData[dateKey] += session.pagesRead;
      } else {
        dailyData[dateKey] = session.pagesRead;
      }
    });

    // 3. Calculate Speed (Pages per Hour)
    const hours = minutes / 60;
    const speed = hours > 0 ? (pages / hours).toFixed(1) : 0;

    setStats({ totalPages: pages, totalTime: minutes, speed });

    // 4. Convert Object to Array for Recharts
    // We reverse it to show oldest -> newest if the API returns newest first
    const chartArray = Object.keys(dailyData)
      .map((key) => ({
        date: key,
        pages: dailyData[key],
      }))
      .slice(-7); // Only show last 7 active days

    setChartData(chartArray);
  };

  if (sessions.length === 0) return null; // Don't show stats if user is new

  return (
    <div className="mb-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm font-bold">TOTAL PAGES READ</p>
          <p className="text-2xl font-bold text-gray-800">{stats.totalPages}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-gray-500 text-sm font-bold">TOTAL READING TIME</p>
          <p className="text-2xl font-bold text-gray-800">
            {Math.floor(stats.totalTime / 60)}h {stats.totalTime % 60}m
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <p className="text-gray-500 text-sm font-bold">READING SPEED</p>
          <p className="text-2xl font-bold text-gray-800">
            {stats.speed}{" "}
            <span className="text-sm font-normal text-gray-500">pages/hr</span>
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold text-gray-700 mb-4">
          Activity (Last 7 Sessions)
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar
                dataKey="pages"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ReadingStats;
