"use client";

import { JobCategory } from "@/shared/enum";



interface JobFilterBarProps {
  search: string;
  setSearch: (value: string) => void;

  location: string;
  setLocation: (value: string) => void;

  category: JobCategory | "";
  setCategory: (value: JobCategory | "") => void;

  salaryMin: number | "";
  setSalaryMin: (value: number | "") => void;

  salaryMax: number | "";
  setSalaryMax: (value: number | "") => void;
}

export default function JobFilterBar({
  search,
  setSearch,
  location,
  setLocation,
  category,
  setCategory,
  salaryMin,
  setSalaryMin,
  salaryMax,
  setSalaryMax,
}: JobFilterBarProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm  border-gray-300 border-2  grid grid-cols-1 md:grid-cols-5 gap-3">
      
     
      <input
        type="text"
        placeholder="Search jobs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="col-span-1 md:col-span-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      />

     
      <select
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="px-3 py-2 border border-gray-300  rounded-md focus:ring-2 focus:ring-primary"
      >
        <option value="">All Locations</option>
        <option value="Colombo">Colombo</option>
        <option value="Matara">Matara</option>
        <option value="Kandy">Kandy</option>
        <option value="Galle">Galle</option>
      </select>

    
      <select
        value={category}
        onChange={(e) =>
          setCategory(e.target.value as JobCategory | "")
        }
        className="px-3 py-2 border border-gray-300  rounded-md focus:ring-2 focus:ring-primary"
      >
        <option value="">All Categories</option>
        {Object.values(JobCategory).map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Min"
          value={salaryMin}
          onChange={(e) =>
            setSalaryMin(e.target.value ? Number(e.target.value) : "")
          }
          className="w-full px-2 py-2 border border-gray-300  rounded-md focus:ring-2 focus:ring-primary"
        />

        <input
          type="number"
          placeholder="Max"
          value={salaryMax}
          onChange={(e) =>
            setSalaryMax(e.target.value ? Number(e.target.value) : "")
          }
          className="w-full px-2 py-2 border border-gray-300  rounded-md focus:ring-2 focus:ring-primary"
        />
      </div>
    </div>
  );
}