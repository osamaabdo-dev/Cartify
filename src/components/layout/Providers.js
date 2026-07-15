"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { store } from "@/store/store";
import { initializeCart } from "@/store/slices/cartSlice";

export default function Providers({ children }) {
  useEffect(() => {
    store.dispatch(initializeCart());
  }, []);

  return (
    <SessionProvider>
      <Provider store={store}>{children}</Provider>
    </SessionProvider>
  );
}
