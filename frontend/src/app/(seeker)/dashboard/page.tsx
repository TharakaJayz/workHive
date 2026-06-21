"use client";

import { useEffect, useState } from "react";
import { getAllApplicationByUser } from "@/api-client";
import { toast } from "sonner";
import { ApplicationWithJob } from "@/lib/types/api.types";
import { useRouter } from "next/navigation";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "ACCEPTED":
      return "bg-green-100 text-green-800 border-green-200";
    case "REJECTED":
      return "bg-red-100 text-red-800 border-red-200";
    case "ACTIVE":
      return "bg-green-600 text-white border-green-600";
    case "FLAGGED":
      return "bg-yellow-600 text-white border-yellow-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export default function SeekerDashboardPage() {
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

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

  

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading applications...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          My Applications
        </h1>
        <p className="text-sm text-gray-500">
          Track all your job applications and their status
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-16 border rounded-lg bg-gray-50">
          <p className="text-gray-500">No applications found</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto rounded-lg border shadow-sm bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700 text-left">
                <tr>
                  <th className="p-4 font-semibold">Job</th>
                  <th className="p-4 font-semibold">Company</th>
                  <th className="p-4 font-semibold">Applied Date</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody>
                {applications.map((app) => (
                  <tr
                    key={app.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-4">
                      <div className="font-medium text-gray-900">
                        {app.job.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {app.job.location}
                      </div>
                    </td>

                    <td className="p-4 text-gray-700">
                      {app.job.company}
                    </td>

                    <td className="p-4 text-gray-600">
                      {new Date(app.date_applied).toLocaleDateString(
                        "en-GB",
                        { day: "2-digit", month: "short", year: "numeric" }
                      )}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => router.push(`/jobs/${app.job.id}`)}
                        className="px-4 py-2 bg-primary text-white rounded-md text-xs font-semibold hover:bg-primary/90 transition"
                      >
                        View Job
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="border rounded-lg p-4 shadow-sm bg-white space-y-3"
              >
                <div>
                  <div className="font-semibold text-gray-900">
                    {app.job.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    {app.job.company} • {app.job.location}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>

                  <span className="text-xs text-gray-500">
                    {new Date(app.date_applied).toLocaleDateString(
                      "en-GB",
                      { day: "2-digit", month: "short", year: "numeric" }
                    )}
                  </span>
                </div>

                <button
                  onClick={() => router.push(`/jobs/${app.job.id}`)}
                  className="w-full py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary/90 transition"
                >
                  View Job
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}