import ExternalLink from "@/components/ExternalLink";
import SimpleIcon from "@/components/SimpleIcon";
import {
  type SimpleIcon as SimpleIconType,
  siJavascript,
  siTensorflow,
  siPython,
  siNextdotjs,
  siTypescript,
  siDocker,
  siTampermonkey,
  siGo,
  siFastify,
  siPostgresql,
  siRedis,
  siExpress,
  siBootstrap,
  siReact,
  siVuedotjs,
  siTailwindcss,
  siJquery,
} from "simple-icons";

export const metadata = { title: "Projects | wxh.im" };

interface Project {
  href: string;
  name: string;
  description: React.ReactNode;
  icons: SimpleIconType[];
}

const projects: Project[] = [
  {
    href: "https://github.com/wxh06/dockerjudge",
    name: "dockerjudge",
    description: "A Docker-based online judge engine",
    icons: [siDocker, siPython],
  },
  {
    href: "https://github.com/extend-luogu/extend-luogu",
    name: "extend-luogu (exlg)",
    description: (
      <>
        Userscript for{" "}
        <ExternalLink href="https://www.luogu.com.cn" hrefLang="zh-Hans-CN">
          Luogu
        </ExternalLink>{" "}
        with magic power
      </>
    ),
    icons: [siTampermonkey, siJquery, siJavascript],
  },
  {
    href: "https://github.com/extend-luogu/exlg-backend",
    name: "exlg-backend",
    description: "Back end of extend-luogu",
    icons: [siRedis, siExpress, siTypescript],
  },
  {
    href: "https://github.com/piterator-org/luogu-discussion-archive",
    name: "Luogu Discussion Archive",
    description: "A database for discussions on Luogu",
    icons: [
      siPostgresql,
      siFastify,
      siBootstrap,
      siReact,
      siNextdotjs,
      siTypescript,
    ],
  },
  {
    href: "https://github.com/wxh06/luogu-captcha-bypass",
    name: "luogu-captcha-bypass",
    description:
      "CAPTCHA Recognition using Convolutional Neural Network built with TensorFlow",
    icons: [siTensorflow, siPython],
  },
  {
    href: "https://github.com/wxh06/ultimate-tic-tac-toe",
    name: "Ultimate Tic-Tac-Toe",
    description:
      "A board game composed of nine tic-tac-toe boards arranged in a 3 × 3 grid",
    icons: [siTailwindcss, siVuedotjs, siTypescript],
  },
  {
    href: "https://github.com/wxh06/caddy-uwsgi-transport",
    name: "caddy-uwsgi-transport",
    description: (
      <>
        uwsgi reverse proxy transport for{" "}
        <ExternalLink href="https://caddyserver.com/v2">Caddy v2</ExternalLink>
      </>
    ),
    icons: [siGo],
  },
];

export default function Projects() {
  return (
    <div className="grid gap-3 py-4 md:grid-cols-2 xl:grid-cols-3">
      {projects.map(({ href: url, name, description, icons }) => (
        <div
          className="rounded-xl border px-6 py-4 dark:border-gray-700"
          key={url}
        >
          <a
            className="text-lg text-blue-500 hover:underline dark:text-blue-500"
            href={url}
            target="_blank"
            rel="noreferrer"
          >
            {name}
          </a>
          <div className="float-right space-x-2">
            {icons.map((icon) => (
              <SimpleIcon
                className="inline-block text-gray-500 dark:text-gray-400"
                icon={icon}
                width={20}
                height={20}
                fill="currentColor"
                key={icon.slug}
              />
            ))}
          </div>
          <div className="mt-1">{description}</div>
        </div>
      ))}
    </div>
  );
}
