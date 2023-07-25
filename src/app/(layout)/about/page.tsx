import { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSchool,
  faLocationDot,
  faLanguage,
} from "@fortawesome/free-solid-svg-icons";
import type { SimpleIcon as SimpleIconType } from "simple-icons";
import SimpleIcon from "@/components/SimpleIcon";
import {
  siApple,
  siArchlinux,
  siClion,
  siDatagrip,
  siFirefoxbrowser,
  siGooglechrome,
  siUbuntu,
  siVim,
  siVisualstudiocode,
} from "simple-icons";
import ExternalLink from "@/components/ExternalLink";
import GitHubButton from "./GitHubButton";

export const metadata = { title: "About | wxh.im" };

const tools: Record<string, { icon: SimpleIconType; title?: string }[]> = {
  OS: [
    { icon: siApple, title: "Apple macOS" },
    { icon: siArchlinux },
    { icon: siUbuntu, title: "Ubuntu Server" },
  ],
  browser: [{ icon: siGooglechrome }, { icon: siFirefoxbrowser }],
  "IDE / editor": [
    { icon: siVisualstudiocode },
    { icon: siVim },
    { icon: siClion },
    { icon: siDatagrip },
  ],
};

export default function Page() {
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
            Shanghai, People&apos;s Republic of China (
            <span lang="zh-Hans">中华人民共和国 上海市</span>)
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
          <span>Habitual</span>
          <ul>
            {Object.entries(tools).map(([category, t]) => (
              <li key={category}>
                {category}:
                {t.map(({ icon, title }) => (
                  <Fragment key={icon.slug}>
                    {" "}
                    <SimpleIcon
                      icon={icon}
                      title={title}
                      className="h-6 align-text-bottom"
                    />
                  </Fragment>
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
          <source
            srcSet="/skillicons/dark"
            media="(prefers-color-scheme: dark)"
          />
          <img alt="Skills" src="/skillicons/light" />
        </picture>
      </div>
    </div>
  );
}
