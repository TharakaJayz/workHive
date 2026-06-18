import { signIn } from "next-auth/react";
import { ApiResponse, ApiSuccess, UserRegisterResponse } from "./lib/types/api.types";
import { LoginFormData, RegisterFormData } from "./lib/validations/auth";

export const API_BASE_URL = "http://localhost:8080/api/v1"

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
    const responseBody  = await response.json();
    if (!response.ok) {
        console.log("error", responseBody);
        throw new Error(responseBody.error.message);
       
    }

    const result = await signIn("credentials", {
        redirect: false, 
        email: formData.email,     
        password: formData.password,
      });

      console.log("NextAuth result",result);

      if (result?.error) {
        console.log("Account created, but failed to log in automatically. Please go to Login page.");
      } 


    return responseBody as ApiSuccess<UserRegisterResponse> ;

}


export const loginUser = async (formData:LoginFormData) =>{
    const result = await signIn("credentials", {
        redirect: false, 
        email: formData.email,  
        password: formData.password,
      });

      if (result?.error) {
        console.log("Failed to log in automatically. Please go to Login page.");
        throw new Error("Invalid Credentials");
      } 

      return result ;
}