import { signIn } from "next-auth/react";
import { ApiResponse, ApiSuccess, ApplicationWithJob, ApplicationWithUser, UserRegisterResponse } from "./lib/types/api.types";
import { LoginFormData, RegisterFormData } from "./lib/validations/auth";
import { CreateJobFormData, UpdateJobFormData } from "./lib/validations/job";
import { Application, Job } from "./lib/types/model.types";
import { getSession } from "next-auth/react";
import { ApplicationStatus, JobStatus } from "./shared/enum";


 const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export const registerUser = async (formData: RegisterFormData) => {
  const { confirmPassword, ...payload } = formData;
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const responseBody = await response.json();
  if (!response.ok) {
    console.log("error", responseBody);
    throw new Error(responseBody.error.message);

  }

  const result = await signIn("credentials", {
    redirect: false,
    email: formData.email,
    password: formData.password,
  });

  console.log("NextAuth result", result);

  if (result?.error) {
    console.log("Account created, but failed to log in automatically. Please go to Login page.");
  }


  return responseBody as ApiSuccess<UserRegisterResponse>;

}


export const loginUser = async (formData: LoginFormData) => {
  const result = await signIn("credentials", {
    redirect: false,
    email: formData.email,
    password: formData.password,
  });

  if (result?.error) {
    console.log("Failed to log in automatically. Please go to Login page.");
    throw new Error("Invalid Credentials");
  }

  return result;
}

export const createNewJob = async (formData: CreateJobFormData) => {
  const session = await getSession();
  const token = session?.user?.accessToken;
  const response = await fetch(`${API_BASE_URL}/jobs`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(formData),
  });
  const responseBody = await response.json();
  if (!response.ok) {
    console.log("error", responseBody);
    throw new Error(responseBody.error.message);

  }
  return responseBody as ApiSuccess<Job>;
}



export const getAllJobsByEmployerId = async (
  employerId: number
) => {
  const session = await getSession();
  const token = session?.user?.accessToken;

  const response = await fetch(
    `${API_BASE_URL}/jobs/employer/${employerId}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token && {
          Authorization: `Bearer ${token}`,
        }),
      },
    }
  );

  const responseBody = await response.json();


  if (!response.ok) {
    console.log("error", responseBody);
    throw new Error(responseBody.error.message);
  }

  return responseBody as ApiSuccess<Job[]>;
};

export const getAllJobs = async (
) => {
  const response = await fetch(
    `${API_BASE_URL}/jobs`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const responseBody = await response.json();

  if (!response.ok) {
    console.log("error", responseBody);
    throw new Error(responseBody.error.message);
  }

  return responseBody as ApiSuccess<Job[]>;
};


export const getAllApplicationByUser = async (
) => {
  const session = await getSession();
  const token = session?.user?.accessToken;
  const response = await fetch(
    `${API_BASE_URL}/applications/mine`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    }
  );
  const responseBody = await response.json();

  console.log("application response",responseBody)

  if (!response.ok) {
    console.log("error", responseBody);
    throw new Error(responseBody.error.message);
  }

 
  return responseBody as ApiSuccess<ApplicationWithJob[]>;
};

export const updateJob = async (
  jobId: number,
  formData: UpdateJobFormData
) => {
  const session = await getSession();
  const token = session?.user?.accessToken;

  const response = await fetch(
    `${API_BASE_URL}/jobs/${jobId}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(formData),
    }
  );

  const responseBody = await response.json();

  if (!response.ok) {
    console.log("error", responseBody);
    throw new Error(responseBody.error.message);
  }

  return responseBody as ApiSuccess<Job>;
};

export const getApplicantsByJobId =  async(jobId:number) =>{
  const session = await getSession();
  const token = session?.user?.accessToken;

  const response = await fetch(
    `${API_BASE_URL}/jobs/${jobId}/applicants`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token && {
          Authorization: `Bearer ${token}`,
        }),
      },
    }
  );

  const responseBody = await response.json();


  if (!response.ok) {
    console.log("error", responseBody);
    throw new Error(responseBody.error.message);
  }

  return responseBody as ApiSuccess<ApplicationWithUser[]> ;
}


export const updateApplicationStatus = async (
  applicationId: number,
  status:ApplicationStatus
) => {
  const session = await getSession();
  const token = session?.user?.accessToken;

  const response = await fetch(
    `${API_BASE_URL}/applications/${applicationId}/status`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({status}),
    }
  );

  const responseBody = await response.json();

  if (!response.ok) {
    console.log("error", responseBody);
    throw new Error(responseBody.error.message);
  }

  return responseBody as ApiSuccess<Application>;
};

export const updateJobStatus = async (
  jobId: number,
  status:JobStatus
) => {
  const session = await getSession();
  const token = session?.user?.accessToken;

  const response = await fetch(
    `${API_BASE_URL}/admin/jobs/${jobId}/flag`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({status}),
    }
  );

  const responseBody = await response.json();

  if (!response.ok) {
    console.log("error", responseBody);
    throw new Error(responseBody.error.message);
  }

  return responseBody as ApiSuccess<Job>;
};

export const deleteJobById = async (
  jobId: number,
) => {
  const session = await getSession();
  const token = session?.user?.accessToken;

  const response = await fetch(
    `${API_BASE_URL}/admin/jobs/${jobId}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({status}),
    }
  );

  const responseBody = await response.json();

  if (!response.ok) {
    console.log("error", responseBody);
    throw new Error(responseBody.error.message);
  }

  return responseBody as ApiSuccess<Job>;
};




