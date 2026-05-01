import { useNavigate } from "react-router";
import { CheckCircle, Download, Mail, Home } from "lucide-react";

export function Success() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-12">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Certificate Generated Successfully!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your certificate has been created and is ready for download or email delivery.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center gap-2 text-green-700 mb-2">
              <Mail className="w-5 h-5" />
              <span className="font-medium">Email Sent Successfully</span>
            </div>
            <p className="text-sm text-green-600">
              Certificate has been delivered to the recipient's email address
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/preview")}
              className="flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Download className="w-5 h-5" />
              Download Again
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </button>
          </div>

          <button
            onClick={() => navigate("/select-certificate")}
            className="mt-6 w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors font-medium"
          >
            Generate Another Certificate
          </button>
        </div>
      </div>
    </div>
  );
}
