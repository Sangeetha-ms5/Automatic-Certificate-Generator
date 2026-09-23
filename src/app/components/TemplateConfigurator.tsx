// ===============================
// FULLY UPDATED TemplateConfigurator.tsx
// ===============================

import { useState, useRef, useEffect } from "react";
import { X, Save } from "lucide-react";

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

interface TemplateConfiguratorProps {
  templateImage: string;
  certificateType: string;
  onSave: (config: TextFieldConfig[]) => void;
  onClose: () => void;
}

const defaultFields: TextFieldConfig[] = [

  // PARTICIPANT NAME
  {
    id: "name",
    label: "Participant Name",
    x: 50,
    y: 35,
    fontSize: 5,
    color: "#1e40af",
    fontFamily: "serif",
    textAlign: "center",
    maxWidth: 70,
  },

  // EVENT NAME (HIDDEN)
  {
    id: "eventName",
    label: "Event Name",
    x: 50,
    y: 50,
    fontSize: 0,
    color: "#374151",
    fontFamily: "serif",
    textAlign: "center",
    maxWidth: 70,
  },

  // INTERNSHIP DURATION
  {
    id: "internshipMonths",
    label: "Internship Duration",
    x: 50,
    y: 56,
    fontSize: 2.5,
    color: "#374151",
    fontFamily: "serif",
    textAlign: "center",
    maxWidth: 70,
  },

  // DESCRIPTION
  {
    id: "description",
    label: "Certificate Description",
    x: 50,
    y: 63,
    fontSize: 2.7,
    color: "#374151",
    fontFamily: "serif",
    textAlign: "center",
    maxWidth: 80,
  },

  // ISSUE DATE
  {
    id: "date",
    label: "Issue Date",
    x: 50,
    y: 75,
    fontSize: 2,
    color: "#6b7280",
    fontFamily: "sans-serif",
    textAlign: "center",
    maxWidth: 70,
  },

  // CREDENTIAL ID
  {
    id: "credentialId",
    label: "Credential ID",
    x: 70,
    y: 75,
    fontSize: 2,
    color: "#6b7280",
    fontFamily: "sans-serif",
    textAlign: "center",
    maxWidth: 70,
  },
];

