import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, Download, CheckCircle } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

import * as XLSX from "xlsx";
import saveAs from "file-saver";

export function RecordManagement() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [deletedItem, setDeletedItem] = useState<any | null>(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user-data");
      const data = await res.json();

      setRecords(data.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleDelete = async (record: any) => {
    try {
      await fetch(`http://localhost:5000/api/user-data/${record._id}`, {
        method: "DELETE",
      });

      setRecords((prev) =>
        prev.filter((item) => item._id !== record._id)
      );

      setDeletedItem(record);

      setTimeout(() => setDeletedItem(null), 5000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUndo = async () => {
    if (!deletedItem) return;

    try {
      await fetch(
        `http://localhost:5000/api/user-data/restore/${deletedItem._id}`,
        { method: "PATCH" }
      );

      setRecords((prev) => [deletedItem, ...prev]);
      setDeletedItem(null);
    } catch (err) {
      console.error(err);
    }
  };

  /* =========================
     ✅ EXPORT TO EXCEL (FIXED)
  ========================== */
  const handleExport = () => {
    if (filteredRecords.length === 0) {
      alert("No records to export");
      return;
    }

    const exportData = filteredRecords.map((r) => ({
      CertificateID: r.certificateId,
      Name: r.participantName,
      Event: r.eventName,
      Type: r.type,
      Email: r.email,
      Date: r.date,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Records");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(data, `certificate_records.xlsx`);
  };

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.participantName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      record.certificateId
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      record.email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === "all" ||
      record.type?.toLowerCase() === filterType.toLowerCase();

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

          {/* UNDO BAR */}
          {deletedItem && (
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded flex justify-between">
              <p>Record deleted</p>

              <button
                onClick={handleUndo}
                className="text-blue-600 font-medium"
              >
                Undo
              </button>
            </div>
          )}

          {/* SEARCH + FILTER */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">

              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="all">All Types</option>
                <option value="participation">Participation</option>
                <option value="achievement">Achievement</option>
                <option value="appreciation">Appreciation</option>
                <option value="completion">Completion</option>
              </select>

              {/* ✅ EXPORT BUTTON FIXED */}
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                <Download className="w-4 h-4" />
                Export
              </button>

            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">

            {loading ? (
              <div className="p-6 text-center">Loading...</div>
            ) : filteredRecords.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                No records found
              </div>
            ) : (
              <table className="w-full">

                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-4 px-6 text-left">ID</th>
                    <th className="py-4 px-6 text-left">Name</th>
                    <th className="py-4 px-6 text-left">Event</th>
                    <th className="py-4 px-6 text-left">Type</th>
                    <th className="py-4 px-6 text-left">Email</th>
                    <th className="py-4 px-6 text-left">Date</th>
                    <th className="py-4 px-6 text-left">Status</th>
                    <th className="py-4 px-6 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRecords.map((record) => (
                    <tr key={record._id} className="border-t">

                      <td className="py-4 px-6">{record.certificateId}</td>
                      <td className="py-4 px-6">{record.participantName}</td>
                      <td className="py-4 px-6">{record.eventName}</td>
                      <td className="py-4 px-6">{record.type}</td>
                      <td className="py-4 px-6">{record.email}</td>
                      <td className="py-4 px-6">{record.date}</td>

                      <td className="py-4 px-6 text-green-600">
                        <CheckCircle className="inline w-4 h-4" /> Saved
                      </td>

                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleDelete(record)}
                          className="text-red-600 font-medium"
                        >
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