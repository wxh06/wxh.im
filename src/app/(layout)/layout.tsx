import Link from "next/link";
import NavLink from "./NavLink";

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="container mx-auto divide-y divide-gray-200 px-4 dark:divide-gray-700">
      <nav className="my-4 flex justify-end space-x-3 text-lg">
        <Link className="my-auto mr-auto text-2xl" href="/" rel="prefetch">
          wxh06
        </Link>
        {[
          { href: "/about", text: "About" },
          { href: "/projects", text: "Projects" },
          { href: "/links", text: "Links" },
        ].map(({ href, text }) => (
          <NavLink href={href} key={href}>
            {text}
          </NavLink>
        ))}
      </nav>
      {children}
    </div>
  );
}
