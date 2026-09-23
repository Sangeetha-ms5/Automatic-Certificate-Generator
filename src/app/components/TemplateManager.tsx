// ===============================
// FULLY UPDATED TemplateManager.tsx
// ===============================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Upload,
  Trash2,
  Eye,
} from "lucide-react";

import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

export function TemplateManager() {
  const navigate = useNavigate();

  const [templates, setTemplates] =
    useState<any[]>([]);

  const [templateName, setTemplateName] =
    useState("");

  const [templateType, setTemplateType] =
    useState("");

  const [preview, setPreview] =
    useState<string | null>(null);

  // NEW STATES
  const [duration, setDuration] =
    useState("2");

  const [durationType, setDurationType] =
    useState<
      "month" | "day" | "none"
    >("month");

  // ---------------- LOAD SAVED TEMPLATES ----------------
  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem(
        "certificateTemplates"
      ) || "[]"
    );

    setTemplates(saved);
  }, []);

  // ---------------- SAVE FUNCTION ----------------
  const saveTemplates = (
    data: any[]
  ) => {
    setTemplates(data);

    localStorage.setItem(
      "certificateTemplates",
      JSON.stringify(data)
    );
  };

  // ---------------- FILE UPLOAD ----------------
  const handleFileUpload = (
    e: any
  ) => {
    const file =
      e.target.files[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onloadend = () => {
      setPreview(
        reader.result as string
      );
    };

    reader.readAsDataURL(file);
  };

  // ---------------- TYPE CHANGE ----------------
  const handleTypeChange = (
    value: string
  ) => {
    setTemplateType(value);

    // AUTO SET DURATION TYPE
    if (value === "Completion") {
      setDurationType("month");
    } else if (
      value === "Participation"
    ) {
      setDurationType("day");
    } else {
      setDurationType("none");
    }
  };

  // ---------------- ADD TEMPLATE ----------------
  const handleAddTemplate = () => {
    if (
      !templateName ||
      !templateType ||
      !preview
    ) {
      alert("Fill all fields");

      return;
    }

    const newTemplate = {
      id: Date.now(),

      name: templateName,

      type: templateType,

      preview: preview,

      // NEW
      duration,

      durationType,

      createdAt:
        new Date().toISOString(),
    };

    const updated = [
      ...templates,
      newTemplate,
    ];

    saveTemplates(updated);

    // RESET
    setTemplateName("");

    setTemplateType("");

    setPreview(null);

    setDuration("2");

    setDurationType("month");
  };

  // ---------------- DELETE TEMPLATE ----------------
  const deleteTemplate = (
    id: number
  ) => {
    const updated =
      templates.filter(
        (t) => t.id !== id
      );

    saveTemplates(updated);
  };

  // ---------------- GET DURATION LABEL ----------------
  const getDurationLabel = (
    template: any
  ) => {
    if (
      template.durationType ===
      "none"
    ) {
      return "No Duration";
    }

    if (
      template.durationType ===
      "month"
    ) {
      return `${template.duration} ${
        Number(
          template.duration
        ) > 1
          ? "Months"
          : "Month"
      } Internship`;
    }

    if (
      template.durationType ===
      "day"
    ) {
      return `${template.duration} ${
        Number(
          template.duration
        ) > 1
          ? "Days"
          : "Day"
      } Workshop`;
    }

    return "";
  };

  // ---------------- UI ----------------
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1">
        <AdminHeader
          title="Certificate Template Manager"
          onLogout={() => {
            localStorage.removeItem(
              "adminAuth"
            );

            navigate(
              "/admin-login"
            );
          }}
        />

        <main className="p-8">

          {/* ADD TEMPLATE */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Add Certificate Template
            </h2>

            <div className="grid md:grid-cols-3 gap-4">

              {/* TEMPLATE NAME */}
              <input
                type="text"
                placeholder="Template Name"
                value={templateName}
                onChange={(e) =>
                  setTemplateName(
                    e.target.value
                  )
                }
                className="border p-2 rounded-lg"
              />

              {/* CERTIFICATE TYPE */}
              <select
                value={templateType}
                onChange={(e) =>
                  handleTypeChange(
                    e.target.value
                  )
                }
                className="border p-2 rounded-lg"
              >
                <option value="">
                  Select Type
                </option>

                <option>
                  Participation
                </option>

                <option>
                  Achievement
                </option>

                <option>
                  Completion
                </option>

                <option>
                  Appreciation
                </option>
              </select>

              {/* FILE */}
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={
                  handleFileUpload
                }
                className="border p-2 rounded-lg"
              />

              {/* SHOW DURATION ONLY FOR COMPLETION/PARTICIPATION */}
              {durationType !==
                "none" && (
                <>
                  {/* DURATION */}
                  <input
                    type="number"
                    min="1"
                    placeholder="Duration"
                    value={duration}
                    onChange={(e) =>
                      setDuration(
                        e.target.value
                      )
                    }
                    className="border p-2 rounded-lg"
                  />

                  {/* AUTO TYPE */}
                  <div className="border p-2 rounded-lg bg-gray-100 text-gray-700 flex items-center">
                    {durationType ===
                    "month"
                      ? "Months Internship"
                      : "Days Workshop"}
                  </div>
                </>
              )}
            </div>

            {/* PREVIEW */}
            {preview && (
              <div className="mt-6">
                <p className="font-medium mb-2">
                  Template Preview
                </p>

                <img
                  src={preview}
                  alt="preview"
                  className="w-full max-w-md rounded-lg border shadow-sm"
                />
              </div>
            )}

            {/* ADD BUTTON */}
            <button
              onClick={
                handleAddTemplate
              }
              className="mt-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Upload className="w-4 h-4" />

              Add Template
            </button>
          </div>

          {/* TEMPLATE LIST */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">
              Certificate Templates
            </h2>

            {templates.length ===
            0 ? (
              <p className="text-center text-gray-500 py-10">
                No templates uploaded
                yet
              </p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map(
                  (template) => (
                    <div
                      key={
                        template.id
                      }
                      className="border rounded-xl overflow-hidden shadow-sm hover:shadow-lg"
                    >
                      {/* IMAGE */}
                      <img
                        src={
                          template.preview
                        }
                        alt="certificate"
                        className="w-full h-48 object-cover"
                      />

                      <div className="p-4">

                        {/* NAME */}
                        <h3 className="font-semibold">
                          {
                            template.name
                          }
                        </h3>

                        {/* TYPE */}
                        <p className="text-sm text-gray-600">
                          {
                            template.type
                          }
                        </p>

                        {/* DURATION */}
                        <p className="text-sm text-blue-600 mt-1 mb-3">
                          {getDurationLabel(
                            template
                          )}
                        </p>

                        {/* DELETE */}
                        <button
                          onClick={() =>
                            deleteTemplate(
                              template.id
                            )
                          }
                          className="flex items-center gap-1 text-red-600 text-sm"
                        >
                          <Trash2 className="w-4 h-4" />

                          Delete
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}