"use client";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function PdfViewer({ fileUrl }) {
    return (
        <div
            style={{
                width: "100%",
                height: "50vh",
                display: "flex",
                justifyContent: "center",
                backgroundColor: "#f3f4f6", // light gray bg for contrast
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "900px", // optional: set a max width for readability
                    height: "100%",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    overflow: "hidden",
                    backgroundColor: "#fff",
                }}
            >
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                    <Viewer
                        fileUrl={fileUrl}
                        defaultScale={1.0}
                    />
                </Worker>
            </div>
        </div>
    );
}
