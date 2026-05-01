import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, Download, CheckCircle, Clock } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

export function RecordManagement() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const records = [
    { id: "CERT-2026-001", name: "John Smith", event: "Web Dev Workshop", type: "Completion", email: "john@example.com", date: "2026-04-23", status: "verified" },
    { id: "CERT-2026-002", name: "Sarah Johnson", event: "Leadership Training", type: "Achievement", email: "sarah@example.com", date: "2026-04-23", status: "verified" },
    { id: "CERT-2026-003", name: "Mike Chen", event: "Annual Conference", type: "Participation", email: "mike@example.com", date: "2026-04-22", status: "verified" },
    { id: "CERT-2026-004", name: "Emily Davis", event: "Community Service", type: "Appreciation", email: "emily@example.com", date: "2026-04-22", status: "pending" },
    { id: "CERT-2026-005", name: "Alex Martinez", event: "Tech Summit", type: "Participation", email: "alex@example.com", date: "2026-04-21", status: "verified" },
    { id: "CERT-2026-006", name: "Lisa Wang", event: "Data Science Course", type: "Completion", email: "lisa@example.com", date: "2026-04-21", status: "verified" },
    { id: "CERT-2026-007", name: "David Brown", event: "Sales Excellence", type: "Achievement", email: "david@example.com", date: "2026-04-20", status: "pending" },
    { id: "CERT-2026-008", name: "Maria Garcia", event: "Volunteer Program", type: "Appreciation", email: "maria@example.com", date: "2026-04-20", status: "verified" },
  ];

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || record.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1">
        <AdminHeader
          title="Record Management"
          onLogout={() => {
            localStorage.removeItem("adminAuth");
            navigate("/admin-login");
          }}
        />

        <main className="p-8">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, ID, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="all">All Types</option>
                <option value="participation">Participation</option>
                <option value="achievement">Achievement</option>
                <option value="appreciation">Appreciation</option>
                <option value="completion">Completion</option>
              </select>

              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                Export All
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Certificate ID</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Participant</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Event</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Type</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Email</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Date</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6 text-sm font-medium text-blue-600">{record.id}</td>
                      <td className="py-4 px-6 text-sm text-gray-900">{record.name}</td>
                      <td className="py-4 px-6 text-sm text-gray-600">{record.event}</td>
                      <td className="py-4 px-6 text-sm text-gray-600">{record.type}</td>
                      <td className="py-4 px-6 text-sm text-gray-600">{record.email}</td>
                      <td className="py-4 px-6 text-sm text-gray-600">{record.date}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {record.status === "verified" ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-green-600">Verified</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-4 h-4 text-yellow-600" />
                              <span className="text-sm text-yellow-600">Pending</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredRecords.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                No records found matching your search criteria
              </div>
            )}
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredRecords.length} of {records.length} records
          </div>
        </main>
      </div>
    </div>
  );
}
