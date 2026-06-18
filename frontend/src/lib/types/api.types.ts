
import { User } from "./model.types";

export type ApiSuccess<T> = { success: true; data: T; };
export type ApiError = { success: false; error: { message: string; code:string}; };
export type ApiResponse<T> = | ApiSuccess<T> | ApiError;



export type UserRegisterResponse =  {
    user:User;
    token: string;
}

export type UserLoginResponse =  {
    user:User;
    token: string;
}
