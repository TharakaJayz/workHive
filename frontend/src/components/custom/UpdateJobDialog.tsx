"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Resolver } from "react-hook-form";
import { toast } from "sonner";

import { TextInput } from "@/components/custom/TextInput";
import { JobCategory, JobType } from "@/shared/enum";
import {
  UpdateJobFormData,
  updateJobSchema,
} from "@/lib/validations/job";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  open: boolean;
  onClose: () => void;
  initialData: UpdateJobFormData;
  onSubmit: (data: UpdateJobFormData) => Promise<void>;
};

export default function UpdateJobDialog({
  open,
  onClose,
  initialData,
  onSubmit,
}: Props) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateJobFormData>({
    resolver: zodResolver(updateJobSchema) as Resolver<UpdateJobFormData>,
    defaultValues: initialData,
    mode: "onChange",
  });

  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  const submitHandler = async (data: UpdateJobFormData) => {
    try {
      setLoading(true);
      await onSubmit(data);
      toast.success("Job updated successfully",{position:"top-right"});
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Update failed",{position:"top-right"});
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className=" px-16 min-w-[50%]  bg-gray-50 ">
        <DialogHeader>
          <DialogTitle className="text-primary font-semibold w-full text-center text-xl">Update Job</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          <TextInput label="Job Title" {...register("title")} error={errors.title?.message} />

          <TextInput label="Company" {...register("company")} error={errors.company?.message} />

          <TextInput label="Location" {...register("location")} error={errors.location?.message} />

          
          <div>
            <label className="block text-sm font-medium text-gray-700">Job Type</label>
            <select {...register("type")} className="w-full border border-gray-300 p-2 rounded block text-sm font-medium text-gray-700">
              <option value="">Select</option>
              <option value={JobType.REMOTE}>Remote</option>
              <option value={JobType.ONSITE}>Onsite</option>
              <option value={JobType.HYBRID}>Hybrid</option>
            </select>
          </div>

          
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select {...register("category")} className="w-full border border-gray-300 p-2 rounded block text-sm font-medium text-gray-700">
              <option value="">Select</option>
              <option value={JobCategory.IT}>IT</option>
              <option value={JobCategory.HR}>HR</option>
              <option value={JobCategory.FINANCE}>Finance</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <TextInput
              label="Min Salary"
              type="number"
              {...register("salary_min")}
              error={errors.salary_min?.message}
            />

            <TextInput
              label="Max Salary"
              type="number"
              {...register("salary_max")}
              error={errors.salary_max?.message}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              rows={5}
              {...register("description")}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          <button
            type="submit"
            disabled={loading || isSubmitting}
            className="w-full bg-primary text-white py-2 rounded"
          >
            {loading ? "Updating..." : "Update Job"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}