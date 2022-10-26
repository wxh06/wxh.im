import type React from "react";
import Header from "./header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto divide-y divide-gray-200 px-4 dark:divide-gray-700">
      <Header />
      {children}
    </div>
  );
}
