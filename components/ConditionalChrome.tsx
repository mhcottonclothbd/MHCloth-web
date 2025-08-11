"use client";

import { Navbar } from "@/app/navbar/widget";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";
import React from "react";

interface ConditionalChromeProps {
  children: React.ReactNode;
}

export default function ConditionalChrome({
  children,
}: ConditionalChromeProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname === "/admin" || pathname?.startsWith("/admin/");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isAdminRoute && <Footer />}
    </>
  );
}
