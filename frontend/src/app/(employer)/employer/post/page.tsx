"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { TextInput } from "@/components/custom/TextInput";
import { JobCategory, JobType } from "@/shared/enum";
import { CreateJobFormData, createJobSchema } from "@/lib/validations/job";
import { Resolver } from "react-hook-form";
import { createNewJob } from "@/api-client";

export default function CreateJobPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateJobFormData>({
    resolver: zodResolver(createJobSchema) as Resolver<CreateJobFormData>,
    mode: "onChange",
  });

  const onSubmit = async (data: CreateJobFormData) => {
    console.log("FINAL DATA:", data);

    try {
      setLoading(true);
      const response = await createNewJob(data);
      toast.success("Job created successfully", {
        position: "top-right",
      });

      router.push("/employer/jobs");
    } catch (error: any) {
      console.error("create job error", error);

      toast.error(`Error: ${error}`, {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background w-full min-h-screen flex items-center justify-center py-10">
      <div className="w-full max-w-3xl px-4">
        <div className="text-2xl sm:text-3xl font-bold text-center mb-8">
          Create Job
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <TextInput
            label="Job Title"
            type="text"
            placeholder="Frontend Developer"
            {...register("title")}
            error={errors.title?.message}
          />

          <TextInput
            label="Company"
            type="text"
            placeholder="ABC Technologies"
            {...register("company")}
            error={errors.company?.message}
          />

          <TextInput
            label="Location"
            type="text"
            placeholder="Colombo"
            {...register("location")}
            error={errors.location?.message}
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium">Job Type</label>

            <select
              {...register("type")}
              className={`w-full px-3 py-2 border rounded-md outline-none
              ${errors.type ? "border-danger" : "border-gray-300"}`}
            >
              <option value="">Select job type</option>

              <option value={JobType.REMOTE}>Remote</option>
              <option value={JobType.ONSITE}>Onsite</option>
              <option value={JobType.HYBRID}>Hybrid</option>
            </select>

            {errors.type && (
              <p className="text-danger text-xs">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium">Category</label>

            <select
              {...register("category")}
              className={`w-full px-3 py-2 border rounded-md outline-none
              ${errors.category ? "border-danger" : "border-gray-300"}`}
            >
              <option value="">Select category</option>

              <option value={JobCategory.IT}>IT</option>
              <option value={JobCategory.HR}>HR</option>
              <option value={JobCategory.HOSPITALITY}>Hospitality</option>
              <option value={JobCategory.FINANCE}>Finance</option>
              <option value={JobCategory.MEDICAL}>Medical</option>
              <option value={JobCategory.EDUCATION}>Education</option>
              <option value={JobCategory.MARKETING}>Marketing</option>
              <option value={JobCategory.SALES}>Sales</option>
            </select>

            {errors.category && (
              <p className="text-danger text-xs">{errors.category.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Minimum Salary"
              type="number"
              placeholder="50000"
              {...register("salary_min")}
              error={errors.salary_min?.message}
            />

            <TextInput
              label="Maximum Salary"
              type="number"
              placeholder="100000"
              {...register("salary_max")}
              error={errors.salary_max?.message}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium">Description</label>

            <textarea
              rows={6}
              placeholder="Enter job description..."
              {...register("description")}
              className={`w-full border rounded-md p-3 outline-none resize-none
              ${errors.description ? "border-danger" : "border-gray-300"}`}
            />

            {errors.description && (
              <p className="text-danger text-xs">
                {errors.description.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-md font-medium text-background transition
            ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-primaryHover"
            }`}
          >
            {loading ? "Saving..." : "Create Job"}
          </button>
        </form>
      </div>
    </div>
  );
}
