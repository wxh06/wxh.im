"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function NavLink({
  children,
  href,
}: React.PropsWithChildren<{ href: string }>) {
  const pathname = usePathname();
  return (
    <Link
      className={`rounded-lg px-4 py-2 transition-colors duration-100 ${
        pathname === href
          ? "bg-gray-300 dark:bg-gray-600"
          : "hover:bg-gray-200 dark:hover:bg-gray-700"
      }`}
      href={href}
    >
      {children}
    </Link>
  );
}
