import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Download, Mail, Edit } from "lucide-react";
import { Header } from "./Header";
import { CertificateRenderer } from "./CertificateRenderer";
import jsPDF from "jspdf";

export function CertificatePreview() {
  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);
  const [templateImage, setTemplateImage] =
    useState<string | null>(null);

  const [sending, setSending] = useState(false);

  // ✅ certificate ready state
  const [certificateReady, setCertificateReady] =
    useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(
    null
  );

  useEffect(() => {
    const stored =
      localStorage.getItem("certificateData");

    if (!stored) {
      navigate("/select-certificate");
      return;
    }

    const parsed = JSON.parse(stored);

    console.log(
      "🔥 CURRENT CERTIFICATE DATA:",
      parsed
    );

    setData(parsed);

    const template = localStorage.getItem(
      `template_${parsed.type}`
    );

    setTemplateImage(template);
  }, [navigate]);

  // ✅ wait until canvas is fully rendered
  useEffect(() => {
    if (canvasRef.current) {
      const timer = setTimeout(() => {
        setCertificateReady(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [data, templateImage]);

  /* =========================
      DOWNLOAD PDF
  ========================== */
  const handleDownloadPDF = () => {
    const canvas = canvasRef.current;

    if (!canvas || !certificateReady) {
      alert("Certificate is loading...");
      return;
    }

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF(
      "landscape",
      "px",
      [canvas.width, canvas.height]
    );

    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      canvas.width,
      canvas.height
    );

    pdf.save(
      `Certificate_${data?.certificateId}.pdf`
    );
  };

  /* =========================
      SEND EMAIL
  ========================== */
  const handleSendEmail = async () => {
    try {
      const canvas = canvasRef.current;

      if (!canvas || !certificateReady) {
        alert("Certificate is loading...");
        return;
      }

      setSending(true);

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF(
        "landscape",
        "px",
        [canvas.width, canvas.height]
      );

      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        canvas.width,
        canvas.height
      );

      const pdfBase64 =
        pdf.output("datauristring");

      const res = await fetch(
        "http://localhost:5000/api/send-email",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name: data.participantName,
            email: data.email,
            certificateId:
              data.certificateId,
            pdf: pdfBase64,
          }),
        }
      );

      const result = await res.json();

      if (result.success) {
        alert(
          "✅ Certificate Email Sent Successfully"
        );

        navigate("/success");
      } else {
        alert("❌ Email sending failed");
      }
    } catch (error) {
      console.error(error);
      alert("Email sending error");
    } finally {
      setSending(false);
    }
  };

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-6">
          Certificate Preview
        </h1>

        {/* CERTIFICATE */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <CertificateRenderer
            ref={canvasRef}
            data={data}
            templateImage={templateImage}
          />
        </div>

        {/* BUTTONS */}
        <div className="grid md:grid-cols-3 gap-4">

          {/* DOWNLOAD */}
          <button
            onClick={handleDownloadPDF}
            disabled={!certificateReady}
            className="bg-blue-600 text-white py-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Download />
            Download PDF
          </button>

          {/* EMAIL */}
          <button
            onClick={handleSendEmail}
            disabled={sending || !certificateReady}
            className="bg-green-600 text-white py-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Mail />
            {sending
              ? "Sending..."
              : "Send Email"}
          </button>

          {/* EDIT */}
          <button
            onClick={() =>
              navigate(`/form/${data.type}`)
            }
            className="border py-4 rounded-lg flex items-center justify-center gap-2"
          >
            <Edit />
            Edit
          </button>

        </div>
      </main>
    </div>
  );
}