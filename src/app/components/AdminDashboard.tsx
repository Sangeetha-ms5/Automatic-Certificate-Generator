import { Award, Calendar, Users, Mail, Trash2, Undo2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

export function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalCertificates: 0,
    activeEvents: 0,
    participants: 0,
    emailsSent: 0,
  });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [deletedItem, setDeletedItem] = useState<any | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/admin-login");
  };

  /* ================= FETCH DASHBOARD ================= */
  const fetchDashboardData = async () => {
    try {
      const [cert, events, users, emails, recent] = await Promise.all([
        fetch("http://localhost:5000/api/stats/total-certificates").then(r => r.json()),
        fetch("http://localhost:5000/api/stats/events").then(r => r.json()),
        fetch("http://localhost:5000/api/stats/participants").then(r => r.json()),
        fetch("http://localhost:5000/api/stats/emails").then(r => r.json()),
        fetch("http://localhost:5000/api/stats/recent").then(r => r.json()),
      ]);

      setStats({
        totalCertificates: cert.totalCertificates || 0,
        activeEvents: events.activeEvents || 0,
        participants: users.totalParticipants || 0,
        emailsSent: emails.emailsSent || 0,
      });

      setRecentActivity(recent.data || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  /* ================= DELETE (SOFT DELETE) ================= */
  const handleDelete = async (item: any) => {
    try {
      await fetch(
        `http://localhost:5000/api/user-data/${item._id}`,
        {
          method: "DELETE",
        }
      );

      // remove instantly from UI
      setRecentActivity((prev) =>
        prev.filter((x) => x._id !== item._id)
      );

      // show undo bar
      setDeletedItem(item);

      // auto hide undo after 5 sec
      setTimeout(() => {
        setDeletedItem(null);
      }, 5000);

    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  /* ================= UNDO DELETE ================= */
  const handleUndo = async () => {
    if (!deletedItem) return;

    try {
      await fetch(
        `http://localhost:5000/api/user-data/restore/${deletedItem._id}`,
        {
          method: "PATCH",
        }
      );

      setRecentActivity((prev) => [
        deletedItem,
        ...prev,
      ]);

      setDeletedItem(null);

    } catch (error) {
      console.error("Undo error:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      <AdminSidebar />

      <div className="flex-1">
        <AdminHeader title="Dashboard" onLogout={handleLogout} />

        <main className="p-8">

          {/* ================= UNDO BAR ================= */}
          {deletedItem && (
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded flex justify-between items-center">
              <p>Record deleted</p>

              <button
                onClick={handleUndo}
                className="flex items-center gap-1 text-blue-600 font-medium"
              >
                <Undo2 size={16} />
                Undo
              </button>
            </div>
          )}

          {/* ================= STATS ================= */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

            <div className="bg-white p-6 rounded-xl shadow">
              <Award className="text-blue-600" />
              <p>Total Certificates</p>
              <h2 className="text-2xl font-bold">
                {stats.totalCertificates}
              </h2>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <Calendar className="text-green-600" />
              <p>Active Events</p>
              <h2 className="text-2xl font-bold">
                {stats.activeEvents}
              </h2>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <Users className="text-purple-600" />
              <p>Participants</p>
              <h2 className="text-2xl font-bold">
                {stats.participants}
              </h2>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <Mail className="text-orange-600" />
              <p>Emails Sent</p>
              <h2 className="text-2xl font-bold">
                {stats.emailsSent}
              </h2>
            </div>

          </div>

          {/* ================= RECENT ACTIVITY ================= */}
          <div className="bg-white rounded-xl shadow-md p-6">

            <h2 className="text-xl font-bold mb-6">
              Recent Activity
            </h2>

            {loading ? (
              <p>Loading...</p>
            ) : recentActivity.length === 0 ? (
              <p className="text-gray-500 text-center py-6">
                No recent activity
              </p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th>Participant</th>
                    <th>Event</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {recentActivity.map((item) => (
                    <tr key={item._id} className="border-b">

                      <td>{item.participantName}</td>
                      <td>{item.eventName}</td>
                      <td>{item.type}</td>
                      <td>{item.date}</td>

                      <td>
                        <button
                          onClick={() => handleDelete(item)}
                          className="text-red-600 flex items-center gap-1"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            )}

          </div>

        </main>
      </div>
    </div>
  );
}