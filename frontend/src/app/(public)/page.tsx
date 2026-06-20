//SSR

import { getAllJobs } from "@/api-client";
import JobList from "@/components/custom/JobList";
import { Job } from "@/lib/types/model.types";
import { toast } from "sonner";


export default async function Home() {
  
  let jobs:Job[] = [];
    try {

       const jobsData = await getAllJobs();
       jobs = jobsData.data;
       console.log("jobs ",jobs)
    
    } catch (error) {
      console.log("error");
      toast.error("Failed to fetch jobs");
    }
  
  return (
    <div className="">
      <JobList jobs={jobs} key={"job-list"} />
    </div>
  )
}
