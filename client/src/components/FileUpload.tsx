import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface Summary {
  file_name: string;
  text: string;
}

interface FileUploadProps {
  onComplete: (combinedText: string, summaries: Summary[]) => void;
}

export default function FileUpload({ onComplete }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const handleUpload = async () => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file);
    });

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const combinedText = data.map((s: Summary) => s.text).join("\n\n");

      onComplete(combinedText, data);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded bg-white shadow">
      <h2 className="text-xl font-semibold mb-4">📄 Upload your documents</h2>

      <div
        {...getRootProps()}
        className={`p-6 border-2 border-dashed rounded cursor-pointer transition ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-center text-blue-700 font-medium">
            Drop the files here...
          </p>
        ) : (
          <p className="text-center text-gray-600">
            Drag & drop files here, or click to select
          </p>
        )}
      </div>

      {files.length > 0 && (
        <ul className="mt-4 list-disc list-inside text-sm text-gray-700 space-y-1">
          {files.map((file, idx) => (
            <li key={idx}>{file.name}</li>
          ))}
        </ul>
      )}

      <button
        onClick={handleUpload}
        disabled={loading || files.length === 0}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
