import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Header } from "./Header";
import { generateCredentialId } from "../utils/credentialIdGenerator";

export function UserDataForm() {
  const navigate = useNavigate();
  const { type } = useParams();
  const [formData, setFormData] = useState({
    participantName: "",
    eventName: "",
    organization: "",
    date: "",
    email: "",
  });
  const [generatedCredentialId, setGeneratedCredentialId] = useState("");

  useEffect(() => {
    // Generate credential ID when component mounts
    const credId = generateCredentialId();
    setGeneratedCredentialId(credId);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Include auto-generated credential ID in the data
    const certificateData = {
      ...formData,
      certificateId: generatedCredentialId,
      type
    };
    localStorage.setItem("certificateData", JSON.stringify(certificateData));
    navigate("/preview");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const certificateTitles: Record<string, string> = {
    participation: "Certificate of Participation",
    achievement: "Certificate of Achievement",
    appreciation: "Certificate of Appreciation",
    completion: "Certificate of Completion",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Enter Certificate Details</h1>
          <p className="text-lg text-gray-600">
            Fill in the information for your {certificateTitles[type || "participation"]}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Participant Name *
              </label>
              <input
                type="text"
                name="participantName"
                required
                value={formData.participantName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Enter participant's full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Name *
              </label>
              <input
                type="text"
                name="eventName"
                required
                value={formData.eventName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Enter event or course name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization *
              </label>
              <input
                type="text"
                name="organization"
                required
                value={formData.organization}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Enter organization name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Credential ID (Auto-Generated)
              </label>
              <div className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-mono font-semibold">
                {generatedCredentialId || "Generating..."}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                This ID is automatically generated and will be unique to this certificate
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="participant@example.com"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate("/select-certificate")}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Generate Certificate
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
