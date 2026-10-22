// import React, { useState, useRef } from "react";
// import {
//   X,
//   ScanLine,
//   UploadCloud,
//   FileImage,
//   Copy,
//   Check,
//   Sparkles,
//   RotateCcw,
//   BookPlus,
//   Loader2,
// } from "lucide-react";
// import Tesseract from "tesseract.js";
// import { useNotes } from "../../context/NotesContext";
// import { Button } from "../common/Badge";
// import toast from "react-hot-toast";

// export const OCRScannerModal = () => {
//   const { isOcrOpen, setIsOcrOpen, openNewNoteModal, incrementOcrCount } = useNotes();

//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [statusMessage, setStatusMessage] = useState("");
//   const [extractedText, setExtractedText] = useState("");
//   const [copied, setCopied] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);

//   const fileInputRef = useRef(null);

//   if (!isOcrOpen) return null;

//   const handleFile = (file) => {
//     if (!file || !file.type.startsWith("image/")) {
//       toast.error("Please select a valid image file");
//       return;
//     }
//     setImageFile(file);
//     setImagePreview(URL.createObjectURL(file));
//     setExtractedText("");
//     processOCR(file);
//   };

//   const processOCR = async (file) => {
//     setLoading(true);
//     setProgress(0);
//     setStatusMessage("Initializing OCR engine...");

//     try {
//       const { data } = await Tesseract.recognize(file, "eng", {
//         logger: (m) => {
//           if (m.status === "recognizing text") {
//             setProgress(Math.round(m.progress * 100));
//             setStatusMessage(`Recognizing text (${Math.round(m.progress * 100)}%)...`);
//           } else {
//             setStatusMessage(m.status);
//           }
//         },
//       });

//       setExtractedText(data.text || "");
//       incrementOcrCount();
//       toast.success("Text extracted successfully! 📸");
//     } catch (err) {
//       console.error("OCR Failed:", err);
//       toast.error("Failed to recognize text from this image.");
//     } finally {
//       setLoading(false);
//       setProgress(100);
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       handleFile(e.dataTransfer.files[0]);
//     }
//   };

