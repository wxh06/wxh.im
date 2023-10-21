import { unstable_getImgProps as getImgProps } from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSchool,
  faLocationDot,
  faLanguage,
} from "@fortawesome/free-solid-svg-icons";
import type { SimpleIcon as SimpleIconType } from "simple-icons";
import SimpleIcon from "@/components/simple-icon";
import {
  siApple,
  siArc,
  siArchlinux,
  siGooglechrome,
  siJetbrains,
  siUbuntu,
  siVim,
  siVisualstudiocode,
  siWindows,
} from "simple-icons";
import ExternalLink from "@/components/external-link";
import GitHubButton from "@/components/github-button";
import skills from "./skills.json";

export const metadata = { title: "About | wxh.im" };

const tools: Record<string, { icon: SimpleIconType; title?: string }[]> = {
  OS: [
    { icon: siApple, title: "Apple macOS" },
    { icon: siArchlinux },
    { icon: siUbuntu, title: "Ubuntu Server" },
    { icon: siWindows, title: "Microsoft Windows" },
  ],
  browsers: [{ icon: siArc, title: "Arc Browser" }, { icon: siGooglechrome }],
  "IDE / editors": [
    { icon: siVisualstudiocode },
    { icon: siJetbrains, title: "JetBrains IDEs" },
    { icon: siVim },
  ],
};

const skillIcons = (theme: "light" | "dark") =>
  `https://skillicons.dev/icons?i=${skills.join(",")}&theme=${theme}&perline=5`;

export default function Page() {
  const common = { alt: "Skills", width: 300, height: 0 };
  const {
    props: { srcSet: dark },
  } = getImgProps({ ...common, src: skillIcons("dark") });
  const {
    props: { srcSet: light, ...rest },
  } = getImgProps({ ...common, src: skillIcons("light") });

  return (
    <div className="flex flex-wrap justify-between text-lg">
      <main className="grow">
        <p className="mt-5 text-3xl">Hey there</p>
        <p className="mt-4 text-xl">
          I&rsquo;m <span lang="zh-Hans">汪心禾</span> (
          <ExternalLink
            href="https://en.wikipedia.org/wiki/Pinyin"
            hrefLang="en"
            icon={false}
          >
            pinyin
          </ExternalLink>
          : <span lang="zh-Latn-pinyin">Wāng Xīnhé</span>), a 17 y.o. student &
          developer.
        </p>
        <ul className="mt-2">
          <li>
            <FontAwesomeIcon
              icon={faSchool}
              className="mr-2 h-6 w-6 align-text-bottom"
              title="school"
            />
            Grade 12 at{" "}
            <ExternalLink href="https://www.ghcis.com/" hrefLang="zh-Hans-CN">
              GHCIS
            </ExternalLink>
          </li>
          <li>
            <FontAwesomeIcon
              icon={faLocationDot}
              className="mr-2 h-6 w-6 align-text-bottom"
              title="location"
            />
            Shanghai, China (<span lang="zh-Hans">中国 上海</span>)
          </li>
          <li>
            <FontAwesomeIcon
              icon={faLanguage}
              className="mr-2 h-6 w-6 align-text-bottom"
              title="languages"
            />
            Simplified Chinese (<span lang="zh-Hans">简体中文</span>), English
          </li>
        </ul>
        <div className="mt-2 flex space-x-1">
          <span>My</span>
          <ul>
            {Object.entries(tools).map(([category, t]) => (
              <li key={category}>
                {category}:
                {t.map(({ icon, title }) => (
                  <SimpleIcon
                    icon={icon}
                    title={title}
                    className="ms-1.5 h-6 align-text-bottom"
                    key={icon.slug}
                  />
                ))}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <GitHubButton
            href="https://github.com/wxh06"
            data-size="large"
            data-show-count
            aria-label="Follow @wxh06 on GitHub"
          >
            Follow @wxh06
          </GitHubButton>
        </div>
      </main>
      <div className="mx-auto my-5">
        <picture>
          <source media="(prefers-color-scheme: dark)" srcSet={dark} />
          <source media="(prefers-color-scheme: light)" srcSet={light} />
          {/* eslint-disable-next-line react/jsx-props-no-spreading, jsx-a11y/alt-text */}
          <img {...rest} />
        </picture>
      </div>
    </div>
  );
}
