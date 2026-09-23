import { useNavigate } from "react-router";
import { Award, Trophy, Heart, CheckCircle, Upload, Settings } from "lucide-react";
import { Header } from "./Header";
import { useState, useEffect, useRef } from "react";
import { TemplateConfigurator } from "./TemplateConfigurator";

const certificateTypes = [
  {
    id: "participation",
    title: "Certificate of Participation",
    description: "For event attendees and participants",
    icon: Award,
    color: "blue",
  },
  {
    id: "achievement",
    title: "Certificate of Achievement",
    description: "For outstanding performance and success",
    icon: Trophy,
    color: "yellow",
  },
  {
    id: "appreciation",
    title: "Certificate of Appreciation",
    description: "For valuable contributions and support",
    icon: Heart,
    color: "pink",
  },
  {
    id: "completion",
    title: "Certificate of Completion",
    description: "For course and program completion",
    icon: CheckCircle,
    color: "green",
  },
];

export function CertificateTypeSelection() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Record<string, string>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [configuringTemplate, setConfiguringTemplate] = useState<string | null>(null);

  useEffect(() => {
    const savedTemplates: Record<string, string> = {};
    certificateTypes.forEach((cert) => {
      const saved = localStorage.getItem(`template_${cert.id}`);
      if (saved) {
        savedTemplates[cert.id] = saved;
      }
    });
    setTemplates(savedTemplates);
  }, []);

  const handleTemplateUpload = (certId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setTemplates((prev) => ({ ...prev, [certId]: result }));
        localStorage.setItem(`template_${certId}`, result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = (certId: string) => {
    fileInputRefs.current[certId]?.click();
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; icon: string; button: string }> = {
      blue: { bg: "bg-blue-50", icon: "text-blue-600", button: "bg-blue-600 hover:bg-blue-700" },
      yellow: { bg: "bg-yellow-50", icon: "text-yellow-600", button: "bg-yellow-600 hover:bg-yellow-700" },
      pink: { bg: "bg-pink-50", icon: "text-pink-600", button: "bg-pink-600 hover:bg-pink-700" },
      green: { bg: "bg-green-50", icon: "text-green-600", button: "bg-green-600 hover:bg-green-700" },
    };
    return colors[color];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Select Certificate Type</h1>
          <p className="text-lg text-gray-600">Upload your custom templates and choose the certificate type</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {certificateTypes.map((cert) => {
            const Icon = cert.icon;
            const colors = getColorClasses(cert.color);

            return (
              <div
                key={cert.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-8 border border-gray-100"
              >
                <div className={`w-16 h-16 ${colors.bg} rounded-lg flex items-center justify-center mb-6`}>
                  <Icon className={`w-8 h-8 ${colors.icon}`} />
                </div>

                <h3 className="text-2xl font-semibold text-gray-900 mb-3">{cert.title}</h3>
                <p className="text-gray-600 mb-6">{cert.description}</p>

                <div className="bg-gray-50 rounded-lg p-4 mb-6 h-40 flex items-center justify-center border-2 border-dashed border-gray-200 overflow-hidden">
                  {templates[cert.id] ? (
                    <img
                      src={templates[cert.id]}
                      alt={`${cert.title} preview`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-gray-400">No Template Uploaded</span>
                  )}
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => handleUploadClick(cert.id)}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Template
                  </button>
                  <input
                   ref={(el) => {
    fileInputRefs.current[cert.id] = el;
  }}
  type="file"
  accept="image/png,image/jpeg,image/jpg,.pdf"
  onChange={(e) => handleTemplateUpload(cert.id, e)}
  className="hidden"
                  />
                  {templates[cert.id] && (
                    <button
                      onClick={() => setConfiguringTemplate(cert.id)}
                      className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Configure Template
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/form/${cert.id}`)}
                    className={`w-full py-3 ${colors.button} text-white rounded-lg transition-colors font-medium ${
                      !templates[cert.id] ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={!templates[cert.id]}
                  >
                    {templates[cert.id] ? "Select Template" : "Upload Template First"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {configuringTemplate && templates[configuringTemplate] && (
        <TemplateConfigurator
          templateImage={templates[configuringTemplate]}
          certificateType={configuringTemplate}
          onSave={() => {
            setConfiguringTemplate(null);
          }}
          onClose={() => setConfiguringTemplate(null)}
        />
      )}
    </div>
  );
}
