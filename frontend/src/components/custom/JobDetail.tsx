"use client";
import { Job } from "@/lib/types/model.types";
import { useAppSelector } from "@/store/hooks";
import { PiBagSimpleFill } from "react-icons/pi";
import { BiWorld } from "react-icons/bi";
import { UserRole } from "@/shared/enum";
import { redirect, useRouter } from "next/navigation";
export default function JobDetailComponent({ jobId }: { jobId: number }) {
  const jobs = useAppSelector((state) => state.jobs.jobs);
  const user = useAppSelector((state)=>state.auth.user);
  const router = useRouter();

  const job = jobs.find((job) => job.id === jobId);
  // only job seekers can apply to jobs
  const isApplyButtonEnabled = user?.role === UserRole.JOB_SEEKER;

  if (!job) {
    return (
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="text-center space-y-4">
          <p className="text-xl font-medium text-gray-700">
            No job found
          </p>
  
          <p className="text-sm text-gray-500">
            The job you are looking for may have been removed or is no longer available.
          </p>
  
          <button className="bg-primary text-white px-4 py-2 rounded-md text-sm hover:opacity-90 transition cursor-pointer "
          onClick={()=>{router.push("/")}}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }
  // check use auth before enabel apply buton

  return (
    <div className="w-full flex-1 flex flex-col gap-5 py-10 px-16 ">
      <div className="flex flex-col sm:flex-row items-end justify-center">
        <span className="text-xl text-start w-full sm:text-2xl ">{job.title}</span>
        <button className="text-sm sm:text-xl px-5 py-2 bg-primary rounded-sm text-white cursor-pointer hover:bg-secondary disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={!isApplyButtonEnabled} onClick={()=>{
          router.push(`/apply/${job.id}`)
        }}>Apply</button>
      </div>
      <div className="w-full">
        <span className="text-orange-400 font-bold">{job.company}</span>
      </div>
      <div className="w-full flex items-center justify-start gap-3 ">
        <div className="flex  items-center justify-center gap-1">
          <PiBagSimpleFill className="text-primary" />
          <span>{job.location}</span>
        </div>
        <div className="flex  items-center justify-center gap-1">
          <BiWorld className="text-primary" />
          <span>{job.location}</span>
        </div>
      </div>
      <div className="w-full">
        <p>
          Job Title:{job.title}
        </p>
        <p className="flex flex-col gap-2">
          <span>Job Description: <br/></span>
          <span className="">{job.description}</span>
        </p>
      </div>
    </div>
  );
}
