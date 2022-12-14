import Head from "next/head";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faQq,
  faTelegram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

const contact = [
  {
    url: "https://github.com/wxh06",
    title: "GitHub @wxh06",
    icon: faGithub,
  },
  {
    url: "https://twitter.com/wxh06",
    title: "Twitter @wxh06",
    icon: faTwitter,
  },
  {
    url: "https://t.me/wangxinhe",
    title: "Telegram @wangxinhe",
    icon: faTelegram,
  },
  {
    url: "https://wpa.qq.com/msgrd?uin=1659133940",
    title: "QQ: 1659133940",
    icon: faQq,
  },
  {
    url: "mailto:wangxinhe06@gmail.com",
    title: "Email: wangxinhe06@gmail.com",
    icon: faEnvelope,
  },
];

export default function Home() {
  return (
    <div className="flex h-screen flex-col justify-center">
      <Head>
        <title>汪心禾 | wxh.im</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="text-center">
        <h1 className="text-4xl">汪心禾</h1>
        <p className="text-3xl">Wang, Xinhe</p>
        <div className="mt-4 flex justify-center divide-x divide-dashed divide-gray-300 text-3xl dark:divide-gray-600">
          {contact.map(({ url, title, icon }) => (
            <div className="flex px-1" key={url}>
              <Link
                className="px-2 transition duration-100 hover:scale-110"
                title={title}
                href={url}
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon icon={icon} />
              </Link>
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

      {new Date().getUTCMonth() === 11 ? ( // December
        <div className="fixed right-0 bottom-0 -z-50 overflow-hidden">
          <pre className="relative -right-4 -bottom-8 -rotate-12 text-xs">
            <span className="text-yellow-500 dark:text-yellow-200">{`                        *`}</span>
            <span className="text-green-500 dark:text-green-400">{`
                       * *
                      *   *
                    *   *   *
                  *           *
                *  ^  _ ^ _  ^  *
                 /        *    \\
               /    *            \\
             /             *       \\
           /      *                  \\
         /  ^  _  ^  _  ^  _  ^  _  ^  \\
          /             *             \\
        /      *                        \\
      /                         *         \\
    /                  *                    \\
  /        *                          *       \\
/   ^   _   ^  _  ^  _  ^  _  ^  _  ^   _   ^   \\
                /               \\
                /               \\
                /_______________\\
                是送给你的圣诞树哦！`}</span>
          </pre>
        </div>
      ) : null}
    </div>
  );
}
