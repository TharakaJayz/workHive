"use client";
import { loginUser } from "@/api-client";
import { TextInput } from "@/components/custom/TextInput";
import { LoginFormData, loginUserSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginUserSchema),
    mode: "onChange",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onSubmit = async (data: LoginFormData) => {
    console.log("FINAL DATA:", data);
    try {
      setLoading(true);
      await loginUser(data);
      toast.success("Login Sucessfull", { position: "top-right" });
      router.push("/");
    } catch (error: any) {
      console.log("Login error", error);
      toast.error(`${error || "error"}`, { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background w-full h-screen flex items-center justify-center ">
      <div className="px-2 py-5  w-[50%] flex flex-col items-center justify-center gap-5 ">
        <div className="className  text-2xl w-full font-bold text-center sm:text-3xl  ">
          Welcome Back!
        </div>
        <div className=" w-full">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-md mx-auto space-y-4"
          >
            <TextInput
              label="Email"
              type="email"
              placeholder="Enter email"
              {...register("email")}
              error={errors.email?.message}
            />

            {/* PASSWORD */}
            <TextInput
              label="Password"
              type="password"
              placeholder="Enter password"
              {...register("password")}
              error={errors.password?.message}
            />
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
              {loading ? "Saving..." : "Login "}
            </button>
          </form>
        </div>

        <div className=" w-full text-center font-semibold ">
          Don't have an account?{" "}
          <Link className="text-blue-600" href={"/auth/register"}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
