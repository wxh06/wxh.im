import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faApple,
  faChrome,
  faUbuntu,
} from "@fortawesome/free-brands-svg-icons";
import {
  faLanguage,
  faLocationDot,
  faSchool,
  faUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import GitHubButton from "react-github-btn";
import { TwitterFollowButton, TwitterTimelineEmbed } from "react-twitter-embed";
import Layout from "../components/layout";

export default function About() {
  return (
    <Layout>
      <Head>
        <title>About | wxh.im</title>
      </Head>

      <div className="flex flex-wrap justify-between space-y-4 text-lg">
        <main className="grow">
          <p className="mt-5 text-3xl">Hey there</p>
          <p className="mt-4 text-xl">
            I&rsquo;m <span lang="zh-Hans">汪心禾</span> (
            <a
              className="text-blue-500 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              href="https://en.wikipedia.org/wiki/Pinyin"
              hrefLang="en"
              rel="noreferrer"
              target="_blank"
            >
              pinyin
            </a>
            : Wāng Xīnhé), a 16 y.o. student & developer.
          </p>
          <ul className="mt-2">
            <li>
              <FontAwesomeIcon icon={faSchool} className="w-6" /> Grade 11 at{" "}
              <a
                className="text-blue-500 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                href="https://www.ghcis.com/"
                hrefLang="zh-Hans-CN"
                rel="noreferrer"
                target="_blank"
              >
                GHCIS{" "}
                <FontAwesomeIcon
                  icon={faUpRightFromSquare}
                  className="text-xs"
                />
              </a>
            </li>
            <li>
              <FontAwesomeIcon icon={faLocationDot} className="w-6" /> Shanghai,
              People&apos;s Republic of China (
              <span lang="zh-Hans">中华人民共和国 上海市</span>)
            </li>
            <li>
              <FontAwesomeIcon icon={faLanguage} className="w-6" /> Simplified
              Chinese (<span lang="zh-Hans">简体中文</span>), English
            </li>
          </ul>
          <div className="mt-2 flex space-x-1">
            <span>Habitual</span>
            <ul>
              <li>
                OS: <FontAwesomeIcon icon={faApple} /> macOS,{" "}
                <FontAwesomeIcon icon={faUbuntu} /> Ubuntu Server
              </li>
              <li>
                browser: <FontAwesomeIcon icon={faChrome} /> Google Chrome
              </li>
              <li>IDE / editor: Visual Studio Code, JetBrains WebStorm, Vim</li>
            </ul>
          </div>
          <div className="mt-4">
            <GitHubButton
              href="https://github.com/wxh06"
              data-size="large"
              data-text="Follow @wxh06"
              data-show-count
            />
            <TwitterFollowButton
              screenName="wxh06"
              options={{ size: "large" }}
            />
          </div>
        </main>
        <div className="mx-auto max-h-96 max-w-sm basis-full overflow-scroll">
          <TwitterTimelineEmbed
            sourceType="profile"
            screenName="wxh06"
            options={{ width: "100%" }}
          />
        </div>
      </div>
    </Layout>
  );
}
