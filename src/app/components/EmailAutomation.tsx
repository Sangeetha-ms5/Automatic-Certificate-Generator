import { useNavigate } from "react-router";
import { Send } from "lucide-react";
import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

export function EmailAutomation() {
  const navigate = useNavigate();

  /* =========================
     STATES
  ========================= */
  const [recentEmails, setRecentEmails] = useState<any[]>([]);
  const [recipientEmail, setRecipientEmail] = useState("");

  const [stats, setStats] = useState({
    sent: 0,
    delivered: 0,
    failed: 0,
    pending: 0,
  });

  const emailConfig = {
    smtp: "smtp.gmail.com",
    from: "admin@college.com",
    limit: "500/day",
    deliveryRate: "98%",
  };

  /* =========================
     SEND EMAIL
  ========================= */
  const handleSendEmail = () => {
    if (!recipientEmail) return;

    const id = Date.now();

    const newEmail = {
      id,
      recipient: recipientEmail,
      subject: "Certificate Issued",
      certId: `CERT${Math.floor(Math.random() * 1000)}`,
      status: "Pending",
      time: "Sending...",
    };

    /* Add Email */
    setRecentEmails((prev) => [newEmail, ...prev]);

    /* Update Stats */
    setStats((prev) => ({
      ...prev,
      sent: prev.sent + 1,
      pending: prev.pending + 1,
    }));

    setRecipientEmail("");

    /* =========================
       SIMULATE DELIVERY RESULT
    ========================= */
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success

      setRecentEmails((prev) =>
        prev.map((mail) =>
          mail.id === id
            ? {
                ...mail,
                status: success ? "Delivered" : "Failed",
                time: "Just now",
              }
            : mail
        )
      );

      setStats((prev) => ({
        ...prev,
        pending: prev.pending - 1,
        delivered: success
          ? prev.delivered + 1
          : prev.delivered,
        failed: !success ? prev.failed + 1 : prev.failed,
      }));
    }, 2000);
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

          {/* ================= STATS ================= */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

            <StatCard title="Emails Sent" value={stats.sent} />
            <StatCard title="Delivered" value={stats.delivered} />
            <StatCard title="Failed" value={stats.failed} />
            <StatCard title="Pending" value={stats.pending} />

          </div>

          {/* ================= SEND EMAIL ================= */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Send Certificate Email
            </h2>

            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter recipient email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="border p-2 flex-1 rounded"
              />

              <button
                onClick={handleSendEmail}
                className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <Send size={18} /> Send Email
              </button>
            </div>
          </div>

          {/* ================= CONFIG ================= */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Email Configuration
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <ConfigBox label="SMTP Server" value={emailConfig.smtp} />
              <ConfigBox label="From Address" value={emailConfig.from} />
              <ConfigBox label="Daily Limit" value={emailConfig.limit} />
              <ConfigBox label="Delivery Rate" value={emailConfig.deliveryRate} />
            </div>
          </div>

          {/* ================= RECENT EMAILS ================= */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">
                Recent Email Activity
              </h2>
            </div>

            {recentEmails.length === 0 ? (
              <p className="p-6">No email activity available</p>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-4 px-6 text-left">Recipient</th>
                    <th className="py-4 px-6 text-left">Subject</th>
                    <th className="py-4 px-6 text-left">Certificate ID</th>
                    <th className="py-4 px-6 text-left">Status</th>
                    <th className="py-4 px-6 text-left">Time</th>
                  </tr>
                </thead>

                <tbody>
                  {recentEmails.map((email) => (
                    <tr key={email.id} className="border-t">
                      <td className="py-4 px-6">{email.recipient}</td>
                      <td className="py-4 px-6">{email.subject}</td>
                      <td className="py-4 px-6 text-blue-600">
                        {email.certId}
                      </td>
                      <td
                        className={`py-4 px-6 font-medium ${
                          email.status === "Delivered"
                            ? "text-green-600"
                            : email.status === "Failed"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {email.status}
                      </td>
                      <td className="py-4 px-6 text-gray-500">
                        {email.time}
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

/* ================= COMPONENTS ================= */

function StatCard({ title, value }: any) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function ConfigBox({ label, value }: any) {
  return (
    <div className="p-4 bg-gray-50 rounded">
      <p className="text-gray-600">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}