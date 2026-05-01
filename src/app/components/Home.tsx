import { useNavigate } from "react-router";
import { Award, FileText, Mail, Zap } from "lucide-react";
import { Header } from "./Header";

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header showAdminLink onAdminClick={() => navigate("/admin-login")} />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Automatic Certificate Generator System
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Generate professional certificates in seconds with dynamic user input and predefined templates.
            Streamline your certificate creation process today.
          </p>
          <button
            onClick={() => navigate("/select-certificate")}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium shadow-lg hover:shadow-xl"
          >
            Get Started
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Dynamic Data Input</h3>
            <p className="text-gray-600">
              Enter participant details and watch certificates populate automatically with real-time preview.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Certificate Automation</h3>
            <p className="text-gray-600">
              Multiple professional templates ready to use. Select, customize, and generate instantly.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">PDF Download</h3>
            <p className="text-gray-600">
              Download high-quality PDF certificates ready for printing or digital distribution.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Delivery</h3>
            <p className="text-gray-600">
              Send certificates directly to participants via email with automated delivery tracking.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
