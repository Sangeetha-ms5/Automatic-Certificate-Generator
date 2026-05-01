import { useNavigate } from "react-router";
import { Mail, CheckCircle, XCircle, Clock, Send } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

export function EmailAutomation() {
  const navigate = useNavigate();
  const emailStats = [
    { label: "Total Sent", value: "1,128", icon: Send, color: "blue" },
    { label: "Delivered", value: "1,112", icon: CheckCircle, color: "green" },
    { label: "Failed", value: "8", icon: XCircle, color: "red" },
    { label: "Pending", value: "8", icon: Clock, color: "yellow" },
  ];

  const recentEmails = [
    { id: 1, recipient: "john@example.com", subject: "Your Certificate is Ready", certId: "CERT-2026-001", status: "delivered", time: "2 mins ago" },
    { id: 2, recipient: "sarah@example.com", subject: "Your Certificate is Ready", certId: "CERT-2026-002", status: "delivered", time: "5 mins ago" },
    { id: 3, recipient: "mike@example.com", subject: "Your Certificate is Ready", certId: "CERT-2026-003", status: "delivered", time: "12 mins ago" },
    { id: 4, recipient: "emily@example.com", subject: "Your Certificate is Ready", certId: "CERT-2026-004", status: "pending", time: "15 mins ago" },
    { id: 5, recipient: "alex@example.com", subject: "Your Certificate is Ready", certId: "CERT-2026-005", status: "delivered", time: "23 mins ago" },
    { id: 6, recipient: "lisa@example.com", subject: "Your Certificate is Ready", certId: "CERT-2026-006", status: "delivered", time: "45 mins ago" },
    { id: 7, recipient: "invalid@email", subject: "Your Certificate is Ready", certId: "CERT-2026-007", status: "failed", time: "1 hour ago" },
    { id: 8, recipient: "maria@example.com", subject: "Your Certificate is Ready", certId: "CERT-2026-008", status: "delivered", time: "2 hours ago" },
  ];

  const colorClasses: Record<string, { bg: string; text: string }> = {
    blue: { bg: "bg-blue-100", text: "text-blue-600" },
    green: { bg: "bg-green-100", text: "text-green-600" },
    red: { bg: "bg-red-100", text: "text-red-600" },
    yellow: { bg: "bg-yellow-100", text: "text-yellow-600" },
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1">
        <AdminHeader
          title="Email Automation Panel"
          onLogout={() => {
            localStorage.removeItem("adminAuth");
            navigate("/admin-login");
          }}
        />

        <main className="p-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {emailStats.map((stat, index) => {
              const Icon = stat.icon;
              const colors = colorClasses[stat.color];

              return (
                <div key={index} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Email Configuration</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Edit Settings
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-1">SMTP Server</p>
                <p className="font-medium text-gray-900">smtp.example.com</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-1">From Address</p>
                <p className="font-medium text-gray-900">certificates@certifypro.com</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-1">Daily Limit</p>
                <p className="font-medium text-gray-900">1,000 emails</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-1">Delivery Rate</p>
                <p className="font-medium text-green-600">98.5%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Email Activity</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Recipient</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Subject</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Certificate ID</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEmails.map((email) => (
                    <tr key={email.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6 text-sm text-gray-900">{email.recipient}</td>
                      <td className="py-4 px-6 text-sm text-gray-600">{email.subject}</td>
                      <td className="py-4 px-6 text-sm font-medium text-blue-600">{email.certId}</td>
                      <td className="py-4 px-6">
                        {email.status === "delivered" && (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-600">Delivered</span>
                          </div>
                        )}
                        {email.status === "pending" && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm text-yellow-600">Pending</span>
                          </div>
                        )}
                        {email.status === "failed" && (
                          <div className="flex items-center gap-2">
                            <XCircle className="w-4 h-4 text-red-600" />
                            <span className="text-sm text-red-600">Failed</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">{email.time}</td>
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
