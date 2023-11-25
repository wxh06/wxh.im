import {
  siBootstrap,
  siDocker,
  siEsbuild,
  siExpress,
  siFastify,
  siGo,
  siJavascript,
  siJquery,
  siNextdotjs,
  siNodedotjs,
  siPnpm,
  siPostgresql,
  siPrisma,
  siPython,
  siReact,
  siRedis,
  siShieldsdotio,
  siSocketdotio,
  siTailwindcss,
  siTampermonkey,
  siTensorflow,
  siTypescript,
  siVite,
  siVuedotjs,
  siYarn,
} from "simple-icons";
import ExternalLink from "@/components/external-link";
import Projects, { type Project } from "./projects";

export const metadata = { title: "Projects | wxh.im" };

const groups: { heading: string; projects: Project[] }[] = [
  {
    heading: "",
    projects: [
      {
        href: "https://dockerjudge.readthedocs.io/",
        name: "dockerjudge",
        github: "wxh06/dockerjudge",
        description: "A Docker-based online judge engine",
        icons: [siDocker, siPython],
      },
      {
        href: "https://github.com/wxh06/caddy-uwsgi-transport",
        name: "caddy-uwsgi-transport",
        github: "wxh06/caddy-uwsgi-transport",
        description: (
          <>
            uwsgi reverse proxy transport for{" "}
            <ExternalLink href="https://caddyserver.com/v2">
              Caddy v2
            </ExternalLink>
          </>
        ),
        icons: [siGo],
      },
    ],
  },
  {
    heading: "Luogu-related",
    projects: [
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
        href: "https://badges.luogu.piterator.com/",
        name: "luogu-badges",
        github: "wxh06/luogu-badges",
        description: "Dynamic badges for Luogu users and problems",
        icons: [
          siShieldsdotio,
          siTailwindcss,
          siReact,
          siNextdotjs,
          siPnpm,
          siNodedotjs,
          siTypescript,
        ],
      },
      {
        href: "https://tracker.exlg.cc/",
        name: "lgtracker",
        github: "wxh06/lgtracker",
        description: "Show passed problems by contest",
        icons: [siGo, siVuedotjs, siVite, siPnpm, siTypescript],
      },
      {
        href: "https://github.com/wxh06/luogu-captcha-bypass",
        name: "luogu-captcha-bypass",
        github: "wxh06/luogu-captcha-bypass",
        description:
          "CAPTCHA recognition using Convolutional Neural Network built with TensorFlow",
        icons: [siTensorflow, siPython],
      },
      {
        href: "https://pyluogu.readthedocs.io/",
        name: "pyluogu",
        github: "piterator-org/pyluogu",
        description: "A model-based Luogu API client in Python",
        icons: [siPython],
      },
    ],
  },
];

export default function Page() {
  return (
    <main className="py-4">
      {groups.map(({ heading, projects }) => (
        <section key={heading}>
          {heading && <h2 className="mb-4 mt-6 text-xl">{heading}</h2>}
          <Projects projects={projects} />
        </section>
      ))}
    </main>
  );
}
