import { useState } from "react";
import { useNavigate } from "react-router";
import { Upload, Eye, Trash2 } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

export function TemplateManager() {
  const navigate = useNavigate();
  const [templates] = useState([
    { id: 1, name: "Participation Template A", type: "Participation", uploads: 45, preview: "blue" },
    { id: 2, name: "Participation Template B", type: "Participation", uploads: 32, preview: "purple" },
    { id: 3, name: "Achievement Template A", type: "Achievement", uploads: 28, preview: "yellow" },
    { id: 4, name: "Achievement Template B", type: "Achievement", uploads: 19, preview: "orange" },
    { id: 5, name: "Appreciation Template A", type: "Appreciation", uploads: 41, preview: "pink" },
    { id: 6, name: "Appreciation Template B", type: "Appreciation", uploads: 23, preview: "red" },
    { id: 7, name: "Completion Template A", type: "Completion", uploads: 56, preview: "green" },
    { id: 8, name: "Completion Template B", type: "Completion", uploads: 38, preview: "teal" },
  ]);

  const colorClasses: Record<string, string> = {
    blue: "from-blue-400 to-blue-600",
    purple: "from-purple-400 to-purple-600",
    yellow: "from-yellow-400 to-yellow-600",
    orange: "from-orange-400 to-orange-600",
    pink: "from-pink-400 to-pink-600",
    red: "from-red-400 to-red-600",
    green: "from-green-400 to-green-600",
    teal: "from-teal-400 to-teal-600",
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1">
        <AdminHeader
          title="Certificate Template Manager"
          onLogout={() => {
            localStorage.removeItem("adminAuth");
            navigate("/admin-login");
          }}
        />

        <main className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Template Library</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Upload className="w-4 h-4" />
              Upload New Template
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template) => (
              <div key={template.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`h-48 bg-gradient-to-br ${colorClasses[template.preview]} p-6 flex items-center justify-center`}>
                  <div className="text-center text-white">
                    <div className="text-xs mb-2 opacity-80">CERTIFICATE</div>
                    <div className="text-sm font-semibold mb-1">Sample Name</div>
                    <div className="text-xs opacity-80">{template.type}</div>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{template.type}</p>
                  <p className="text-xs text-gray-500 mb-4">Used {template.uploads} times</p>

                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm">
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                    <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Template Guidelines</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Upload templates in PNG or PDF format</li>
              <li>• Recommended size: 1920x1080 pixels (landscape)</li>
              <li>• Use placeholder text for dynamic fields</li>
              <li>• Each certificate type should have at least 2 template variations</li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
