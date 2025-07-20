import { useState } from "react";
import Tesseract from "tesseract.js";

const OCRUpload = ({ onExtractedText }) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setProgress(0);

    try {
      const { data } = await Tesseract.recognize(file, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      onExtractedText(data.text);
    } catch (error) {
      console.error("OCR Failed:", error);
      alert("Failed to recognize text. Try another image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center">
      <label
        className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
      >
        Upload Handwritten Note
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
      {loading && (
        <p className="text-sm text-gray-500">Processing OCR: {progress}%</p>
      )}
    </div>
  );
};

export default OCRUpload;
