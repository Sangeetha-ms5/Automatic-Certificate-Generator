import { Award, Calendar, Users, Mail } from "lucide-react";
import { useNavigate } from "react-router";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

export function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/admin-login");
  };

  const stats = [
    {
      title: "Total Certificates Generated",
      value: "1,284",
      icon: Award,
      color: "blue",
      trend: "+12% from last month",
    },
    {
      title: "Active Events",
      value: "24",
      icon: Calendar,
      color: "green",
      trend: "8 events this week",
    },
    {
      title: "Registered Participants",
      value: "3,562",
      icon: Users,
      color: "purple",
      trend: "+156 new this week",
    },
    {
      title: "Emails Sent",
      value: "1,128",
      icon: Mail,
      color: "orange",
      trend: "98.5% delivery rate",
    },
  ];

  const recentActivity = [
    { name: "John Smith", event: "Web Development Workshop", date: "2026-04-23", type: "Completion" },
    { name: "Sarah Johnson", event: "Leadership Training", date: "2026-04-23", type: "Achievement" },
    { name: "Mike Chen", event: "Annual Conference", date: "2026-04-22", type: "Participation" },
    { name: "Emily Davis", event: "Community Service", date: "2026-04-22", type: "Appreciation" },
    { name: "Alex Martinez", event: "Tech Summit 2026", date: "2026-04-21", type: "Participation" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1">
        <AdminHeader title="Dashboard" onLogout={handleLogout} />

        <main className="p-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const colorClasses: Record<string, string> = {
                blue: "bg-blue-100 text-blue-600",
                green: "bg-green-100 text-green-600",
                purple: "bg-purple-100 text-purple-600",
                orange: "bg-orange-100 text-orange-600",
              };

              return (
                <div key={index} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${colorClasses[stat.color]} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.trend}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Participant</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Event</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((activity, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 text-sm text-gray-900">{activity.name}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{activity.event}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{activity.type}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{activity.date}</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Sent
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
