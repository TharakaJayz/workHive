"use client";

import { useEffect, useState } from "react";
import { getAllApplicationByUser } from "@/api-client";
import { Application, Job } from "@/lib/types/model.types";
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

        const data = res.data;

        setApplications(data);
      } catch (error: any) {
        console.error("fetch applications error", error);
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
        return "bg-yellow-100 text-yellow-700";
      case "ACCEPTED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return <div>Loading applications...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">
        My Applications
      </h1>

      {applications.length === 0 ? (
        <div>No applications found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-50">
              <tr className="border-b">
                <th className="text-left p-3">Job Title</th>
                <th className="text-left p-3">Company</th>
                <th className="text-left p-3">Applied Date</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="border-b">
                  <td className="p-3 font-medium">
                    {app.job.title}
                  </td>

                  <td className="p-3">
                    {app.job.company}
                  </td>

                  <td className="p-3">
                    {new Date(app.date_applied).toLocaleDateString()}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
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