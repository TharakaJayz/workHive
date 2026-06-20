"use client";

import { useAppSelector } from "@/store/hooks";
import { useMemo } from "react";

export default function EmployerJobsPage() {
  const jobs = useAppSelector((state) => state.jobs.jobs);
  const user = useAppSelector((state) => state.auth.user);

  const jobsPostedByUser = useMemo(() => {
    if (!user?.id) return [];
    return jobs.filter((job) => job.employer_id === user.id);
  }, [jobs, user?.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 border-green-200";
      case "CLOSED":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "FLAGGED":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "DELETED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          My Posted Jobs
        </h1>
        <p className="text-sm text-gray-500">
          Manage your job postings and applications
        </p>
      </div>

      {jobsPostedByUser.length === 0 ? (
        <div className="text-center py-16 border rounded-lg bg-gray-50">
          <p className="text-gray-500">No jobs posted yet</p>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div className="hidden md:block overflow-x-auto rounded-lg border shadow-sm bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700 text-left">
                <tr>
                  <th className="p-4 font-semibold">Job</th>
                  <th className="p-4 font-semibold">Company</th>
                  <th className="p-4 font-semibold">Location</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {jobsPostedByUser.map((job) => (
                  <tr
                    key={job.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-4">
                      <div className="font-medium text-gray-900">
                        {job.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {job.category}
                      </div>
                    </td>

                    <td className="p-4 text-gray-700">
                      {job.company}
                    </td>

                    <td className="p-4 text-gray-600">
                      {job.location}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          job.status
                        )}`}
                      >
                        {job.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex gap-2 flex-wrap">
                        <button className="px-3 py-1 text-xs rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition">
                          Close Posting
                        </button>

                        <button className="px-3 py-1 text-xs rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition">
                          Edit
                        </button>

                        <button className="px-3 py-1 text-xs rounded-md bg-primary text-white hover:bg-primary/90 transition">
                          View Applicants
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="md:hidden space-y-4">
            {jobsPostedByUser.map((job) => (
              <div
                key={job.id}
                className="border rounded-lg p-4 shadow-sm bg-white space-y-3"
              >
                <div>
                  <div className="font-semibold text-gray-900">
                    {job.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    {job.company} • {job.location}
                  </div>
                </div>

                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                    job.status
                  )}`}
                >
                  {job.status}
                </span>

                <div className="flex flex-col gap-2 pt-2">
                  <button className="w-full py-2 text-sm rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition">
                    Close Posting
                  </button>

                  <button className="w-full py-2 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition">
                    Edit
                  </button>

                  <button className="w-full py-2 text-sm rounded-md bg-primary text-white hover:bg-primary/90 transition">
                    View Applicants
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}