"use client";

import { useState } from "react";

import { toast } from "sonner";
import { FileText, Loader2, UploadCloud } from "lucide-react";
import { uploadPDFAction } from "@/actions/cloudinary.action";

interface PDFUploadInputProps {
  label: string;
  error?: string;
  onUploadSuccess: (url: string) => void;
}

export function PDFUploadInput({ label, error, onUploadSuccess }: PDFUploadInputProps) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    
    if (file.type !== "application/pdf") {
      toast.error("Invalid format: Only PDF files are accepted.",{position:"top-right"});
      return;
    }

    const maxBytes = 5 * 1024 * 1024; 
    if (file.size > maxBytes) {
      toast.error("File size exception: Document must be under 5MB.",{position:"top-right"});
      return;
    }

    try {
      setUploading(true);
      setFileName(file.name);

      
      const formData = new FormData();
      formData.append("file", file);

     
      const hostedUrl = await uploadPDFAction(formData);
      
     
      onUploadSuccess(hostedUrl);
      toast.success("Resume uploaded successfully!");
    } catch (err: any) {
      setFileName(null);
      toast.error(err.message || "Something went wrong during data upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-1 w-full">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      <div className={`relative border-2 border-dashed border-primary rounded-md p-4 transition text-center flex flex-col items-center justify-center gap-2 bg-slate-50/50 ${
        error ? "border-red-400" : "border-gray-300 hover:border-black"
      }`}>
        <input 
          type="file" 
          accept=".pdf" 
          onChange={handleFileChange} 
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        
        {uploading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Uploading dynamic data blocks...</p>
          </>
        ) : fileName ? (
          <>
            <FileText className="h-8 w-8 text-green-600" />
            <p className="text-sm font-medium truncate max-w-xs text-green-700">{fileName}</p>
            <p className="text-xs text-gray-400">Click or drag to replace</p>
          </>
        ) : (
          <>
            <UploadCloud className="h-8 w-8  text-primary" />
            <p className="text-sm font-medium  text-primary">Click to upload your resume (PDF up to 5MB)</p>
          </>
        )}
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}