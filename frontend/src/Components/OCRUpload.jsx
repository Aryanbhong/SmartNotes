


import { useRef, useState } from "react";
import Tesseract from "tesseract.js";
import { Upload, Image as ImageIcon, Sparkles, X } from "lucide-react";

const OCRUpload = ({ onExtractedText }) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    setFileName(file.name);
    setError("");
    setLoading(true);
    setProgress(0);

    try {
      const { data } = await Tesseract.recognize(file, "eng", {
        logger: (message) => {
          if (message.status === "recognizing text") {
            setProgress(Math.round(message.progress * 100));
          }
        },
      });

      onExtractedText?.(data.text);
    } catch (err) {
      console.error("OCR failed:", err);
      setError("Couldn't recognize the text. Try another image.");
    } finally {
      setLoading(false);

      // Allows selecting the same image again.
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const clearFile = () => {
    setFileName("");
    setError("");
    setProgress(0);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-[#E7E0D4] bg-[#FDFBF6] p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E5E9DE] text-[#4B5C3F]">
          <Sparkles size={21} />
        </div>

        <div>
          <h3 className="font-display text-base font-semibold text-[#292720]">
            Image to Text
          </h3>
          <p className="mt-0.5 text-xs text-[#817C70]">
            Extract text from handwritten notes
          </p>
        </div>
      </div>

      {/* Upload area */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="group flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D7DFCE] bg-[#F6F2E9] px-4 py-7 text-center transition-all hover:border-[#5C6E4E] hover:bg-[#E5E9DE]/50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E9DE] text-[#5C6E4E] transition-transform group-hover:scale-105">
          <Upload size={22} />
        </div>

        <span className="text-sm font-semibold text-[#4B5C3F]">
          {loading ? "Reading your image..." : "Choose an image"}
        </span>

        <span className="mt-1 text-xs text-[#817C70]">
          PNG, JPG, WEBP or another image format
        </span>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={loading}
        />
      </button>

      {/* Selected file */}
      {fileName && (
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#E7E0D4] bg-[#F1EDE3] p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FDFBF6] text-[#5C6E4E]">
            <ImageIcon size={18} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[#292720]">
              {fileName}
            </p>
            <p className="text-xs text-[#817C70]">
              {loading ? "Processing image..." : "Image selected"}
            </p>
          </div>

          {!loading && (
            <button
              type="button"
              onClick={clearFile}
              aria-label="Clear selected image"
              className="rounded-lg p-1.5 text-[#817C70] transition-colors hover:bg-[#E7E0D4] hover:text-[#292720]"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {/* Progress */}
      {loading && (
        <div className="mt-4" aria-live="polite">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-medium text-[#4B5C3F]">
              Recognizing text
            </span>
            <span className="font-semibold tabular-nums text-[#5C6E4E]">
              {progress}%
            </span>
          </div>

          <div
            className="h-2 overflow-hidden rounded-full bg-[#E7E0D4]"
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

          <p className="mt-2 text-xs text-[#817C70]">
            This may take a little while depending on the image.
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <p
          role="alert"
          className="mt-3 rounded-xl border border-[#E8C8BC] bg-[#F6E8E2] px-3 py-2.5 text-sm text-[#9E4F37]"
        >
          {error}
        </p>
      )}

      <p className="mt-4 text-center text-[11px] leading-relaxed text-[#817C70]">
        <Sparkles size={12} className="mr-1 inline-block" />
        Extracted text will be passed to your note editor.
      </p>
    </div>
  );
};

export default OCRUpload;