//   const handleCopy = () => {
//     if (!extractedText) return;
//     navigator.clipboard.writeText(extractedText);
//     setCopied(true);
//     toast.success("Text copied!");
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const handleSaveAsNote = () => {
//     setIsOcrOpen(false);
//     openNewNoteModal({
//       title: `OCR Scan — ${new Date().toLocaleDateString()}`,
//       content: `<p>${extractedText.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br/>")}</p>`,
//     });
//   };

//   const resetAll = () => {
//     setImageFile(null);
//     setImagePreview(null);
//     setExtractedText("");
//     setProgress(0);
//     setStatusMessage("");
//   };

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
//       onClick={() => setIsOcrOpen(false)}
//       role="dialog"
//       aria-modal="true"
//     >
//       <div
//         className="w-full max-w-4xl max-h-[90vh] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center ring-4 ring-purple-500/10">
//               <ScanLine className="w-5 h-5" />
//             </div>
//             <div>
//               <h3 className="text-lg font-bold font-display leading-tight">OCR Handwritten Notes Scanner</h3>
//               <p className="text-xs text-slate-400">Extract clean text from class photos, whiteboards & notebook pages</p>
//             </div>
//           </div>
//           <button
//             onClick={() => setIsOcrOpen(false)}
//             className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="p-6 flex-1 overflow-y-auto">
//           {!imagePreview ? (
//             /* Upload Dropzone */
//             <div
//               onDragOver={(e) => {
//                 e.preventDefault();
//                 setIsDragging(true);
//               }}
//               onDragLeave={() => setIsDragging(false)}
//               onDrop={handleDrop}
//               onClick={() => fileInputRef.current?.click()}
//               className={`border-2 border-dashed rounded-3xl p-10 text-center flex flex-col items-center justify-center cursor-pointer transition ${
//                 isDragging
//                   ? "border-purple-500 bg-purple-50/50 dark:bg-purple-950/30"
//                   : "border-slate-300 dark:border-slate-700 hover:border-purple-400 hover:bg-slate-50 dark:hover:bg-slate-800/40"
//               }`}
//             >
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={(e) => handleFile(e.target.files[0])}
//               />
//               <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 shadow-sm">
//                 <UploadCloud className="w-8 h-8" />
//               </div>
//               <h4 className="text-base font-bold font-display text-slate-800 dark:text-slate-100 mb-1">
//                 Drag & drop note image here, or browse
//               </h4>
//               <p className="text-xs text-slate-400 max-w-sm mb-4">
//                 Supports JPG, PNG, WEBP of handwritten notebooks, lecture slides, and textbook pages.
//               </p>
//               <Button variant="primary" size="sm">
//                 Choose Image File
//               </Button>
//             </div>
//           ) : (
//             /* Side by Side Preview & Extracted Result */
//             <div className="space-y-4">
//               {/* Progress bar during recognition */}
//               {loading && (
//                 <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 space-y-2">
//                   <div className="flex items-center justify-between text-xs font-semibold text-purple-700 dark:text-purple-300">
//                     <span className="flex items-center gap-2">
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                       {statusMessage}
//                     </span>
//                     <span>{progress}%</span>
//                   </div>
//                   <div className="w-full h-2 rounded-full bg-purple-200 dark:bg-purple-900/60 overflow-hidden">
//                     <div
//                       className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300 rounded-full"
//                       style={{ width: `${progress}%` }}
//                     />
//                   </div>
//                 </div>
//               )}

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {/* Original Image */}
//                 <div className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-900/60">
//                   <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
//                     <span className="flex items-center gap-1.5">
//                       <FileImage className="w-4 h-4 text-purple-500" /> Original Image
//                     </span>
//                     <button
//                       type="button"
//                       onClick={resetAll}
//                       className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
//                     >
//                       <RotateCcw className="w-3.5 h-3.5" /> Upload Different
//                     </button>
//                   </div>
//                   <div className="p-3 flex items-center justify-center min-h-[260px] max-h-[360px] overflow-hidden bg-slate-950/5">
//                     <img
//                       src={imagePreview}
//                       alt="Uploaded note"
//                       className="max-h-[340px] max-w-full rounded-xl object-contain shadow-sm"
//                     />
//                   </div>
//                 </div>

//                 {/* Extracted Text Area */}
//                 <div className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
//                   <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
//                     <span className="flex items-center gap-1.5">
//                       <Sparkles className="w-4 h-4 text-indigo-500" /> Extracted Text (Editable)
//                     </span>
//                     <button
//                       type="button"
//                       disabled={!extractedText}
//                       onClick={handleCopy}
//                       className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1"
//                     >
//                       {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
//                       {copied ? "Copied" : "Copy"}
//                     </button>
//                   </div>
//                   <textarea
//                     value={extractedText}
//                     onChange={(e) => setExtractedText(e.target.value)}
//                     placeholder={loading ? "Scanning text..." : "Recognized text will appear here. You can edit it directly."}
//                     className="flex-1 p-3.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 bg-transparent outline-none resize-none min-h-[260px] leading-relaxed font-mono"
//                   />
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
//           <Button variant="ghost" size="sm" onClick={() => setIsOcrOpen(false)}>
//             Close
//           </Button>
//           {extractedText && (
//             <div className="flex items-center gap-3">
//               <Button variant="secondary" size="sm" onClick={handleCopy}>
//                 {copied ? "Copied" : "Copy Text"}
//               </Button>
//               <Button
//                 variant="primary"
//                 size="sm"
//                 onClick={handleSaveAsNote}
//                 icon={BookPlus}
//               >
//                 Save as Note
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };


