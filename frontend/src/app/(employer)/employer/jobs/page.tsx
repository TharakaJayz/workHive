"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useMemo, useState } from "react";
import { UpdateJobFormData } from "@/lib/validations/job";
import UpdateJobDialog from "@/components/custom/UpdateJobDialog";
import { updateJob } from "@/api-client";
import { Job } from "@/lib/types/model.types";
import {updateAJob} from "@/store/slices/jobSlice";

export default function EmployerJobsPage() {
  const jobs = useAppSelector((state) => state.jobs.jobs);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const jobsPostedByUser = useMemo(() => {
    if (!user?.id) return [];
    return jobs.filter((job) => job.employer_id === user.id);
  }, [jobs, user?.id]);

  const handleUpdateJob = async (data: UpdateJobFormData) => {
    if (!selectedJob) return;

    console.log("UPDATE JOB:", selectedJob.id, data);
    try {
        const result = await updateJob(selectedJob.id,data);
        
        dispatch(updateAJob({...result.data}));
    } catch (error) {
        console.log("job update error",error);
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
                    <div className="flex flex-wrap gap-2">
                      <button className="px-3 py-1 text-xs rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition">
                        Close Posting
                      </button>

                      <button
                        onClick={() => setSelectedJob(job)}
                        className="px-3 py-1 text-xs rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
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
    </div>
  );
}