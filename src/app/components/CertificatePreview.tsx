import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Award, Download, Mail, Edit } from "lucide-react";
import { Header } from "./Header";
import { CertificateRenderer } from "./CertificateRenderer";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export function CertificatePreview() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [templateImage, setTemplateImage] = useState<string | null>(null);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("certificateData");
    if (stored) {
      const parsedData = JSON.parse(stored);
      setData(parsedData);

      const template = localStorage.getItem(`template_${parsedData.type}`);
      setTemplateImage(template);
    } else {
      navigate("/select-certificate");
    }
  }, [navigate]);

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`Certificate_${data.certificateId}.pdf`);

      navigate("/success");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const handleSendEmail = () => {
    alert(`Certificate sent to ${data?.email}`);
    navigate("/success");
  };

  if (!data) return null;

  const certificateTitles: Record<string, string> = {
    participation: "Certificate of Participation",
    achievement: "Certificate of Achievement",
    appreciation: "Certificate of Appreciation",
    completion: "Certificate of Completion",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Certificate Preview</h1>
          <p className="text-lg text-gray-600">Review your certificate before downloading or sending</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div id="certificate" ref={certificateRef} className="relative w-full">
            {templateImage ? (
              <CertificateRenderer data={data} templateImage={templateImage} />
            ) : (
              <div className="border-8 border-blue-600 p-8 md:p-16 bg-gradient-to-br from-blue-50 to-white relative min-h-[600px] rounded-lg">
                <div className="absolute top-8 left-8 right-8 bottom-8 border-2 border-blue-300"></div>

                <div className="text-center relative z-10">
                  <div className="mb-8">
                    <Award className="w-16 h-16 md:w-24 md:h-24 text-blue-600 mx-auto mb-4" />
                    <div className="text-xs md:text-sm text-blue-600 tracking-widest uppercase mb-2">
                      Official Certificate
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8">
                      {certificateTitles[data.type]}
                    </h2>
                  </div>

                  <div className="mb-8">
                    <p className="text-lg md:text-xl text-gray-600 mb-4">This is to certify that</p>
                    <p className="text-2xl md:text-4xl font-bold text-blue-600 mb-4">
                      {data.participantName}
                    </p>
                    <p className="text-lg md:text-xl text-gray-600 mb-4">
                      has successfully participated in
                    </p>
                    <p className="text-xl md:text-2xl font-semibold text-gray-900 mb-8">
                      {data.eventName}
                    </p>
                  </div>

                  <div className="flex justify-between items-end mt-12 pt-8 border-t-2 border-gray-200">
                    <div className="text-left">
                      <p className="text-xs md:text-sm text-gray-500">Date</p>
                      <p className="text-sm md:text-base font-semibold text-gray-900">{data.date}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs md:text-sm text-gray-500">Organization</p>
                      <p className="text-sm md:text-base font-semibold text-gray-900">
                        {data.organization}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs md:text-sm text-gray-500">Certificate ID</p>
                      <p className="text-sm md:text-base font-semibold text-gray-900">
                        {data.certificateId}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Download className="w-5 h-5" />
            Download PDF
          </button>
          <button
            onClick={handleSendEmail}
            className="flex items-center justify-center gap-2 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <Mail className="w-5 h-5" />
            Send to Email
          </button>
          <button
            onClick={() => navigate(`/form/${data.type}`)}
            className="flex items-center justify-center gap-2 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <Edit className="w-5 h-5" />
            Edit Details
          </button>
        </div>
      </main>
    </div>
  );
}
