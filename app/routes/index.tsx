import type { LinksFunction, MetaFunction } from "@remix-run/cloudflare";
import { TwitterFollowButton, TwitterTimelineEmbed } from "react-twitter-embed";
import GitHubButton from "react-github-btn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faApple,
  faBilibili,
  faGithub,
  faGitlab,
  faQq,
  faTelegram,
  faTwitch,
  faTwitter,
  faUbuntu,
  faWeibo,
  faYoutube,
  faZhihu,
} from "@fortawesome/free-brands-svg-icons";
import twitterTimeStyles from "~/styles/twitter-timeline.css";
import {
  faEnvelope,
  faLanguage,
  faLocationDot,
  faSchool,
} from "@fortawesome/free-solid-svg-icons";
import ExternalLink from "~/components/external-link";

export const meta: MetaFunction = () => ({
  title: "汪心禾 | wxh.im",
});

export const links: LinksFunction = () => [
  { rel: "dns-prefetch", href: "https://api.github.com/" },
  { rel: "dns-prefetch", href: "https://platform.twitter.com/" },
  { rel: "stylesheet", href: twitterTimeStyles },
];

function Contact({
  icon,
  platform,
  user,
  link,
}: {
  icon: IconProp;
  platform: string;
  user: string;
  link: string;
}) {
  return (
    <li className="mb-1">
      <FontAwesomeIcon icon={icon} style={{ height: "1em" }} /> {platform}{" "}
      <ExternalLink href={link}>{user}</ExternalLink>
    </li>
  );
}

export default function Index() {
  return (
    <main className="overflow-hidden">
      <div className="row">
        <div className="col-md">
          <h1>Hey there</h1>
          <p className="fs-5">
            I&apos;m <span lang="zh-Hans">汪心禾</span> (
            <ExternalLink
              href="https://en.wikipedia.org/wiki/Pinyin"
              hrefLang="en"
            >
              pinyin
            </ExternalLink>
            : Wāng Xīnhé), a 16 y.o. student.
          </p>
          <ul className="list-unstyled">
            <li>
              <FontAwesomeIcon
                icon={faSchool}
                style={{ height: "1em", width: "1.25em" }}
              />{" "}
              Grade 11 at{" "}
              <ExternalLink href="https://www.ghcis.com/" hrefLang="zh-Hans-CN">
                GHCIS
              </ExternalLink>
            </li>
            <li>
              <FontAwesomeIcon
                icon={faLocationDot}
                style={{ height: "1em", width: "1.25em" }}
              />{" "}
              Shanghai, People&apos;s Republic of China (
              <span lang="zh-Hans">中华人民共和国 上海市</span>)
            </li>
            <li>
              <FontAwesomeIcon
                icon={faLanguage}
                style={{ height: "1em", width: "1.25em" }}
              />{" "}
              Simplified Chinese (<span lang="zh-Hans">简体中文</span>), English
            </li>
            <li>
              Habitual operating system:{" "}
              <FontAwesomeIcon icon={faApple} style={{ height: "1em" }} />{" "}
              macOS,{" "}
              <FontAwesomeIcon icon={faUbuntu} style={{ height: "1em" }} />{" "}
              Ubuntu Server
            </li>
          </ul>

          <GitHubButton
            href="https://github.com/wxh06"
            data-size="large"
            data-text="Follow @wxh06"
            data-show-count
          />
          <TwitterFollowButton screenName="wxh06" options={{ size: "large" }} />
        </div>

        <div className="col-md-4 overflow-scroll" style={{ maxHeight: "20em" }}>
          <TwitterTimelineEmbed sourceType="profile" screenName="wxh06" />
        </div>
      </div>

      <hr className="col-3 col-md-2 mb-5" />

      <div className="row g-5">
        <div className="col-md-6">
          <h2>Social Media &amp; Contact Info.</h2>
          <p>You can reach me via:</p>
          <ul className="ps-3">
            <Contact
              icon={faGithub}
              platform="GitHub"
              user="@wxh06"
              link="https://github.com/wxh06"
            />
            {/* <Contact
              icon={faGitlab}
              platform="GitLab"
              user="@wangxinhe"
              link="https://gitlab.com/wangxinhe"
            /> */}
            <Contact
              icon={faTwitter}
              platform="Twitter"
              user="@wxh06"
              link="https://twitter.com/wxh06"
            />
            {/* <Contact
              icon={faWeibo}
              platform="微博"
              user="@汪心禾"
              link="https://weibo.com/u/5542763526"
            />
            <Contact
              icon={faZhihu}
              platform="知乎"
              user="@汪心禾"
              link="https://www.zhihu.com/people/wangxinhe-2006"
            />
            <Contact
              icon={faYoutube}
              platform="YouTube"
              user="汪心禾"
              link="https://www.youtube.com/channel/UCGTCE1U3QblnN070LFeM_Bw"
            />
            <Contact
              icon={faBilibili}
              platform="哔哩哔哩"
              user="@wxh06"
              link="https://space.bilibili.com/551132744"
            />
            <Contact
              icon={faTwitch}
              platform="Twitch"
              user="@wxh06"
              link="https://www.twitch.tv/wxh06"
            /> */}
            <Contact
              icon={faTelegram}
              platform="Telegram"
              user="@wangxinhe"
              link="https://t.me/wangxinhe"
            />
            <Contact
              icon={faQq}
              platform="QQ"
              user="1659133940"
              link="https://wpa.qq.com/msgrd?uin=1659133940"
            />
            <Contact
              icon={faEnvelope}
              platform="Email:"
              user="wangxinhe06@gmail.com"
              link="mailto:wangxinhe06@gmail.com"
            />
          </ul>
        </div>
      </div>
    </main>
  );
}
