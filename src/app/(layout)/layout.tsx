import Link from "next/link";
import links from "@/app/navigation.json";
import NavLink from "./NavLink";

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="container mx-auto divide-y divide-gray-200 px-4 dark:divide-gray-700">
      <nav className="my-4 flex-wrap justify-between text-center sm:flex">
        <div className="my-3 text-3xl sm:my-auto">
          <Link href="/" rel="prefetch">
            wxh06
          </Link>
        </div>
        <div className="my-4 space-x-3 text-lg sm:my-2">
          {links.map(({ href, text }) => (
            <NavLink href={href} key={href}>
              {text}
            </NavLink>
          ))}
        </div>
      </nav>
      {children}
    </div>
  );
}
