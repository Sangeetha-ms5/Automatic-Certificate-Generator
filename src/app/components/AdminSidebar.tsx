import { Award, LayoutDashboard, Calendar, FileText, Database, Mail } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";

export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [logo, setLogo] = useState<string | null>(() => {
    return localStorage.getItem("cmxLogo");
  });

  useEffect(() => {
    const handleLogoUpdate = () => {
      const updatedLogo = localStorage.getItem("cmxLogo");
      setLogo(updatedLogo);
    };

    window.addEventListener("logoUpdated", handleLogoUpdate);
    return () => window.removeEventListener("logoUpdated", handleLogoUpdate);
  }, []);

  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/events", label: "Event Management", icon: Calendar },
    { path: "/admin/templates", label: "Templates", icon: FileText },
    { path: "/admin/records", label: "Records", icon: Database },
    { path: "/admin/emails", label: "Email Automation", icon: Mail },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          {logo ? (
            <img src={logo} alt="CMX Logo" className="w-8 h-8 object-contain" />
          ) : (
            <Award className="w-8 h-8 text-blue-600" />
          )}
          <span className="text-xl font-bold text-gray-900">CMX</span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
