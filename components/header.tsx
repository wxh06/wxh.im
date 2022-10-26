import Link from "next/link";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();
  return (
    <nav className="my-4 flex justify-end space-x-3 text-lg">
      <Link className="my-auto mr-auto text-2xl" href="/">
        wxh06
      </Link>
      {[
        { href: "/about", text: "About" },
        { href: "/skills", text: "Skills" },
        { href: "/links", text: "Links" },
      ].map(({ href, text }) => (
        <Link
          className={`rounded-lg px-4 py-2 transition-colors duration-100 ${
            router.pathname === href
              ? "bg-gray-300 dark:bg-gray-600"
              : "hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
          href={href}
          key={href}
        >
          {text}
        </Link>
      ))}
    </nav>
  );
}
