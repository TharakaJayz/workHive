"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface CloseJobDialogProps {
  open: boolean;
  jobTitle: string;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function CloseJobDialog({
  open,
  jobTitle,
  loading,
  onClose,
  onConfirm,
}: CloseJobDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!loading && !value) {
          onClose();
        }
      }}
    >
      <DialogContent className="bg-white min-w-[40%] px-5 py-5">
        <DialogHeader>
          <DialogTitle className="text-black">Close Job Posting</DialogTitle>

          <DialogDescription className="text-gray-800 mt-5">
            Are you sure you want to close the job posting
            <span className="font-semibold ">
              {" "}
              "{jobTitle}"
            </span>
            ?
           
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="bg-white border-none">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-400"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-70"
          >
            {loading ? "Closing..." : "Confirm"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}