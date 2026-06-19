"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import AuthSync from "../custom/AuthSync";

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <AuthSync>{children}</AuthSync>
    </Provider>
  );
}
