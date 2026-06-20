"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { PDFUploadInput } from "@/components/custom/PDFUploadInput";

import { useState} from "react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { CreateApplicationInput, createApplicationSchema } from "@/lib/validations/application";
import { createJobApplication } from "@/actions/application.actions";
import { useAppSelector } from "@/store/hooks";



export default  function ApplyJobPage() {
    const params = useParams();
    const jobId = Number(params.jobId);
    const user = useAppSelector((state)=> state.auth.user); 
  
  
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

  const onSubmit = async (data: CreateApplicationInput) => {
    
    if (!data.resume_url) {
      toast.error("Please wait for your document upload to complete successfully.",{ position: "top-right" });
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

  return (
    <div className="bg-background w-full h-screen flex items-center justify-center">
      <div className="px-2 py-5 w-[50%] flex flex-col items-center justify-center gap-5">
        <h1 className="text-2xl w-full font-bold text-center sm:text-3xl">
          Submit Your Application
        </h1>
        
        <div className="w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto space-y-6">
           
            <input type="hidden" {...register("job_id")} value={jobId} />

          
            <PDFUploadInput
              label="Resume (PDF Only)"
              error={errors.resume_url?.message}
              onUploadSuccess={(url) => setValue("resume_url", url, { shouldValidate: true })}
            />

           
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Cover Letter</label>
              <textarea
                placeholder="Tell the employer why you're a great fit..."
                rows={5}
                {...register("cover_letter")}
                className={`w-full px-3 py-2 border rounded-md outline-none transition text-sm ${
                  errors.cover_letter ? "border-red-500 focus:ring-2 focus:ring-red-300" : "border-gray-300 focus:ring-2 focus:ring-black"
                }`}
              />
              {errors.cover_letter && (
                <p className="text-red-500 text-xs">{errors.cover_letter.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-2 rounded-md font-medium transition text-white bg-primary ${
                submitting ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-zinc-800"
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