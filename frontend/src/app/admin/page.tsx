"use client";

import { Job } from "@/lib/types/model.types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteJobById, updateJobStatus } from "@/api-client";
import { JobStatus } from "@/shared/enum";
import { toast } from "sonner";
import { updateAJob, deleteAJob } from "@/store/slices/jobSlice";

export default function AdminDashboardPage() {
  const jobs: Job[] = useAppSelector((state) => state.jobs.jobs);

  const [flagJob, setFlagJob] = useState<Job | null>(null);
  const [deleteJob, setDeleteJob] = useState<Job | null>(null);
  const dispatch = useAppDispatch();

  const handleFlagConfirm = async () => {
    if (!flagJob) return;
    try {
      const result = await updateJobStatus(flagJob.id, JobStatus.FLAGGED);
      dispatch(updateAJob(result.data));
      toast.success("Job flagged successfully", { position: "top-right" });
    } catch (error) {
      console.log("Job flagging failed", error);
      toast.error(`${error}`, { position: "top-right" });
    } finally {
      setFlagJob(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteJob) return;
    console.log("DELETE JOB ID:", deleteJob.id);
    try {
      await deleteJobById(deleteJob.id);
      dispatch(deleteAJob(deleteJob.id));
      toast.success("Job deleted successfully", { position: "top-right" });
    } catch (error) {
      console.log("Job flagging failed", error);
      toast.error(`${error}`, { position: "top-right" });
    } finally {
      setDeleteJob(null);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
     
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">
          All jobs list — flag or permanently remove any job
        </p>
      </div>

      {/* TABLE (DESKTOP) */}
      <div className="hidden md:block overflow-x-auto rounded-lg border shadow-sm bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="p-4">Job</th>
              <th className="p-4">Company</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {jobs.map((job) => (
              <tr
                key={job.id}
                className="border-t hover:bg-gray-50 transition "
              >
              
                <td className="p-4">
                  <div className="font-medium text-gray-900">{job.title}</div>
                  <div className="text-xs text-gray-500">{job.location}</div>
                </td>

               
                <td className="p-4 text-gray-700">{job.company}</td>

             
                <td className="p-4 ">
                  <span
                    className={`px-3 py-1 text-xs  rounded-full font-semibold ${
                      job.status === "FLAGGED"
                        ? "bg-yellow-100 text-yellow-800"
                        : job.status === "CLOSED"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {job.status}
                  </span>
                </td>

              
                <td className="p-4 flex gap-2   flex-wrap">
                  <button
                    onClick={() => setFlagJob(job)}
                    disabled={job.status === JobStatus.FLAGGED}
                    className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-500 disabled:cursor-not-allowed disabled:bg-gray-400 cursor-pointer transition"
                  >
                    Flag
                  </button>

                  <button
                    onClick={() => setDeleteJob(job)}
                    className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:cursor-not-allowed disabled:bg-gray-400 cursor-pointer transition"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="border rounded-lg p-4 shadow-sm bg-white space-y-3"
          >
            <div>
              <div className="font-semibold text-gray-900">{job.title}</div>
              <div className="text-sm text-gray-500">
                {job.company} • {job.location}
              </div>
            </div>

            <span
              className={`px-3 py-1 text-xs rounded-full font-semibold inline-block ${
                job.status === "FLAGGED"
                  ? "bg-yellow-100 text-yellow-800"
                  : job.status === "CLOSED"
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
              }`}
            >
              {job.status}
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => setFlagJob(job)}
                className="w-full px-3 py-2 text-xs bg-yellow-600 text-white rounded"
              >
                Flag
              </button>

              <button
                onClick={() => setDeleteJob(job)}
                className="w-full px-3 py-2 text-xs bg-red-100 text-red-700 rounded"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      
      <Dialog open={!!flagJob} onOpenChange={() => setFlagJob(null)}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Flag Job</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-600">
            Are you sure you want to flag{" "}
            <span className="font-semibold">{flagJob?.title}</span>?
          </p>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setFlagJob(null)}
              className="px-3 py-1 text-sm bg-gray-400  rounded"
            >
              Cancel
            </button>

            <button
              onClick={handleFlagConfirm}
              className="px-3 py-1 text-sm bg-yellow-500 text-white rounded"
            >
              Confirm
            </button>
          </div>
        </DialogContent>
      </Dialog>

      
      <Dialog open={!!deleteJob} onOpenChange={() => setDeleteJob(null)}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Delete Job</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-600">
            This action is permanent. Delete{" "}
            <span className="font-semibold">{deleteJob?.title}</span>?
          </p>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setDeleteJob(null)}
              className="px-3 py-1 text-sm bg-gray-400 rounded"
            >
              Cancel
            </button>

            <button
              onClick={handleDeleteConfirm}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
