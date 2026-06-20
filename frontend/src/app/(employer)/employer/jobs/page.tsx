"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useMemo, useState } from "react";
import { UpdateJobFormData } from "@/lib/validations/job";
import UpdateJobDialog from "@/components/custom/UpdateJobDialog";
import CloseJobDialog from "@/components/custom/CloseJobDialog";
import { updateJob } from "@/api-client";
import { Job } from "@/lib/types/model.types";
import { updateAJob } from "@/store/slices/jobSlice";
import { JobStatus } from "@/shared/enum";
import { toast } from "sonner";

export default function EmployerJobsPage() {
  const jobs = useAppSelector((state) => state.jobs.jobs);
  const user = useAppSelector((state) => state.auth.user);

  const dispatch = useAppDispatch();

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const [jobToClose, setJobToClose] = useState<Job | null>(null);

  const [closingJob, setClosingJob] = useState(false);

  const jobsPostedByUser = useMemo(() => {
    if (!user?.id) return [];

    return jobs.filter((job) => job.employer_id === user.id);
  }, [jobs, user?.id]);

  const handleUpdateJob = async (data: UpdateJobFormData) => {
    if (!selectedJob) return;

    try {
      const result = await updateJob(selectedJob.id, data);

      dispatch(updateAJob(result.data));

      toast.success("Job updated successfully");

      setSelectedJob(null);
    } catch (error) {
      console.log("job update error", error);

      toast.error("Failed to update job");
    }
  };

  const handleCloseJob = async () => {
    if (!jobToClose) return;

    try {
      setClosingJob(true);

      const result = await updateJob(jobToClose.id, {
        status: JobStatus.CLOSED,
      });

      dispatch(updateAJob(result.data));

      toast.success("Job closed successfully");

      setJobToClose(null);
    } catch (error) {
      console.log("close job error", error);

      toast.error("Failed to close job");
    } finally {
      setClosingJob(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Posted Jobs</h1>

        <p className="text-sm text-gray-500">
          Manage your job postings and applications
        </p>
      </div>

      {jobsPostedByUser.length === 0 ? (
        <div className="text-center py-16 border rounded-xl bg-gray-50">
          <p className="text-gray-500">No jobs posted yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border shadow-sm bg-white">
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
                    <div className="font-semibold text-gray-900">
                      {job.title}
                    </div>

                    <div className="text-xs text-gray-500">{job.category}</div>
                  </td>

                  <td className="p-4 text-gray-700">{job.company}</td>

                  <td className="p-4 text-gray-600">{job.location}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        job.status === JobStatus.CLOSED
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setJobToClose(job)}
                        disabled={job.status === JobStatus.CLOSED}
                        className="px-3 py-1 text-xs rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Close Posting
                      </button>

                      <button
                        onClick={() => setSelectedJob(job)}
                        disabled={job.status === JobStatus.CLOSED}
                        className="px-3 py-1 text-xs rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
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
      )}

      {selectedJob && (
        <UpdateJobDialog
          open={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          initialData={{
            title: selectedJob.title,
            description: selectedJob.description,
            company: selectedJob.company,
            location: selectedJob.location,
            type: selectedJob.type,
            category: selectedJob.category,
            salary_min: selectedJob.salary_min,
            salary_max: selectedJob.salary_max,
            status: selectedJob.status,
          }}
          onSubmit={handleUpdateJob}
        />
      )}

      {jobToClose && (
        <CloseJobDialog
          open={!!jobToClose}
          jobTitle={jobToClose.title}
          loading={closingJob}
          onClose={() => {
            if (!closingJob) {
              setJobToClose(null);
            }
          }}
          onConfirm={handleCloseJob}
        />
      )}
    </div>
  );
}
