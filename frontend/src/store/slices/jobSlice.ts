import { Job } from "@/lib/types/model.types";
import { JobCategory } from "@/shared/enum";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface JobState {
  jobs: Job[];

  filters: {
    search: string;
    location: string;
    category: JobCategory | "";
    salaryMin: number | "";
    salaryMax: number | "";
  };
}
interface Filters {
  search: string;
  location: string;
  category: JobCategory | "";
  salaryMin: number | "";
  salaryMax: number | "";
}

interface JobState {
  jobs: Job[];
  filters: Filters;
}

const initialState: JobState = {
  jobs: [],
  filters: {
    search: "",
    location: "",
    category: "",
    salaryMin: "",
    salaryMax: "",
  },
};


const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {

    setJobs: (state, action: PayloadAction<Job[]>) => {
      state.jobs = action.payload;
    },
    updateAJob: (state, action) => {
      const updatedJob = action.payload;

      const index = state.jobs.findIndex(
        (job) => job.id === updatedJob.id
      );

      if (index !== -1) {
        state.jobs[index] = updatedJob;
      }
    },

    setFilters: (state, action: PayloadAction<Filters>) => {
      state.filters = action.payload;
    },


    setSearch: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },

    setLocation: (state, action: PayloadAction<string>) => {
      state.filters.location = action.payload;
    },

    setCategory: (
      state,
      action: PayloadAction<JobCategory | "">
    ) => {
      state.filters.category = action.payload;
    },

    setSalaryMin: (
      state,
      action: PayloadAction<number | "">
    ) => {
      state.filters.salaryMin = action.payload;
    },

    setSalaryMax: (
      state,
      action: PayloadAction<number | "">
    ) => {
      state.filters.salaryMax = action.payload;
    },


    clearJobs: (state) => {
      state.jobs = [];
      state.filters = initialState.filters;
    },
  },
});


export const {
  setJobs,
  setFilters,
  setSearch,
  setLocation,
  setCategory,
  setSalaryMin,
  setSalaryMax,
  clearJobs,
  updateAJob
} = jobSlice.actions;


export default jobSlice.reducer;