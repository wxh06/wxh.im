import Link from "next/link";
import {
  siGithub,
  siGmail,
  siMastodon,
  siTelegram,
  siTwitter,
} from "simple-icons";
import SimpleIcon from "@/components/SimpleIcon";

export const metadata = { title: "汪心禾 | wxh.im" };

const contact = [
  {
    url: "https://github.com/wxh06",
    title: "GitHub @wxh06",
    icon: siGithub,
  },
  {
    url: "https://mastodon.social/@wangxinhe",
    title: "Mastodon @wangxinhe@mastodon.social",
    icon: siMastodon,
  },
  {
    url: "https://twitter.com/wxh06",
    title: "Twitter @wxh06",
    icon: siTwitter,
  },
  {
    url: "https://t.me/wangxinhe",
    title: "Telegram @wangxinhe",
    icon: siTelegram,
  },
  {
    url: "mailto:wangxinhe06@gmail.com",
    title: "Email: wangxinhe06@gmail.com",
    icon: siGmail,
  },
];

export default function Home() {
  return (
    <div className="flex h-screen flex-col justify-center">
      <main className="text-center">
        <h1 className="text-4xl">汪心禾</h1>
        <p className="text-3xl">Wang, Xinhe</p>
        <div className="mt-4 flex justify-center divide-x divide-dashed divide-gray-300 text-3xl dark:divide-gray-600">
          {contact.map(({ url, title, icon }) => (
            <div className="flex px-1" key={icon.slug}>
              <a
                className="px-2 transition duration-100 hover:scale-110"
                title={title}
                href={url}
                target="_blank"
                rel="noreferrer me" // eslint-disable-line react/no-invalid-html-attribute
              >
                <SimpleIcon icon={icon} height="1em" title={title} />
              </a>
            </div>
          ))}
        </div>
      </main>

      <nav className="mt-6 flex justify-center space-x-4 text-lg">
        {[
          { href: "/about", text: "About" },
          { href: "/links", text: "Friends" },
        ].map(({ href, text }) => (
          <Link
            className="rounded-full bg-gray-200 px-4 py-1 transition-colors duration-100 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            href={href}
            key={href}
          >
            {text}
          </Link>
        ))}
      </nav>
    </div>
  );
}
