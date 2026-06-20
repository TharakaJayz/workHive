"use client";

import { useEffect, useMemo, useState } from "react";
import { Job } from "@/lib/types/model.types";
import JobCard from "./JobCard";
import JobFilterBar from "./JobFilterBar";
import { JobCategory } from "@/shared/enum";
import { useAppDispatch } from "@/store/hooks";
import { setJobs } from "@/store/slices/jobSlice";

interface JobListProps {
  jobs: Job[];
}

export default function JobList({ jobs }: JobListProps) {
  const dispatch = useAppDispatch();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<JobCategory | "">("");

  const [salaryMin, setSalaryMin] = useState<number | "">("");
  const [salaryMax, setSalaryMax] = useState<number | "">("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!jobs || jobs.length === 0) return;
    dispatch(setJobs(jobs));
  }, [jobs, dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, location, category, salaryMin, salaryMax]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const isInactive = job.status === "CLOSED" || job.status === "DELETED";

      if (isInactive) return false;
      const matchesSearch =
        debouncedSearch === "" ||
        job.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        job.company.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesLocation = location === "" || job.location === location;

      const matchesCategory = category === "" || job.category === category;

      const matchesSalary =
        (salaryMin === "" || job.salary_min >= salaryMin) &&
        (salaryMax === "" || job.salary_max <= salaryMax);

      return (
        matchesSearch && matchesLocation && matchesCategory && matchesSalary
      );
    });
  }, [jobs, debouncedSearch, location, category, salaryMin, salaryMax]);

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredJobs.slice(start, start + itemsPerPage);
  }, [filteredJobs, currentPage]);

  return (
    <div className="w-full px-4 md:px-8 py-6 space-y-6  ">
      <div className="w-full  flex-1">
        <JobFilterBar
          search={search}
          setSearch={setSearch}
          location={location}
          setLocation={setLocation}
          category={category}
          setCategory={setCategory}
          salaryMin={salaryMin}
          setSalaryMin={setSalaryMin}
          salaryMax={salaryMax}
          setSalaryMax={setSalaryMax}
        />
      </div>

      <div className="grid grid-cols-1  lg:grid-cols-2 gap-4 lg:h-[400px] ">
        {paginatedJobs.length > 0 ? (
          paginatedJobs.map((job) => <JobCard job={job} key={job.id} />)
        ) : (
          <div className="text-center text-gray-500 py-10">No jobs found</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 pt-3  ">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? "bg-primary text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
