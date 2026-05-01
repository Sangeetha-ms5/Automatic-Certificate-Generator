import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Award, Lock } from "lucide-react";

export function AdminLogin() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.username && credentials.password) {
      localStorage.setItem("adminAuth", "true");
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            {logo ? (
              <img src={logo} alt="CMX Logo" className="w-12 h-12 object-contain" />
            ) : (
              <Award className="w-12 h-12 text-white" />
            )}
            <span className="text-3xl font-bold text-white">Code MorphicX</span>
          </div>
          <p className="text-blue-100">Admin Portal</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Lock className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                required
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Enter admin username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                required
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Sign In
            </button>
          </form>

          <button
            onClick={() => navigate("/")}
            className="w-full mt-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
