"use client";

import { RegisterFormData, registerUserSchema } from "@/lib/validations/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "@/components/custom/TextInput";
import Link from "next/link";
import { registerUser } from "@/api-client";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerUserSchema),
    mode: "onChange",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onSubmit = async (data: RegisterFormData) => {
    console.log("FINAL DATA:", data);

    try {
      setLoading(true);
      const res = await registerUser(data);
      toast.success("Registration Sucessfull", { position: "top-right" });
      router.push("/");
    } catch (error: any) {
      console.log("register error", error);
      toast.error(`${error}`, { position: "top-right" });
    } finally {
      setLoading(false);
    }

  
  };

  return (
    <div className="bg-background w-full h-screen flex items-center justify-center ">
      <div className="px-2 py-5  w-[50%] flex flex-col items-center justify-center gap-5 ">
        <div className="className  text-2xl w-full font-bold text-center sm:text-3xl  ">
          Create an account
        </div>
        <div className=" w-full">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-md mx-auto space-y-4"
          >
          
            <TextInput
              label="Full Name"
              type="text"
              placeholder="Enter full name"
              {...register("full_name")}
              error={errors.full_name?.message}
            />

            
            <TextInput
              label="Email"
              type="email"
              placeholder="Enter email"
              {...register("email")}
              error={errors.email?.message}
            />

            
            <TextInput
              label="Password"
              type="password"
              placeholder="Enter password"
              {...register("password")}
              error={errors.password?.message}
            />

        
            <TextInput
              label="Confirm Password"
              type="password"
              placeholder="Re-enter password"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />

           
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>

              <select
                {...register("role")}
                className={`w-full px-3 py-2 border rounded-md outline-none transition
        ${
          errors.role
            ? "border-dantext-danger focus:ring-2 focus:ring-red-300"
            : "border-gray-300 focus:ring-2 focus:ring-black"
        }`}
              >
                <option value="">Select role</option>
                <option value="JOB_SEEKER">Job Seeker</option>
                <option value="EMPLOYER">Employer</option>
                <option value="ADMIN">Admin</option>
              </select>

              {errors.role && (
                <p className="text-danger text-xs">{errors.role.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 rounded-md font-medium transition text-background
              
      ${
        isSubmitting
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-primary hover:bg-primaryHover"
      }`}
            >
              
              {loading ? "Saving..." : "Register"}
            </button>
          </form>
        </div>

        <div className=" w-full text-center font-semibold">
          Have an account?{" "}
          <Link className="text-blue-600" href={"/auth/login"}>
            Sign in
          </Link>{" "}
        </div>
      </div>
    </div>
  );
}
