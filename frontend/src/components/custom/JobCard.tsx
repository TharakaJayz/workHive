"use client";
import { Job } from "@/lib/types/model.types";
import { JobCategory, JobStatus, JobType } from "@/shared/enum";
import { useRouter } from "next/navigation";
import { FaLocationDot } from "react-icons/fa6";
import { IoBag } from "react-icons/io5";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const router = useRouter();
  return (
    <div
      className="w-full max-h-[200px] flex flex-col border-2 border-gray-300 hover:bg-gray-100 rounded-sm py-5 cursor-pointer px-3"
      onClick={() => {
        router.push(`/jobs/${job.id}`);
      }}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-blue-900">{job.title}</span>
          <span>{job.company}</span>
        </div>
        <div className="hidden">
          <button>Apply</button>
        </div>
      </div>
      <div className="flex items-center justify-between w-full">
        <span>{job.category}</span>
      </div>
      <div className="flex items-center justify-between gap-3 w-full">
        <div className="flex-2  flex gap-3">
          <div className="flex items-center justify-center gap-1">
          <IoBag  className="text-primary" />
            <span>{job.type}</span>
          </div>
          <div className="flex  items-center justify-center gap-1">
          <FaLocationDot   className="text-primary" />
            <span>{job.location}</span>
          </div>
        </div>
        <div className="flex-1  flex items-center justify-end">
          <div className="">
            <span>${job.salary_min}</span> - <span>${job.salary_max}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
