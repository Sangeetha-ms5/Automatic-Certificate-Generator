import { useState } from "react";
import { useNavigate } from "react-router";
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

export function EventManagement() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([
    { id: 1, name: "Web Development Workshop", type: "Completion", participants: 45, status: "active", date: "2026-05-15" },
    { id: 2, name: "Leadership Training", type: "Achievement", participants: 32, status: "active", date: "2026-06-01" },
    { id: 3, name: "Annual Conference", type: "Participation", participants: 120, status: "active", date: "2026-07-10" },
    { id: 4, name: "Community Service Day", type: "Appreciation", participants: 68, status: "inactive", date: "2026-04-20" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: "",
    type: "participation",
    date: "",
  });

  const handleCreateEvent = () => {
    if (newEvent.name && newEvent.date) {
      setEvents([...events, {
        id: events.length + 1,
        name: newEvent.name,
        type: newEvent.type,
        participants: 0,
        status: "active",
        date: newEvent.date,
      }]);
      setNewEvent({ name: "", type: "participation", date: "" });
      setShowModal(false);
    }
  };

  const toggleStatus = (id: number) => {
    setEvents(events.map(event =>
      event.id === id
        ? { ...event, status: event.status === "active" ? "inactive" : "active" }
        : event
    ));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1">
        <AdminHeader
          title="Event Management"
          onLogout={() => {
            localStorage.removeItem("adminAuth");
            navigate("/admin-login");
          }}
        />

        <main className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">All Events</h2>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Event
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Event Name</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Certificate Type</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Participants</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Date</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">{event.name}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{event.type}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{event.participants}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{event.date}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        event.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleStatus(event.id)}
                          className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          {event.status === "active" ? (
                            <ToggleRight className="w-5 h-5" />
                          ) : (
                            <ToggleLeft className="w-5 h-5" />
                          )}
                        </button>
                        <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Create New Event</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Name</label>
                  <input
                    type="text"
                    value={newEvent.name}
                    onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Enter event name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Type</label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="participation">Participation</option>
                    <option value="achievement">Achievement</option>
                    <option value="appreciation">Appreciation</option>
                    <option value="completion">Completion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateEvent}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
