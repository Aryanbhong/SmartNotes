import React, { useState, useRef } from "react";
import {
  ScanLine,
  UploadCloud,
  FileImage,
  Copy,
  Check,
  Sparkles,
  RotateCcw,
  BookPlus,
  Loader2,
} from "lucide-react";
import Tesseract from "tesseract.js";
import { useNotes } from "../context/NotesContext";
import AppLayout from "../Components/layout/AppLayout";
import { Button, Card } from "../Components/common/Badge";
import toast from "react-hot-toast";

export const OCRPage = () => {
  const { openNewNoteModal, incrementOcrCount } = useNotes();

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setExtractedText("");
    processOCR(file);
  };

  const processOCR = async (file) => {
    setLoading(true);
    setProgress(0);
    setStatusMessage("Initializing OCR recognition engine...");

    try {
      const { data } = await Tesseract.recognize(file, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
            setStatusMessage(`Extracting handwritten text (${Math.round(m.progress * 100)}%)...`);
          } else {
            setStatusMessage(m.status);
          }
        },
      });

      setExtractedText(data.text || "");
      incrementOcrCount();
      toast.success("Text extraction complete! 📸");
    } catch (err) {
      console.error("OCR Failed:", err);
      toast.error("Failed to recognize text. Please try another image.");
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleCopy = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveAsNote = () => {
    openNewNoteModal({
      title: `OCR Scan — ${new Date().toLocaleDateString()}`,
      content: `<p>${extractedText.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br/>")}</p>`,
    });
  };

  const resetAll = () => {
    setImageFile(null);
    setImagePreview(null);
    setExtractedText("");
    setProgress(0);
    setStatusMessage("");
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
        {/* Title */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center ring-4 ring-purple-500/10">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold font-display text-slate-900 dark:text-slate-100 tracking-tight">
                OCR Handwriting & Document Workstation
              </h1>
              <p className="text-xs text-slate-400">
                Transform photos of physical notebooks and lecture slides into digital study notes
              </p>
            </div>
          </div>
        </div>

        {/* Workstation Container */}
        {!imagePreview ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-16 text-center flex flex-col items-center justify-center cursor-pointer transition ${
              isDragging
                ? "border-purple-500 bg-purple-50/50 dark:bg-purple-950/30"
                : "border-slate-300 dark:border-slate-700 hover:border-purple-400 hover:bg-slate-50 dark:hover:bg-slate-800/40"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
            <div className="w-20 h-20 rounded-3xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 shadow-sm">
              <UploadCloud className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-slate-100 mb-1">
              Drag & drop lecture photos or notes here
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6">
              Our embedded Tesseract optical character recognition extracts all readable handwriting, headings, and lists directly in your browser.
            </p>
            <Button variant="primary" size="md">
              Browse Image From Device
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Progress indicator */}
            {loading && (
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-purple-700 dark:text-purple-300">
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {statusMessage}
                  </span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-purple-200 dark:bg-purple-900/60 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Side by side preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original Image */}
              <Card className="flex flex-col overflow-hidden">
                <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <FileImage className="w-4 h-4 text-purple-500" /> Original Source Image
                  </span>
                  <button
                    onClick={resetAll}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Scan Another
                  </button>
                </div>
                <div className="p-4 flex items-center justify-center min-h-[360px] max-h-[460px] bg-slate-950/5 dark:bg-slate-950/30 overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Original scan"
                    className="max-h-[440px] max-w-full rounded-xl object-contain shadow-sm"
                  />
                </div>
              </Card>

              {/* Extracted Text */}
              <Card className="flex flex-col overflow-hidden">
                <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-500" /> Extracted Text (Editable)
                  </span>
                  <button
                    disabled={!extractedText}
                    onClick={handleCopy}
                    className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 font-medium"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <textarea
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  placeholder={loading ? "Scanning text..." : "Extracted text will appear here. Edit as needed before saving."}
                  className="flex-1 p-4 text-xs sm:text-sm text-slate-800 dark:text-slate-200 bg-transparent outline-none resize-none min-h-[360px] leading-relaxed font-mono"
                />
                <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                  <span className="text-[11px] text-slate-400">
                    {extractedText ? `${extractedText.trim().split(/\s+/).length} words` : "0 words"}
                  </span>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={!extractedText}
                    onClick={handleSaveAsNote}
                    icon={BookPlus}
                  >
                    Save as Note
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default OCRPage;

