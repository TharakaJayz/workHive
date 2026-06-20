"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useMemo, useState } from "react";
import { UpdateJobFormData } from "@/lib/validations/job";
import UpdateJobDialog from "@/components/custom/UpdateJobDialog";
import CloseJobDialog from "@/components/custom/CloseJobDialog";
import {
  updateJob,
  getApplicantsByJobId,
  updateApplicationStatus,
} from "@/api-client";
import { Job } from "@/lib/types/model.types";
import { updateAJob } from "@/store/slices/jobSlice";
import { ApplicationStatus, JobStatus } from "@/shared/enum";
import { toast } from "sonner";
import ApplicantsDialog from "@/components/custom/ApplicantsDialog";
import { ApplicationWithUser } from "@/lib/types/api.types";

export default function EmployerJobsPage() {
  const jobs = useAppSelector((state) => state.jobs.jobs);
  const user = useAppSelector((state) => state.auth.user);

  const dispatch = useAppDispatch();

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobToClose, setJobToClose] = useState<Job | null>(null);

  const [applicantsJob, setApplicantsJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<ApplicationWithUser[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [updatingAppId, setUpdatingAppId] = useState<number | null>(null);

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
      console.log(error);
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
      console.log(error);
      toast.error("Failed to close job");
    } finally {
      setClosingJob(false);
    }
  };

 
  const handleViewApplicants = async (job: Job) => {
    try {
      setApplicantsJob(job);
      setLoadingApplicants(true);

      const res = await getApplicantsByJobId(job.id);
      setApplicants(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load applicants");
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleAcceptApplication = async (appId: number) => {
    try {
      setUpdatingAppId(appId);

      await updateApplicationStatus(appId, ApplicationStatus.ACCEPTED);

      setApplicants((prev) =>
        prev.map((app) =>
          app.id === appId
            ? { ...app, status: ApplicationStatus.ACCEPTED }
            : app
        )
      );

      toast.success("Application accepted");
    } catch (error) {
      toast.error("Failed to accept application");
    } finally {
      setUpdatingAppId(null);
    }
  };
  const handleRejectApplication = async (appId: number) => {
    try {
      setUpdatingAppId(appId);

      await updateApplicationStatus(appId, ApplicationStatus.REJECTED);

      setApplicants((prev) =>
        prev.map((app) =>
          app.id === appId
            ? { ...app, status: ApplicationStatus.REJECTED }
            : app
        )
      );

      toast.success("Application rejected");
    } catch (error) {
      toast.error("Failed to reject application");
    } finally {
      setUpdatingAppId(null);
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
                <th className="p-4">Job</th>
                <th className="p-4">Company</th>
                <th className="p-4">Location</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {jobsPostedByUser.map((job) => (
                <tr
                  key={job.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  
                  <td className="p-4 font-medium text-gray-900">
                    {job.title}
                  </td>

                 
                  <td className="p-4 text-gray-700">
                    {job.company}
                  </td>

                 
                  <td className="p-4 text-gray-600">
                    {job.location}
                  </td>

                  
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setJobToClose(job)}
                        disabled={job.status === JobStatus.CLOSED}
                        className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Close Posting
                      </button>

                      <button
                        onClick={() => setSelectedJob(job)}
                        disabled={job.status === JobStatus.CLOSED}
                        className="px-3 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleViewApplicants(job)}
                        className="px-3 py-1 text-xs bg-primary text-white rounded hover:bg-primary/90 transition"
                      >
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
          onClose={() => setJobToClose(null)}
          onConfirm={handleCloseJob}
        />
      )}

      
      {applicantsJob && (
        <ApplicantsDialog
          open={!!applicantsJob}
          jobTitle={applicantsJob.title}
          loading={loadingApplicants}
          applicants={applicants}
          onClose={() => setApplicantsJob(null)}
          onAccept={handleAcceptApplication}
          onReject={handleRejectApplication}
          updatingAppId={updatingAppId}
        />
      )}
    </div>
  );
}