import { useRef, useEffect, useState } from "react";

interface CertificateData {
  participantName: string;
  eventName: string;
  organization: string;
  date: string;
  certificateId: string;
  type: string;
}

interface TextFieldConfig {
  id: string;
  label: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
  textAlign: "left" | "center" | "right";
  maxWidth?: number;
}

interface CertificateRendererProps {
  data: CertificateData;
  templateImage: string | null;
}

const defaultFieldConfig: TextFieldConfig[] = [
  { id: "name", label: "Participant Name", x: 50, y: 35, fontSize: 6, color: "#1e40af", fontFamily: "serif", textAlign: "center" },
  { id: "eventName", label: "Event Name", x: 50, y: 50, fontSize: 4, color: "#374151", fontFamily: "serif", textAlign: "center" },
  { id: "date", label: "Issue Date", x: 50, y: 75, fontSize: 2.5, color: "#6b7280", fontFamily: "sans-serif", textAlign: "center" },
  { id: "credentialId", label: "Credential ID", x: 75, y: 75, fontSize: 2.5, color: "#6b7280", fontFamily: "sans-serif", textAlign: "center" },
];

export function CertificateRenderer({ data, templateImage }: CertificateRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 850 });

  useEffect(() => {
    if (!templateImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Load field configuration
    const savedConfig = localStorage.getItem(`template_config_${data.type}`);
    const fieldConfig: TextFieldConfig[] = savedConfig ? JSON.parse(savedConfig) : defaultFieldConfig;

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      // Set canvas dimensions to match image
      const aspectRatio = img.height / img.width;
      const maxWidth = 1200;
      const width = Math.min(img.width, maxWidth);
      const height = width * aspectRatio;

      canvas.width = width;
      canvas.height = height;
      setDimensions({ width, height });

      // Draw template image
      ctx.drawImage(img, 0, 0, width, height);

      // Map data to field IDs
      const dataMap: Record<string, string> = {
        name: data.participantName.toUpperCase(),
        eventName: data.eventName,
        date: new Date(data.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        }),
        credentialId: data.certificateId,
        organization: data.organization,
      };

      // Draw each configured field
      fieldConfig.forEach((field) => {
        const x = (field.x / 100) * width;
        const y = (field.y / 100) * height;
        const fontSize = (field.fontSize / 100) * height;

        ctx.font = `bold ${fontSize}px ${field.fontFamily}`;
        ctx.fillStyle = field.color;
        ctx.textAlign = field.textAlign;
        ctx.textBaseline = "middle";

        const text = dataMap[field.id] || "";

        if (field.maxWidth) {
          const maxWidth = (field.maxWidth / 100) * width;
          ctx.fillText(text, x, y, maxWidth);
        } else {
          ctx.fillText(text, x, y);
        }
      });
    };

    img.onerror = () => {
      console.error("Failed to load certificate template image");
    };

    img.src = templateImage;
  }, [data, templateImage]);

  return (
    <div className="w-full">
      <canvas
        ref={canvasRef}
        className="w-full h-auto rounded-lg shadow-lg"
        style={{ maxWidth: "100%" }}
      />
    </div>
  );
}
