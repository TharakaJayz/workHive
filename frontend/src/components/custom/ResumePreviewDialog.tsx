"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  resumeUrl: string;
  applicantName: string;
  onClose: () => void;
}

export default function ResumePreviewDialog({
  open,
  resumeUrl,
  applicantName,
  onClose,
}: Props) {
  const viewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
    resumeUrl
  )}`;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Resume - {applicantName}
          </DialogTitle>
        </DialogHeader>

        <div className="w-full h-full">
          <iframe
            src={viewerUrl}
            title="Resume Preview"
            className="w-full h-[75vh] border rounded-md"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}