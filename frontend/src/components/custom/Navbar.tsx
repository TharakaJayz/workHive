"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function Navbar() {
  // implement log out functionality

  const dispatch = useAppDispatch();
  const authUserData = useAppSelector((state) => state.auth);
  console.log("auth data", authUserData);

  return (
    <div className="flex  justify-between items-center px-5 py-5 shadow">
      <div className="sm:flex-5 flex-1">
        <span>Home </span>
        <span>link 2</span>
      </div>
      <div className="sm:flex-2 flex-1 flex justify-end gap-3">
        <span className="text-xl font-semibold capitalize">{authUserData.user?.full_name.split(" ")[0] || "User"}</span>
        <button className="rounded-md font-medium transition text-background bg-primary hover:bg-primaryHover px-3 py-1">Sign In</button>
      </div>
    </div>
  );
}
