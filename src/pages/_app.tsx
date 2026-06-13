import Fotter from "@/components/Fotter";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { initMessaging } from "@/lib/firebaseMessaging";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    initMessaging();
  }, []);
  return (
    
    <AuthProvider>
      <Header />
      <Component {...pageProps} />
      <Fotter />
      <Toaster richColors />
    </AuthProvider>
  );
}
