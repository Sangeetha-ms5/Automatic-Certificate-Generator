// ===============================
// FULLY UPDATED CertificateRenderer.tsx
// ===============================

import React, {
  useRef,
  useEffect,
  useState,
  forwardRef,
} from "react";

interface CertificateData {
  participantName: string;
  eventName: string;
  organization: string;
  date: string;
  certificateId: string;
  type: string;

  // NEW
  internshipMonths?: string;
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

// ===============================
// DEFAULT FIELD CONFIG
// ===============================

const defaultFieldConfig: TextFieldConfig[] = [

  // NAME
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

  // EVENT NAME HIDDEN
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
    fontSize: 0,
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
    fontSize: 3,
    color: "#374151",
    fontFamily: "serif",
    textAlign: "center",
    maxWidth: 80,
  },

  // DATE
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

  // ID
  {
    id: "credentialId",
    label: "Credential ID",
    x: 75,
    y: 75,
    fontSize: 2,
    color: "#6b7280",
    fontFamily: "sans-serif",
    textAlign: "center",
    maxWidth: 70,
  },
];

export const CertificateRenderer =
  forwardRef<
    HTMLCanvasElement,
    CertificateRendererProps
  >(
    (
      {
        data,
        templateImage,
      },
      ref
    ) => {

      const canvasRef =
        useRef<HTMLCanvasElement>(null);

      const [dimensions, setDimensions] =
        useState({
          width: 1200,
          height: 850,
        });

      // ===============================
      // AUTO FONT RESIZE
      // ===============================

      const getResponsiveFontSize = (
        text: string,
        defaultSize: number
      ) => {

        if (text.length > 250)
          return defaultSize - 1.3;

        if (text.length > 180)
          return defaultSize - 1;

        if (text.length > 120)
          return defaultSize - 0.5;

        return defaultSize;
      };

      // ===============================
      // WRAP TEXT
      // ===============================

      const wrapText = (
        ctx: CanvasRenderingContext2D,
        text: string,
        x: number,
        y: number,
        maxWidth: number,
        lineHeight: number
      ) => {

        const words =
          text.split(" ");

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

            line =
              words[n] + " ";

          } else {

            line = testLine;
          }
        }

        lines.push(line);

        lines.forEach(
          (l, index) => {

            ctx.fillText(
              l.trim(),
              x,
              y +
                index *
                  lineHeight
            );
          }
        );
      };

      useEffect(() => {

        if (
          !templateImage ||
          !canvasRef.current
        )
          return;

        const canvas =
          canvasRef.current;

        const ctx =
          canvas.getContext("2d");

        if (!ctx) return;

        // ===============================
        // LOAD CONFIG
        // ===============================

        const savedConfig =
          localStorage.getItem(
            `template_config_${data.type}`
          );

        let fieldConfig:
          TextFieldConfig[] =
          [];

        if (savedConfig) {

          const parsed =
            JSON.parse(savedConfig);

          const existingIds =
            parsed.map(
              (
                f: TextFieldConfig
              ) => f.id
            );

          const missingFields =
            defaultFieldConfig.filter(
              (field) =>
                !existingIds.includes(
                  field.id
                )
            );

          fieldConfig = [
            ...parsed,
            ...missingFields,
          ];

        } else {

          fieldConfig =
            defaultFieldConfig;
        }

        // ===============================
        // LOAD IMAGE
        // ===============================

        const img = new Image();

        img.crossOrigin =
          "anonymous";

        img.onload = () => {

          const aspectRatio =
            img.height /
            img.width;

          const maxWidth = 1200;

          const width =
            Math.min(
              img.width,
              maxWidth
            );

          const height =
            width *
            aspectRatio;

          canvas.width =
            width;

          canvas.height =
            height;

          setDimensions({
            width,
            height,
          });

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

          // ===============================
          // DESCRIPTION LOGIC
          // ===============================

          const certificateType =
            data.type?.toLowerCase();

          const descriptionText =
            (() => {

              // COMPLETION
              if (
                certificateType ===
                "completion"
              ) {

                return `For the successful completion of a ${
                  data.internshipMonths || "2"
                } Month internship in ${
                  data.eventName
                } at Code Morphicx. Your commitment to personal growth and excellence has been truly inspiring.`;
              }

              // PARTICIPATION
              if (
                certificateType ===
                "participation"
              ) {

                return `This certificate is proudly presented for actively participating in the ${
                  data.eventName
                } at Code Morphicx. Your enthusiasm and commitment are sincerely appreciated.`;
              }

              // ACHIEVEMENT
              if (
                certificateType ===
                "achievement"
              ) {

                return `Hopefully, this achievement will be the first step towards bigger success. Keep trying and give your best at Code Morphicx.`;
              }

              // APPRECIATION
              if (
                certificateType ===
                "appreciation"
              ) {

                return `Appreciation of your valuable contribution, dedication, and outstanding support towards ${
                  data.eventName
                }, organized by Code Morphicx.`;
              }

              return "";

            })();

          // ===============================
          // DATA MAP
          // ===============================

          const dataMap: Record<
            string,
            string
          > = {

            // NAME
            name:
              data.participantName?.toUpperCase() ||
              "",

            // EVENT NAME
            eventName:
              data.eventName ||
              "",

            // INTERNSHIP
            internshipMonths:
              certificateType ===
              "completion"
                ? `${data.internshipMonths} Month Internship`
                : certificateType ===
                  "participation"
                ? `${data.internshipMonths} Days Workshop`
                : "",

            // DESCRIPTION
            description:
              descriptionText,

            // DATE
            date: data.date
              ? new Date(
                  data.date
                ).toLocaleDateString(
                  "en-US",
                  {
                    year:
                      "numeric",
                    month:
                      "long",
                    day: "numeric",
                  }
                )
              : "",

            // ID
            credentialId:
              data.certificateId ||
              "",

            organization:
              data.organization ||
              "",
          };

          // ===============================
          // DRAW FIELDS
          // ===============================

          fieldConfig.forEach(
            (field) => {

              const x =
                (field.x / 100) *
                width;

              const y =
                (field.y / 100) *
                height;

              const responsiveSize =
                getResponsiveFontSize(
                  dataMap[
                    field.id
                  ] || "",
                  field.fontSize
                );

              const fontSize =
                (responsiveSize /
                  100) *
                height;

              // SKIP ZERO FONT
              if (
                field.fontSize === 0
              )
                return;

              ctx.font =
                `bold ${fontSize}px ${field.fontFamily}`;

              ctx.fillStyle =
                field.color;

              ctx.textAlign =
                field.textAlign;

              ctx.textBaseline =
                "middle";

              const text =
                dataMap[
                  field.id
                ] || "";

              // SKIP EMPTY
              if (!text) return;

              if (
                field.maxWidth
              ) {

                const maxWidth =
                  (field.maxWidth /
                    100) *
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
            }
          );
        };

        img.onerror = () => {

          console.error(
            "Failed to load certificate template image"
          );
        };

        img.src = templateImage;

      }, [data, templateImage]);

      return (
        <div className="w-full">

          <canvas
            ref={(node) => {

              canvasRef.current =
                node;

              if (
                typeof ref ===
                "function"
              ) {

                ref(node);

              } else if (ref) {

                (
                  ref as React.MutableRefObject<HTMLCanvasElement | null>
                ).current =
                  node;
              }
            }}
            className="w-full h-auto rounded-lg shadow-lg"
            style={{
              maxWidth: "100%",
            }}
          />
        </div>
      );
    }
  );

CertificateRenderer.displayName =
  "CertificateRenderer";