import React, { useEffect, useRef, useState } from "react";
import {
  X,
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
import { useNotes } from "../../context/NotesContext";
import { Button } from "../common/Badge";
import toast from "react-hot-toast";

export const OCRScannerModal = () => {
  const {
    isOcrOpen,
    setIsOcrOpen,
    openNewNoteModal,
    incrementOcrCount,
  } = useNotes();

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);
  const previewUrlRef = useRef(null);
  const copyTimeoutRef = useRef(null);
  const scanIdRef = useRef(0);

  const darkMode = document.documentElement.classList.contains("dark");

  const theme = darkMode
    ? {
        modal: "bg-[#292720] border-[#49463D] text-[#F6F2E9]",
        header: "border-[#49463D] bg-[#302F27]",
        surface: "bg-[#302F27] border-[#49463D]",
        muted: "text-[#B5AE9F]",
        title: "text-[#F6F2E9]",
        body: "text-[#D6D0C4]",
        dropzone: "border-[#5C6E4E] bg-[#353C30]",
        dropzoneIdle:
          "border-[#49463D] hover:border-[#7D906C] hover:bg-[#353C30]",
        iconSurface: "bg-[#41483A] text-[#D5DFC9]",
        input: "bg-[#292720] text-[#F6F2E9] placeholder:text-[#817C70]",
        footer: "border-[#49463D] bg-[#302F27]",
        progressTrack: "bg-[#414035]",
      }
    : {
        modal: "bg-[#FDFBF6] border-[#E7E0D4] text-[#292720]",
        header: "border-[#E7E0D4] bg-[#F6F2E9]",
        surface: "bg-[#FDFBF6] border-[#E7E0D4]",
        muted: "text-[#817C70]",
        title: "text-[#292720]",
        body: "text-[#5F5A50]",
        dropzone: "border-[#5C6E4E] bg-[#E5E9DE]",
        dropzoneIdle:
          "border-[#D7DFCE] hover:border-[#7D906C] hover:bg-[#F1EDE3]",
        iconSurface: "bg-[#E5E9DE] text-[#4B5C3F]",
        input: "bg-[#FDFBF6] text-[#292720] placeholder:text-[#A29B8E]",
        footer: "border-[#E7E0D4] bg-[#F6F2E9]",
        progressTrack: "bg-[#E7E0D4]",
      };

  const revokePreview = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  };

  const resetAll = () => {
    scanIdRef.current += 1;
    revokePreview();
    setImageFile(null);
    setImagePreview(null);
    setExtractedText("");
    setProgress(0);
    setStatusMessage("");
    setLoading(false);
    setCopied(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const closeModal = () => {
    scanIdRef.current += 1;
    setIsOcrOpen(false);
    setLoading(false);
  };

  useEffect(() => {
    if (!isOcrOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeModal();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOcrOpen, setIsOcrOpen]);

  useEffect(() => {
    return () => {
      revokePreview();

      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  if (!isOcrOpen) return null;

  const processOCR = async (file, scanId) => {
    setLoading(true);
    setProgress(0);
    setStatusMessage("Initializing OCR engine...");

    try {
      const { data } = await Tesseract.recognize(file, "eng", {
        logger: (message) => {
          if (scanId !== scanIdRef.current) return;

          if (message.status === "recognizing text") {
            const percent = Math.round(message.progress * 100);
            setProgress(percent);
            setStatusMessage("Recognizing text...");
          } else {
            setStatusMessage(message.status);
          }
        },
      });

      if (scanId !== scanIdRef.current) return;

      setExtractedText(data.text || "");
      incrementOcrCount();
      toast.success("Text extracted successfully!");
    } catch (error) {
      if (scanId !== scanIdRef.current) return;

      console.error("OCR failed:", error);
      toast.error("Failed to recognize text from this image.");
      setStatusMessage("Recognition failed.");
    } finally {
      if (scanId === scanIdRef.current) {
        setLoading(false);
      }
    }
  };

  const handleFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    // Invalidate any previous scan.
    const scanId = ++scanIdRef.current;

    revokePreview();

    const previewUrl = URL.createObjectURL(file);
    previewUrlRef.current = previewUrl;

    setImageFile(file);
    setImagePreview(previewUrl);
    setExtractedText("");
    setProgress(0);
    setStatusMessage("");
    setCopied(false);

    processOCR(file, scanId);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files?.[0]);
  };

  const handleCopy = async () => {
    if (!extractedText) return;

    try {
      await navigator.clipboard.writeText(extractedText);
      setCopied(true);
      toast.success("Text copied!");

      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }

      copyTimeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Clipboard copy failed:", error);
      toast.error("Couldn't copy text. Please try again.");
    }
  };

  const handleSaveAsNote = () => {
    if (!extractedText.trim()) {
      toast.error("There is no text to save.");
      return;
    }

    // Escape recognized text before inserting it into HTML.
    const escapedText = extractedText
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

    const content = escapedText
      .split(/\n{2,}/)
      .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br/>")}</p>`)
      .join("");

    closeModal();

    openNewNoteModal({
      title: `OCR Scan — ${new Date().toLocaleDateString()}`,
      content,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#292720]/55 p-3 backdrop-blur-sm animate-in fade-in duration-200 sm:p-6"
      onClick={closeModal}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ocr-modal-title"
        className={`flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border shadow-2xl shadow-[#292720]/20 animate-in zoom-in-95 duration-150 ${theme.modal}`}
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between gap-4 border-b px-5 py-4 sm:px-6 ${theme.header}`}
        >
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${theme.iconSurface}`}
            >
              <ScanLine size={21} />
            </div>

            <div className="min-w-0">
              <h2
                id="ocr-modal-title"
                className={`font-display text-base font-semibold leading-tight sm:text-lg ${theme.title}`}
              >
                OCR Notes Scanner
              </h2>
              <p className={`mt-1 text-xs ${theme.muted}`}>
                Turn handwritten notes into editable text
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeModal}
            aria-label="Close OCR scanner"
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[#5C6E4E]/40 ${
              darkMode
                ? "text-[#B5AE9F] hover:bg-[#414035] hover:text-white"
                : "text-[#817C70] hover:bg-[#E7E0D4] hover:text-[#292720]"
            }`}
          >
            <X size={19} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {!imagePreview ? (
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setIsDragging(false);
                }
              }}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Choose an image or drag and drop it here"
              className={`flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-7 text-center transition-colors sm:p-10 ${
                isDragging ? theme.dropzone : theme.dropzoneIdle
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  handleFile(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />

              <div
                className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${theme.iconSurface}`}
              >
                <UploadCloud size={30} strokeWidth={1.7} />
              </div>

              <h3 className={`font-display text-lg font-semibold ${theme.title}`}>
                Drop your note image here
              </h3>

              <p className={`mt-2 max-w-sm text-sm leading-6 ${theme.muted}`}>
                Upload a photo of handwritten notes, a whiteboard, lecture
                slides, or textbook pages.
              </p>

              <div className="mt-5">
                <Button variant="primary" size="sm">
                  <span className="inline-flex items-center gap-2">
                    <UploadCloud size={15} />
                    Choose image
                  </span>
                </Button>
              </div>

              <p className={`mt-4 text-xs ${theme.muted}`}>
                Supports common image formats
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Progress */}
              {loading && (
                <div
                  className={`rounded-xl border p-4 ${theme.surface}`}
                  aria-live="polite"
                >
                  <div className="mb-3 flex items-center justify-between gap-3 text-xs">
                    <span className={`flex items-center gap-2 font-medium ${theme.title}`}>
                      <Loader2
                        size={15}
                        className="animate-spin text-[#5C6E4E]"
                      />
                      {statusMessage || "Processing image..."}
                    </span>
                    <span className={`shrink-0 font-semibold tabular-nums ${theme.muted}`}>
                      {progress}%
                    </span>
                  </div>

                  <div
                    className={`h-2 overflow-hidden rounded-full ${theme.progressTrack}`}
                    role="progressbar"
                    aria-label="OCR progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress}
                  >
                    <div
                      className="h-full rounded-full bg-[#5C6E4E] transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Image preview */}
                <section
                  className={`flex min-w-0 flex-col overflow-hidden rounded-xl border ${theme.surface}`}
                >
                  <div
                    className={`flex items-center justify-between gap-2 border-b px-3 py-3 ${theme.header}`}
                  >
                    <span className={`flex items-center gap-2 text-xs font-semibold ${theme.title}`}>
                      <FileImage size={15} className="text-[#5C6E4E]" />
                      Original image
                    </span>

                    <button
                      type="button"
                      onClick={resetAll}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#B65F43] transition-colors hover:text-[#9E4F37]"
                    >
                      <RotateCcw size={13} />
                      Replace
                    </button>
                  </div>

                  <div className="flex min-h-[260px] max-h-[360px] items-center justify-center overflow-hidden p-3">
                    <img
                      src={imagePreview}
                      alt={`Preview of ${imageFile?.name || "uploaded note"}`}
                      className="max-h-[340px] max-w-full rounded-lg object-contain"
                    />
                  </div>

                  {imageFile && (
                    <p className={`truncate border-t px-3 py-2 text-xs ${theme.muted} ${theme.header}`}>
                      {imageFile.name}
                    </p>
                  )}
                </section>

                {/* Extracted text */}
                <section
                  className={`flex min-w-0 flex-col overflow-hidden rounded-xl border ${theme.surface}`}
                >
                  <div
                    className={`flex items-center justify-between gap-2 border-b px-3 py-3 ${theme.header}`}
                  >
                    <span className={`flex items-center gap-2 text-xs font-semibold ${theme.title}`}>
                      <Sparkles size={15} className="text-[#B8842A]" />
                      Extracted text
                    </span>

                    <button
                      type="button"
                      disabled={!extractedText}
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5C6E4E] transition-colors hover:text-[#4B5C3F] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {copied ? <Check size={13} /> : <Copy size={13} />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>

                  <textarea
                    value={extractedText}
                    onChange={(event) => setExtractedText(event.target.value)}
                    placeholder={
                      loading
                        ? "Reading your image..."
                        : "Recognized text will appear here. You can edit it."
                    }
                    aria-label="Extracted text, editable"
                    className={`min-h-[260px] flex-1 resize-y p-4 text-sm leading-6 outline-none focus:ring-2 focus:ring-inset focus:ring-[#5C6E4E]/30 ${theme.input}`}
                  />
                </section>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`flex flex-wrap items-center justify-between gap-3 border-t px-5 py-4 sm:px-6 ${theme.footer}`}
        >
          <Button variant="ghost" size="sm" onClick={closeModal}>
            Close
          </Button>

          {imagePreview && (
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopy}
                disabled={!extractedText}
              >
                <span className="inline-flex items-center gap-1.5">
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? "Copied" : "Copy text"}
                </span>
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveAsNote}
                disabled={loading || !extractedText.trim()}
              >
                <span className="inline-flex items-center gap-1.5">
                  <BookPlus size={15} />
                  Save as note
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