export function TemplateConfigurator({
  templateImage,
  certificateType,
  onSave,
  onClose,
}: TemplateConfiguratorProps) {

  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  const [fields, setFields] =
    useState<TextFieldConfig[]>(() => {

      const saved =
        localStorage.getItem(
          `template_config_${certificateType}`
        );

      if (saved) {

        const parsed =
          JSON.parse(saved);

        // ADD MISSING NEW FIELDS
        const existingIds =
          parsed.map(
            (f: TextFieldConfig) => f.id
          );

        const missingFields =
          defaultFields.filter(
            (field) =>
              !existingIds.includes(field.id)
          );

        return [
          ...parsed,
          ...missingFields,
        ];
      }

      return defaultFields;
    });

  const [selectedField, setSelectedField] =
    useState<string | null>(null);

  const [canvasDimensions, setCanvasDimensions] =
    useState({
      width: 1200,
      height: 850,
    });

  // SAMPLE DESCRIPTIONS
  const sampleDescriptions: Record<
    string,
    string
  > = {

    Completion:
      "For the successful completion of a 2 Month internship in Web Development at Code Morphicx. Your commitment to personal growth and excellence has been truly inspiring.",

    Participation:
      "This certificate is proudly presented for actively participating in the Web Development Workshop at Code Morphicx. Your enthusiasm and commitment are sincerely appreciated.",

    Achievement:
      "Hopefully, this achievement will be the first step towards bigger success. Keep trying and give your best at Code Morphicx.",

    Appreciation:
      "Appreciation of your valuable contribution, dedication, and outstanding support towards Web Development Workshop, organized by Code Morphicx.",
  };

  const sampleData = {

    name: "JOHN DOE",

    eventName:
      "Web Development Workshop 2026",

    internshipMonths:
      certificateType === "Completion"
        ? "2 Month Internship"
        : certificateType ===
          "Participation"
        ? "3 Days Workshop"
        : "",

    description:
      sampleDescriptions[
        certificateType
      ] || "",

    date: "April 28, 2026",

    credentialId: "CMX-0001",
  };

  // TEXT WRAP
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) => {

    const words = text.split(" ");

    let line = "";

    const lines: string[] = [];

    for (
      let n = 0;
      n < words.length;
      n++
    ) {

      const testLine =
        line + words[n] + " ";

      const metrics =
        ctx.measureText(testLine);

      const testWidth =
        metrics.width;

      if (
        testWidth > maxWidth &&
        n > 0
      ) {

        lines.push(line);

        line = words[n] + " ";

      } else {

        line = testLine;
      }
    }

    lines.push(line);

    lines.forEach((l, index) => {

      ctx.fillText(
        l.trim(),
        x,
        y + index * lineHeight
      );
    });
  };

  useEffect(() => {

    if (
      !templateImage ||
      !canvasRef.current
    )
      return;

    const canvas = canvasRef.current;

    const ctx =
      canvas.getContext("2d");

    if (!ctx) return;

    const img = new Image();

    img.crossOrigin = "anonymous";

    img.onload = () => {

      const aspectRatio =
        img.height / img.width;

      const maxWidth = 1000;

      const width = Math.min(
        img.width,
        maxWidth
      );

      const height =
        width * aspectRatio;

      canvas.width = width;

      canvas.height = height;

      setCanvasDimensions({
        width,
        height,
      });

      redrawCanvas(
        ctx,
        img,
        width,
        height
      );
    };

    img.src = templateImage;

  }, [
    templateImage,
    fields,
    selectedField,
  ]);

  const redrawCanvas = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    width: number,
    height: number
  ) => {

    ctx.clearRect(
      0,
      0,
      width,
      height
    );

    ctx.drawImage(
      img,
      0,
      0,
      width,
      height
    );

    fields.forEach((field) => {

      const x =
        (field.x / 100) * width;

      const y =
        (field.y / 100) * height;

      const fontSize =
        (field.fontSize / 100) *
        height;

      ctx.font =
        `bold ${fontSize}px ${field.fontFamily}`;

      ctx.fillStyle =
        field.color;

      ctx.textAlign =
        field.textAlign;

      ctx.textBaseline =
        "middle";

      const text =
        sampleData[
          field.id as keyof typeof sampleData
        ] || field.label;

      if (
        field.maxWidth
      ) {

        const maxWidth =
          (field.maxWidth / 100) *
          width;

        wrapText(
          ctx,
          text,
          x,
          y,
          maxWidth,
          fontSize + 8
        );

      } else {

        ctx.fillText(
          text,
          x,
          y
        );
      }

      // SELECT BORDER
      if (
        selectedField === field.id
      ) {

        ctx.strokeStyle =
          "#3b82f6";

        ctx.lineWidth = 2;

        ctx.setLineDash([5, 5]);

        const metrics =
          ctx.measureText(text);

        const textWidth =
          metrics.width;

        ctx.strokeRect(
          x - textWidth / 2 - 10,
          y - fontSize / 2 - 5,
          textWidth + 20,
          fontSize + 10
        );

        ctx.setLineDash([]);
      }
    });
  };

  // CLICK TO MOVE
  const handleCanvasClick = (
    e: React.MouseEvent<HTMLCanvasElement>
  ) => {

    if (!canvasRef.current)
      return;

    const rect =
      canvasRef.current.getBoundingClientRect();

    const scaleX =
      canvasDimensions.width /
      rect.width;

    const scaleY =
      canvasDimensions.height /
      rect.height;

    const clickX =
      (e.clientX - rect.left) *
      scaleX;

    const clickY =
      (e.clientY - rect.top) *
      scaleY;

    if (selectedField) {

      const xPercent =
        (clickX /
          canvasDimensions.width) *
        100;

      const yPercent =
        (clickY /
          canvasDimensions.height) *
        100;

      setFields((prev) =>
        prev.map((f) =>
          f.id === selectedField
            ? {
                ...f,
                x: xPercent,
                y: yPercent,
              }
            : f
        )
      );
    }
  };

  // SAVE
  const handleSave = () => {

    localStorage.setItem(
      `template_config_${certificateType}`,
      JSON.stringify(fields)
    );

    onSave(fields);

    onClose();
  };

  // UPDATE FIELD
  const updateField = (
    id: string,
    updates: Partial<TextFieldConfig>
  ) => {

    setFields((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              ...updates,
            }
          : f
      )
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">

      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">

        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b">

          <h2 className="text-2xl font-bold text-gray-900">
            Configure Certificate Template
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">

          {/* CANVAS */}
          <div className="flex-1 p-6 overflow-auto">

            <p className="text-sm text-gray-600 mb-4">
              Click on the canvas to
              position each text field.
              Select a field from the
              right panel first.
            </p>

            <canvas
              ref={canvasRef}
              onClick={
                handleCanvasClick
              }
              className="w-full border-2 border-gray-300 rounded-lg cursor-crosshair"
            />
          </div>

          {/* RIGHT PANEL */}
          <div className="w-80 bg-gray-50 p-6 overflow-auto border-l">

            <h3 className="font-semibold text-gray-900 mb-4">
              Text Fields
            </h3>

            <div className="space-y-4">

              {fields.map((field) => (

                <div
                  key={field.id}
                  className={`p-4 bg-white rounded-lg border-2 cursor-pointer ${
                    selectedField === field.id
                      ? "border-blue-500"
                      : "border-gray-200"
                  }`}
                  onClick={() =>
                    setSelectedField(field.id)
                  }
                >

                  <div className="font-medium text-gray-900 mb-2">
                    {field.label}
                  </div>

                  <div className="space-y-2">

                    {/* FONT SIZE */}
                    <div>

                      <label className="text-xs text-gray-600">
                        Font Size (%)
                      </label>

                      <input
                        type="number"
                        value={field.fontSize}
                        onChange={(e) =>
                          updateField(
                            field.id,
                            {
                              fontSize:
                                Number(
                                  e.target.value
                                ),
                            }
                          )
                        }
                        className="w-full px-2 py-1 text-sm border rounded"
                        min="0"
                        max="20"
                      />
                    </div>

                    {/* COLOR */}
                    <div>

                      <label className="text-xs text-gray-600">
                        Color
                      </label>

                      <input
                        type="color"
                        value={field.color}
                        onChange={(e) =>
                          updateField(
                            field.id,
                            {
                              color:
                                e.target.value,
                            }
                          )
                        }
                        className="w-full h-8 border rounded"
                      />
                    </div>

                    {/* ALIGNMENT */}
                    <div>

                      <label className="text-xs text-gray-600">
                        Alignment
                      </label>

                      <select
                        value={field.textAlign}
                        onChange={(e) =>
                          updateField(
                            field.id,
                            {
                              textAlign:
                                e.target
                                  .value as any,
                            }
                          )
                        }
                        className="w-full px-2 py-1 text-sm border rounded"
                      >
                        <option value="left">
                          Left
                        </option>

                        <option value="center">
                          Center
                        </option>

                        <option value="right">
                          Right
                        </option>
                      </select>
                    </div>

                    {/* MAX WIDTH */}
                    <div>

                      <label className="text-xs text-gray-600">
                        Max Width (%)
                      </label>

                      <input
                        type="number"
                        value={
                          field.maxWidth || 70
                        }
                        onChange={(e) =>
                          updateField(
                            field.id,
                            {
                              maxWidth:
                                Number(
                                  e.target.value
                                ),
                            }
                          )
                        }
                        className="w-full px-2 py-1 text-sm border rounded"
                        min="10"
                        max="100"
                      />
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* SAVE BUTTON */}
            <button
              onClick={handleSave}
              className="w-full mt-6 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >

              <Save className="w-5 h-5" />

              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}