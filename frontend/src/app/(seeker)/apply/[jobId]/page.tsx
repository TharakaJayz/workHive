"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PDFUploadInput } from "@/components/custom/PDFUploadInput";
import { useState } from "react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { CreateApplicationInput, createApplicationSchema } from "@/lib/validations/application";
import { createJobApplication } from "@/actions/application.actions";
import { useAppSelector } from "@/store/hooks";
import Link from "next/link";
import { Briefcase, MapPin, DollarSign, ArrowLeft } from "lucide-react";

export default function ApplyJobPage() {
  const params = useParams();
  const jobId = Number(params.jobId);
  
  // Fetching data from global state
  const user = useAppSelector((state) => state.auth.user); 
  const job = useAppSelector((state) => state.jobs.jobs.find((job) => job.id === jobId)); 
  
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateApplicationInput>({
    resolver: zodResolver(createApplicationSchema),
    defaultValues: {
      job_id: jobId,
      resume_url: "",
      cover_letter: "",
    }
  });

 
  if (!job) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center p-4 bg-white ">
        <div className="text-center max-w-sm space-y-4 p-6  rounded-xl ">
          <h2 className="text-2xl font-bold text-foreground">Job Listing Not Found 🫤</h2>
          <p className="text-muted-foreground text-sm">
            The job opening you are looking for might have been closed, removed, or doesn't exist.
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full py-2 px-4 rounded-md font-medium text-white bg-primary hover:bg-zinc-800 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: CreateApplicationInput) => {
    if (!data.resume_url) {
      toast.error("Please wait for your document upload to complete successfully.", { position: "top-right" });
      return;
    }

    try {
      setSubmitting(true);
      const res = await createJobApplication(data, user?.id!);

      if (res.success) {
        toast.success("Application successfully registered!", { position: "top-right" });
        router.push("/dashboard");
      } else {
        throw new Error(res.error);
      }
    } catch (error: any) {
      console.error("Submission operational error", error);
      toast.error(`Submission Failure: ${error.message}`, { position: "top-right" });
    } finally {
      setSubmitting(false);
    }
  };

  
  const formatCategory = (cat: string) => cat === "IT" ? "Information Technology" : cat;

  return (
    <div className="min-h-screen  w-full flex flex-col lg:flex-row">
      
      {/*  Job Data Card */}
      <div className="w-full lg:w-[45%]  lg:border-r border-b lg:border-b-0 p-6 sm:p-10 flex flex-col justify-between lg:h-screen lg:sticky lg:top-0">
        <div className="space-y-6">
          <div className="space-y-3">
            <span className="inline-block text-xs font-semibold tracking-wide uppercase bg-zinc-200/60 px-2.5 py-1 rounded-full text-zinc-800">
              {job.type.toLowerCase()}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {job.title}
            </h1>
            <p className="text-lg font-medium text-muted-foreground">{job.company}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-2 text-sm text-zinc-600">
              <MapPin size={18} className="text-zinc-400" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-600">
              <Briefcase size={18} className="text-zinc-400" />
              <span>{formatCategory(job.category)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-600 sm:col-span-2">
              <DollarSign size={18} className="text-green-600" />
              <span className="font-medium text-zinc-900">
                ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}
              </span>
            </div>
          </div>

          <hr className="border-zinc-200" />

          <div className="space-y-2 lg:max-h-[35vh] lg:overflow-y-auto pr-2">
            <h3 className="font-bold text-sm text-zinc-800 uppercase tracking-wider">About the Role</h3>
            <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>
        </div>

        <div className="text-xs text-muted-foreground pt-6 hidden lg:block">
          Applying as <span className="font-semibold text-zinc-700">{user?.email || "Guest"}</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Form Container */}
      <div className="w-full lg:w-[55%] p-6 sm:p-10 flex items-center justify-center lg:h-screen lg:overflow-y-auto">
        <div className="w-full max-w-md mx-auto space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Complete Application</h2>
            <p className="text-sm text-muted-foreground">Provide your latest professional resume and details below.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Hidden field for mapping form state */}
            <input type="hidden" {...register("job_id")} value={jobId} />

            {/* Reusable File Component Custom Element */}
            <PDFUploadInput
              label="Resume (PDF Only)"
              error={errors.resume_url?.message}
              onUploadSuccess={(url) => setValue("resume_url", url, { shouldValidate: true })}
            />

            {/* Cover Letter Input Field Area Box */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-700">Cover Letter</label>
              <textarea
                placeholder="Introduce yourself to the hiring team and highlight your matching qualifications..."
                rows={6}
                {...register("cover_letter")}
                className={`w-full px-3 py-2 border rounded-md outline-none transition text-sm leading-relaxed ${
                  errors.cover_letter ? "border-red-500 focus:ring-2 focus:ring-red-100" : "border-zinc-300 focus:border-black focus:ring-1 focus:ring-black"
                }`}
              />
              {errors.cover_letter && (
                <p className="text-red-500 text-xs mt-1">{errors.cover_letter.message}</p>
              )}
            </div>

            {/* Form submission action button controller */}
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-2.5 rounded-md font-medium transition text-white bg-primary ${
                submitting 
                  ? "bg-zinc-400 cursor-not-allowed" 
                  : "bg-black hover:bg-zinc-800 active:scale-[0.99]"
              }`}
            >
              {submitting ? "Processing Application..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}