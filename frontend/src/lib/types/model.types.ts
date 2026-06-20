import { JobCategory, JobStatus, JobType, UserRole } from "@/shared/enum";

export interface User {
    email: string;
    full_name: string;
    role: UserRole;
    id: number;
    email_verified: boolean;
};



export interface Job {
    type: JobType;
    title: string;
    description: string;
    company: string;
    location: string;
    category: JobCategory;
    salary_min: number;
    salary_max: number;
    status: JobStatus;
    id: number;
    employer_id: number;
}