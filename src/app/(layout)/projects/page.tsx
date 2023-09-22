import {
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
  siSocketdotio,
  siPrisma,
  siNodedotjs,
  siPnpm,
  siYarn,
  siEsbuild,
} from "simple-icons";
import ExternalLink from "@/components/ExternalLink";
import Projects, { type Project } from "./Projects";

export const metadata = { title: "Projects | wxh.im" };

const projects: Project[] = [
  {
    href: "https://dockerjudge.readthedocs.io/",
    name: "dockerjudge",
    github: "wxh06/dockerjudge",
    description: "A Docker-based online judge engine",
    icons: [siDocker, siPython],
  },
  {
    href: "https://docs.exlg.cc/",
    name: "extend-luogu (exlg)",
    github: "extend-luogu/extend-luogu",
    description: (
      <>
        Userscript for{" "}
        <ExternalLink href="https://www.luogu.com.cn" hrefLang="zh-Hans-CN">
          Luogu
        </ExternalLink>{" "}
        with magic power
      </>
    ),
    icons: [siTampermonkey, siJquery, siEsbuild, siYarn, siJavascript],
  },
  {
    href: "https://github.com/extend-luogu/exlg-backend",
    name: "exlg-backend",
    github: "extend-luogu/exlg-backend",
    description: "Back end of extend-luogu",
    icons: [siRedis, siExpress, siPnpm, siNodedotjs, siTypescript],
  },
  {
    href: "https://lglg.top/",
    name: "Luogu Discussion Archive",
    github: "piterator-org/luogu-discussion-archive",
    description: "A wayback machine for discussions on Luogu",
    icons: [
      siPostgresql,
      siPrisma,
      siFastify,
      siSocketdotio,
      siBootstrap,
      siReact,
      siNextdotjs,
      siPnpm,
      siNodedotjs,
      siTypescript,
    ],
  },
  {
    href: "https://github.com/wxh06/luogu-captcha-bypass",
    name: "luogu-captcha-bypass",
    github: "wxh06/luogu-captcha-bypass",
    description:
      "CAPTCHA Recognition using Convolutional Neural Network built with TensorFlow",
    icons: [siTensorflow, siPython],
  },
  {
    href: "https://wxh06.github.io/ultimate-tic-tac-toe/",
    name: "Ultimate Tic-Tac-Toe",
    github: "wxh06/ultimate-tic-tac-toe",
    description:
      "A board game composed of nine tic-tac-toe boards arranged in a 3 × 3 grid",
    icons: [siTailwindcss, siVuedotjs, siPnpm, siTypescript],
  },
  {
    href: "https://github.com/wxh06/caddy-uwsgi-transport",
    name: "caddy-uwsgi-transport",
    github: "wxh06/caddy-uwsgi-transport",
    description: (
      <>
        uwsgi reverse proxy transport for{" "}
        <ExternalLink href="https://caddyserver.com/v2">Caddy v2</ExternalLink>
      </>
    ),
    icons: [siGo],
  },
];

export default function Page() {
  return <Projects projects={projects} />;
}
