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
    organization: "Code Morphicx",
    date: "",
    email: "",
    // ✅ NEW FIELD for dynamic description
    internshipMonths: "",
    description: "",
  });

  // Credential ID state
  const [credentialId, setCredentialId] = useState("");

  // Generate Credential ID on load
  useEffect(() => {
    const credId = generateCredentialId();
    setCredentialId(credId);
  }, []);

  // 🔥 UPDATED HANDLE SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const certificateData = {
      ...formData,
      certificateId: credentialId,
      type,
    };

    console.log(
      "👉 Sending data to backend:",
      certificateData
    );

    try {
      const response = await fetch(
        "http://localhost:5000/api/user-data",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            certificateData
          ),
        }
      );

      console.log(
        "👉 Response status:",
        response.status
      );

      const result =
        await response.json();

      console.log("👉 Saved:", result);

      /* ================= SAVE CURRENT DATA ================= */

      localStorage.setItem(
        "certificateData",
        JSON.stringify(certificateData)
      );

      // ✅ ALSO SAVE FOR PREVIEW
      localStorage.setItem(
        "previewCertificate",
        JSON.stringify(certificateData)
      );

      /* ================= NAVIGATE ================= */

      navigate("/preview");
    } catch (error) {
      console.error(
        "❌ API ERROR:",
        error
      );

      alert("Failed to save data");
    }
  };

  // Handle normal inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // Handle credential ID edit
  const handleCredentialChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCredentialId(e.target.value);
  };

  // Automatically generate certificate description
  useEffect(() => {
    let generatedDescription = "";

    // COMPLETION
    if (type === "completion") {
      generatedDescription =
        `For the successful completion of a ${formData.internshipMonths} Month internship in ${formData.eventName} at Code Morphicx. Your commitment to personal growth and excellence has been truly inspiring.`;
    }
    // PARTICIPATION
    else if (type === "participation") {
      generatedDescription =
        `This certificate is proudly presented for actively participating in the ${formData.eventName} at Code Morphicx. Your enthusiasm and commitment are sincerely appreciated.`;
    }
    // ACHIEVEMENT
    else if (type === "achievement") {
      generatedDescription =
        `Hopefully, this achievement will be the first step towards bigger success. Keep trying and give your best at Code Morphicx.`;
    }
    // APPRECIATION
    else if (type === "appreciation") {
      generatedDescription =
        `Appreciation of your valuable contribution, dedication, and outstanding support towards ${formData.eventName}, organized by Code Morphicx.`;
    }

    // Update form data with the generated description
    setFormData((prev) => ({
      ...prev,
      description: generatedDescription,
    }));
  }, [type, formData.eventName, formData.internshipMonths]);

  const certificateTitles: Record<
    string,
    string
  > = {
    participation:
      "Certificate of Participation",

    achievement:
      "Certificate of Achievement",

    appreciation:
      "Certificate of Appreciation",

    completion:
      "Certificate of Completion",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Enter Certificate Details
          </h1>

          <p className="text-lg text-gray-600">
            Fill in the information
            for your{" "}
            {
              certificateTitles[
                type ||
                  "participation"
              ]
            }
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-md p-8"
        >
          <div className="space-y-6">

            {/* Participant Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Participant Name *
              </label>

              <input
                type="text"
                name="participantName"
                required
                value={
                  formData.participantName
                }
                onChange={
                  handleChange
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter participant's full name"
              />
            </div>

            {/* Event Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Name *
              </label>

              <input
                type="text"
                name="eventName"
                required
                value={
                  formData.eventName
                }
                onChange={
                  handleChange
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter event or course name"
              />

              {/* ✅ EXTRA INFO */}
              <p className="text-xs text-gray-500 mt-1">
                Long event names
                will automatically
                resize and wrap
                properly inside the
                certificate.
              </p>
            </div>

            {/* ✅ INTERNSHIP MONTHS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Internship Duration
                (Months)
              </label>

              <input
                type="number"
                name="internshipMonths"
                value={
                  formData.internshipMonths
                }
                onChange={
                  handleChange
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Example: 3"
              />

              <p className="text-xs text-gray-500 mt-1">
                Example: 3 Months
                Internship
              </p>
            </div>

            {/* Organization */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization *
              </label>

              <input
                type="text"
                name="organization"
                required
                value={
                  formData.organization
                }
                onChange={
                  handleChange
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter organization name"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>

              <input
                type="date"
                name="date"
                required
                value={
                  formData.date
                }
                onChange={
                  handleChange
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Credential ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Credential ID
              </label>

              <input
                type="text"
                value={
                  credentialId
                }
                onChange={
                  handleCredentialChange
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
              />

              <p className="text-xs text-gray-500 mt-1">
                Auto-generated ID.
                You may edit it if
                required.
              </p>

              <button
                type="button"
                onClick={() =>
                  setCredentialId(
                    generateCredentialId()
                  )
                }
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                Regenerate ID
              </button>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>

              <input
                type="email"
                name="email"
                required
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="participant@example.com"
              />
            </div>

            {/* Certificate Description - Auto-generated */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certificate Description
              </label>

              <textarea
                value={formData.description}
                readOnly
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 outline-none"
              />

              <p className="text-xs text-gray-500 mt-1">
                This description is automatically generated
                based on certificate type, event name,
                and internship duration.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={() =>
                navigate(
                  "/select-certificate"
                )
              }
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Back
            </button>

            <button
              type="submit"
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Generate Certificate
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}