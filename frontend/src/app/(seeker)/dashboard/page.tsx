"use client";

import { useEffect, useState } from "react";
import { getAllApplicationByUser } from "@/api-client";
import { toast } from "sonner";
import { ApplicationWithJob } from "@/lib/types/api.types";

export default function SeekerDashboardPage() {
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await getAllApplicationByUser();
        setApplications(res.data);
      } catch (error: any) {
        toast.error(error.message || "Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "ACCEPTED":
        return "bg-green-100 text-green-800 border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading applications...
      </div>
    );
  }

  return (
    <div className="p-6  w-[70%] mx-auto">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          My Applications
        </h1>
        <p className="text-sm text-gray-500">
          Track all your job applications and their status
        </p>
      </div>

      {/* EMPTY STATE */}
      {applications.length === 0 ? (
        <div className="text-center py-16 border rounded-lg bg-gray-50">
          <p className="text-gray-500">No applications found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border shadow-sm bg-white">
          <table className="w-full text-sm">
            {/* HEADER */}
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="p-4 font-semibold">Job</th>
                <th className="p-4 font-semibold">Company</th>
                <th className="p-4 font-semibold">Applied Date</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {applications.map((app, index) => (
                <tr
                  key={app.id}
                  className={`
                    border-t transition
                    hover:bg-gray-50
                  `}
                >
                  {/* JOB */}
                  <td className="p-4">
                    <div className="font-medium text-gray-900">
                      {app.job.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {app.job.location}
                    </div>
                  </td>

                  {/* COMPANY */}
                  <td className="p-4 text-gray-700">
                    {app.job.company}
                  </td>

                  {/* DATE */}
                  <td className="p-4 text-gray-600">
                    {new Date(app.date_applied).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </td>

                  {/* STATUS */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}