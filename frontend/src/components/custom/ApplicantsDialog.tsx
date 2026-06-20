"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ApplicationWithUser } from "@/lib/types/api.types";


interface Props {
  open: boolean;
  jobTitle: string;
  loading: boolean;
  applicants: ApplicationWithUser[];
  onClose: () => void;
}

export default function ApplicantsDialog({
  open,
  jobTitle,
  loading,
  applicants,
  onClose,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white min-w-[90%] min-h-[80%] w-full  flex flex-col items-center justify-start">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Applicants - {jobTitle}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-10 text-center text-gray-500">
            Loading applicants...
          </div>
        ) : applicants.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            No applicants yet
          </div>
        ) : (
          <div className="overflow-x-auto w-full mt-4  ">
            <span className="text-primary text-xl font-semibold w-full text-center   ">Applicants</span>
            <table className="w-full text-sm border rounded-md mt-5">
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
                {applicants.map((app) => (
                  <tr key={app.id} className="border-t text-gray-600">
                    <td className="p-3">
                      {app.user.full_name}
                    </td>

                    <td className="p-3 text-gray-600">
                      {app.user.email}
                    </td>
                    <td className="p-3 text-gray-600">
                    {new Date(app.date_applied).toLocaleDateString()}
                    </td>

                    <td className="p-3">{app.status}</td>

                    <td className="p-3 flex gap-2">
                      <button className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                        Accept
                      </button>

                      <button className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
                        Reject
                      </button>

                      <a
                        href={app.resume_url}
                        target="_blank"
                        className="px-2 py-1 text-xs bg-primary text-white rounded"
                      >
                        View Resume
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}