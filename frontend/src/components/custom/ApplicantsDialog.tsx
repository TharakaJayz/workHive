"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ApplicationWithUser } from "@/lib/types/api.types";
import { ApplicationStatus } from "@/shared/enum";

interface Props {
  open: boolean;
  jobTitle: string;
  loading: boolean;
  applicants: ApplicationWithUser[];
  updatingAppId: number | null;

  onClose: () => void;
  onAccept: (applicationId: number) => void;
  onReject: (applicationId: number) => void;
}

export default function ApplicantsDialog({
  open,
  jobTitle,
  loading,
  applicants,
  updatingAppId,
  onClose,
  onAccept,
  onReject,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white min-w-[95%] md:min-w-[80%] lg:min-w-[70%] max-h-[85vh] min-h-[80%] overflow-y-auto flex flex-col">
        
        {/* HEADER */}
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Applicants - {jobTitle}
          </DialogTitle>
        </DialogHeader>

        {/* LOADING STATE */}
        {loading ? (
          <div className="py-10 text-center text-gray-500">
            Loading applicants...
          </div>
        ) : applicants.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            No applicants yet
          </div>
        ) : (
          <div className="w-full mt-4 overflow-x-auto">
            
            {/* TITLE */}
            <div className="text-primary text-lg font-semibold text-center mb-4">
              Applicants List
            </div>

            {/* TABLE */}
            <table className="w-full text-sm border rounded-md overflow-hidden bg-gray-100">
              
              <thead className="bg-gray-100 text-gray-700 text-left">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {applicants.map((app) => {
                  const isLoading = updatingAppId === app.id;

                  return (
                    <tr
                      key={app.id}
                      className="border-t text-gray-700 hover:bg-gray-50 transition"
                    >
                      {/* NAME */}
                      <td className="p-3 font-medium">
                        {app.user.full_name}
                      </td>

                      {/* EMAIL */}
                      <td className="p-3 text-gray-600">
                        {app.user.email}
                      </td>

                      {/* DATE */}
                      <td className="p-3 text-gray-500">
                        {new Date(app.date_applied).toLocaleDateString()}
                      </td>

                      {/* STATUS */}
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${
                            app.status === ApplicationStatus.ACCEPTED
                              ? "bg-green-100 text-green-700"
                              : app.status === ApplicationStatus.REJECTED
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="p-3 flex gap-2 flex-wrap">
                        
                        {/* ACCEPT */}
                        <button
                          onClick={() => onAccept(app.id)}
                          disabled={
                            app.status === ApplicationStatus.ACCEPTED ||
                            isLoading
                          }
                          className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded
                                     hover:bg-green-200 transition
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? "..." : "Accept"}
                        </button>

                        {/* REJECT */}
                        <button
                          onClick={() => onReject(app.id)}
                          disabled={
                            app.status === ApplicationStatus.REJECTED ||
                            isLoading
                          }
                          className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded
                                     hover:bg-red-200 transition
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? "..." : "Reject"}
                        </button>

                        {/* RESUME */}
                        <a
                          href={app.resume_url}
                          target="_blank"
                          className="px-2 py-1 text-xs bg-primary text-white rounded
                                     hover:bg-primary/90 transition"
                        >
                          View Resume
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}