import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "ACCEPTED":
      return "bg-green-100 text-green-800 border-green-200";
    case "REJECTED":
      return "bg-red-100 text-red-800 border-red-200";
    case "ACTIVE":
      return "bg-green-600 text-white border-green-600";
    case "FLAGGED":
      return "bg-yellow-600 text-white border-yellow-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};